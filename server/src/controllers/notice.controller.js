const { Notice } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Notice, {
  order: [
    ["pinned", "DESC"],
    ["date", "DESC"],
  ],
});

module.exports = controller;
