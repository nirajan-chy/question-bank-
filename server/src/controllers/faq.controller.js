const { Faq } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Faq);

module.exports = controller;
