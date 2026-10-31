import {
  secondaryPageMetadata,
  SecondaryPage,
} from "@/components/secondary-page";

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return secondaryPageMetadata(params, "providers");
}

export default function ProvidersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <SecondaryPage params={params} page="providers" />;
}
