const organizations = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Organization ${index + 1}`,
  location: ["New York", "Chicago", "Austin", "Seattle", "Miami"][index % 5],
  status: index % 3 === 0 ? "Active" : index % 3 === 1 ? "Review" : "Pending",
}));

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Overview</p>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
        </div>
        <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
          {organizations.length} records
        </span>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-[1fr_180px_120px] gap-4 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">
          <span>Name</span>
          <span>Location</span>
          <span>Status</span>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="grid grid-cols-[1fr_180px_120px] gap-4 border-b border-border px-4 py-3 text-sm last:border-b-0 hover:bg-muted/50"
            >
              <span className="font-medium text-foreground">{org.name}</span>
              <span className="text-muted-foreground">{org.location}</span>
              <span>
                <span
                  className={
                    org.status === "Active"
                      ? "rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                      : org.status === "Review"
                        ? "rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400"
                        : "rounded-full bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-600 dark:text-sky-400"
                  }
                >
                  {org.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
