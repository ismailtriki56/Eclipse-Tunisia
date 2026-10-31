"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { packages } from "@/data/packages";
import { useLanguage } from "@/context/language-context";

type Mode = "quote" | "waitlist";

export function QuoteForm({
  defaultPackageSlug,
  mode = "quote",
  compact = false,
}: {
  defaultPackageSlug?: string;
  mode?: Mode;
  compact?: boolean;
}) {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    packageSlug: defaultPackageSlug ?? "",
    travellers: "2",
    message: "",
    website: "",
  });

  const packageText = t.packageText as Record<string, { name: string }>;

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, travellers: Number(form.travellers), locale }),
      });
      if (!response.ok) throw new Error("request_failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="h-5 w-5" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
          {mode === "waitlist" ? t.form.waitlistSuccessTitle : t.form.successTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {mode === "waitlist" ? t.form.waitlistSuccessBody : t.form.successBody}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        compact
          ? "rounded-2xl border border-line bg-white p-5 shadow-card"
          : "rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8"
      }
    >
      <h2 className="font-display text-2xl font-semibold text-ink">
        {mode === "waitlist" ? t.form.waitlistTitle : t.form.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {mode === "waitlist" ? t.form.waitlistDescription : t.form.description}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {t.form.name}
          </span>
          <input
            required
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder={t.form.namePlaceholder}
            className="mt-1.5 w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm text-ink focus:border-navy focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {t.form.email}
          </span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder={t.form.emailPlaceholder}
            className="mt-1.5 w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm text-ink focus:border-navy focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {t.form.phone}
          </span>
          <input
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder={t.form.phonePlaceholder}
            className="mt-1.5 w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm text-ink focus:border-navy focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {t.form.travellers}
          </span>
          <input
            required
            type="number"
            min={1}
            max={20}
            value={form.travellers}
            onChange={(event) => update("travellers", event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm text-ink focus:border-navy focus:outline-none"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {t.form.package}
        </span>
        <select
          value={form.packageSlug}
          onChange={(event) => update("packageSlug", event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm text-ink focus:border-navy focus:outline-none"
        >
          <option value="">{t.form.selectPackage}</option>
          {packages.map((pkg) => (
            <option key={pkg.slug} value={pkg.slug}>
              {packageText[pkg.slug]?.name ?? pkg.name}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {t.form.message}
        </span>
        <textarea
          rows={4}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder={t.form.messagePlaceholder}
          className="mt-1.5 w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm text-ink focus:border-navy focus:outline-none"
        />
      </label>

      <label className="sr-only" aria-hidden>
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </label>

      {status === "error" ? (
        <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {t.form.errorBody}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-navy-800 disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.form.submitting}
            </>
          ) : mode === "waitlist" ? (
            t.packages.requestWaitlist
          ) : (
            t.form.submit
          )}
        </button>
        <p className="text-xs text-muted">{t.form.privacyNote}</p>
      </div>
    </form>
  );
}
