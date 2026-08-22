const { MockTest } = require("../models");
const { createBaseController } = require("./base.controller");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");

const controller = createBaseController(MockTest, {
  filters: [{ field: "subjectSlug" }],
  searchFields: ["title", "subjectSlug", "subjectName", "level", "description"],
});

// Keep the legacy `questions` count column in sync with the actual question set.
const syncQuestionCount = (body) => {
  if (Array.isArray(body.questionData)) {
    body.questions = body.questionData.length;
  }
};

const baseCreate = controller.create;
const baseUpdate = controller.update;

controller.create = asyncHandler(async (req, res, next) => {
  syncQuestionCount(req.body);
  return baseCreate(req, res, next);
});

controller.update = asyncHandler(async (req, res, next) => {
  syncQuestionCount(req.body);
  return baseUpdate(req, res, next);
});

/**
 * Score a submitted mock test. `answers` maps question id -> selected option index.
 * Never trusts the client for the score — it recomputes from stored question data.
 */
controller.submit = asyncHandler(async (req, res) => {
  const { slug, answers } = req.body ?? {};
  if (!slug) throw new ApiError(400, "Mock test slug is required");
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    throw new ApiError(400, "Answers must be an object mapping question id to option index");
  }

  const test = await MockTest.findOne({ where: { slug } });
  if (!test) throw new ApiError(404, "Mock test not found");

  const questions = Array.isArray(test.questionData) ? test.questionData : [];
  if (questions.length === 0) throw new ApiError(400, "This mock test has no questions yet");

  const results = questions.map((q) => {
    const selected = Number(answers[q.id]);
    const valid = Number.isInteger(selected) && selected >= 0 && selected < (q.options?.length || 0);
    const correct = valid && selected === Number(q.correctIndex);
    return {
      id: q.id,
      question: q.question,
      options: Array.isArray(q.options) ? q.options : [],
      topic: q.topic ?? null,
      explanation: q.explanation ?? null,
      marks: Number(q.marks) || 1,
      selected: valid ? selected : null,
      correctIndex: Number(q.correctIndex),
      correct,
    };
  });

  const total = results.reduce((sum, q) => sum + q.marks, 0);
  const score = results.reduce((sum, q) => (q.correct ? sum + q.marks : sum), 0);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const attempts = (test.attempts || 0) + 1;
  const avgScore = Math.round((((test.avgScore || 0) * (attempts - 1) + percentage) / attempts) * 10) / 10;
  await test.update({ attempts, avgScore });

  sendSuccess(res, {
    score,
    total,
    percentage,
    passed: percentage >= 40,
    passPercent: 40,
    results,
  });
});

module.exports = controller;
