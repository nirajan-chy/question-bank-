const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Sandarbh API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API healthy", timestamp: new Date().toISOString() });
});

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
