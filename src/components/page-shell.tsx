import type { ReactNode } from "react";
import { Container } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-line bg-white", className)}>
      <Container className="py-14 sm:py-[90px]">
        {eyebrow ? (
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            <span aria-hidden className="h-px w-8 bg-gold/70" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-4xl font-display text-[2.5rem] font-semibold leading-[1.03] tracking-tight text-ink text-balance sm:text-6xl lg:text-[4.75rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </Container>
    </div>
  );
}

export function ComingSoon({ note }: { note: string }) {
  return (
    <Container className="py-16 sm:py-20">
      <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
          In development
        </p>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
          {note}
        </p>
      </div>
    </Container>
  );
}
