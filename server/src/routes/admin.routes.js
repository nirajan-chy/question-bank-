const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth");
const adminCtrl = require("../controllers/admin.controller");
const userCtrl = require("../controllers/base.controller").createBaseController(
  require("../models").User
);

router.use(auth, adminOnly);

router.get("/stats", adminCtrl.getStats);

const resources = [
  { path: "levels", ctrl: require("../controllers/level.controller") },
  { path: "universities", ctrl: require("../controllers/university.controller") },
  { path: "faculties", ctrl: require("../controllers/faculty.controller") },
  { path: "subjects", ctrl: require("../controllers/subject.controller") },
  { path: "notes", ctrl: require("../controllers/note.controller") },
  { path: "books", ctrl: require("../controllers/book.controller") },
  { path: "question-banks", ctrl: require("../controllers/questionBank.controller") },
  { path: "past-papers", ctrl: require("../controllers/pastPaper.controller") },
  { path: "mock-tests", ctrl: require("../controllers/mockTest.controller") },
  { path: "scholarships", ctrl: require("../controllers/scholarship.controller") },
  { path: "notices", ctrl: require("../controllers/notice.controller") },
  { path: "results", ctrl: require("../controllers/result.controller") },
  { path: "testimonials", ctrl: require("../controllers/testimonial.controller") },
  { path: "faqs", ctrl: require("../controllers/faq.controller") },
  { path: "posts", ctrl: require("../controllers/post.controller") },
  { path: "community", ctrl: require("../controllers/community.controller") },
  { path: "leaderboard", ctrl: require("../controllers/leaderboard.controller") },
  { path: "contacts", ctrl: require("../controllers/contact.controller") },
];

for (const { path, ctrl } of resources) {
  router.get(`/${path}`, ctrl.list);
  router.get(`/${path}/:id`, ctrl.getById);
  router.post(`/${path}`, ctrl.create);
  router.put(`/${path}/:id`, ctrl.update);
  router.delete(`/${path}/:id`, ctrl.remove);
}

router.get("/users", userCtrl.list);
router.get("/users/:id", userCtrl.getById);
router.put("/users/:id", adminCtrl.updateUser);
router.delete("/users/:id", adminCtrl.deleteUser);

module.exports = router;
