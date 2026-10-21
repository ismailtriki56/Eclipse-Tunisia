import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 ${className ?? ""}`}
      aria-label={`${site.name} home`}
    >
      <span
        aria-hidden
        className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy"
      >
        <span className="absolute h-8 w-8 rounded-full bg-ivory shadow-[3px_0_0_0_var(--color-navy)]" />
        <span className="absolute right-1 h-4 w-4 rounded-full bg-gold blur-[0.5px]" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-navy">
        Eclipse <span className="text-gold-600">Tunisia</span>
      </span>
    </Link>
  );
}
