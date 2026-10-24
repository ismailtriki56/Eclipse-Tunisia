export type CampaignTheme = "night" | "coast" | "desert";

export interface Campaign {
  id: string;
  brand: string;
  category: string;
  headline: string;
  body: string;
  detail: string;
  ctaLabel: string;
  href: string;
  theme: CampaignTheme;
  mark: string;
  disclosure: string;
}

export const campaigns: Campaign[] = [
  {
    id: "lufthansa",
    brand: "Lufthansa",
    category: "Airline campaign",
    headline: "Fly to Tunisia for totality.",
    body: "From major European hubs, connect to Tunis (TUN), Monastir (MIR) or Djerba (DJE) for eclipse week. Compare real routes and fares via our flight search.",
    detail: "Europe → TUN / DJE / MIR",
    ctaLabel: "Search flights",
    href: "/flights",
    theme: "night",
    mark: "LH",
    disclosure: "Illustrative campaign concept — no official partnership claimed. Use /flights for real searches.",
  },
  {
    id: "swiss",
    brand: "SWISS",
    category: "Airline campaign",
    headline: "Alpine precision to a Mediterranean eclipse.",
    body: "Connect via Zürich to Tunisia's eclipse gateways. Plan for morning totality with easy transfers to coast and island bases.",
    detail: "ZRH → TUN / DJE / MIR",
    ctaLabel: "Search flights",
    href: "/flights",
    theme: "coast",
    mark: "LX",
    disclosure: "Illustrative campaign concept — no official partnership claimed.",
  },
  {
    id: "mahdia-packages",
    brand: "Mahdia Eclipse Beach Escape",
    category: "Travel packages",
    headline: "Four nights. Minutes of wonder.",
    body: "Premium coastal stay in Mahdia timed for totality, with airport transfers, verified viewing, eclipse glasses, and curated experiences.",
    detail: "Mahdia, Tunisia",
    ctaLabel: "View packages",
    href: "/packages",
    theme: "desert",
    mark: "ME",
    disclosure: "Illustrative demo pricing — not a live offer.",
  },
];
