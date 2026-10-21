import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-paper shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Container({
  children,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer";
}) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}
    >
      {children}
    </Component>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display text-3xl font-semibold tracking-tight text-ink text-balance sm:text-4xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** A large figure with a small label, used for headline statistics. */
export function Stat({
  value,
  label,
  hint,
  className,
  tone = "ink",
}: {
  value: string;
  label: string;
  hint?: string;
  className?: string;
  tone?: "ink" | "light";
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span
        className={cn(
          "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
          tone === "ink" ? "text-ink" : "text-ivory",
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.16em]",
          tone === "ink" ? "text-muted" : "text-ivory/60",
        )}
      >
        {label}
      </span>
      {hint ? (
        <span
          className={cn(
            "text-sm leading-relaxed",
            tone === "ink" ? "text-muted" : "text-ivory/70",
          )}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}
