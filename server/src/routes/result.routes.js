const router = require("express").Router();
const ctrl = require("../controllers/result.controller");

router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);

module.exports = router;
