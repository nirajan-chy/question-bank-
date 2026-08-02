const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");
const models = require("../models");

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

module.exports = { getStats, updateUser, deleteUser };
