const fs = require("fs");
const path = require("path");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../config/postgres");

const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations");

async function runMigrations() {
  await sequelize.authenticate();

  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS "schema_migrations" (
       "name" VARCHAR(255) PRIMARY KEY,
       "applied_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
     )`,
  );

  const applied = new Set(
    (
      await sequelize.query('SELECT "name" FROM "schema_migrations"', {
        type: QueryTypes.SELECT,
      })
    ).map((r) => r.name),
  );

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const pending = files.filter((f) => !applied.has(f));
  if (pending.length === 0) {
    console.log("✅ No pending migrations");
    return;
  }

  for (const file of pending) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    const transaction = await sequelize.transaction();
    try {
      await sequelize.query(sql, { transaction });
      await sequelize.query('INSERT INTO "schema_migrations" ("name") VALUES (?)', {
        transaction,
        replacements: [file],
      });
      await transaction.commit();
      console.log(`✅ Applied ${file}`);
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Migration ${file} failed: ${error.message}`);
    }
  }
  console.log("🎉 Migrations complete");
}

module.exports = runMigrations;

if (require.main === module) {
  runMigrations()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Migration error:", error.message);
      process.exit(1);
    });
}
