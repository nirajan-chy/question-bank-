const { Book } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Book, {
  filters: [{ field: "bestseller", boolean: true }],
  searchFields: ["title", "author", "publisher", "isbn", "level", "description"],
});

module.exports = controller;
