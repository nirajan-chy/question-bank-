const router = require("express").Router();
const ctrl = require("../controllers/note.controller");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const models = require("../models");

router.get("/", ctrl.list);
router.get("/id/:id", ctrl.getById);

// Related notes — same subject, exclude current
router.get(
  "/:slug/related",
  asyncHandler(async (req, res) => {
    const note = await models.Note.findOne({ where: { slug: req.params.slug } });
    if (!note) throw new ApiError(404, "Note not found");

    const related = await models.Note.findAll({
      where: { subjectSlug: note.subjectSlug },
      order: [["downloads", "DESC"]],
      limit: 6,
    });
    const filtered = related.filter((n) => n.id !== note.id);
    res.json({ success: true, data: filtered.slice(0, 4) });
  })
);

// Increment view count
router.post(
  "/:slug/view",
  asyncHandler(async (req, res) => {
    const note = await models.Note.findOne({ where: { slug: req.params.slug } });
    if (!note) throw new ApiError(404, "Note not found");
    await note.update({ views: (note.views || 0) + 1 });
    res.json({ success: true, data: { views: note.views + 1 } });
  })
);

// Increment download count
router.post(
  "/:slug/download",
  asyncHandler(async (req, res) => {
    const note = await models.Note.findOne({ where: { slug: req.params.slug } });
    if (!note) throw new ApiError(404, "Note not found");
    await note.update({ downloads: (note.downloads || 0) + 1 });
    res.json({ success: true, data: { downloads: note.downloads + 1 } });
  })
);

// Get note by slug (must come after specific /:slug/* routes)
router.get("/:slug", ctrl.getBySlug);

module.exports = router;
