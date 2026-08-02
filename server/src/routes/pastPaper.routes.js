const router = require("express").Router();
const ctrl = require("../controllers/pastPaper.controller");

router.get("/", ctrl.list);
router.get("/:slug", ctrl.getBySlug);
router.get("/id/:id", ctrl.getById);

module.exports = router;
