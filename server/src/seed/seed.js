const path = require("path");
const fs = require("fs");
const { sequelize } = require("../config/postgres");
const models = require("../models");

const DATA_DIR = path.resolve(__dirname, "../../../client/data");

const readJson = (file) => {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Skipping missing data file: ${file}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const seedMap = [
  { model: models.Level, file: "levels.json" },
  { model: models.University, file: "universities.json" },
  { model: models.Faculty, file: "faculties.json" },
  { model: models.Subject, file: "subjects.json" },
  { model: models.Note, file: "notes.json" },
  { model: models.Book, file: "books.json" },
  { model: models.QuestionBank, file: "question-banks.json" },
  { model: models.PastPaper, file: "past-papers.json" },
  { model: models.MockTest, file: "mock-tests.json" },
  { model: models.Scholarship, file: "scholarships.json" },
  { model: models.Notice, file: "notices.json" },
  { model: models.ResultEntry, file: "results.json" },
  { model: models.Testimonial, file: "testimonials.json" },
  { model: models.Faq, file: "faq.json" },
  { model: models.Post, file: "posts.json" },
  { model: models.CommunityQuestion, file: "community.json" },
  { model: models.LeaderboardEntry, file: "leaderboard.json" },
];

const getUpdateFields = (model) =>
  Object.keys(model.rawAttributes)
    .filter((key) => key !== "id" && key !== "createdAt" && key !== "updatedAt");

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Tables synced");

    for (const { model, file } of seedMap) {
      const rows = readJson(file);
      if (rows.length === 0) continue;

      await model.bulkCreate(rows, {
        updateOnDuplicate: getUpdateFields(model),
        upsertKeys: ["id"],
      });
      console.log(`✅ ${model.name}: ${rows.length} rows upserted`);
    }

    console.log("🎉 Seeding complete");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seed();
