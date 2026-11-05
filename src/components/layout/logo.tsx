"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/context/language-context";
import { localePath } from "@/lib/locale-path";

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const { locale, t } = useLanguage();
  return (
    <Link
      href={localePath(locale, "/")}
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label={`${site.name} ${t.header.home}`}
    >
      <span
        aria-hidden
        className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy"
      >
        <span className="absolute h-9 w-9 rounded-full bg-ivory shadow-[3px_0_0_0_var(--color-navy)]" />
        <span className="absolute right-1.5 h-4 w-4 rounded-full bg-gold blur-[0.5px]" />
      </span>
      <span
        className={cn(
          "font-display text-xl font-semibold tracking-tight",
          tone === "light" ? "text-ivory" : "text-navy",
        )}
      >
        Eclipse <span className={tone === "light" ? "text-gold" : "text-gold-600"}>Tunisia</span>
      </span>
    </Link>
  );
}
