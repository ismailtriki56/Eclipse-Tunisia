export interface PackageRoomOption {
  id: string;
  label: string;
  description: string;
  priceDelta: number;
}

export interface PackageAddOn {
  id: string;
  label: string;
  description: string;
  pricePerPerson: number;
}

export interface PackageDay {
  day: number;
  title: string;
  body: string;
}

export interface TravelPackage {
  slug: string;
  name: string;
  kicker: string;
  destinationSlug: string;
  area: string;
  nights: number;
  basePricePerPerson: number;
  nightlyAdjustment: number;
  singleSupplement: number;
  currency: "USD";
  imageKey: string;
  summary: string;
  bestFor: string[];
  eclipseBase: string;
  included: string[];
  excluded: string[];
  itinerary: PackageDay[];
  roomOptions: PackageRoomOption[];
  addOns: PackageAddOn[];
  isIllustrative: true;
}

export const packages: TravelPackage[] = [
  {
    slug: "mahdia-signature",
    name: "Mahdia Signature",
    kicker: "Four nights on the eclipse coast",
    destinationSlug: "mahdia",
    area: "Mahdia, central-east Tunisia",
    nights: 4,
    basePricePerPerson: 1200,
    nightlyAdjustment: 210,
    singleSupplement: 340,
    currency: "USD",
    imageKey: "mahdiaBeach",
    summary:
      "A four-night beach base in Mahdia, timed around 2 minutes 48 seconds of totality. Pair the eclipse with the medina, the lighthouse and a day at El Jem.",
    bestFor: ["First eclipse trip", "Beach and history", "Small groups"],
    eclipseBase: "mahdia",
    included: [
      "4 nights in a 4-star beach hotel, double or twin share",
      "Daily breakfast and two dinners",
      "Return private transfers from Monastir airport (MIR)",
      "Eclipse-morning transfer to a verified open coastal viewing point",
      "ISO 12312-2 eclipse glasses for each traveller",
      "Guided Mahdia medina and lighthouse walk",
      "Full-day El Jem amphitheatre excursion",
      "Local trip coordination before arrival",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Lunches, drinks and personal spending",
      "Visa or entry fees",
      "Single supplement, room upgrades and optional add-ons",
      "Anything not listed as included",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Monastir, transfer to Mahdia",
        body: "Private transfer along the coast, hotel check-in and a first walk through the old town at sunset.",
      },
      {
        day: 2,
        title: "Medina, lighthouse and eclipse briefing",
        body: "A guided morning in the medina and around the lighthouse, followed by a practical briefing on the next morning's timings and safety.",
      },
      {
        day: 3,
        title: "Eclipse day on the coast",
        body: "Early transfer to an open coastal viewing point. First contact at 08:56, totality from 10:10 to 10:13, last contact at 11:31 local time.",
      },
      {
        day: 4,
        title: "El Jem and the amphitheatre",
        body: "A day trip inland to the Roman amphitheatre at El Jem, with time for the museum and a late lunch before returning to Mahdia.",
      },
      {
        day: 5,
        title: "Departure",
        body: "Breakfast, check-out and a private transfer back to Monastir airport.",
      },
    ],
    roomOptions: [
      {
        id: "standard",
        label: "Garden or courtyard view",
        description: "Standard double or twin room, subject to hotel allocation.",
        priceDelta: 0,
      },
      {
        id: "sea-view",
        label: "Sea-view room",
        description: "Upgrade subject to availability at the selected hotel.",
        priceDelta: 95,
      },
    ],
    addOns: [
      {
        id: "photography-clinic",
        label: "Eclipse photography clinic",
        description: "A small-group session on exposure, filters and composition before eclipse morning.",
        pricePerPerson: 120,
      },
      {
        id: "private-guide",
        label: "Private guide for El Jem",
        description: "A dedicated local guide for the amphitheatre and museum visit.",
        pricePerPerson: 75,
      },
      {
        id: "extra-dinner",
        label: "Coastal dinner for two nights",
        description: "Two additional dinners at the hotel or a partner restaurant.",
        pricePerPerson: 90,
      },
    ],
    isIllustrative: true,
  },
  {
    slug: "djerba-total-totality",
    name: "Djerba Total Totality",
    kicker: "Our longest island totality",
    destinationSlug: "djerba",
    area: "Djerba, south-east Tunisia",
    nights: 4,
    basePricePerPerson: 1450,
    nightlyAdjustment: 245,
    singleSupplement: 390,
    currency: "USD",
    imageKey: "djerbaBeach",
    summary:
      "Four nights on Djerba, where our verified circumstances give 4 minutes 37 seconds of totality. A slower island rhythm, whitewashed Houmt Souk and long beaches.",
    bestFor: ["Long totality", "Island stays", "Families"],
    eclipseBase: "djerba",
    included: [
      "4 nights in a 4-star island hotel, double or twin share",
      "Daily breakfast",
      "Return private transfers from Djerba–Zarzis airport (DJE)",
      "Eclipse-morning transfer to a verified island viewing point",
      "ISO 12312-2 eclipse glasses for each traveller",
      "Guided Houmt Souk and Guellala excursion",
      "Local trip coordination before arrival",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Lunches, drinks and personal spending",
      "Visa or entry fees",
      "Single supplement, room upgrades and optional add-ons",
      "Anything not listed as included",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Djerba",
        body: "Airport transfer, hotel check-in and an evening in Houmt Souk.",
      },
      {
        day: 2,
        title: "Island culture and eclipse briefing",
        body: "Houmt Souk, the ceramic workshops at Guellala and a practical briefing on eclipse morning.",
      },
      {
        day: 3,
        title: "Eclipse day",
        body: "Early departure for an open island viewing point. Totality runs from 10:09 to 10:14 local time.",
      },
      {
        day: 4,
        title: "Beach and lagoon day",
        body: "An unhurried day on the coast, with time for the lagoon and a final island dinner.",
      },
      {
        day: 5,
        title: "Departure",
        body: "Breakfast and a private transfer to Djerba–Zarzis airport.",
      },
    ],
    roomOptions: [
      {
        id: "standard",
        label: "Garden or courtyard view",
        description: "Standard double or twin room, subject to hotel allocation.",
        priceDelta: 0,
      },
      {
        id: "sea-view",
        label: "Sea-view room",
        description: "Upgrade subject to availability at the selected hotel.",
        priceDelta: 110,
      },
    ],
    addOns: [
      {
        id: "photography-clinic",
        label: "Eclipse photography clinic",
        description: "A small-group session on exposure, filters and composition before eclipse morning.",
        pricePerPerson: 120,
      },
      {
        id: "boat-trip",
        label: "Djerba coastal boat trip",
        description: "A half-day boat outing from the island, weather permitting.",
        pricePerPerson: 85,
      },
      {
        id: "spa-ritual",
        label: "Thalassotherapy ritual",
        description: "A 60-minute seawater spa treatment at the selected hotel.",
        pricePerPerson: 95,
      },
    ],
    isIllustrative: true,
  },
  {
    slug: "sahara-eclipse-oasis",
    name: "Sahara Eclipse & Oasis",
    kicker: "Desert light and a short totality",
    destinationSlug: "tozeur",
    area: "Tozeur and Chott el Jerid",
    nights: 5,
    basePricePerPerson: 1650,
    nightlyAdjustment: 235,
    singleSupplement: 450,
    currency: "USD",
    imageKey: "tozeurSunset",
    summary:
      "Five nights between the Tozeur oasis and the salt flats. Totality here is short, so this trip is for travellers who want the desert first and the eclipse as part of a wider landscape.",
    bestFor: ["Desert landscapes", "Photography", "Slower travel"],
    eclipseBase: "tozeur",
    included: [
      "5 nights in a desert hotel or guesthouse, double or twin share",
      "Daily breakfast",
      "Return private transfers from Tozeur airport (TOE) where available",
      "Eclipse-morning 4x4 transfer to a verified desert viewing point",
      "ISO 12312-2 eclipse glasses for each traveller",
      "Guided Tozeur oasis and old-town walk",
      "Chott el Jerid excursion by 4x4",
      "Local trip coordination before arrival",
    ],
    excluded: [
      "International flights",
      "Travel insurance",
      "Lunches, drinks and personal spending",
      "Visa or entry fees",
      "Single supplement, room upgrades and optional add-ons",
      "Anything not listed as included",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Tozeur",
        body: "Transfer, check-in and an evening walk at the edge of the oasis.",
      },
      {
        day: 2,
        title: "Oasis and old town",
        body: "A guided walk through the palm groves, irrigation channels and brickwork lanes of Tozeur.",
      },
      {
        day: 3,
        title: "Chott el Jerid and eclipse briefing",
        body: "A 4x4 excursion onto the salt flats, returning for a practical briefing on the following morning.",
      },
      {
        day: 4,
        title: "Eclipse day",
        body: "Early 4x4 departure for an open desert viewing point. Totality from 10:06 to 10:08 local time.",
      },
      {
        day: 5,
        title: "Nefta and the palm groves",
        body: "A slower day toward Nefta, with time in the palm groves and the old town.",
      },
      {
        day: 6,
        title: "Departure",
        body: "Breakfast and transfer to Tozeur airport or onward by road.",
      },
    ],
    roomOptions: [
      {
        id: "standard",
        label: "Garden or oasis view",
        description: "Standard double or twin room, subject to hotel allocation.",
        priceDelta: 0,
      },
      {
        id: "suite",
        label: "Desert suite",
        description: "A larger room or suite, subject to availability.",
        priceDelta: 185,
      },
    ],
    addOns: [
      {
        id: "photography-clinic",
        label: "Desert photography clinic",
        description: "A small-group session on landscape and eclipse photography in hard desert light.",
        pricePerPerson: 120,
      },
      {
        id: "private-guide",
        label: "Private oasis guide",
        description: "A dedicated guide for the oasis, old town and Chott el Jerid.",
        pricePerPerson: 110,
      },
      {
        id: "star-dinner",
        label: "Private desert dinner",
        description: "A set dinner under the stars, weather and local permissions permitting.",
        pricePerPerson: 130,
      },
    ],
    isIllustrative: true,
  },
];

export function getPackage(slug: string): TravelPackage | undefined {
  return packages.find((item) => item.slug === slug);
}
