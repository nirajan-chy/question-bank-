const router = require("express").Router();
const ctrl = require("../controllers/course.controller");

router.get("/", ctrl.list);
router.get("/level/:levelSlug", ctrl.listByLevel);
router.get("/:slug", ctrl.getBySlug);
router.get("/id/:id", ctrl.getById);

module.exports = router;