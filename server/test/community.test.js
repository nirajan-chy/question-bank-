"use strict";

const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

const models = require("../src/models");

const questions = [];
models.CommunityQuestion = {
  name: "CommunityQuestion",
  async findByPk(id) {
    return questions.find((q) => q.id === id) || null;
  },
  async create(data) {
    questions.push(data);
    return data;
  },
};

const ctrl = require("../src/controllers/community.controller");
const { settle } = require("./helpers");

beforeEach(() => {
  questions.length = 0;
});

test("createQuestion requires title and body", async () => {
  await assert.rejects(
    () => settle(ctrl.createQuestion, { body: { title: "Only title" } }),
    (e) => e.statusCode === 400
  );
  await assert.rejects(
    () => settle(ctrl.createQuestion, { body: { body: "Only body" } }),
    (e) => e.statusCode === 400
  );
});

test("createQuestion returns 201 with a slug and defaults", async () => {
  const res = await settle(ctrl.createQuestion, {
    body: { title: "How to study Physics?", body: "Need help." },
  });
  assert.equal(res._status, 201);
  assert.ok(res._body.data.slug.startsWith("how-to-study-physics"));
  assert.equal(res._body.data.answerCount, 0);
  assert.equal(res._body.data.answered, false);
  assert.deepEqual(res._body.data.answers, []);
});

test("addAnswer rejects a missing body with 400", async () => {
  questions.push({ id: "q1", answers: [], answerCount: 0 });
  await assert.rejects(
    () => settle(ctrl.addAnswer, { params: { id: "q1" }, body: {} }),
    (e) => e.statusCode === 400
  );
});

test("addAnswer returns 404 when the question is missing", async () => {
  await assert.rejects(
    () => settle(ctrl.addAnswer, { params: { id: "nope" }, body: { body: "x" } }),
    (e) => e.statusCode === 404
  );
});

test("addAnswer appends the answer and marks the question answered", async () => {
  const q = { id: "q1", answers: [], answerCount: 0, answered: false, acceptedAnswerId: null };
  q.update = async (patch) => Object.assign(q, patch);
  questions.push(q);

  const res = await settle(ctrl.addAnswer, {
    params: { id: "q1" },
    body: { body: "My answer", author: "Helper" },
  });
  assert.equal(res._status, 201);
  assert.equal(res._body.data.answerCount, 1);
  assert.equal(res._body.data.answered, true);
  assert.equal(res._body.data.answers[0].body, "My answer");
  assert.equal(res._body.data.answers[0].accepted, true);
});

test("incrementViews increments views and formats thousands", async () => {
  const q = { id: "q1", views: 999, viewsFormatted: "999" };
  q.update = async (patch) => Object.assign(q, patch);
  questions.push(q);

  const res = await settle(ctrl.incrementViews, { params: { id: "q1" } });
  assert.equal(res._body.data.views, 1000);
  assert.equal(res._body.data.viewsFormatted, "1.0k");
});
