const router = require("express").Router();
const ctrl = require("../controllers/course.controller");

router.get("/", ctrl.list);
router.get("/level/:levelSlug", ctrl.listByLevel);
router.get("/id/:id", ctrl.getById);
router.get("/:slug", ctrl.getBySlug);

module.exports = router;