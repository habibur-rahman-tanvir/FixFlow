import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const dummyUser = {
  name: "Alicia Morgan",
  email: "alicia.morgan@fixflow.io",
  role: "technician",
  userStatus: "active",
  verifiedBy: "email",
  memberOf: "North Ridge Operations",
  managerOf: ["Maintenance & Safety"],
  technicianOf: ["HVAC Response Unit", "Facility Support"],
  avatar: "AM",
};

const profileStats = [
  { label: "Open issues", value: "12" },
  { label: "Resolved", value: "48" },
  { label: "Avg. response", value: "2h 14m" },
];

const infoRows = [
  { label: "Email", value: dummyUser.email },
  { label: "Verification", value: dummyUser.verifiedBy.toUpperCase() },
  { label: "Status", value: dummyUser.userStatus },
  { label: "Organization", value: dummyUser.memberOf },
  { label: "Manager of", value: dummyUser.managerOf.join(", ") },
  { label: "Technician of", value: dummyUser.technicianOf.join(", ") },
];

const roleStyles: Record<string, string> = {
  visitor: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  member: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  admin: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  manager: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  technician: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const ProfilePage = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden border-0 bg-card/80 shadow-sm backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/30 p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-500 text-lg font-semibold text-primary-foreground shadow-sm sm:h-20 sm:w-20">
                    {dummyUser.avatar}
                  </div>

                  <div>
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                      {dummyUser.name}
                    </CardTitle>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${roleStyles[dummyUser.role]}`}
                      >
                        {dummyUser.role}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        {dummyUser.userStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Edit profile
                  </Button>
                  <Button size="sm">View organization</Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {profileStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/80 bg-muted/30 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <CardDescription className="mb-3 text-base font-medium text-foreground">
                  Profile details
                </CardDescription>

                <div className="grid gap-3 sm:grid-cols-2">
                  {infoRows.map((row) => (
                    <div
                      key={row.label}
                      className="rounded-xl border border-border/80 bg-background/70 p-3.5"
                    >
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        {row.label}
                      </p>
                      <p className="mt-2 text-sm font-medium text-foreground">
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="justify-between border-t bg-muted/20 px-5 py-4 sm:px-6">
              <p className="text-sm text-muted-foreground">Member since 2024</p>
              <p className="text-sm text-muted-foreground">
                Last active 12 min ago
              </p>
            </CardFooter>
          </Card>

          <Card className="bg-card/80 shadow-sm">
            <CardHeader className="p-5 sm:p-6">
              <CardTitle>Quick overview</CardTitle>
              <CardDescription>Dummy profile snapshot</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-5 pt-0 sm:p-6 sm:pt-0">
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Primary team
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Facility Operations
                </p>
              </div>

              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Shift
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Day Shift • 08:00 - 16:00
                </p>
              </div>

              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Access level
                </p>
                <p className="mt-2 text-lg font-semibold capitalize">
                  {dummyUser.role}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
