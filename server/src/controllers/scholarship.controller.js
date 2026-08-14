const { Scholarship } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Scholarship, {
  filters: [{ field: "featured", boolean: true }],
  searchFields: ["title", "provider", "level", "category", "description"],
});

module.exports = controller;
