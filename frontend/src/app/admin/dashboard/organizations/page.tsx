"use client";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const organizations = Array.from({ length: 250 }, (_, index) => ({
  id: index + 1,
  name: `Organization ${index + 1}`,
  slug: `organization-${index + 1}`,
  description: `Sample organization ${index + 1} for testing the dashboard list.`,
  timezone: ["UTC-05:00", "UTC-06:00", "UTC-07:00", "UTC+00:00"][index % 4],
}));

const PAGE_SIZE = 20;

export default function OrganizationsPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleOrganizations = organizations.slice(0, visibleCount);

  const next = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, organizations.length));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Overview</p>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
        </div>

        <Link href="/admin/dashboard/organizations/add">
          <Button>Add organization</Button>
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-[1.4fr_1fr_1.2fr] gap-4 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">
          <span>Name</span>
          <span>Slug</span>
          <span>Timezone</span>
        </div>

        <div
          id="organizations-scroll-container"
          className="max-h-[70vh] overflow-y-auto"
        >
          <InfiniteScroll
            dataLength={visibleOrganizations.length}
            next={next}
            hasMore={visibleCount < organizations.length}
            loader={
              <p className="px-4 py-3 text-center text-sm text-muted-foreground">
                Loading...
              </p>
            }
            endMessage={
              <p className="px-4 py-3 text-center text-sm text-muted-foreground">
                You have reached the end.
              </p>
            }
            scrollableTarget="organizations-scroll-container"
          >
            {visibleOrganizations.map((org) => (
              <div
                key={org.id}
                className="grid grid-cols-[1.4fr_1fr_1.2fr] gap-4 border-b border-border px-4 py-3 text-sm last:border-b-0 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium text-foreground">{org.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {org.description}
                  </p>
                </div>
                <span className="text-muted-foreground">{org.slug}</span>
                <span className="text-muted-foreground">{org.timezone}</span>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
