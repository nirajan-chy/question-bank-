const { sequelize } = require("./src/config/postgres");

const tables = ["subjects", "courses", "faculties", "universities", "scholarships", "communities"];

(async () => {
  await sequelize.authenticate();
  for (const t of tables) {
    try {
      await sequelize.query(`ALTER TABLE "${t}" DROP COLUMN IF EXISTS "gradient";`);
      console.log("dropped gradient ->", t);
    } catch (e) {
      console.log("skip", t, "->", e.message);
    }
  }
  await sequelize.close();
  console.log("done");
})().catch((e) => {
  console.error("FAIL", e);
  process.exit(1);
});
