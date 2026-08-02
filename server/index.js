require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/postgres");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

// Routes example
// const userRoutes = require("./src/routes/user.routes");
// app.use("/api/users", userRoutes);

// Database connection
async function connectDatabase() {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully");

    // Create tables if they don't exist
    await sequelize.sync();

    console.log("Database synced");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
