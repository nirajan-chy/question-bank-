"use strict";

const { test, before } = require("node:test");
const assert = require("node:assert/strict");

const models = require("../src/models");

const users = [];

before(() => {
  for (const key of Object.keys(models)) {
    models[key] = {
      name: key,
      count: async () => 1,
      findAll: async () => [],
      findByPk: async () => null,
      unscoped() {
        return this;
      },
      create: async (data) => data,
      update: async () => {},
      destroy: async () => true,
    };
  }

  models.User = {
    name: "User",
    count: async () => 1,
    async findByPk(id) {
      return users.find((u) => u.id === id) || null;
    },
    unscoped() {
      return this;
    },
  };

  models.Contact = {
    name: "Contact",
    count: async () => 1,
    async findAll() {
      return [{ id: "c1", name: "N", email: "e@x.com", subject: "S", message: "M" }];
    },
  };

  models.CommunityQuestion = {
    name: "CommunityQuestion",
    count: async () => 1,
    async findAll() {
      return [{ id: "q1", title: "Q", author: "A", answers: [], createdAt: "2026-01-01" }];
    },
  };
});

const ctrl = require("../src/controllers/admin.controller");
const { settle } = require("./helpers");

test("getStats returns counts for every model plus recent items", async () => {
  const res = await settle(ctrl.getStats, {});
  assert.equal(res._status, 200);
  assert.equal(res._body.data.counts.Level, 1);
  assert.equal(res._body.data.counts.User, 1);
  assert.equal(res._body.data.recentContacts.length, 1);
  assert.equal(res._body.data.recentQuestions.length, 1);
});

test("updateUser blocks demoting your own admin account", async () => {
  const self = { id: "u1", role: "admin", update: async () => {} };
  users.push(self);

  await assert.rejects(
    () => settle(ctrl.updateUser, { params: { id: "u1" }, body: { role: "user" }, user: self }),
    (e) => e.statusCode === 400 && e.message.includes("demote")
  );
});

test("updateUser allows changing another user's role", async () => {
  const target = { id: "u2", role: "user" };
  target.update = async (patch) => Object.assign(target, patch);
  users.push(target);

  const res = await settle(ctrl.updateUser, {
    params: { id: "u2" },
    body: { role: "admin" },
    user: { id: "u1", role: "admin" },
  });
  assert.equal(res._status, 200);
  assert.equal(target.role, "admin");
});

test("updateUser returns 404 for a missing user", async () => {
  await assert.rejects(
    () => settle(ctrl.updateUser, { params: { id: "nope" }, body: {}, user: { id: "u1" } }),
    (e) => e.statusCode === 404
  );
});

test("deleteUser blocks deleting your own account", async () => {
  await assert.rejects(
    () => settle(ctrl.deleteUser, { params: { id: "u1" }, user: { id: "u1" } }),
    (e) => e.statusCode === 400
  );
});

test("deleteUser returns 404 for a missing user", async () => {
  await assert.rejects(
    () => settle(ctrl.deleteUser, { params: { id: "nope" }, user: { id: "u1" } }),
    (e) => e.statusCode === 404
  );
});
