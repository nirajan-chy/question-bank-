const router = require("express").Router();
const ctrl = require("../controllers/community.controller");

router.get("/", ctrl.list);
router.post("/", ctrl.createQuestion);
router.post("/:id/view", ctrl.incrementViews);
router.post("/:id/answers", ctrl.addAnswer);
router.get("/:slug", ctrl.getBySlug);
router.get("/id/:id", ctrl.getById);

module.exports = router;
