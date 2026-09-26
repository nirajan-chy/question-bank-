import type {
  CommunityQuestion,
  Community,
  CommunityMessage,
  MessageAttachment,
} from "@/types";

import { http } from "../http";

/**
 * Community Q&A and study chat rooms.
 *
 * Route shapes note (the server mounts everything under `/community`):
 *   questions  → `/community/questions`
 *   channels   → `/community/channels`
 */
export const community = {
  questions: () => http<CommunityQuestion[]>("/community/questions"),
  question: (slug: string) => http<CommunityQuestion>(`/community/questions/${slug}`),
  askQuestion: (payload: { title: string; body: string; tags: string[]; author?: string }) =>
    http<CommunityQuestion>("/community/questions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  addAnswer: (id: string, payload: { body: string; author?: string }) =>
    http<CommunityQuestion>(`/community/questions/${id}/answers`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  recordView: (id: string) =>
    http<unknown>(`/community/questions/${id}/view`, { method: "POST" }),

  channels: () => http<Community[]>("/community/channels"),
  channelMessages: (communityId: string, channelId: string) =>
    http<CommunityMessage[]>(
      `/community/channels/${communityId}/messages?channel=${encodeURIComponent(channelId)}`
    ),
  sendMessage: (
    communityId: string,
    channelId: string,
    payload: { author: string; role?: string; content: string; attachment?: MessageAttachment | null }
  ) =>
    http<CommunityMessage>(`/community/channels/${communityId}/messages`, {
      method: "POST",
      body: JSON.stringify({ ...payload, channelId }),
    }),
  reactToMessage: (messageId: string, emoji: string) =>
    http<CommunityMessage>(`/community/messages/${messageId}/reactions`, {
      method: "POST",
      body: JSON.stringify({ emoji }),
    }),
};
