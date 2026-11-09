"use client";

import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios/client";

type SortField = "name" | "slug" | "createdAt" | "updatedAt";
type SortOrder = "asc" | "desc";

type Organization = {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
};

const PAGE_SIZE = 20;

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchOrganizations = useCallback(
    async ({
      reset = false,
      skip = 0,
      nextSortBy = sortBy,
      nextOrder = order,
    }: {
      reset?: boolean;
      skip?: number;
      nextSortBy?: SortField;
      nextOrder?: SortOrder;
    } = {}) => {
      try {
        if (reset) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await api.get("/api/organizations", {
          params: {
            skip,
            limit: PAGE_SIZE,
            sortBy: nextSortBy,
            order: nextOrder,
          },
        });

        const payload = response.data ?? {};
        const nextOrganizations = Array.isArray(payload.data)
          ? payload.data
          : [];
        const pagination = payload.pagination ?? {};
        const nextTotal = Number(pagination.total ?? nextOrganizations.length);

        setOrganizations((prev) =>
          reset ? nextOrganizations : [...prev, ...nextOrganizations],
        );
        setHasMore(Boolean(pagination.hasNextPage));
        setTotal(nextTotal);
      } catch {
        toast.error("Unable to load organizations right now.");
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [order, sortBy],
  );

  useEffect(() => {
    let isActive = true;

    const loadInitialOrganizations = async () => {
      if (!isActive) {
        return;
      }

      await fetchOrganizations({
        reset: true,
        skip: 0,
        nextSortBy: sortBy,
        nextOrder: order,
      });
    };

    void loadInitialOrganizations();
    return () => {
      isActive = false;
    };
  }, [fetchOrganizations, order, sortBy]);

  const handleSort = (field: SortField) => {
    const nextOrder = sortBy === field && order === "asc" ? "desc" : "asc";

    setOrganizations([]);
    setHasMore(true);
    setTotal(0);
    setSortBy(field);
    setOrder(nextOrder);
    void fetchOrganizations({
      reset: true,
      skip: 0,
      nextSortBy: field,
      nextOrder,
    });
  };

  const renderSortIcon = (field: SortField) => {
    const isActive = sortBy === field;

    if (!isActive) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />;
    }

    return order === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-foreground" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-foreground" />
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Overview</p>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
            {total} records
          </span>

          <Link href="/admin/dashboard/organizations/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add organization
            </Button>
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="hidden border-b border-border bg-muted/30 px-4 py-3 text-sm font-medium text-muted-foreground md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-4">
          <button
            type="button"
            onClick={() => handleSort("name")}
            className="flex items-center gap-2 text-left transition-colors hover:text-foreground"
          >
            <span>Name</span>
            {renderSortIcon("name")}
          </button>

          <button
            type="button"
            onClick={() => handleSort("slug")}
            className="flex items-center gap-2 text-left transition-colors hover:text-foreground"
          >
            <span>Slug</span>
            {renderSortIcon("slug")}
          </button>

          <button
            type="button"
            onClick={() => handleSort("createdAt")}
            className="flex items-center gap-2 text-left transition-colors hover:text-foreground"
          >
            <span>Created</span>
            {renderSortIcon("createdAt")}
          </button>
        </div>

        <div
          id="organizations-scroll-container"
          className="max-h-[70vh] overflow-y-auto"
        >
          <InfiniteScroll
            dataLength={organizations.length}
            next={() => {
              if (!isLoadingMore && hasMore) {
                void fetchOrganizations({
                  reset: false,
                  skip: organizations.length,
                  nextSortBy: sortBy,
                  nextOrder: order,
                });
              }
            }}
            hasMore={hasMore}
            loader={
              <div className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more...
              </div>
            }
            endMessage={
              organizations.length > 0 ? (
                <p className="px-4 py-3 text-center text-sm text-muted-foreground">
                  You have reached the end.
                </p>
              ) : null
            }
            scrollableTarget="organizations-scroll-container"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading organizations...
              </div>
            ) : organizations.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No organizations found.
              </div>
            ) : (
              organizations.map((org) => (
                <div
                  key={org._id ?? org.slug}
                  className="grid gap-3 border-b border-border px-4 py-4 text-sm last:border-b-0 hover:bg-muted/40 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-4 md:py-3"
                >
                  <div className="min-w-0">
                    <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground md:hidden">
                      Name
                    </div>
                    <Link
                      href={`/organization/${org.slug || org._id}`}
                      className="block truncate font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {org.name}
                    </Link>
                    {org.description ? (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {org.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground md:hidden">
                      Slug
                    </div>
                    <Link
                      href={`/organization/${org.slug || org._id}`}
                      className="block truncate text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {org.slug}
                    </Link>
                  </div>

                  <div className="min-w-0">
                    <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground md:hidden">
                      Created
                    </div>
                    <span className="truncate text-muted-foreground">
                      {org.createdAt
                        ? new Date(org.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>
              ))
            )}

            {isLoadingMore ? (
              <div className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more...
              </div>
            ) : null}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
