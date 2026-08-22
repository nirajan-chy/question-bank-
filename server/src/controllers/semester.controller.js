const { Semester } = require("../models");
const { createBaseController } = require("./base.controller");
const asyncHandler = require("../utils/asyncHandler");
const sendSuccess = require("../utils/sendSuccess");

const controller = createBaseController(Semester, {
  searchFields: ["name", "short", "description", "courseSlug"],
});

const listByCourse = asyncHandler(async (req, res) => {
  const items = await Semester.findAll({
    where: { courseSlug: req.params.courseSlug },
    order: [["number", "ASC"]],
  });
  sendSuccess(res, items);
});

module.exports = {
  ...controller,
  listByCourse,
};