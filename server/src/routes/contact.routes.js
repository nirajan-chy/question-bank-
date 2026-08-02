const router = require("express").Router();
const ctrl = require("../controllers/contact.controller");

router.post("/", ctrl.createContact);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);

module.exports = router;
