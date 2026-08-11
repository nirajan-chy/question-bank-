require("dotenv").config();

const app = require("./src/app");
const { connectDB } = require("./src/config/postgres");

let dbInitialized = false;

async function initializeDB() {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
}

// Vercel
if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    await initializeDB();
    return app(req, res);
  };
}

// Local development
else {
  const PORT = process.env.PORT || 5000;

  initializeDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}
