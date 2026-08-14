const { QuestionBank } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(QuestionBank, {
  filters: [{ field: "subjectSlug" }],
  searchFields: ["title", "subjectSlug", "subjectName", "level", "description"],
});

module.exports = controller;
