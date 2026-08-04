const router = require("express").Router();
const ctrl = require("../controllers/level.controller");

router.get("/", ctrl.list);
router.get("/:slug", ctrl.getBySlug);
router.get("/id/:id", ctrl.getById);

module.exports = router;
