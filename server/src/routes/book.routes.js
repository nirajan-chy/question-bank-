const router = require("express").Router();
const ctrl = require("../controllers/book.controller");

router.get("/", ctrl.list);
router.get("/id/:id", ctrl.getById);
router.get("/:slug", ctrl.getBySlug);

module.exports = router;
