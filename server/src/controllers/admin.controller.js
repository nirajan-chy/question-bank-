const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");
const models = require("../models");

const { Op } = require("sequelize");

const getStats = asyncHandler(async (req, res) => {
  const entries = await Promise.all(
    Object.entries(models).map(async ([key, Model]) => ({ resource: key, count: await Model.count() }))
  );
  const counts = Object.fromEntries(entries.map((e) => [e.resource, e.count]));

  const recentContacts = await models.Contact.findAll({
    order: [["createdAt", "DESC"]],
    limit: 5,
  });
  const recentQuestions = await models.CommunityQuestion.findAll({
    order: [["createdAt", "DESC"]],
    limit: 5,
    attributes: ["id", "title", "author", "answers", "createdAt"],
  });

  sendSuccess(res, { counts, recentContacts, recentQuestions });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, name, avatar, bio, password } = req.body || {};

  const user = await models.User.unscoped().findByPk(id);
  if (!user) throw new ApiError(404, "User not found");

  if (id === req.user.id && role && role !== "admin") {
    throw new ApiError(400, "You cannot demote your own admin account");
  }

  const patch = {};
  if (name !== undefined) patch.name = name;
  if (role !== undefined) patch.role = role;
  if (avatar !== undefined) patch.avatar = avatar;
  if (bio !== undefined) patch.bio = bio;
  if (password) patch.password = password;

  await user.update(patch);
  sendSuccess(res, user, 200, "User updated");
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (id === req.user.id) throw new ApiError(400, "You cannot delete your own account");

  const user = await models.User.findByPk(id);
  if (!user) throw new ApiError(404, "User not found");

  await user.destroy();
  sendSuccess(res, null, 200, "User deleted");
});

const buildModelMeta = (Model) => ({
  name: Model.name,
  attributes: Object.entries(Model.rawAttributes).map(([key, attr]) => ({
    key,
    type: attr.type?.key ?? "STRING",
    allowNull: attr.allowNull === undefined ? !attr.primaryKey : attr.allowNull,
    primaryKey: Boolean(attr.primaryKey),
    defaultValue: attr.defaultValue === undefined ? null : attr.defaultValue,
    unique: Boolean(attr.unique),
    values: attr.type?.values || undefined,
  })),
});

const getUserStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, activeUsers, newThisWeek, newThisMonth, usersByRole] = await Promise.all([
    models.User.count(),
    models.User.count({ where: { updatedAt: { [Op.gte]: sevenDaysAgo } } }),
    models.User.count({ where: { createdAt: { [Op.gte]: sevenDaysAgo } } }),
    models.User.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
    models.User.findAll({
      attributes: ["role", [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"]],
      group: ["role"],
      raw: true,
    }),
  ]);

  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const count = await models.User.count({
      where: { createdAt: { [Op.between]: [monthStart, monthEnd] } },
    });
    last6Months.push({
      month: monthStart.toLocaleString("default", { month: "short", year: "numeric" }),
      count,
    });
  }

  const roleBreakdown = {};
  for (const r of usersByRole) {
    roleBreakdown[r.role] = Number(r.count);
  }

  sendSuccess(res, {
    totalUsers,
    activeUsers,
    newThisWeek,
    newThisMonth,
    roleBreakdown,
    growth: last6Months,
  });
});

module.exports = { getStats, getUserStats, updateUser, deleteUser, buildModelMeta };
