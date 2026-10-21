import type { Metadata } from "next";
import { PageHeader, ComingSoon } from "@/components/page-shell";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy policy"
        description="How Eclipse Tunisia handles personal information."
      />
      <ComingSoon note="A privacy policy must be drafted to reflect the actual business model and applicable Tunisian and international requirements before any personal data is collected." />
    </>
  );
}
