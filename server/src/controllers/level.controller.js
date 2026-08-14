const { Level } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Level, {
  searchFields: ["name", "short", "description"],
});

module.exports = controller;
