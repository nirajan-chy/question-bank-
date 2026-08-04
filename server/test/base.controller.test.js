"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  createBaseController,
  toNumber,
  toBoolean,
} = require("../src/controllers/base.controller");
const { settle } = require("./helpers");

test("toNumber returns the number for positive values", () => {
  assert.equal(toNumber("5"), 5);
  assert.equal(toNumber(3), 3);
});

test("toNumber returns undefined for zero, negative and non-numeric input", () => {
  assert.equal(toNumber("0"), undefined);
  assert.equal(toNumber("-3"), undefined);
  assert.equal(toNumber("abc"), undefined);
  assert.equal(toNumber(""), undefined);
  assert.equal(toNumber(undefined), undefined);
});

test("toBoolean accepts common truthy representations", () => {
  assert.equal(toBoolean("true"), true);
  assert.equal(toBoolean("1"), true);
  assert.equal(toBoolean(true), true);
  assert.equal(toBoolean("false"), false);
  assert.equal(toBoolean(0), false);
});

function fakeModel(rows) {
  return {
    name: "Fake",
    async findAll({ where = {}, limit } = {}) {
      let out = rows.filter((r) =>
        Object.entries(where).every(([k, v]) => r[k] === v)
      );
      if (limit) out = out.slice(0, limit);
      return out;
    },
    async findByPk(id) {
      return rows.find((r) => r.id === id) || null;
    },
    async create(data) {
      const row = { id: "new", ...data };
      rows.push(row);
      return row;
    },
    async update() {},
    async destroy() {
      return true;
    },
  };
}

test("buildWhere handles boolean and plain filters", () => {
  const ctrl = createBaseController(fakeModel([]), {
    filters: [
      { field: "featured", boolean: true },
      { field: "subjectSlug" },
    ],
  });

  assert.deepEqual(ctrl.buildWhere({}), {});
  assert.deepEqual(ctrl.buildWhere({ featured: "true" }), { featured: true });
  assert.deepEqual(ctrl.buildWhere({ featured: "1" }), { featured: true });
  assert.deepEqual(ctrl.buildWhere({ featured: "false" }), {});
  assert.deepEqual(ctrl.buildWhere({ subjectSlug: "phy" }), { subjectSlug: "phy" });
  assert.deepEqual(ctrl.buildWhere({ subjectSlug: "" }), {});
});

test("list applies filters and limit", async () => {
  const rows = [
    { id: "1", featured: true },
    { id: "2", featured: false },
    { id: "3", featured: true },
  ];
  const ctrl = createBaseController(fakeModel(rows), {
    filters: [{ field: "featured", boolean: true }],
  });

  const res = await settle(ctrl.list, { query: { featured: "true", limit: "1" } });
  assert.equal(res._status, 200);
  assert.equal(res._body.success, true);
  assert.equal(res._body.data.length, 1);
  assert.equal(res._body.data[0].id, "1");
});

test("getById returns 404 when the record does not exist", async () => {
  const ctrl = createBaseController(fakeModel([]));
  await assert.rejects(
    () => settle(ctrl.getById, { params: { id: "nope" } }),
    (e) => e.statusCode === 404
  );
});

test("create persists the body and returns 201", async () => {
  const rows = [];
  const ctrl = createBaseController(fakeModel(rows));
  const res = await settle(ctrl.create, { body: { title: "T", free: true } });
  assert.equal(res._status, 201);
  assert.equal(res._body.data.title, "T");
  assert.equal(rows.length, 1);
});

test("remove returns 404 when the record does not exist", async () => {
  const ctrl = createBaseController(fakeModel([]));
  await assert.rejects(
    () => settle(ctrl.remove, { params: { id: "x" } }),
    (e) => e.statusCode === 404
  );
});
