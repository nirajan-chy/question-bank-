"use client";

import { useState } from "react";
import { Download, FileText, MoreHorizontal, Reply, SmilePlus, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatTime } from "@/lib/utils";
import type { CommunityMessage as ChatMessage } from "@/types";

interface CommunityMessageProps {
  message: ChatMessage;
  onReact?: (emoji: string) => void;
}

export function CommunityMessage({ message, onReact }: CommunityMessageProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="group relative flex gap-3 rounded-lg p-2 hover:bg-muted/50"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="bg-brand-gradient text-white text-sm font-medium">
          {message.avatar}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm">{message.author}</span>
          {message.role === "Moderator" && (
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              Moderator
            </span>
          )}
          <span className="text-xs text-muted-foreground">{formatTime(message.createdAt)}</span>
        </div>

        <p className="text-sm mt-1 whitespace-pre-wrap">{message.content}</p>

        {/* Attachment */}
        {message.attachment && (
          <div className="mt-2 flex items-center gap-3 rounded-lg border p-3 bg-muted/30 max-w-md">
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.attachment.name}</p>
              <p className="text-xs text-muted-foreground">{message.attachment.size}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => onReact?.(reaction.emoji)}
                className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs hover:bg-muted"
              >
                <span>{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
              </button>
            ))}
            <button className="flex items-center justify-center h-6 w-6 rounded-full border text-muted-foreground hover:bg-muted hover:text-foreground">
              <SmilePlus className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="absolute right-2 top-0 -translate-y-1/2 flex items-center gap-1 bg-background border rounded-lg shadow-sm p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onReact?.("👍")}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Reply className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <SmilePlus className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
