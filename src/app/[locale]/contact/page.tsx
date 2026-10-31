import {
  secondaryPageMetadata,
  SecondaryPage,
} from "@/components/secondary-page";

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return secondaryPageMetadata(params, "contact");
}

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <SecondaryPage params={params} page="contact" />;
}
