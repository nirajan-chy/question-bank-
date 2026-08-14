const { Note } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Note, {
  filters: [{ field: "subjectSlug" }],
  searchFields: ["title", "subjectSlug", "subjectName", "level", "author", "description"],
});

module.exports = controller;
