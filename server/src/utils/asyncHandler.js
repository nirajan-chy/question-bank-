const ApiError = require("./ApiError");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    if (error instanceof ApiError) return next(error);
    next(new ApiError(500, error.message || "Internal server error"));
  });
};

module.exports = asyncHandler;
