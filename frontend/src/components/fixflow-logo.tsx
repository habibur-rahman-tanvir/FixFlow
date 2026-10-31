import Image from "next/image";
import Link from "next/link";

export function FixFlowLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="FixFlow home"
    >
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-sky-200 bg-linear-to-br from-sky-500 via-blue-600 to-blue-700 shadow-sm shadow-blue-500/20 dark:border-sky-800">
        <Image
          src="/fixflow-logo.svg"
          alt="FixFlow logo"
          width={28}
          height={28}
          priority
        />
      </div>

      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-tight text-foreground">
            FixFlow
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Operations
          </span>
        </div>
      )}
    </Link>
  );
}
