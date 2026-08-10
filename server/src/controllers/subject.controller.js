const { Subject } = require("../models");
const { Op } = require("sequelize");
const { createBaseController } = require("./base.controller");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");

const controller = createBaseController(Subject);

const listByLevel = asyncHandler(async (req, res) => {
  const items = await Subject.findAll({
    where: { levelSlug: req.params.levelSlug },
  });
  sendSuccess(res, items);
});

const listByCourse = asyncHandler(async (req, res) => {
  const items = await Subject.findAll({
    where: { courseSlug: req.params.courseSlug },
  });
  sendSuccess(res, items);
});

const listByCourseSemester = asyncHandler(async (req, res) => {
  const where = { courseSlug: req.params.courseSlug };
  if (req.params.semesterNumber) {
    where.semester = Number(req.params.semesterNumber);
  }
  const items = await Subject.findAll({ where });
  sendSuccess(res, items);
});

const listTrending = asyncHandler(async (req, res) => {
  const limit = controller.toNumber(req.query.limit);
  const items = await Subject.findAll({
    where: { trending: true },
    order: [["popularity", "DESC"]],
    limit,
  });
  sendSuccess(res, items);
});

module.exports = {
  ...controller,
  listByLevel,
  listByCourse,
  listByCourseSemester,
  listTrending,
};