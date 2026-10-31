import {
  secondaryPageMetadata,
  SecondaryPage,
} from "@/components/secondary-page";

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return secondaryPageMetadata(params, "terms");
}

export default function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <SecondaryPage params={params} page="terms" />;
}
