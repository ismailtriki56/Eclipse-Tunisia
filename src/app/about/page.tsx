import type { Metadata } from "next";
import { PageHeader, ComingSoon } from "@/components/page-shell";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About Eclipse Tunisia"
        description="A planning companion for the total solar eclipse of 2 August 2027 in Tunisia."
      />
      <ComingSoon note="This content is being prepared. Eclipse Tunisia is not the official organiser of the eclipse and is not affiliated with NASA or any other organisation." />
    </>
  );
}
