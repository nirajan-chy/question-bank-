const { Book } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Book, {
  filters: [{ field: "bestseller", boolean: true }],
});

module.exports = controller;
