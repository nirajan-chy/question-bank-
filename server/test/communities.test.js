"use strict";

const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

const models = require("../src/models");

const communities = [];
const messages = [];

models.Community = {
  name: "Community",
  async findByPk(id) {
    return communities.find((c) => c.id === id) || null;
  },
  async findAll() {
    return communities;
  },
  async create(data) {
    communities.push({ ...data, channels: data.channels || [] });
    return data;
  },
};

models.CommunityMessage = {
  name: "CommunityMessage",
  async findAll({ where }) {
    return messages.filter(
      (m) => m.communityId === where.communityId && m.channelId === where.channelId
    );
  },
  async findByPk(id) {
    return messages.find((m) => m.id === id) || null;
  },
  async create(data) {
    const msg = {
      id: data.id,
      communityId: data.communityId,
      channelId: data.channelId,
      author: data.author,
      role: data.role,
      avatar: data.avatar,
      content: data.content,
      reactions: data.reactions || [],
      attachment: data.attachment || null,
      update: async (patch) => Object.assign(msg, patch),
    };
    messages.push(msg);
    return msg;
  },
};

const ctrl = require("../src/controllers/communities.controller");
const { settle } = require("./helpers");

beforeEach(() => {
  communities.length = 0;
  messages.length = 0;
  communities.push({
    id: "class-8",
    channels: [{ id: "general" }, { id: "random" }],
  });
});

test("listMessages returns 404 for an unknown community", async () => {
  await assert.rejects(
    () => settle(ctrl.listMessages, { params: { id: "nope" }, query: { channel: "general" } }),
    (e) => e.statusCode === 404
  );
});

test("listMessages returns 404 for an unknown channel", async () => {
  await assert.rejects(
    () => settle(ctrl.listMessages, { params: { id: "class-8" }, query: { channel: "nope" } }),
    (e) => e.statusCode === 404
  );
});

test("listMessages returns only messages for the requested channel", async () => {
  messages.push({ id: "m1", communityId: "class-8", channelId: "general" });
  messages.push({ id: "m2", communityId: "class-8", channelId: "random" });

  const res = await settle(ctrl.listMessages, {
    params: { id: "class-8" },
    query: { channel: "general" },
  });
  assert.equal(res._status, 200);
  assert.equal(res._body.data.length, 1);
  assert.equal(res._body.data[0].id, "m1");
});

test("sendMessage rejects blank content with 400", async () => {
  await assert.rejects(
    () =>
      settle(ctrl.sendMessage, {
        params: { id: "class-8" },
        body: { channelId: "general", content: "   " },
      }),
    (e) => e.statusCode === 400
  );
});

test("sendMessage rejects an unknown channel with 404", async () => {
  await assert.rejects(
    () =>
      settle(ctrl.sendMessage, {
        params: { id: "class-8" },
        body: { channelId: "nope", content: "Hello" },
      }),
    (e) => e.statusCode === 404
  );
});

test("sendMessage creates a message with author avatar", async () => {
  const res = await settle(ctrl.sendMessage, {
    params: { id: "class-8" },
    body: { channelId: "general", author: "Hello", content: "Hello!" },
  });
  assert.equal(res._status, 201);
  assert.equal(res._body.data.content, "Hello!");
  assert.equal(res._body.data.avatar, "HE");
  assert.deepEqual(res._body.data.reactions, []);
});

test("addReaction rejects a missing emoji with 400", async () => {
  messages.push({ id: "m1", reactions: [], update: async () => {} });
  await assert.rejects(
    () => settle(ctrl.addReaction, { params: { messageId: "m1" }, body: {} }),
    (e) => e.statusCode === 400
  );
});

test("addReaction returns 404 when the message does not exist", async () => {
  await assert.rejects(
    () => settle(ctrl.addReaction, { params: { messageId: "nope" }, body: { emoji: "👍" } }),
    (e) => e.statusCode === 404
  );
});

test("addReaction increments an existing reaction count", async () => {
  const msg = { id: "m1", reactions: [{ emoji: "👍", count: 2 }] };
  msg.update = async (patch) => Object.assign(msg, patch);
  messages.push(msg);

  const res = await settle(ctrl.addReaction, {
    params: { messageId: "m1" },
    body: { emoji: "👍" },
  });
  assert.equal(res._status, 200);
  assert.equal(res._body.data.reactions[0].count, 3);
});

test("addReaction creates a new reaction when absent", async () => {
  const msg = { id: "m1", reactions: [] };
  msg.update = async (patch) => Object.assign(msg, patch);
  messages.push(msg);

  const res = await settle(ctrl.addReaction, {
    params: { messageId: "m1" },
    body: { emoji: "🔥" },
  });
  assert.equal(res._body.data.reactions.length, 1);
  assert.equal(res._body.data.reactions[0].emoji, "🔥");
  assert.equal(res._body.data.reactions[0].count, 1);
});
