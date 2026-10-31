export type StayAmenity =
  | "beachfront"
  | "pool"
  | "rooftopPool"
  | "spa"
  | "thalasso"
  | "kidsClub"
  | "restaurant"
  | "bar"
  | "wifi"
  | "parking"
  | "fitness"
  | "airConditioning"
  | "breakfast"
  | "terrace"
  | "seaView"
  | "garden"
  | "golf"
  | "casino"
  | "allInclusive"
  | "familyRooms";

export interface Stay {
  slug: string;
  name: string;
  city: string;
  destinationSlug: string;
  setting: string;
  character: string;
  summary: string;
  highlights: string[];
  bestFor: string[];
  stars: number | null;
  amenities: StayAmenity[];
  photoKeys: string[];
  officialUrl: string;
  bookingSearchUrl: string;
  verifiedOn: string;
}

const bookingSearch = (city: string) =>
  `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&checkin=2027-08-01&checkout=2027-08-05&group_adults=2&no_rooms=1&group_children=0`;

export const stays: Stay[] = [
  {
    slug: "iberostar-selection-royal-el-mansour",
    name: "Iberostar Selection Royal El Mansour",
    city: "Mahdia",
    destinationSlug: "mahdia",
    setting: "Beachfront, next to the old town",
    character: "Family beach resort with thalassotherapy",
    summary:
      "A five-star beachfront resort on the Route de la Corniche, with direct beach access, pools, a thalassotherapy centre and the Star Camp children's programme.",
    highlights: [
      "Direct beach access",
      "Thalassotherapy and spa",
      "Star Camp children's programme",
      "All-inclusive option",
    ],
    bestFor: ["Families", "Beach days", "Mahdia old town"],
    stars: 5,
    amenities: [
      "beachfront",
      "thalasso",
      "spa",
      "pool",
      "kidsClub",
      "allInclusive",
      "restaurant",
      "wifi",
      "parking",
    ],
    photoKeys: [
      "iberostarRoyalElMansourExterior",
      "iberostarRoyalElMansourGrounds",
    ],
    officialUrl:
      "https://www.iberostar.com/en/hotels/mahdia/iberostar-selection-royal-el-mansour",
    bookingSearchUrl: bookingSearch("Mahdia"),
    verifiedOn: "Official hotel website",
  },
  {
    slug: "mahdia-palace-thalasso",
    name: "Mahdia Palace Thalasso",
    city: "Mahdia",
    destinationSlug: "mahdia",
    setting: "Tourist zone, gardens and pools",
    character: "Large resort with a Tunisian design language",
    summary:
      "A resort in the Mahdia tourist zone with garden and sea-view rooms, pools and thalassotherapy. It is a practical base for a beach-led eclipse stay.",
    highlights: [
      "Garden and sea-view rooms",
      "Pools and gardens",
      "Thalassotherapy",
      "Family rooms",
    ],
    bestFor: ["Resort stays", "Families", "Pool time"],
    stars: 5,
    amenities: [
      "pool",
      "garden",
      "seaView",
      "thalasso",
      "familyRooms",
      "restaurant",
      "spa",
      "wifi",
    ],
    photoKeys: [],
    officialUrl: "https://mahdiapalace.tn/en-gb/",
    bookingSearchUrl: bookingSearch("Mahdia"),
    verifiedOn: "Official hotel website",
  },
  {
    slug: "nour-palace-resort-thalasso",
    name: "Nour Palace Resort & Thalasso",
    city: "Mahdia",
    destinationSlug: "mahdia",
    setting: "Beachfront tourist zone north of the centre",
    character: "All-inclusive beach resort",
    summary:
      "A beachfront resort north of Mahdia with pools, restaurants, a spa and family facilities. The broad beach and resort grounds make it an easy base for mixed-age groups.",
    highlights: [
      "Beachfront setting",
      "Pools and spa",
      "Family facilities",
      "All-inclusive stays",
    ],
    bestFor: ["All-inclusive", "Families", "Mixed-age groups"],
    stars: 5,
    amenities: [
      "beachfront",
      "pool",
      "spa",
      "familyRooms",
      "allInclusive",
      "restaurant",
      "bar",
      "wifi",
    ],
    photoKeys: [],
    officialUrl: "https://nourpalace.tn/en-gb/",
    bookingSearchUrl: bookingSearch("Mahdia"),
    verifiedOn: "Official hotel website",
  },
  {
    slug: "radisson-blu-athenee-palace-djerba",
    name: "Radisson Blu Athénée Palace Resort & Thalasso",
    city: "Djerba",
    destinationSlug: "djerba",
    setting: "Beachfront in Houmt Souk's tourist zone",
    character: "Five-star island resort with a kids' club",
    summary:
      "A beachfront resort with 296 rooms and suites, a thalassotherapy spa, several restaurants, pools and a kids' club. Its Houmt Souk setting puts the medina within easy reach.",
    highlights: [
      "Beachfront location",
      "Thalassotherapy spa",
      "Kids' club",
      "Close to Houmt Souk",
    ],
    bestFor: ["Families", "Spa breaks", "Djerba's medina"],
    stars: 5,
    amenities: [
      "beachfront",
      "thalasso",
      "spa",
      "pool",
      "kidsClub",
      "restaurant",
      "fitness",
      "wifi",
      "parking",
    ],
    photoKeys: [],
    officialUrl:
      "https://www.radissonhotels.com/en-us/hotels/radisson-blu-resort-djerba",
    bookingSearchUrl: bookingSearch("Djerba"),
    verifiedOn: "Official hotel website",
  },
  {
    slug: "hasdrubal-prestige-djerba",
    name: "Hasdrubal Prestige Thalassa & Spa Djerba",
    city: "Djerba",
    destinationSlug: "djerba",
    setting: "Private beach at Sidi Mehrez",
    character: "Suite-led thalassotherapy hotel",
    summary:
      "A seafront hotel built around suites, a private beach and thalassotherapy, with golf and the Djerba casino nearby. Best suited to travellers prioritising space and spa time.",
    highlights: [
      "Private beach",
      "Suites",
      "Thalassotherapy",
      "Golf nearby",
    ],
    bestFor: ["Couples", "Suites", "Spa time"],
    stars: 5,
    amenities: [
      "beachfront",
      "spa",
      "thalasso",
      "seaView",
      "golf",
      "casino",
      "restaurant",
      "wifi",
      "parking",
    ],
    photoKeys: [],
    officialUrl: "https://hasdrubalprestige.tn/en-gb",
    bookingSearchUrl: bookingSearch("Djerba"),
    verifiedOn: "Official hotel website",
  },
  {
    slug: "anantara-sahara-tozeur",
    name: "Anantara Sahara Tozeur Resort & Villas",
    city: "Tozeur",
    destinationSlug: "tozeur",
    setting: "Desert edge outside Tozeur",
    character: "Desert resort and villas",
    summary:
      "A desert resort and villa retreat on the edge of Tozeur, positioned for oasis excursions and the landscapes around Chott el Jerid. A quieter, higher-comfort Sahara base.",
    highlights: [
      "Desert setting",
      "Resort and villa accommodation",
      "Oasis excursions",
      "Spa and dining",
    ],
    bestFor: ["Desert stays", "Couples", "Oasis excursions"],
    stars: 5,
    amenities: [
      "spa",
      "pool",
      "restaurant",
      "bar",
      "airConditioning",
      "wifi",
      "parking",
    ],
    photoKeys: [],
    officialUrl: "https://www.anantara.com/en/sahara-tozeur",
    bookingSearchUrl: bookingSearch("Tozeur"),
    verifiedOn: "Official hotel website",
  },
  {
    slug: "movenpick-resort-marine-spa-sousse",
    name: "Mövenpick Resort & Marine Spa Sousse",
    city: "Sousse",
    destinationSlug: "sousse",
    setting: "Beachfront on the edge of Sousse",
    character: "Resort with a marine spa",
    summary:
      "A beachfront resort with a marine spa, pools and family facilities, within reach of Sousse's UNESCO-listed medina. Useful for travellers who want a full-service base outside the totality path.",
    highlights: [
      "Beachfront setting",
      "Marine spa",
      "Pools",
      "Medina access",
    ],
    bestFor: ["Resort stays", "Families", "Sousse medina"],
    stars: 5,
    amenities: [
      "beachfront",
      "spa",
      "pool",
      "kidsClub",
      "restaurant",
      "fitness",
      "wifi",
      "parking",
    ],
    photoKeys: [],
    officialUrl:
      "https://movenpick.accor.com/en/africa/tunisia/sousse/hotel-sousse.html",
    bookingSearchUrl: bookingSearch("Sousse"),
    verifiedOn: "Official hotel website",
  },
  {
    slug: "radisson-hotel-sfax",
    name: "Radisson Hotel Sfax",
    city: "Sfax",
    destinationSlug: "sfax",
    setting: "City centre, near the medina and the Ribat",
    character: "International five-star city hotel",
    summary:
      "A central Sfax hotel with a rooftop pool and city views, a spa, a fitness centre and a restaurant. The medina, the Ribat and the Archaeological Museum are within easy reach.",
    highlights: [
      "Rooftop pool",
      "Spa and fitness centre",
      "Central location",
      "Parking on site",
    ],
    bestFor: ["City stays", "Comfort", "Medina access"],
    stars: 5,
    amenities: [
      "rooftopPool",
      "spa",
      "fitness",
      "restaurant",
      "bar",
      "airConditioning",
      "wifi",
      "parking",
    ],
    photoKeys: [],
    officialUrl: "https://radissonsfax.tn/",
    bookingSearchUrl: bookingSearch("Sfax"),
    verifiedOn: "Official hotel website",
  },
  {
    slug: "borj-dhiafa-sfax",
    name: "Borj Dhiafa",
    city: "Sfax",
    destinationSlug: "sfax",
    setting: "Route de Soukra, between the centre and the airport",
    character: "Five-star boutique hotel with a spa",
    summary:
      "A boutique five-star hotel in a modern Tunisian building, with a spa and pool, two restaurants and a lounge bar. A quiet base south of the city with straightforward road access.",
    highlights: [
      "Spa and pool",
      "Two restaurants",
      "Boutique scale",
      "Road access",
    ],
    bestFor: ["Quiet stays", "Couples", "Spa time"],
    stars: 5,
    amenities: [
      "spa",
      "pool",
      "restaurant",
      "bar",
      "garden",
      "airConditioning",
      "wifi",
      "parking",
    ],
    photoKeys: [],
    officialUrl: "https://www.hotelborjdhiafa.com/",
    bookingSearchUrl: bookingSearch("Sfax"),
    verifiedOn: "Official hotel website",
  },
  {
    slug: "hotel-cercina-kerkennah",
    name: "Cercina Hotel",
    city: "Kerkennah",
    destinationSlug: "kerkennah",
    setting: "Beachfront at Sidi Fredj, Ouled Yaneg",
    character: "Family-run island hotel",
    summary:
      "A simple beachfront hotel on the Sidi Fredj shore, with air-conditioned rooms, a terrace restaurant and direct access to one of Kerkennah's quietest beaches.",
    highlights: [
      "Beachfront setting",
      "Family-run",
      "Seafood restaurant",
      "Quiet shore",
    ],
    bestFor: ["Island stays", "Beach time", "Slow travel"],
    stars: 2,
    amenities: [
      "beachfront",
      "restaurant",
      "bar",
      "terrace",
      "airConditioning",
      "wifi",
    ],
    photoKeys: [],
    officialUrl: "https://www.hotel-cercina.com/",
    bookingSearchUrl: bookingSearch("Kerkennah"),
    verifiedOn: "Official hotel website",
  },
  {
    slug: "beit-el-ezz-kerkennah",
    name: "Beit El Ezz",
    city: "Kerkennah",
    destinationSlug: "kerkennah",
    setting: "Island guesthouse in a traditional house",
    character: "Guesthouse with a courtyard",
    summary:
      "A small guesthouse in a traditional Kerkennah house, with a courtyard, breakfast and a handful of rooms. Best for travellers who want an island stay at a slower scale.",
    highlights: [
      "Traditional house",
      "Courtyard",
      "Breakfast",
      "Small scale",
    ],
    bestFor: ["Slow travel", "Couples", "Island life"],
    stars: null,
    amenities: ["terrace", "breakfast", "airConditioning", "wifi"],
    photoKeys: [],
    officialUrl: "http://www.beitelezz-kerkennah.com/",
    bookingSearchUrl: bookingSearch("Kerkennah"),
    verifiedOn: "Official guesthouse website",
  },
];

export function getStay(slug: string): Stay | undefined {
  return stays.find((stay) => stay.slug === slug);
}

export function staysForDestination(destinationSlug: string): Stay[] {
  return stays.filter((stay) => stay.destinationSlug === destinationSlug);
}

export function stayCities(): string[] {
  return Array.from(new Set(stays.map((stay) => stay.city)));
}
