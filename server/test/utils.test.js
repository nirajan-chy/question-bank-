"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { ValidationError } = require("sequelize");

const ApiError = require("../src/utils/ApiError");
const asyncHandler = require("../src/utils/asyncHandler");
const sendSuccess = require("../src/utils/sendSuccess");
const slugify = require("../src/utils/slugify");
const notFound = require("../src/middleware/notFound");
const errorHandler = require("../src/middleware/errorHandler");
const { makeRes } = require("./helpers");

test("slugify converts text to lowercase dashed slugs", () => {
  assert.equal(slugify("Hello World!"), "hello-world");
  assert.equal(slugify("  Nepal's   Guide  "), "nepals-guide");
  assert.equal(slugify("ABC_xyz-123"), "abc-xyz-123");
  assert.equal(slugify(1234), "1234");
});

test("ApiError carries statusCode, errors and isOperational", () => {
  const err = new ApiError(404, "not found", [{ field: "id" }]);
  assert.equal(err.statusCode, 404);
  assert.equal(err.message, "not found");
  assert.equal(err.isOperational, true);
  assert.deepEqual(err.errors, [{ field: "id" }]);
});

test("asyncHandler forwards ApiError to next", async () => {
  const handler = asyncHandler(async () => {
    throw new ApiError(400, "bad request");
  });
  let captured;
  handler({}, {}, (e) => {
    captured = e;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.ok(captured instanceof ApiError);
  assert.equal(captured.statusCode, 400);
});

test("asyncHandler wraps unknown errors as 500 ApiError", async () => {
  const handler = asyncHandler(async () => {
    throw new Error("boom");
  });
  let captured;
  handler({}, {}, (e) => {
    captured = e;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.ok(captured instanceof ApiError);
  assert.equal(captured.statusCode, 500);
  assert.equal(captured.message, "boom");
});

test("sendSuccess writes the standard success envelope", () => {
  const res = makeRes();
  sendSuccess(res, { a: 1 }, 201, "Created");
  assert.equal(res._status, 201);
  assert.deepEqual(res._body, { success: true, message: "Created", data: { a: 1 } });
});

test("notFound produces a 404 ApiError", () => {
  let err;
  notFound({ method: "GET", originalUrl: "/api/nope" }, {}, (e) => {
    err = e;
  });
  assert.ok(err instanceof ApiError);
  assert.equal(err.statusCode, 404);
});

test("errorHandler responds with JSON for ApiError", () => {
  const res = makeRes();
  errorHandler(new ApiError(422, "bad input"), {}, res, () => {});
  assert.equal(res._status, 422);
  assert.deepEqual(res._body, { success: false, message: "bad input", errors: [] });
});

test("errorHandler maps Sequelize ValidationError to a 400 with field errors", () => {
  const res = makeRes();
  const err = new ValidationError("Validation error");
  err.errors = [{ path: "name", message: "name is required" }];
  errorHandler(err, {}, res, () => {});
  assert.equal(res._status, 400);
  assert.equal(res._body.message, "Validation error");
  assert.deepEqual(res._body.errors, [{ field: "name", message: "name is required" }]);
});

test("errorHandler defaults unknown errors to 500", () => {
  const res = makeRes();
  errorHandler(new Error("kaboom"), {}, res, () => {});
  assert.equal(res._status, 500);
  assert.equal(res._body.success, false);
});
