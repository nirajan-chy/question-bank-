"use client";

import { useState } from "react";
import { CommunitySidebar } from "@/features/community/components/community-sidebar";
import { CommunityChat } from "@/features/community/components/community-chat";
import communityChannelsData from "@/data/community-channels.json";

export default function CommunityLayout() {
  const [selectedCommunity, setSelectedCommunity] = useState(communityChannelsData[0].id);
  const [selectedChannel, setSelectedChannel] = useState("general");

  const community = communityChannelsData.find((c) => c.id === selectedCommunity);
  const channel = community?.channels.find((ch) => ch.id === selectedChannel);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <CommunitySidebar
        communities={communityChannelsData}
        selectedCommunity={selectedCommunity}
        selectedChannel={selectedChannel}
        onSelectCommunity={(id) => {
          setSelectedCommunity(id);
          setSelectedChannel("general");
        }}
        onSelectChannel={setSelectedChannel}
      />
      <div className="flex-1 flex flex-col">
        <CommunityChat
          community={community!}
          channel={channel!}
        />
      </div>
    </div>
  );
}