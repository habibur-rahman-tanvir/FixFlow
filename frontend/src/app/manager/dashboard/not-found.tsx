"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
        <SearchX className="size-10 text-muted-foreground" />
      </div>

      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
        Error 404
      </p>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Page Not Found
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Sorry, the page you are looking for doesn&apos;t exist or may have been
        moved. Please check the URL or return to your dashboard.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button>
          <Link className="flex gap-1 items-center" href="/manager/dashboard">
            <Home className="mr-2 size-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Button
          nativeButton={true}
          variant="outline"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 size-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
}
