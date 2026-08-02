require("dotenv").config();

const app = require("./src/app");
const { connectDB } = require("./src/config/postgres");

const PORT = process.env.PORT || 5000;

async function start() {
  const connected = await connectDB();
  if (!connected) {
    console.warn("⚠️  Could not connect to the database — starting API anyway.");
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start();
