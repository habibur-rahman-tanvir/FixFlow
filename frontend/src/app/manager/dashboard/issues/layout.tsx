"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListFilter, Tags } from "lucide-react";
import type { ReactNode } from "react";

export default function IssuesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const issuesHref = "/manager/dashboard/issues";
  const categoriesHref = `${issuesHref}/categories`;
  const isCategoriesActive = pathname.startsWith(categoriesHref);
  const isIssuesActive = pathname.startsWith(issuesHref) && !isCategoriesActive;

  return (
    <div>
      <nav
        aria-label="Issue navigation"
        className="sticky top-16 z-30 border-b border-border/70 bg-background/95 px-3 backdrop-blur-xl sm:px-6"
      >
        <div className="flex h-14 items-center">
          <ul className="relative grid h-10 w-full grid-cols-2 rounded-lg border border-border/70 bg-muted/50 p-1 shadow-sm sm:w-[360px]">
            <span
              aria-hidden="true"
              className={`absolute left-1 top-1 h-8 w-[calc((100%-0.5rem)/2)] rounded-md border border-border/60 bg-background shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isCategoriesActive
                  ? "translate-x-[calc(100%)]"
                  : "translate-x-0"
              }`}
            />

            <li className="relative z-10">
              <Link
                href={issuesHref}
                aria-current={isIssuesActive ? "page" : undefined}
                className={`flex h-8 items-center justify-center gap-2 rounded-md px-3 text-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isIssuesActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ListFilter className="h-4 w-4" />
                Issues
              </Link>
            </li>

            <li className="relative z-10">
              <Link
                href={categoriesHref}
                aria-current={isCategoriesActive ? "page" : undefined}
                className={`flex h-8 items-center justify-center gap-2 rounded-md px-3 text-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isCategoriesActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Tags className="h-4 w-4" />
                Issue Categories
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
}
