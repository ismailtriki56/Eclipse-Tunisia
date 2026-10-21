import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "total" | "partial" | "sample" | "outline";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-navy/5 text-navy",
    total: "bg-navy text-gold",
    partial: "bg-gold-100 text-gold-600",
    sample: "bg-danger/10 text-danger",
    outline: "border border-line-strong text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
