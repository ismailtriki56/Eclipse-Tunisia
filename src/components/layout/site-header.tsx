"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { Logo } from "./logo";
import { ButtonLink } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ivory/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-muted transition-colors hover:text-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink href="/experiences" size="sm" variant="primary">
            Explore Experiences
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-navy md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-line bg-ivory md:hidden"
        >
          <nav aria-label="Mobile" className="px-5 py-4">
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-black/5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 px-1">
              <ButtonLink
                href="/experiences"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Explore Experiences
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
