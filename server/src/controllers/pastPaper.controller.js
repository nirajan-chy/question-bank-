const { PastPaper } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(PastPaper, {
  filters: [{ field: "subjectSlug" }],
  searchFields: ["title", "subjectSlug", "subjectName", "level", "exam", "board", "description"],
});

module.exports = controller;
