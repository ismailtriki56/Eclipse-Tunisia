import type { Metadata } from "next";
import { PageHeader, ComingSoon } from "@/components/page-shell";

export const metadata: Metadata = { title: "For Providers" };

export default function ProvidersPage() {
  return (
    <>
      <PageHeader
        eyebrow="For tourism providers"
        title="List your eclipse experience"
        description="Tour operators, guides, transport providers, accommodation businesses and cultural experience organisers can present services and receive booking requests."
      />
      <ComingSoon note="Provider registration, listing management and booking tools are planned. No provider is currently partnered with the platform, and nothing on this site implies an existing partnership." />
    </>
  );
}
