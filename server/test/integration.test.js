"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");

const { sequelize } = require("../src/config/postgres");

// Full end-to-end tests need a live PostgreSQL instance (configured via .env).
// They skip cleanly when the database is unreachable so CI and local dev
// without a DB still get a green run.
test("database is reachable (skipped when no DB is configured)", async (t) => {
  try {
    await sequelize.authenticate();
  } catch {
    t.skip("PostgreSQL is not reachable in this environment");
    return;
  }
  assert.ok(true, "database reachable");
});
