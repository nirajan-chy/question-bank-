"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";

import { CommunitySidebar } from "@/features/community/components/community-sidebar";
import { CommunityChat } from "@/features/community/components/community-chat";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { useChannels } from "@/services/queries";

/**
 * Chat rooms for the community feature.
 *
 * The route segment is full-height, so it deliberately skips the page padding
 * the rest of the app uses — and skips `<PageHeader>` entirely.
 */
export function CommunityRooms() {
  const { data: communities = [], isPending, isError, error, refetch, isFetching } = useChannels();
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
    return <LoadingState label="Loading chat rooms" className="min-h-[calc(100vh-7rem)]" />;
  }

  if (isError) {
    return (
      <div className="container py-20">
        <ErrorState
          title="Cannot load the chat rooms"
          error={error}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  if (!community || !channel) {
    return (
      <div className="container py-20">
        <EmptyState
          icon={<MessageSquarePlus className="h-5 w-5" />}
          title="No chat rooms yet"
          description="Communities and their channels are created by an administrator. Once they exist they will show up here."
          action={
            <Button variant="outline" asChild>
              <Link href="/community/questions">Browse questions instead</Link>
            </Button>
          }
        />
      </div>
    );
  }

  // Subtracts the sticky navbar (4rem) and the community tab bar (3rem).
  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col bg-background lg:flex-row">
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
      <div className="flex min-w-0 flex-1 flex-col">
        {isFetching ? (
          <LoadingState label="Switching room" />
        ) : (
          <CommunityChat community={community} channel={channel} />
        )}
      </div>
    </div>
  );
}
