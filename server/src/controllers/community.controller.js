const { CommunityQuestion } = require("../models");
const { createBaseController } = require("./base.controller");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");
const slugify = require("../utils/slugify");

const controller = createBaseController(CommunityQuestion, {
  order: [["createdAt", "DESC"]],
  searchFields: ["title", "body", "author", "authorRole"],
});

const createQuestion = asyncHandler(async (req, res) => {
  const { title, body, tags = [], bounty } = req.body;

  if (!title || !body) throw new ApiError(400, "title and body are required");

  const slug = `${slugify(title)}-${Date.now().toString(36)}`;
  const author = req.user.name || "User";
  const authorRole = req.user.role || "Student";

  const question = await CommunityQuestion.create({
    id: `c-${Date.now()}`,
    slug,
    title,
    body,
    author,
    authorRole,
    avatar: req.user.avatar || author.slice(0, 2).toUpperCase(),
    tags,
    views: 0,
    votes: 0,
    answers: [],
    answerCount: 0,
    viewsFormatted: "0",
    answered: false,
    acceptedAnswerId: null,
    bounty: bounty || null,
  });

  sendSuccess(res, question, 201, "Question posted");
});

const addAnswer = asyncHandler(async (req, res) => {
  const question = await CommunityQuestion.findByPk(req.params.id);
  if (!question) throw new ApiError(404, "Community question not found");

  const { body } = req.body;
  if (!body) throw new ApiError(400, "body is required");

  const author = req.user.name || "User";
  const authorRole = req.user.role || "Student";
  const answers = question.answers || [];
  const answer = {
    id: `a-${Date.now()}`,
    author,
    authorRole,
    avatar: req.user.avatar || author.slice(0, 2).toUpperCase(),
    body,
    votes: 0,
    accepted: false,
    createdAt: new Date().toISOString().slice(0, 10),
    comments: [],
  };

  answers.push(answer);

  await question.update({
    answers,
    answerCount: answers.length,
    answered: true,
  });

  sendSuccess(res, question, 201, "Answer added");
});

const incrementViews = asyncHandler(async (req, res) => {
  const question = await CommunityQuestion.findByPk(req.params.id);
  if (!question) throw new ApiError(404, "Community question not found");
  const views = (question.views || 0) + 1;
  const viewsFormatted = views >= 1000 ? `${(views / 1000).toFixed(1)}k` : String(views);
  await question.update({ views, viewsFormatted });
  sendSuccess(res, question);
});

module.exports = {
  ...controller,
  createQuestion,
  addAnswer,
  incrementViews,
};
