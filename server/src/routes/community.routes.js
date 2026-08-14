const router = require("express").Router();
const communityCtrl = require("../controllers/community.controller");
const communitiesCtrl = require("../controllers/communities.controller");

// Questions sub-routes
router.get("/questions", communityCtrl.list);
router.post("/questions", communityCtrl.createQuestion);
router.post("/questions/:id/view", communityCtrl.incrementViews);
router.post("/questions/:id/answers", communityCtrl.addAnswer);
router.get("/questions/:slug", communityCtrl.getBySlug);
router.get("/questions/id/:id", communityCtrl.getById);

// Channels / messages sub-routes (previously /communities)
router.get("/channels", communitiesCtrl.list);
router.get("/channels/:id", communitiesCtrl.getById);
router.get("/channels/:communityId/messages", communitiesCtrl.listMessages);
router.post("/channels/:communityId/messages", communitiesCtrl.sendMessage);
router.post("/messages/:messageId/reactions", communitiesCtrl.addReaction);

module.exports = router;
