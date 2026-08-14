const { Faq } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Faq, {
  searchFields: ["question", "answer", "category"],
});

module.exports = controller;
