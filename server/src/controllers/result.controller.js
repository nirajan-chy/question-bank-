const { ResultEntry } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(ResultEntry, {
  order: [["publishedAt", "DESC"]],
  searchFields: ["exam", "level", "board", "url"],
});

module.exports = controller;
