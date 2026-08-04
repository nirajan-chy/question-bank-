const { Community, CommunityMessage } = require("../models");
const { createBaseController } = require("./base.controller");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");

const controller = createBaseController(Community, {
  order: [["order", "ASC"]],
});

const generateId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const findChannel = (community, channelId) =>
  (community.channels || []).find((c) => c.id === channelId);

const listMessages = asyncHandler(async (req, res) => {
  const community = await Community.findByPk(req.params.id);
  if (!community) throw new ApiError(404, "Community not found");

  const channelId = req.query.channel || "general";
  if (!findChannel(community, channelId)) {
    throw new ApiError(404, `Channel not found: ${channelId}`);
  }

  const messages = await CommunityMessage.findAll({
    where: { communityId: community.id, channelId },
    order: [["createdAt", "ASC"]],
  });

  sendSuccess(res, messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  const community = await Community.findByPk(req.params.id);
  if (!community) throw new ApiError(404, "Community not found");

  const channelId = req.body.channelId || req.query.channel || "general";
  if (!findChannel(community, channelId)) {
    throw new ApiError(404, `Channel not found: ${channelId}`);
  }

  const { author = "Anonymous", role = "Student", content, attachment } = req.body;
  if (!content || !content.trim()) throw new ApiError(400, "content is required");

  const message = await CommunityMessage.create({
    id: generateId("msg"),
    communityId: community.id,
    channelId,
    author,
    role,
    avatar: author.slice(0, 2).toUpperCase(),
    content: content.trim(),
    reactions: [],
    attachment: attachment || null,
  });

  sendSuccess(res, message, 201, "Message sent");
});

const addReaction = asyncHandler(async (req, res) => {
  const message = await CommunityMessage.findByPk(req.params.messageId);
  if (!message) throw new ApiError(404, "Message not found");

  const { emoji } = req.body;
  if (!emoji || !emoji.trim()) throw new ApiError(400, "emoji is required");

  const reactions = message.reactions || [];
  const existing = reactions.find((r) => r.emoji === emoji);
  if (existing) existing.count = (existing.count || 0) + 1;
  else reactions.push({ emoji, count: 1 });

  await message.update({ reactions });
  sendSuccess(res, message, 200, "Reaction added");
});

module.exports = {
  ...controller,
  listMessages,
  sendMessage,
  addReaction,
};
