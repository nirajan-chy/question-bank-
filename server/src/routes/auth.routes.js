const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");
const oauthCtrl = require("../controllers/oauth.controller");
const { auth } = require("../middleware/auth");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/me", auth, ctrl.me);

router.get("/:provider/start", oauthCtrl.oauthStart);
router.get("/:provider/callback", oauthCtrl.oauthCallback);

module.exports = router;
