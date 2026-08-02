const { Testimonial } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Testimonial);

module.exports = controller;
