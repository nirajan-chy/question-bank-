const router = require("express").Router();
const ctrl = require("../controllers/mockTest.controller");

router.get("/", ctrl.list);
router.get("/:slug", ctrl.getBySlug);
router.get("/id/:id", ctrl.getById);

module.exports = router;
