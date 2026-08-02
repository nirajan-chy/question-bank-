const { QuestionBank } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(QuestionBank, {
  filters: [{ field: "subjectSlug" }],
});

module.exports = controller;
