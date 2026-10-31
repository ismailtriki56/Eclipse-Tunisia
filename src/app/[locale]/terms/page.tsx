import type { Metadata } from "next";
import { PageHeader, ComingSoon } from "@/components/page-shell";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="Terms of use"
        description="The terms that govern use of Eclipse Tunisia."
      />
      <ComingSoon note="Terms of use, booking and cancellation policies, and refund rules must be drafted to reflect the real operating model before bookings are accepted." />
    </>
  );
}
