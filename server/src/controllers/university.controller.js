const { University } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(University);

module.exports = controller;
