import type {
  CommunityQuestion,
  Community,
  CommunityMessage,
  MessageAttachment,
} from "@/types";

import { http } from "../http";

export const community = {
  // Q&A questions
  community: () => http<CommunityQuestion[]>("/community/questions"),
  askQuestion: (payload: { title: string; body: string; tags: string[]; author?: string }) =>
    http<CommunityQuestion>("/community/questions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Channels (chat rooms)
  communities: () => http<Community[]>("/community/channels"),
  communityMessages: (communityId: string, channelId: string) =>
    http<CommunityMessage[]>(
      `/community/channels/${communityId}/messages?channel=${encodeURIComponent(channelId)}`
    ),
  sendCommunityMessage: (
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
