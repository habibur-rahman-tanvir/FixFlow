"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/app/(guards)/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/axios/client";
import Image from "next/image";

type OrganizationDetail = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
  manager?: {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    avatar?: { url?: string };
  } | null;
  createdBy?: {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    avatar?: { url?: string };
  } | null;
  logo?: { url?: string } | null;
  banner?: { url?: string } | null;
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = (value?: string) => {
  if (!value) return "OR";

  return (
    value
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "OR"
  );
};

export function OrganizationDetail() {
  const params = useParams<{ orgIdOrSlug?: string | string[] }>();
  const orgIdOrSlug = useMemo(() => {
    const value = params?.orgIdOrSlug;
    return Array.isArray(value) ? value[0] : (value ?? "");
  }, [params]);

  const [organization, setOrganization] = useState<OrganizationDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(() => Boolean(orgIdOrSlug));

  useEffect(() => {
    if (!orgIdOrSlug) {
      return;
    }

    const fetchOrganization = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/organizations/${orgIdOrSlug}`);
        setOrganization(response.data?.data ?? null);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load organization details.");
        setOrganization(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchOrganization();
  }, [orgIdOrSlug]);

  const managerName = organization?.manager?.name ?? "Unassigned";
  const createdByName = organization?.createdBy?.name ?? "System";
  const logoUrl = organization?.logo?.url ?? organization?.banner?.url;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/admin/dashboard/organizations"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to organizations
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="h-72 animate-pulse rounded-2xl bg-muted" />
              <div className="h-72 animate-pulse rounded-2xl bg-muted" />
            </div>
          ) : !organization ? (
            <Card className="border-dashed bg-card p-8 text-center shadow-sm">
              <CardHeader className="p-0">
                <CardTitle className="text-xl">
                  Organization not found
                </CardTitle>
                <CardDescription className="mt-2">
                  The organization you are looking for does not exist or is no
                  longer available.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-6 p-0">
                <Link href="/admin/dashboard/organizations">
                  <Button>Return to organizations</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div
                  className="relative flex min-h-56 items-end bg-linear-to-r from-primary/80 via-violet-500/80 to-emerald-500/80 p-6 sm:p-8"
                  style={{
                    backgroundImage: organization.banner?.url
                      ? `linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(15, 118, 110, 0.73)), url(${organization.banner.url})`
                      : undefined,
                    backgroundSize: organization.banner?.url
                      ? "cover"
                      : undefined,
                    backgroundPosition: organization.banner?.url
                      ? "center"
                      : undefined,
                  }}
                >
                  <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-xl font-semibold text-white shadow-lg backdrop-blur-sm sm:h-20 sm:w-20">
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt={`${organization.name} logo`}
                            width={80}
                            height={80}
                            className="h-full w-full rounded-2xl object-cover"
                          />
                        ) : (
                          getInitials(organization.name)
                        )}
                      </div>

                      <div className="text-white/95">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                          Organization
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                          {organization.name}
                        </h1>
                        <p className="mt-1 text-sm text-white/80">
                          /{organization.slug}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                        {organization.timezone || "UTC"}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-emerald-200/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-50">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm leading-7 text-muted-foreground">
                        {organization.description ||
                          "No organization description has been provided yet."}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-xl border border-border bg-muted/30 p-3">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" />
                            Name
                          </div>
                          <p className="mt-2 font-medium text-foreground">
                            {organization.name}
                          </p>
                        </div>

                        <div className="rounded-xl border border-border bg-muted/30 p-3">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            <Clock3 className="h-3.5 w-3.5" />
                            Timezone
                          </div>
                          <p className="mt-2 font-medium text-foreground">
                            {organization.timezone || "Not specified"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-border bg-muted/30 p-3">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" />
                            Created
                          </div>
                          <p className="mt-2 font-medium text-foreground">
                            {formatDate(organization.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/80 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {getInitials(managerName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">
                            {managerName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Manager
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/80 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          {getInitials(createdByName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">
                            {createdByName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Created by
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3">
                        <UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            Manager
                          </p>
                          <p className="mt-1 font-medium text-foreground">
                            {managerName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3">
                        <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            Contact
                          </p>
                          <p className="mt-1 font-medium text-foreground">
                            {organization.manager?.email ??
                              organization.createdBy?.email ??
                              "No email available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            Location
                          </p>
                          <p className="mt-1 font-medium text-foreground">
                            {organization.timezone || "Global operations"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl">Quick actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link
                        href="/admin/dashboard/organizations"
                        className="block"
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-center"
                        >
                          Back to list
                        </Button>
                      </Link>
                      <Button
                        className="w-full justify-center"
                        variant="secondary"
                      >
                        Open dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
