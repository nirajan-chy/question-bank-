const router = require("express").Router();
const ctrl = require("../controllers/subject.controller");

router.get("/", ctrl.list);
router.get("/trending", ctrl.listTrending);
router.get("/level/:levelSlug", ctrl.listByLevel);
router.get("/:slug", ctrl.getBySlug);
router.get("/id/:id", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
