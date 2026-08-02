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
  listTrending,
};
