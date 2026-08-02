const router = require("express").Router();
const ctrl = require("../controllers/contact.controller");

router.post("/", ctrl.createContact);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
