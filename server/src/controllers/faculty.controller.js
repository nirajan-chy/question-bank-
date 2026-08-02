const { Faculty } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Faculty);

module.exports = controller;
