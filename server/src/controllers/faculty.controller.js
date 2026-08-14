const { Faculty } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Faculty, {
  searchFields: ["name", "short", "description"],
});

module.exports = controller;
