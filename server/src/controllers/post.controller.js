const { Post } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(Post, {
  order: [["publishedAt", "DESC"]],
  searchFields: ["title", "excerpt", "category", "author"],
});

module.exports = controller;
