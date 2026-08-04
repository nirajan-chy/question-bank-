"use client";

import { useState } from "react";
import { 
  Hash, 
  Users, 
  Search, 
  Settings, 
  Smile, 
  Paperclip, 
  Send,
  X,
  MessageSquarePlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommunityMessage } from "./community-message";

type CommunityChannel = {
  id: string;
  name: string;
  description: string;
};

type Community = {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  memberCount: number;
  badge?: string;
  channels: CommunityChannel[];
};

interface CommunityChatProps {
  community: Community;
  channel: CommunityChannel;
}

const sampleMessages = [
  {
    id: "1",
    author: "Ananya Sharma",
    role: "Moderator",
    avatar: "AS",
    content: "Hello everyone! How's your preparation for the upcoming exams?",
    time: "10:30 AM",
    reactions: [
      { emoji: "👍", count: 12 },
      { emoji: "🎉", count: 4 },
    ],
  },
  {
    id: "2",
    author: "Rahul Verma",
    role: "Student",
    avatar: "RV",
    content: "Pretty good so far! Focusing on Physics these days.",
    time: "10:32 AM",
    reactions: [{ emoji: "🔥", count: 6 }],
  },
  {
    id: "3",
    author: "Priya Singh",
    role: "Student",
    avatar: "PS",
    content: "Anyone has good notes for Chemical Bonding? I'm stuck on that topic.",
    time: "10:34 AM",
    reactions: [],
  },
  {
    id: "4",
    author: "Rahul Verma",
    role: "Student",
    avatar: "RV",
    content: "I have some notes, @Priya Singh. Check this out!",
    time: "10:35 AM",
    reactions: [],
    attachment: {
      name: "Chemical_Bonding_Notes.pdf",
      size: "2.4 MB",
      type: "pdf",
    },
  },
  {
    id: "5",
    author: "Sakshyam",
    role: "Student",
    avatar: "SK",
    content: "Same here! Let's all revise together sometime.",
    time: "10:36 AM",
    reactions: [
      { emoji: "👍", count: 8 },
      { emoji: "🎉", count: 2 },
    ],
  },
  {
    id: "6",
    author: "Arjun Joshi",
    role: "Student",
    avatar: "AJ",
    content: "I can share my notes on Cell Structure, check the file I just uploaded.",
    time: "10:38 AM",
    reactions: [],
  },
];

export function CommunityChat({ community, channel }: CommunityChatProps) {
  const [message, setMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);

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
          <Button variant="gradient" size="sm" className="gap-1.5">
            <MessageSquarePlus className="h-4 w-4" />
            Ask Question
          </Button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>128 online</span>
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
          <span className="text-xs font-medium text-muted-foreground">Today</span>
          <div className="flex-1 border-t" />
        </div>

        {/* Messages */}
        {sampleMessages.map((msg) => (
          <CommunityMessage key={msg.id} message={msg} />
        ))}
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
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}