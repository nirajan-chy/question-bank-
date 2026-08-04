"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCcw, WifiOff } from "lucide-react";
import { CommunitySidebar } from "@/features/community/components/community-sidebar";
import { CommunityChat } from "@/features/community/components/community-chat";
import { useCommunities } from "@/services/queries";

export default function CommunityLayout() {
  const { data: communities = [], isPending, isError, error, refetch } = useCommunities();
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState("general");

  useEffect(() => {
    if (selectedCommunity === null && communities.length > 0) {
      setSelectedCommunity(communities[0].id);
    }
  }, [communities, selectedCommunity]);

  const community = communities.find((c) => c.id === selectedCommunity);
  const channel =
    community?.channels.find((ch) => ch.id === selectedChannel) ?? community?.channels[0];

  if (isPending) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading community…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <WifiOff className="h-10 w-10 text-destructive" />
        <p className="text-lg font-semibold">Cannot load the community page</p>
        <p className="max-w-md text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "The server might be offline."} Make sure the
          backend is running, then try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!community || !channel) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 text-center text-muted-foreground">
        <p>No community channels are available yet. Run <code className="rounded bg-muted px-1 py-0.5">npm run seed</code> on the server.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <CommunitySidebar
        communities={communities}
        selectedCommunity={community.id}
        selectedChannel={channel.id}
        onSelectCommunity={(id) => {
          setSelectedCommunity(id);
          setSelectedChannel("general");
        }}
        onSelectChannel={setSelectedChannel}
      />
      <div className="flex-1 flex flex-col">
        <CommunityChat community={community} channel={channel} />
      </div>
    </div>
  );
}
