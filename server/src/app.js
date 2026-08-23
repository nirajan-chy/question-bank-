const express = require("express");
const cors = require("cors");
const path = require("path");

const apiRoutes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { UPLOAD_DIR } = require("./utils/upload");
const { CONTENT_DIR } = require("./utils/contentStore");
const { CLIENT_ORIGINS } = require("./config/dotenv");

const app = express();

// Trust a single reverse proxy hop (Vercel/Render) so req.protocol respects
// the x-forwarded-proto header. Limiting to one hop prevents arbitrary clients
// from spoofing X-Forwarded-* headers (and bypassing IP-based rate limiting).
app.set("trust proxy", 1);

app.use(
  cors({
    // Deny-by-default allowlist. Requests with no Origin header (curl,
    // server-to-server) are allowed; browser cross-origin requests must
    // match an explicit origin in CLIENT_ORIGINS.
    origin: (origin, cb) => {
      // Requests without an Origin header (curl, server-to-server) pass through.
      // Disallowed browser origins get no CORS headers, so the browser blocks
      // reading the response — they are not server-side errors.
      cb(null, !origin || CLIENT_ORIGINS.includes(origin));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(UPLOAD_DIR));

// Markdown past-question bodies live on disk, not in PostgreSQL — served as
// immutable static text so repeated reads never touch the database.
app.use(
  "/content",
  express.static(CONTENT_DIR, {
    maxAge: "1h",
    setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
  }),
);

app.get("/", (req, res) => {
  res.json({ success: true, message: "PrashnaHub API is running" });
});

app.get("/api/health", async (req, res) => {
  try {
    const { sequelize } = require("./config/postgres");
    await sequelize.authenticate();
    const { Level } = require("./models");
    const levelCount = await Level.count();
    res.json({
      success: true,
      message: "API healthy",
      database: "connected",
      dataCount: levelCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      message: "API running but database unavailable",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
