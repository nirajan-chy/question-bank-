const router = require("express").Router();
const ctrl = require("../controllers/semester.controller");

router.get("/", ctrl.list);
router.get("/course/:courseSlug", ctrl.listByCourse);
router.get("/:slug", ctrl.getBySlug);
router.get("/id/:id", ctrl.getById);

module.exports = router;