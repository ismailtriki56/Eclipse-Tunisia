import {
  secondaryPageMetadata,
  SecondaryPage,
} from "@/components/secondary-page";

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return secondaryPageMetadata(params, "about");
}

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <SecondaryPage params={params} page="about" />;
}
