"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const organizations = [
	{
		id: 1,
		name: "Northwind Labs",
		slug: "northwind-labs",
		description: "Facilities and infrastructure operations support.",
		timezone: "UTC-05:00",
	},
	{
		id: 2,
		name: "Lakeside Medical",
		slug: "lakeside-medical",
		description: "Healthcare maintenance and equipment tracking.",
		timezone: "UTC-06:00",
	},
	{
		id: 3,
		name: "Summit Retail",
		slug: "summit-retail",
		description: "Multi-location retail operations and maintenance.",
		timezone: "UTC-07:00",
	},
	{
		id: 4,
		name: "Harbor Logistics",
		slug: "harbor-logistics",
		description: "Warehouse and fleet issue management across terminals.",
		timezone: "UTC+00:00",
	},
];

export default function OrganizationsPage() {
	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between gap-4">
				<div>
					<p className="text-sm font-medium text-muted-foreground">
						Overview
					</p>
					<h1 className="text-2xl font-bold tracking-tight">
						Organizations
					</h1>
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

				<div className="max-h-[70vh] overflow-y-auto">
					{organizations.map((org) => (
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
							<span className="text-muted-foreground">
								{org.timezone}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
