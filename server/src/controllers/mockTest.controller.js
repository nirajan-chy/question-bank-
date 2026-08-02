const { MockTest } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(MockTest, {
  filters: [{ field: "subjectSlug" }],
});

module.exports = controller;
