import type { Metadata } from "next";
import { PageHeader, ComingSoon } from "@/components/page-shell";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions, corrections or partnership enquiries."
      />
      <ComingSoon note="Contact details and a contact form are being prepared. Please do not submit personal information until a privacy policy is published." />
    </>
  );
}
