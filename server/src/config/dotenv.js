const { config } = require("dotenv");

config();

const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

module.exports = {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  JWT_SECRET,
  SMTP_USER,
  SMTP_PASSWORD,
  CLIENT_ORIGIN,
};
