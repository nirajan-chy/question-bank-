const { Scholarship } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Scholarship, {
  filters: [{ field: "featured", boolean: true }],
});

module.exports = controller;
