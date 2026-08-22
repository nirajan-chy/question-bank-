const { Course } = require("../models");
const { createBaseController } = require("./base.controller");
const asyncHandler = require("../utils/asyncHandler");
const sendSuccess = require("../utils/sendSuccess");

const controller = createBaseController(Course, {
  searchFields: ["name", "short", "description", "levelSlug", "university", "category"],
});

const listByLevel = asyncHandler(async (req, res) => {
  const items = await Course.findAll({
    where: { levelSlug: req.params.levelSlug },
  });
  sendSuccess(res, items);
});

module.exports = {
  ...controller,
  listByLevel,
};