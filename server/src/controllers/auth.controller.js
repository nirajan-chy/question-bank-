const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");
const models = require("../models");

const { User } = models;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "Server misconfigured: JWT_SECRET is not set in the environment");
  }
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const sanitize = (user) => user.get({ plain: true });

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }
  if (!EMAIL_RE.test(email)) throw new ApiError(400, "Please provide a valid email");
  if (password.length < 6) throw new ApiError(400, "Password must be at least 6 characters");

  const existing = await User.findOne({ where: { email: email.toLowerCase().trim() } });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({ name, email: email.toLowerCase().trim(), password });
  const token = signToken(user);

  sendSuccess(res, { token, user: sanitize(user) }, 201, "Account created");
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const user = await User.unscoped().findOne({ where: { email: email.toLowerCase().trim() } });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user);
  sendSuccess(res, { token, user: sanitize(user) }, 200, "Logged in");
});

const me = asyncHandler(async (req, res) => {
  sendSuccess(res, sanitize(req.user), 200, "Authenticated user");
});

module.exports = { register, login, me };
