"use client";

import { useState } from "react";
import Link from "next/link";
import { formatHours, formatMoney } from "@/lib/format";
import type { Experience } from "@/data/experiences";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Users, Plus } from "lucide-react";

export function BookingRequestCard({ experience }: { experience: Experience }) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("2027-08-02");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Card className="p-6 border border-line bg-paper shadow-card">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-3xl font-semibold text-ink">
          {formatMoney(experience.priceAmount, experience.priceCurrency)}
        </p>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {experience.priceBasis}
        </span>
      </div>

      <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Duration</span>
          </dt>
          <dd className="font-medium text-ink">
            {formatHours(experience.durationHours)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>Max group size</span>
          </dt>
          <dd className="font-medium text-ink">{experience.groupSizeMax} guests</dd>
        </div>
      </dl>

      {submitted ? (
        <div className="mt-6 rounded-xl border border-success/30 bg-success/10 p-4 text-xs text-success">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Booking Request Received</span>
          </div>
          <p className="mt-2 text-ink/80 leading-relaxed">
            Thank you, {name || "Traveler"}. Your request for {guests} travelers on {date} has been logged in development preview mode.
          </p>
          <p className="mt-2 text-muted">
            Because this is a development sample, no payment was charged. You can add this stop to your trip plan.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href={`/plan?addExp=${experience.slug}`}
              className="rounded-lg bg-navy py-2 text-center text-xs font-semibold text-ivory hover:bg-navy-800 transition-colors"
            >
              Add to Itinerary Planner
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setIsOpen(false);
              }}
              className="text-xs text-muted hover:underline text-center"
            >
              Submit another inquiry
            </button>
          </div>
        </div>
      ) : isOpen ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5 border-t border-line pt-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Select Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-ivory p-2 text-xs font-medium text-ink focus:border-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Travelers ({guests})
            </label>
            <input
              type="number"
              min={1}
              max={experience.groupSizeMax}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-line bg-ivory p-2 text-xs font-medium text-ink focus:border-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Contact Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Leila Bouazizi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-ivory p-2 text-xs font-medium text-ink focus:border-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-ivory p-2 text-xs font-medium text-ink focus:border-navy focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-navy py-2.5 text-xs font-semibold text-ivory hover:bg-navy-800 transition-colors shadow-xs"
            >
              Submit Booking Inquiry
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full text-center text-xs text-muted hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full rounded-xl bg-navy py-3 text-center text-xs font-semibold text-ivory hover:bg-navy-800 transition-colors shadow-xs"
          >
            Request Booking
          </button>
          <Link
            href={`/plan?addExp=${experience.slug}`}
            className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-line bg-sand/50 py-2.5 text-center text-xs font-semibold text-navy hover:bg-sand transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add to Itinerary</span>
          </Link>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-muted">
        Inquiries are non-binding requests. No payment is charged today.
      </p>
    </Card>
  );
}
