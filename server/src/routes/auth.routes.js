const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");
const oauthCtrl = require("../controllers/oauth.controller");
const { auth } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const { validate, registerSchema, loginSchema } = require("../validators/auth.validator");

router.post("/register", authLimiter, validate(registerSchema), ctrl.register);
router.post("/login", authLimiter, validate(loginSchema), ctrl.login);
router.get("/me", auth, ctrl.me);

router.get("/:provider/start", oauthCtrl.oauthStart);
router.get("/:provider/callback", oauthCtrl.oauthCallback);

module.exports = router;
