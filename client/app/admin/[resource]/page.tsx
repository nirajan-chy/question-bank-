"use client";

import { use } from "react";
import { adminResources } from "@/features/admin/resource-config";
import { ResourceManager } from "@/features/admin/resource-manager";
import { MockTestsManager } from "@/features/admin/mock-tests-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = use(params);
  const config = adminResources.find((r) => r.path === resource);

  if (!config) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <Card className="max-w-sm">
          <CardContent className="p-8">
            <p className="font-display text-lg font-bold">Unknown resource</p>
            <p className="mt-1 text-sm text-muted-foreground">
              &ldquo;{resource}&rdquo; is not an admin-managed collection.
            </p>
            <Button variant="outline" className="mt-5" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" /> Back to dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resource === "mock-tests") {
    return <MockTestsManager />;
  }

  return <ResourceManager resource={config.path} label={config.label} />;
}
