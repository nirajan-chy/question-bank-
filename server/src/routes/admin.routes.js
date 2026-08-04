const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth");
const adminCtrl = require("../controllers/admin.controller");
const sendSuccess = require("../utils/sendSuccess");
const ApiError = require("../utils/ApiError");
const models = require("../models");
const { createBaseController } = require("../controllers/base.controller");

router.use(auth, adminOnly);

router.get("/stats", adminCtrl.getStats);

const resources = [
  { path: "levels", model: models.Level, ctrl: require("../controllers/level.controller") },
  { path: "universities", model: models.University, ctrl: require("../controllers/university.controller") },
  { path: "faculties", model: models.Faculty, ctrl: require("../controllers/faculty.controller") },
  { path: "subjects", model: models.Subject, ctrl: require("../controllers/subject.controller") },
  { path: "notes", model: models.Note, ctrl: require("../controllers/note.controller") },
  { path: "books", model: models.Book, ctrl: require("../controllers/book.controller") },
  { path: "question-banks", model: models.QuestionBank, ctrl: require("../controllers/questionBank.controller") },
  { path: "past-papers", model: models.PastPaper, ctrl: require("../controllers/pastPaper.controller") },
  { path: "mock-tests", model: models.MockTest, ctrl: require("../controllers/mockTest.controller") },
  { path: "scholarships", model: models.Scholarship, ctrl: require("../controllers/scholarship.controller") },
  { path: "notices", model: models.Notice, ctrl: require("../controllers/notice.controller") },
  { path: "results", model: models.ResultEntry, ctrl: require("../controllers/result.controller") },
  { path: "testimonials", model: models.Testimonial, ctrl: require("../controllers/testimonial.controller") },
  { path: "faqs", model: models.Faq, ctrl: require("../controllers/faq.controller") },
  { path: "posts", model: models.Post, ctrl: require("../controllers/post.controller") },
  { path: "community", model: models.CommunityQuestion, ctrl: require("../controllers/community.controller") },
  { path: "communities", model: models.Community, ctrl: require("../controllers/communities.controller") },
  { path: "leaderboard", model: models.LeaderboardEntry, ctrl: require("../controllers/leaderboard.controller") },
  { path: "contacts", model: models.Contact, ctrl: require("../controllers/contact.controller") },
];

const modelByPath = Object.fromEntries(resources.map((r) => [r.path, r.model]));

router.get("/meta/:resource", (req, res, next) => {
  const Model = modelByPath[req.params.resource];
  if (!Model) return next(new ApiError(404, `Unknown resource: ${req.params.resource}`));
  sendSuccess(res, adminCtrl.buildModelMeta(Model));
});

for (const { path, ctrl } of resources) {
  router.get(`/${path}`, ctrl.list);
  router.get(`/${path}/:id`, ctrl.getById);
  router.post(`/${path}`, ctrl.create);
  router.put(`/${path}/:id`, ctrl.update);
  router.delete(`/${path}/:id`, ctrl.remove);
}

const userCtrl = createBaseController(models.User);
router.get("/users", userCtrl.list);
router.get("/users/:id", userCtrl.getById);
router.put("/users/:id", adminCtrl.updateUser);
router.delete("/users/:id", adminCtrl.deleteUser);

module.exports = router;
