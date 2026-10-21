"use client";

import { useSyncExternalStore } from "react";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  complete: boolean;
}

function remainingUntil(target: number, now: number): Remaining {
  const difference = target - now;
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true };
  }
  const seconds = Math.floor(difference / 1000);
  return {
    days: Math.floor(seconds / 86_400),
    hours: Math.floor((seconds % 86_400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    complete: false,
  };
}

const listeners = new Set<() => void>();
let currentTime = 0;
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    currentTime = Date.now();
    timer = setInterval(() => {
      currentTime = Date.now();
      for (const subscriber of listeners) {
        subscriber();
      }
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot() {
  return currentTime;
}

function getServerSnapshot() {
  return 0;
}

const units: Array<{ key: keyof Omit<Remaining, "complete">; label: string }> = [
  { key: "days", label: "days" },
  { key: "hours", label: "hours" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "sec" },
];

/**
 * A live countdown to the instant of greatest eclipse.
 *
 * The target is fixed in UTC so the countdown reads the same everywhere.
 */
export function Countdown({
  target,
  className,
}: {
  target: string;
  className?: string;
}) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const remaining =
    now === 0 ? null : remainingUntil(new Date(target).getTime(), now);

  if (!remaining) {
    return (
      <div className={className} aria-hidden>
        <div className="h-16 w-64 animate-pulse rounded-lg bg-white/10" />
      </div>
    );
  }

  if (remaining.complete) {
    return (
      <p className={className}>
        The eclipse has passed. The published circumstances remain accurate as
        a record of what was observed.
      </p>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-end gap-5 sm:gap-7">
        {units.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center">
            <span className="font-display text-4xl font-semibold tabular-nums tracking-tight text-ivory sm:text-5xl">
              {String(remaining[key]).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/50">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
