"use client";

import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { api } from "@/lib/axios/client";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

type ManagerUser = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: {
    url?: string;
    publicId?: string;
  } | null;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getInitials = (name?: string) => {
  if (!name) return "U";

  const parts = name.split(" ").filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "U";

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

export default function AddOrganizationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [managerSearch, setManagerSearch] = useState("");
  const [managerUsers, setManagerUsers] = useState<ManagerUser[]>([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [selectedManager, setSelectedManager] = useState<ManagerUser | null>(
    null,
  );
  const [form, setForm] = useState({
    name: "",
    slug: "",
    managerId: "",
    description: "",
    timezone: "",
  });

  useEffect(() => {
    if (!isManagerModalOpen) return;

    let isMounted = true;
    const timeoutId = window.setTimeout(async () => {
      setIsLoadingManagers(true);

      try {
        const response = await api.get("/api/users", {
          params: {
            skip: 0,
            limit: 10,
            role: ["manager", "visitor"],
            search: managerSearch.trim() || undefined,
            sortBy: "createdAt",
            order: "desc",
          },
        });

        const users = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        if (isMounted) {
          setManagerUsers(users);
        }
      } catch {
        if (isMounted) {
          setManagerUsers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingManagers(false);
        }
      }
    }, 200);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [isManagerModalOpen, managerSearch]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveManager = () => {
    setSelectedManager(null);
    setForm((prev) => ({ ...prev, managerId: "" }));
  };

  const handleSelectManager = (manager: ManagerUser) => {
    setSelectedManager(manager);
    setForm((prev) => ({ ...prev, managerId: manager._id ?? "" }));
    setIsManagerModalOpen(false);
    setManagerSearch("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        ...(form.managerId.trim() ? { managerId: form.managerId.trim() } : {}),
        ...(form.description.trim()
          ? { description: form.description.trim() }
          : {}),
        ...(form.timezone.trim() ? { timezone: form.timezone.trim() } : {}),
      };

      await api.post("/api/organizations", payload);

      setForm({
        name: "",
        slug: "",
        managerId: "",
        description: "",
        timezone: "",
      });
      setSelectedManager(null);
      toast.success("Organization created successfully");
      router.push("/admin/dashboard/organizations");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Failed to create organization",
        );
      } else {
        toast.error("Failed to create organization");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Create</p>
        <h1 className="text-2xl font-bold tracking-tight">Add organization</h1>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Organization name</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter organization name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="e.g. northwind-labs"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="managerId">Manager</Label>
          {selectedManager ? (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {getInitials(selectedManager.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {selectedManager.name ?? "Unnamed manager"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {selectedManager.email ?? "No email available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsManagerModalOpen(true)}
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveManager}
                    className="text-muted-foreground"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Input
                id="managerId"
                name="managerId"
                value={form.managerId}
                onChange={handleChange}
                placeholder="No manager selected"
                disabled
                aria-disabled="true"
                className="cursor-not-allowed opacity-70"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsManagerModalOpen(true)}
              >
                Select manager
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Optional: assign a manager to this organization.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            placeholder="UTC-05:00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief description of the organization"
            className="min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/dashboard/organizations")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save organization"}
          </Button>
        </div>
      </form>

      <Sheet open={isManagerModalOpen} onOpenChange={setIsManagerModalOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Select manager</SheetTitle>
            <SheetDescription>
              Search by name and pick the manager for this organization.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={managerSearch}
                onChange={(event) => setManagerSearch(event.target.value)}
                placeholder="Search users"
                className="h-10 pl-9"
              />
            </div>

            <div className="space-y-2">
              {isLoadingManagers ? (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading users...
                </div>
              ) : managerUsers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground">
                  No users found.
                </div>
              ) : (
                managerUsers.map((user) => (
                  <button
                    key={
                      user._id ?? user.email ?? user.name ?? "manager-option"
                    }
                    type="button"
                    onClick={() => handleSelectManager(user)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/60"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {getInitials(user.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user.name ?? "Unnamed user"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email ?? "No email"}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-border bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {user.role ?? "member"}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
