"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Users,
  ShieldCheck,
  BriefcaseBusiness,
  UserCog,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios/client";

type Role = "visitor" | "member" | "admin" | "manager" | "technician";
type UserStatus = "active" | "suspended" | "deleted";

type User = {
  _id?: string;
  name?: string;
  email?: string;
  role?: Role;
  userStatus?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  avatar?: {
    url?: string;
    publicId?: string;
  } | null;
};

const FALLBACK_USERS: User[] = [
  {
    _id: "u-1",
    name: "Ava Thompson",
    email: "ava@fixflow.io",
    role: "admin",
    userStatus: "active",
    createdAt: "2026-01-14T09:00:00.000Z",
  },
  {
    _id: "u-2",
    name: "Noah Patel",
    email: "noah@fixflow.io",
    role: "manager",
    userStatus: "active",
    createdAt: "2026-02-05T13:10:00.000Z",
  },
  {
    _id: "u-3",
    name: "Mia Chen",
    email: "mia@fixflow.io",
    role: "technician",
    userStatus: "active",
    createdAt: "2026-03-12T08:30:00.000Z",
  },
  {
    _id: "u-4",
    name: "Ethan Brooks",
    email: "ethan@fixflow.io",
    role: "member",
    userStatus: "suspended",
    createdAt: "2026-04-19T15:40:00.000Z",
  },
  {
    _id: "u-5",
    name: "Sophia Ward",
    email: "sophia@fixflow.io",
    role: "technician",
    userStatus: "active",
    createdAt: "2026-05-22T10:05:00.000Z",
  },
  {
    _id: "u-6",
    name: "Liam Foster",
    email: "liam@fixflow.io",
    role: "visitor",
    userStatus: "deleted",
    createdAt: "2026-06-08T11:55:00.000Z",
  },
];

const statusStyles: Record<UserStatus, string> = {
  active:
    "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400",
  suspended:
    "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400",
  deleted:
    "bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20 dark:text-rose-400",
};

const roleStyles: Record<Role, string> = {
  visitor:
    "bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20 dark:text-slate-300",
  member:
    "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20 dark:text-blue-400",
  admin:
    "bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/20 dark:text-violet-400",
  manager:
    "bg-cyan-500/10 text-cyan-600 ring-1 ring-cyan-500/20 dark:text-cyan-400",
  technician:
    "bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20 dark:text-orange-400",
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "U";
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const timeoutId = window.setTimeout(() => {
      const loadUsers = async () => {
        setIsLoading(true);

        try {
          const response = await api.get("/api/users", {
            params: {
              skip: 0,
              limit: 50,
              search: search.trim() || undefined,
              sortBy: "createdAt",
              order: "desc",
            },
          });

          const responseUsers = Array.isArray(response.data?.data)
            ? response.data.data
            : [];

          if (isMounted) {
            setUsers(responseUsers.length > 0 ? responseUsers : FALLBACK_USERS);
          }
        } catch {
          if (isMounted) {
            setUsers(
              FALLBACK_USERS.filter((user) => {
                if (!search.trim()) return true;
                return user.name?.toLowerCase().includes(search.toLowerCase());
              }),
            );
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      void loadUsers();
    }, 200);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((user) => user.userStatus === "active").length;
    const admins = users.filter((user) => user.role === "admin").length;
    const managers = users.filter((user) => user.role === "manager").length;

    return { total, active, admins, managers };
  }, [users]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Overview</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Users
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
            {stats.total} records
          </div>
          <Button className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-linear-to-br from-primary/10 via-card to-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total users</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {stats.total}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {stats.active}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Admins</span>
            <UserCog className="h-4 w-4 text-violet-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {stats.admins}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Managers</span>
            <BriefcaseBusiness className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {stats.managers}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users by name"
              className="h-10 pl-9"
            />
          </div>

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Quick filters
          </Button>
        </div>

        <div className="hidden border-b border-border bg-muted/30 px-4 py-3 text-sm font-medium text-muted-foreground md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] md:gap-4">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
        </div>

        <div className="max-h-[68vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              No users found for this search.
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id ?? user.email ?? user.name}
                className="grid gap-3 border-b border-border px-4 py-4 text-sm last:border-b-0 hover:bg-muted/30 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] md:gap-4 md:py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary/15 to-primary/30 text-xs font-semibold text-primary">
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {user.name ?? "Unnamed user"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email ?? "No email provided"}
                    </p>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground md:hidden">
                    Role
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${roleStyles[user.role ?? "visitor"]}`}
                  >
                    {user.role ?? "visitor"}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground md:hidden">
                    Status
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[user.userStatus ?? "active"]}`}
                  >
                    {user.userStatus ?? "active"}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground md:hidden">
                    Joined
                  </div>
                  <span className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
