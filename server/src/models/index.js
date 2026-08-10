const { sequelize } = require("../config/postgres");

const Level = require("./level.model")(sequelize);
const University = require("./university.model")(sequelize);
const Faculty = require("./faculty.model")(sequelize);
const Course = require("./course.model")(sequelize);
const Semester = require("./semester.model")(sequelize);
const Subject = require("./subject.model")(sequelize);
const Note = require("./note.model")(sequelize);
const Book = require("./book.model")(sequelize);
const QuestionBank = require("./questionBank.model")(sequelize);
const PastPaper = require("./pastPaper.model")(sequelize);
const MockTest = require("./mockTest.model")(sequelize);
const Scholarship = require("./scholarship.model")(sequelize);
const Notice = require("./notice.model")(sequelize);
const ResultEntry = require("./result.model")(sequelize);
const Testimonial = require("./testimonial.model")(sequelize);
const Faq = require("./faq.model")(sequelize);
const Post = require("./post.model")(sequelize);
const CommunityQuestion = require("./communityQuestion.model")(sequelize);
const Community = require("./community.model")(sequelize);
const CommunityMessage = require("./communityMessage.model")(sequelize);
const LeaderboardEntry = require("./leaderboard.model")(sequelize);
const Contact = require("./contact.model")(sequelize);
const User = require("./user.model")(sequelize);

const models = {
  Level,
  University,
  Faculty,
  Course,
  Semester,
  Subject,
  Note,
  Book,
  QuestionBank,
  PastPaper,
  MockTest,
  Scholarship,
  Notice,
  ResultEntry,
  Testimonial,
  Faq,
  Post,
  CommunityQuestion,
  Community,
  CommunityMessage,
  LeaderboardEntry,
  Contact,
  User,
};

module.exports = models;
