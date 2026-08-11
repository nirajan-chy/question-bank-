const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth");
const adminCtrl = require("../controllers/admin.controller");
const sendSuccess = require("../utils/sendSuccess");
const ApiError = require("../utils/ApiError");
const { upload } = require("../utils/upload");
const models = require("../models");
const { createBaseController } = require("../controllers/base.controller");

router.use(auth, adminOnly);

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded");
  const url = `/uploads/${req.file.filename}`;
  sendSuccess(res, {
    url,
    filename: req.file.filename,
    size: req.file.size,
    mimeType: req.file.mimetype,
  }, 201, "File uploaded");
});

router.get("/stats", adminCtrl.getStats);

const resources = [
  { path: "levels", model: models.Level, ctrl: require("../controllers/level.controller") },
  { path: "universities", model: models.University, ctrl: require("../controllers/university.controller") },
  { path: "faculties", model: models.Faculty, ctrl: require("../controllers/faculty.controller") },
  { path: "courses", model: models.Course, ctrl: require("../controllers/course.controller") },
  { path: "semesters", model: models.Semester, ctrl: require("../controllers/semester.controller") },
  { path: "subjects", model: models.Subject, ctrl: require("../controllers/subject.controller") },
  { path: "notes", model: models.Note, ctrl: require("../controllers/note.controller") },
  { path: "books", model: models.Book, ctrl: require("../controllers/book.controller") },
  { path: "question-banks", model: models.QuestionBank, ctrl: require("../controllers/questionBank.controller") },
  { path: "past-papers", model: models.PastPaper, ctrl: require("../controllers/pastPaper.controller") },
  { path: "mock-tests", model: models.MockTest, ctrl: require("../controllers/mockTest.controller") },
  { path: "scholarships", model: models.Scholarship, ctrl: require("../controllers/scholarship.controller") },
  { path: "notices", model: models.Notice, ctrl: require("../controllers/notice.controller") },
  { path: "results", model: models.ResultEntry, ctrl: require("../controllers/result.controller") },
  { path: "faqs", model: models.Faq, ctrl: require("../controllers/faq.controller") },
  { path: "posts", model: models.Post, ctrl: require("../controllers/post.controller") },
  { path: "community", model: models.CommunityQuestion, ctrl: require("../controllers/community.controller") },
  { path: "communities", model: models.Community, ctrl: require("../controllers/communities.controller") },
  { path: "community-messages", model: models.CommunityMessage, ctrl: createBaseController(models.CommunityMessage) },
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
