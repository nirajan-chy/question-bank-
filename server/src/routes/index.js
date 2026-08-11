const router = require("express").Router();

router.use("/levels", require("./level.routes"));
router.use("/universities", require("./university.routes"));
router.use("/faculties", require("./faculty.routes"));
router.use("/courses", require("./course.routes"));
router.use("/semesters", require("./semester.routes"));
router.use("/subjects", require("./subject.routes"));
router.use("/notes", require("./note.routes"));
router.use("/books", require("./book.routes"));
router.use("/question-banks", require("./questionBank.routes"));
router.use("/past-papers", require("./pastPaper.routes"));
router.use("/mock-tests", require("./mockTest.routes"));
router.use("/scholarships", require("./scholarship.routes"));
router.use("/notices", require("./notice.routes"));
router.use("/results", require("./result.routes"));
router.use("/faqs", require("./faq.routes"));
router.use("/posts", require("./post.routes"));
router.use("/community", require("./community.routes"));
router.use("/communities", require("./communities.routes"));
router.use("/leaderboard", require("./leaderboard.routes"));
router.use("/search", require("./search.routes"));
router.use("/contact", require("./contact.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/admin", require("./admin.routes"));
router.use("/rag", require("./rag.routes"));

module.exports = router;
