const { Op, where, cast, col } = require("sequelize");
const {
  Subject,
  Note,
  Book,
  QuestionBank,
  MockTest,
  Scholarship,
  Post,
  CommunityQuestion,
} = require("../models");
const asyncHandler = require("../utils/asyncHandler");
const sendSuccess = require("../utils/sendSuccess");

const searchModel = async (Model, query, fields) => {
  const conditions = fields.map((field) => {
    if (field === "tags") {
      return where(cast(col(`${Model.name}.${field}`), "text"), {
        [Op.iLike]: `%${query}%`,
      });
    }
    return { [field]: { [Op.iLike]: `%${query}%` } };
  });

  return Model.findAll({ where: { [Op.or]: conditions }, limit: 20 });
};

const searchAll = asyncHandler(async (req, res) => {
  const query = (req.query.q || "").trim();
  const empty = {
    subjects: [],
    notes: [],
    books: [],
    questionBanks: [],
    mockTests: [],
    scholarships: [],
    posts: [],
    community: [],
  };

  if (!query) return sendSuccess(res, empty);

  const [subjects, notes, books, questionBanks, mockTests, scholarships, posts, community] =
    await Promise.all([
      searchModel(Subject, query, ["name", "description", "level", "category", "tags"]),
      searchModel(Note, query, ["title", "description", "subjectName", "level", "author", "tags"]),
      searchModel(Book, query, ["title", "author", "publisher", "level", "description", "tags"]),
      searchModel(QuestionBank, query, ["title", "subjectName", "level", "description", "tags"]),
      searchModel(MockTest, query, ["title", "subjectName", "level", "description", "tags"]),
      searchModel(Scholarship, query, ["title", "provider", "level", "category", "description", "tags"]),
      searchModel(Post, query, ["title", "excerpt", "category", "author", "tags"]),
      searchModel(CommunityQuestion, query, ["title", "body", "author", "tags"]),
    ]);

  sendSuccess(res, { subjects, notes, books, questionBanks, mockTests, scholarships, posts, community });
});

module.exports = { searchAll };
