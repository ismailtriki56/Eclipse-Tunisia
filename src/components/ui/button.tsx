"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/context/language-context";
import { localePath } from "@/lib/locale-path";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "outline" | "gold";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-ivory shadow-sm hover:bg-navy-800 hover:shadow-md active:translate-y-px",
  secondary:
    "border border-line-strong bg-paper text-navy hover:border-navy hover:text-navy",
  ghost: "text-navy hover:bg-black/5",
  inverse: "bg-gold text-navy hover:bg-gold-600 hover:text-ivory shadow-sm",
  outline:
    "border border-ivory/50 text-ivory hover:border-gold hover:text-gold",
  gold: "bg-gold text-navy hover:bg-gold-600 hover:text-ivory shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href">) {
  const { locale } = useLanguage();
  return (
    <Link
      href={localePath(locale, href)}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
