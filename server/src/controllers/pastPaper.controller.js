const { PastPaper } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(PastPaper, {
  filters: [{ field: "subjectSlug" }],
});

module.exports = controller;
