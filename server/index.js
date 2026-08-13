require("dotenv").config();

const app = require("./src/app");
const { connectDB } = require("./src/config/postgres");
const createAdmin = require("./src/seed/createAdmin");
const { seedDatabase } = require("./src/seed/seed");
const { Level } = require("./src/models");

let dbInitialized = false;

async function initializeDB() {
  if (!dbInitialized) {
    const connected = await connectDB();
    if (!connected) {
      console.warn(
        "⚠️  Could not connect to the database — starting API anyway.",
      );
    } else {
      const levelCount = await Level.count().catch(() => 0);
      if (levelCount === 0) {
        console.log("🌱 Database is empty — seeding...");
        await seedDatabase({ closeConnection: false });
      } else {
        console.log("✅ Database already has data — skipping seed");
      }
      // await createAdmin();...
    }
    dbInitialized = true;
  }
}

// Vercel
if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    await initializeDB();
    return app(req, res);
  };
}

// Local development
else {
  const PORT = process.env.PORT || 5000;

  initializeDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}
