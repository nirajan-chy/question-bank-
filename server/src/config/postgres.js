const { Sequelize } = require("sequelize");
require("pg");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      // Aiven free-tier PostgreSQL caps connections (~5). In serverless each
      // function instance opens its own pool, so keep it tiny (max:1) to avoid
      // "remaining connection slots are reserved" errors. Locally max:3 is fine.
      max: process.env.VERCEL ? 1 : 3,
      min: 0,
      acquire: 30000,
      idle: 5000,
    },
    logging: false,
    retry: {
      max: 3,
      backoffBase: 1000,
    },
  },
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected Successfully");

    // Don't run DDL sync in serverless production — tables are created via seed.
    if (!process.env.VERCEL) {
      await sequelize.sync();
      console.log("✅ Database Tables Synchronized");
    }
    return true;
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    // Do not exit the process here so the API can still start in dev — return false to indicate failure.
    return false;
  }
};

module.exports = {
  sequelize,
  connectDB,
};
