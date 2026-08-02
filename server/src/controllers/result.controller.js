const { ResultEntry } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(ResultEntry, {
  order: [["publishedAt", "DESC"]],
});

module.exports = controller;
