export type ExperienceCategory =
  | "eclipse-viewing"
  | "transport"
  | "culture"
  | "history"
  | "food"
  | "package"
  | "accommodation";

export interface Experience {
  slug: string;
  title: string;
  category: ExperienceCategory;
  destinationSlug: string;
  providerName: string;
  summary: string;
  priceAmount: number;
  priceCurrency: string;
  priceBasis: "per person" | "per group";
  durationHours: number;
  groupSizeMax: number;
  includes: string[];
  excludes: string[];
  isSample: boolean;
  imageAlt: string;
}

/**
 * Clearly labelled SAMPLE listings for development only.
 * These are not real providers and must never be displayed as live inventory.
 */
export const experiences: Experience[] = [
  {
    slug: "desert-totality-viewing",
    title: "Desert Totality Viewing with Local Guide",
    category: "eclipse-viewing",
    destinationSlug: "tozeur",
    providerName: "Sample Provider — Sahara Sky Tours",
    summary:
      "A guided pre-dawn departure to a selected viewing point on the salt flats, with transport and shaded seating.",
    priceAmount: 180,
    priceCurrency: "TND",
    priceBasis: "per person",
    durationHours: 8,
    groupSizeMax: 20,
    includes: ["Return transport", "Local guide", "Water and snacks"],
    excludes: ["Solar viewing glasses", "Personal insurance"],
    isSample: true,
    imageAlt: "Group watching the sky from the desert near Tozeur",
  },
  {
    slug: "tozeur-oasis-cultural-walk",
    title: "Tozeur Oasis Cultural Walk",
    category: "culture",
    destinationSlug: "tozeur",
    providerName: "Sample Provider — Oasis Walks",
    summary:
      "A half-day walk through the palm groves and old town, covering irrigation traditions and local crafts.",
    priceAmount: 90,
    priceCurrency: "TND",
    priceBasis: "per person",
    durationHours: 4,
    groupSizeMax: 12,
    includes: ["Guide", "Mint tea stop"],
    excludes: ["Transport to meeting point", "Meals"],
    isSample: true,
    imageAlt: "Palm grove pathway in the Tozeur oasis",
  },
  {
    slug: "gabes-seafront-food-tour",
    title: "Gabès Seafront Food Tour",
    category: "food",
    destinationSlug: "gabes",
    providerName: "Sample Provider — Coastal Flavours",
    summary:
      "An evening tasting walk along the seafront featuring local seafood and southern Tunisian specialities.",
    priceAmount: 120,
    priceCurrency: "TND",
    priceBasis: "per person",
    durationHours: 3,
    groupSizeMax: 10,
    includes: ["Tastings at five stops", "Guide"],
    excludes: ["Drinks outside the set menu", "Transport"],
    isSample: true,
    imageAlt: "Seafood dishes served along the Gabès seafront",
  },
  {
    slug: "douz-desert-transfer",
    title: "Private Transfer to Douz Viewing Area",
    category: "transport",
    destinationSlug: "chott-el-jerid",
    providerName: "Sample Provider — Southern Transfers",
    summary:
      "A private vehicle and driver for the eclipse morning, with flexible pick-up from selected southern hotels.",
    priceAmount: 450,
    priceCurrency: "TND",
    priceBasis: "per group",
    durationHours: 6,
    groupSizeMax: 6,
    includes: ["Vehicle and driver", "Fuel"],
    excludes: ["Viewing equipment", "Guide"],
    isSample: true,
    imageAlt: "Four-wheel-drive vehicle parked near desert dunes",
  },
];

export function getExperience(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}
