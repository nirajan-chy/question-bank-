"use strict";

const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");

const models = require("../src/models");

const rows = [];
models.User = {
  name: "User",
  _rows: rows,
  async findOne({ where }) {
    return rows.find((r) => r.email === where.email) || null;
  },
  unscoped() {
    return this;
  },
  async create(data) {
    const user = {
      id: `u-${rows.length + 1}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: "user",
      avatar: "",
      bio: "",
      get() {
        return {
          id: this.id,
          name: this.name,
          email: this.email,
          role: this.role,
          avatar: this.avatar,
          bio: this.bio,
        };
      },
      comparePassword(password) {
        return bcrypt.compare(password, this.password);
      },
    };
    rows.push(user);
    return user;
  },
};

const ctrl = require("../src/controllers/auth.controller");
const { settle } = require("./helpers");

process.env.JWT_SECRET = "test-secret-0123456789";

before(async () => {
  const hashed = await bcrypt.hash("secret123", 4);
  rows.push({
    id: "u-seed",
    name: "Seeded User",
    email: "seed@sandarbh.com",
    password: hashed,
    role: "user",
    get() {
      return { id: this.id, name: this.name, email: this.email, role: this.role };
    },
    comparePassword(password) {
      return bcrypt.compare(password, this.password);
    },
  });
});

test("register rejects missing fields with 400", async () => {
  await assert.rejects(
    () => settle(ctrl.register, { body: {} }),
    (e) => e.statusCode === 400
  );
});

test("register rejects invalid email with 400", async () => {
  await assert.rejects(
    () => settle(ctrl.register, { body: { name: "A", email: "nope", password: "123456" } }),
    (e) => e.statusCode === 400
  );
});

test("register rejects short passwords with 400", async () => {
  await assert.rejects(
    () => settle(ctrl.register, { body: { name: "A", email: "a@b.com", password: "123" } }),
    (e) => e.statusCode === 400
  );
});

test("register rejects duplicate emails with 409", async () => {
  rows.push({ email: "taken@sandarbh.com" });
  await assert.rejects(
    () =>
      settle(ctrl.register, {
        body: { name: "A", email: "TAKEN@sandarbh.com", password: "123456" },
      }),
    (e) => e.statusCode === 409
  );
});

test("register creates the user and returns a token", async () => {
  const res = await settle(ctrl.register, {
    body: { name: "Test User", email: "Test@Sandarbh.com", password: "secret123" },
  });
  assert.equal(res._status, 201);
  assert.ok(typeof res._body.data.token === "string" && res._body.data.token.length > 0);
  assert.equal(res._body.data.user.email, "test@sandarbh.com");
});

test("register surfaces a clear error when JWT_SECRET is missing", async () => {
  const previous = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  try {
    await assert.rejects(
      () =>
        settle(ctrl.register, {
          body: { name: "A", email: "x@y.com", password: "123456" },
        }),
      (e) => e.statusCode === 500 && e.message.includes("JWT_SECRET")
    );
  } finally {
    process.env.JWT_SECRET = previous;
  }
});

test("login rejects unknown credentials with 401", async () => {
  await assert.rejects(
    () => settle(ctrl.login, { body: { email: "ghost@x.com", password: "123456" } }),
    (e) => e.statusCode === 401
  );
});

test("login rejects a wrong password with 401", async () => {
  await assert.rejects(
    () => settle(ctrl.login, { body: { email: "seed@sandarbh.com", password: "wrongpass" } }),
    (e) => e.statusCode === 401
  );
});

test("login succeeds with valid credentials", async () => {
  const res = await settle(ctrl.login, {
    body: { email: "seed@sandarbh.com", password: "secret123" },
  });
  assert.equal(res._status, 200);
  assert.ok(res._body.data.token);
  assert.equal(res._body.data.user.email, "seed@sandarbh.com");
});

test("me returns the authenticated user", async () => {
  const res = await settle(ctrl.me, {
    user: { name: "X", get() { return { name: "X", email: "x@x.com" }; } },
  });
  assert.equal(res._status, 200);
  assert.equal(res._body.data.name, "X");
});
