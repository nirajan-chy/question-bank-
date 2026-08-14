const { University } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(University, {
  searchFields: ["name", "short", "location", "description"],
});

module.exports = controller;
