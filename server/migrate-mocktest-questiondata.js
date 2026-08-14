const { sequelize } = require("./src/config/postgres");

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query(
      `ALTER TABLE mock_tests ADD COLUMN IF NOT EXISTS "questionData" JSONB DEFAULT '[]'::jsonb`
    );
    console.log("OK: added questionData column to mock_tests");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
})();
