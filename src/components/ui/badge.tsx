import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "total" | "partial" | "sample" | "outline" | "limited" | "soldOut";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-navy/5 text-navy",
    total: "bg-navy text-gold",
    partial: "bg-gold-100 text-gold-600",
    sample: "border border-line-strong bg-paper/85 text-muted",
    outline: "border border-line-strong text-muted",
    limited: "bg-gold text-navy",
    soldOut: "bg-danger text-white",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
