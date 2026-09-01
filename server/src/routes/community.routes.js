const router = require("express").Router();
const communityCtrl = require("../controllers/community.controller");
const communitiesCtrl = require("../controllers/communities.controller");
const { auth } = require("../middleware/auth");

// Questions sub-routes
router.get("/questions", communityCtrl.list);
router.post("/questions", auth, communityCtrl.createQuestion);
router.post("/questions/:id/view", communityCtrl.incrementViews);
router.post("/questions/:id/answers", auth, communityCtrl.addAnswer);
router.get("/questions/id/:id", communityCtrl.getById);
router.get("/questions/:slug", communityCtrl.getBySlug);

// Channels / messages sub-routes (previously /communities)
router.get("/channels", communitiesCtrl.list);
router.get("/channels/:id", communitiesCtrl.getById);
router.get("/channels/:communityId/messages", communitiesCtrl.listMessages);
router.post("/channels/:communityId/messages", auth, communitiesCtrl.sendMessage);
router.post("/messages/:messageId/reactions", auth, communitiesCtrl.addReaction);

module.exports = router;
