const { ValidationError } = require("sequelize");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || [];

  if (err instanceof ValidationError) {
    statusCode = 400;
    message = "Validation error";
    errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
  }

  if (statusCode >= 500) {
    console.error("❌", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = errorHandler;
