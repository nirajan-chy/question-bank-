"use client";

import { useState } from "react";
import { Hash, Users, Search, Settings, Smile, Paperclip, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommunityMessage } from "./community-message";
import { useCommunityMessages, useReactToMessage, useSendCommunityMessage } from "@/services/queries";
import { useAuthStore } from "@/store/use-auth-store";
import type { Community, CommunityChannel } from "@/types";

interface CommunityChatProps {
  community: Community;
  channel: CommunityChannel;
}

export function CommunityChat({ community, channel }: CommunityChatProps) {
  const { data: messages = [], isPending } = useCommunityMessages(community.id, channel.id);
  const sendMessage = useSendCommunityMessage(community.id, channel.id);
  const reactToMessage = useReactToMessage(community.id, channel.id);
  const user = useAuthStore((s) => s.user);

  const [message, setMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);

  const submit = () => {
    const content = message.trim();
    if (!content || sendMessage.isPending) return;
    sendMessage.mutate(
      {
        author: user?.name ?? "Anonymous",
        role: user?.role === "admin" ? "Moderator" : "Student",
        content,
      },
      { onSuccess: () => setMessage("") }
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Channel Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">{channel.name}</h3>
          <span className="text-sm text-muted-foreground">|</span>
          <p className="text-sm text-muted-foreground">{channel.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>{community.memberCount.toLocaleString()} members</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Users className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Message */}
        {showWelcome && (
          <div className="relative rounded-lg border bg-primary/5 p-4 mb-4">
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <h4 className="font-semibold text-primary mb-1">
              👋 Welcome to {community.name}!
            </h4>
            <p className="text-sm text-muted-foreground">
              Feel free to ask questions, share knowledge and help others.
            </p>
          </div>
        )}

        {/* Date Separator */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 border-t" />
          <span className="text-xs font-medium text-muted-foreground">#{channel.name}</span>
          <div className="flex-1 border-t" />
        </div>

        {/* Messages */}
        {isPending ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          messages.map((msg) => (
            <CommunityMessage
              key={msg.id}
              message={msg}
              onReact={(emoji) => reactToMessage.mutate({ messageId: msg.id, emoji })}
            />
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm font-medium">+</span>
            </div>
          </Button>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder={`Message #${channel.name}`}
              className="pr-24 h-10"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={submit}
                disabled={sendMessage.isPending || !message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
