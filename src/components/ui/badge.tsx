import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "total" | "partial" | "sample";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-navy/5 text-navy",
    total: "bg-navy text-gold",
    partial: "bg-gold/20 text-navy",
    sample: "bg-danger/10 text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
