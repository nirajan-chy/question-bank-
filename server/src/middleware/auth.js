const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const models = require("../models");

const getToken = (req) => {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
};

const auth = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) throw new ApiError(401, "Authentication required");
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "Server misconfigured: JWT_SECRET is not set in the environment");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await models.User.findByPk(payload.id);
  if (!user) throw new ApiError(401, "User no longer exists");

  req.user = user;
  next();
});

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Admin access required"));
  }
  next();
};

module.exports = { auth, adminOnly };
