const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const { PastPaper, Subject } = require("../models");
const { createBaseController } = require("./base.controller");

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

// base.create/base.update are asyncHandler-wrapped (they return undefined and
// expect `next`), so delegate through Express-style handlers that forward both
// the mutated body and `next`.
const controller = {
  ...base,
  create: asyncHandlerDelegated(base, "create"),
  update: asyncHandlerDelegated(base, "update"),
};

function asyncHandlerDelegated(delegatee, method) {
  return (req, res, next) => {
    applySubjectMeta(req.body)
      .then(() => delegatee[method](req, res, next))
      .catch(next);
  };
}

module.exports = controller;
