const { Sequelize } = require("sequelize");
require("pg");

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
      // pg defaults connectionTimeoutMillis to 0 (wait forever). The route to
      // Aiven from here is lossy: a plain TCP connect measured anywhere from
      // 0.24s to an outright 8s timeout, a full TLS+auth handshake takes
      // 3.7-4.2s on a good run, and the link does go completely dark for
      // minutes at a time. Without a bound, one stuck socket parks the pool
      // indefinitely - which is how index.js sat in initializeDB() without
      // ever reaching app.listen. 7s clears the observed 4.2s worst good case
      // while failing fast enough that two attempts still land well inside the
      // browser's 20s abort.
      connectionTimeoutMillis: 7000,
    },
    pool: {
      // Aiven's max_connections is 20 (checked against pg_settings); this is
      // about politeness, not capacity. Serverless still uses 1 so parallel
      // functions can't stack up pools.
      max: process.env.VERCEL ? 1 : 3,
      // Keep one connection warm. A cold connect costs 0.24-8s here, and with
      // min:0 plus a 5s idle the pool tore itself down between page loads - so
      // the home page's ~11 parallel fetches each paid that cost at once and
      // blew past the browser's 20s abort.
      min: process.env.VERCEL ? 0 : 1,
      // Must stay under the client's 20s abort (client/services/http.ts) so a
      // congested pool surfaces as a real error the UI can render, not a hang.
      // Sized to fit a full connect chain (7s + 0.5s backoff + 7s = 14.5s)
      // with room to spare, so the server always answers before the browser.
      acquire: 15000,
      idle: 30000,
    },
    logging: false,
    // One quick retry: on this link the first connect often fails and the
    // second succeeds, but anything longer overshoots the client timeout.
    retry: {
      max: 2,
      backoffBase: 500,
      backoffMax: 1500,
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
