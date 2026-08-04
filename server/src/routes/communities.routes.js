const router = require("express").Router();
const ctrl = require("../controllers/communities.controller");

router.post("/messages/:messageId/reactions", ctrl.addReaction);
router.get("/:id/messages", ctrl.listMessages);
router.post("/:id/messages", ctrl.sendMessage);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);

module.exports = router;
