"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");

const models = require("../src/models");

const rows = [];
models.Contact = {
  name: "Contact",
  async create(data) {
    const contact = { id: "c1", ...data };
    rows.push(contact);
    return contact;
  },
};

const ctrl = require("../src/controllers/contact.controller");
const { settle } = require("./helpers");

test("createContact rejects missing fields with 400", async () => {
  await assert.rejects(
    () => settle(ctrl.createContact, { body: { name: "A", email: "a@b.com" } }),
    (e) => e.statusCode === 400
  );
  await assert.rejects(
    () => settle(ctrl.createContact, { body: { name: "A", message: "Hi" } }),
    (e) => e.statusCode === 400
  );
  await assert.rejects(
    () => settle(ctrl.createContact, { body: { email: "a@b.com", message: "Hi" } }),
    (e) => e.statusCode === 400
  );
});

test("createContact saves the message and returns 201", async () => {
  const res = await settle(ctrl.createContact, {
    body: { name: "A", email: "a@b.com", subject: "Hi", message: "Hello!" },
  });
  assert.equal(res._status, 201);
  assert.equal(res._body.data.message, "Hello!");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].subject, "Hi");
});

test("createContact defaults the subject to an empty string", async () => {
  const res = await settle(ctrl.createContact, {
    body: { name: "B", email: "b@b.com", message: "No subject" },
  });
  assert.equal(res._body.data.subject, "");
});
