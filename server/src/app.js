const express = require("express");
const cors = require("cors");
const path = require("path");

const apiRoutes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { UPLOAD_DIR } = require("./utils/upload");
const { CLIENT_ORIGINS } = require("./config/dotenv");

const app = express();

app.set("trust proxy", 1);

const corsOptions = {
  origin:
    CLIENT_ORIGINS.length > 0 ? CLIENT_ORIGINS : ["http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PrashnaHub API is running",
  });
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