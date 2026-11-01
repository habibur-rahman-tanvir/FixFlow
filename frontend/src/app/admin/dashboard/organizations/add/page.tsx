"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios/client";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AddOrganizationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    managerId: "",
    description: "",
    timezone: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
          <div className="flex items-center gap-3">
            <Input
              id="managerId"
              name="managerId"
              value={form.managerId}
              onChange={handleChange}
              placeholder="Select manager"
              disabled
              aria-disabled="true"
              className="cursor-not-allowed opacity-70"
            />
            <Button type="button" variant="outline" disabled>
              Select manager
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Manager assignment will be implemented later.
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
    </div>
  );
}
