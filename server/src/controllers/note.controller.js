const { Note } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Note, {
  filters: [{ field: "subjectSlug" }],
});

module.exports = controller;
