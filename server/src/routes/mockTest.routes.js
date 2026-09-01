const router = require("express").Router();
const ctrl = require("../controllers/mockTest.controller");

router.get("/", ctrl.list);
router.get("/id/:id", ctrl.getById);
router.get("/:slug", ctrl.getBySlug);
router.post("/submit", ctrl.submit);

module.exports = router;
