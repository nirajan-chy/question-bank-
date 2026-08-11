const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
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
  { model: models.Course, file: "courses.json" },
  { model: models.Semester, file: "semesters.json" },
  { model: models.Subject, file: "subjects.json" },
  { model: models.Note, file: "notes.json" },
  { model: models.Book, file: "books.json" },
  { model: models.QuestionBank, file: "question-banks.json" },
  { model: models.PastPaper, file: "past-papers.json" },
  { model: models.MockTest, file: "mock-tests.json" },
  { model: models.Scholarship, file: "scholarships.json" },
  { model: models.Notice, file: "notices.json" },
  { model: models.ResultEntry, file: "results.json" },
  { model: models.Faq, file: "faq.json" },
  { model: models.Post, file: "posts.json" },
  { model: models.CommunityQuestion, file: "community.json", userIdPattern: "c-%" },
  { model: models.Community, file: "community-channels.json", transform: (row, index) => ({ ...row, order: index }) },
  { model: models.CommunityMessage, file: "community-messages.json", userIdPattern: "msg-%" },
  { model: models.LeaderboardEntry, file: "leaderboard.json" },
];

// Seed data files are the source of truth for every table, but some tables also
// hold user-generated rows. For those we only clean up rows that match the seed
// id shape (e.g. "c1", "m12") and are no longer present in the JSON — user rows
// (e.g. "c-1738…", "msg-…") are always preserved.
const getUpdateFields = (model) =>
  Object.keys(model.rawAttributes)
    .filter((key) => key !== "id" && key !== "createdAt" && key !== "updatedAt");

async function seedDatabase({ closeConnection = true } = {}) {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced (altered)");

    for (const { model, file, transform, userIdPattern } of seedMap) {
      const rows = transform ? readJson(file).map(transform) : readJson(file);
      if (rows.length === 0) continue;

      const seedIds = rows.map((r) => r.id).filter(Boolean);
      if (seedIds.length > 0) {
        if (userIdPattern) {
          await model.destroy({
            where: { id: { [Op.notIn]: seedIds, [Op.notLike]: userIdPattern } },
          });
        } else {
          await model.destroy({ where: { id: { [Op.notIn]: seedIds } } });
        }
      }

      // conflictAttributes (NOT upsertKeys — Sequelize ignores upsertKeys when
      // updateOnDuplicate is set) makes the upsert target the primary key, so
      // renames of unique columns (e.g. faculty slug) no longer collide.
      await model.bulkCreate(rows, {
        updateOnDuplicate: getUpdateFields(model),
        conflictAttributes: ["id"],
      });
      console.log(`✅ ${model.name}: ${rows.length} rows upserted`);
    }

    // Clean up messages that point at communities that no longer exist, while
    // keeping user messages in communities that do.
    const communityIds = (
      await models.Community.findAll({ attributes: ["id"], raw: true })
    ).map((r) => r.id);
    if (communityIds.length > 0) {
      const orphaned = await models.CommunityMessage.destroy({
        where: { communityId: { [Op.notIn]: communityIds } },
      });
      if (orphaned > 0) console.log(`🧹 Removed ${orphaned} message(s) from removed communities`);
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@sandarbh.com").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const admin = await models.User.findOne({ where: { email: adminEmail } });
    if (admin) {
      await admin.update({ role: "admin", password: adminPassword });
      console.log(`✅ Admin user updated: ${adminEmail}`);
    } else {
      await models.User.create({
        name: "Sandarbh Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log(`✅ Admin user created: ${adminEmail}`);
    }

    console.log("🎉 Seeding complete");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    if (closeConnection) {
      await sequelize.close();
    }
  }
}

module.exports = { seedDatabase };

if (require.main === module) {
  seedDatabase().catch(() => {
    process.exitCode = 1;
  });
}
