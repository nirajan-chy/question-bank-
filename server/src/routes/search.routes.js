const router = require("express").Router();
const { searchAll } = require("../controllers/search.controller");

router.get("/", searchAll);

module.exports = router;
