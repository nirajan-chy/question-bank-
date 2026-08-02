const { Level } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Level);

module.exports = controller;
