const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { PastPaper, Subject } = require("../models");
const { createBaseController } = require("./base.controller");
const contentStore = require("../utils/contentStore");

const base = createBaseController(PastPaper, {
  filters: [
    { field: "subjectSlug" },
    { field: "courseSlug" },
  ],
  searchFields: ["title", "subjectSlug", "subjectName", "level", "exam", "board", "description"],
});

/**
 * Fill past-paper metadata from the Subject the admin picked, so uploads are
 * automatically filed under the right bachelor course / semester / subject.
 * Accepts `subjectId` (preferred) or an existing subjectSlug/subjectName.
 */
async function applySubjectMeta(body = {}) {
  let subject = null;
  if (body.subjectId) {
    subject = await Subject.findByPk(body.subjectId);
  } else if (body.subjectSlug) {
    subject = await Subject.findOne({ where: { slug: body.subjectSlug } });
  } else if (body.subjectName) {
    subject = await Subject.findOne({ where: { name: { [Op.iLike]: body.subjectName } } });
  }

  if (!subject && body.subjectId) {
    throw new ApiError(400, "Selected subject no longer exists");
  }

  if (subject) {
    body.subjectSlug = subject.slug;
    body.subjectName = subject.name;
    body.level = body.level || subject.level;
    if (!body.courseSlug && subject.courseSlug) body.courseSlug = subject.courseSlug;
    if (body.semester == null && subject.semester != null) body.semester = subject.semester;
  }

  delete body.subjectId;
}

/**
 * Markdown mode: write the question body to the content directory and store
 * only its path in PostgreSQL. PDF records never enter this code path.
 */
function applyMarkdownContent(body, existing = null) {
  const wantsMarkdown = body.contentType === "markdown" || (body.markdown != null && !body.contentType);

  if (!wantsMarkdown) {
    // Switching back to (or staying on) PDF — drop stale markdown fields but
    // clean up the old file when a markdown record converts to PDF.
    const previousPath = existing?.contentPath;
    if (body.contentType === "pdf" && existing?.contentType === "markdown") {
      contentStore.deleteMarkdown(previousPath);
      body.contentPath = null;
    }
    return;
  }

  const markdown = String(body.markdown ?? "").trim();
  if (!markdown) throw new ApiError(400, "Markdown content is required");

  // On update, admins may only resend the markdown text — fall back to the
  // stored record's classification to rebuild the file path.
  const meta = {
    courseSlug: body.courseSlug ?? existing?.courseSlug,
    semester: body.semester ?? existing?.semester,
    subjectSlug: body.subjectSlug ?? existing?.subjectSlug,
    levelSlug: body.levelSlug,
    year: body.year ?? existing?.year,
  };
  if (!meta.year) throw new ApiError(400, "Year is required");

  const contentPath = contentStore.buildContentPath(meta);
  contentStore.writeMarkdown(contentPath, markdown);

  // Rewriting an existing markdown paper at a new location? Remove the old file.
  if (existing?.contentPath && existing.contentPath !== contentPath) {
    contentStore.deleteMarkdown(existing.contentPath);
  }

  body.contentType = "markdown";
  body.contentPath = contentPath;
  delete body.markdown;
}

// base.create/base.update/base.remove are asyncHandler-wrapped (they return
// undefined and expect `next`), so delegate through Express-style handlers.
const controller = {
  ...base,

  create: (req, res, next) => {
    Promise.resolve()
      .then(() => applySubjectMeta(req.body))
      .then(() => applyMarkdownContent(req.body))
      .then(() => base.create(req, res, next))
      .catch(next);
  },

  update: (req, res, next) => {
    let existing = null;
    Promise.resolve()
      .then(() => PastPaper.findByPk(req.params.id))
      .then((record) => {
        existing = record;
        return applySubjectMeta(req.body);
      })
      .then(() => applyMarkdownContent(req.body, existing))
      .then(() => base.update(req, res, next))
      .catch(next);
  },

  remove: (req, res, next) => {
    let existing = null;
    Promise.resolve()
      .then(() => PastPaper.findByPk(req.params.id))
      .then((record) => {
        existing = record;
        return base.remove(req, res, next);
      })
      .then(() => {
        if (existing?.contentType === "markdown") {
          contentStore.deleteMarkdown(existing.contentPath);
        }
      })
      .catch(next);
  },
};

module.exports = controller;
