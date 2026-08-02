const { LeaderboardEntry } = require("../models");
const { createBaseController } = require("./base.controller");

const controller = createBaseController(LeaderboardEntry, {
  order: [["rank", "ASC"]],
});

module.exports = controller;
