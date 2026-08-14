const requiredVars = ["JWT_SECRET", "DB_NAME", "DB_HOST"];

function validateEnv() {
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }
}

module.exports = validateEnv;
