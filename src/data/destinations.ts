export type EclipseVisibility = "total" | "partial";

export interface EclipseCircumstances {
  /** Local time ISO-8601 with offset, e.g. "2027-08-02T10:12:00+01:00". */
  firstContact: string | null;
  secondContact: string | null;
  maximum: string | null;
  thirdContact: string | null;
  fourthContact: string | null;
  /** Seconds of totality, or null when totality does not occur. */
  totalitySeconds: number | null;
  /** IANA time zone used for display at this location. */
  timeZone: string;
}

export interface Destination {
  slug: string;
  name: string;
  region: string;
  summary: string;
  latitude: number;
  longitude: number;
  visibility: EclipseVisibility;
  circumstances: EclipseCircumstances;
  access: string;
  facilities: string[];
  accessibility: string | null;
  sourceUrl: string;
  verifiedOn: string;
  notes: string;
  imageAlt: string;
}

/**
 * Eclipse circumstances below are illustrative placeholders pending
 * verification against NASA GSFC eclipse data (https://eclipse.gsfc.nasa.gov/).
 * Do NOT present these as authoritative. See docs/eclipse-data.md.
 */
export const destinations: Destination[] = [
  {
    slug: "tozeur",
    name: "Tozeur",
    region: "South West",
    summary:
      "An oasis town on the edge of the Chott el Jerid, well connected and a common base for desert excursions.",
    latitude: 33.9197,
    longitude: 8.1335,
    visibility: "total",
    circumstances: {
      firstContact: "2027-08-02T09:53:00+01:00",
      secondContact: "2027-08-02T11:07:00+01:00",
      maximum: "2027-08-02T11:09:00+01:00",
      thirdContact: "2027-08-02T11:11:00+01:00",
      fourthContact: "2027-08-02T12:25:00+01:00",
      totalitySeconds: 240,
      timeZone: "Africa/Tunis",
    },
    access: "Reachable by road and by air through Tozeur–Nefta International Airport.",
    facilities: ["Hotels", "Restaurants", "Fuel", "Medical services"],
    accessibility: null,
    sourceUrl: "https://eclipse.gsfc.nasa.gov/SEsearch/SEsearchmap.php?Ecl=20270802",
    verifiedOn: "2026-01-15",
    notes:
      "Sample record for development. Confirm exact circumstances against the official NASA data before publishing.",
    imageAlt: "Desert oasis and palm groves near Tozeur, Tunisia",
  },
  {
    slug: "nefta",
    name: "Nefta",
    region: "South West",
    summary:
      "A smaller oasis town close to the Algerian border, quieter than Tozeur and often used as an excursion stop.",
    latitude: 33.8736,
    longitude: 7.8769,
    visibility: "total",
    circumstances: {
      firstContact: "2027-08-02T09:52:00+01:00",
      secondContact: "2027-08-02T11:06:00+01:00",
      maximum: "2027-08-02T11:08:00+01:00",
      thirdContact: "2027-08-02T11:10:00+01:00",
      fourthContact: "2027-08-02T12:24:00+01:00",
      totalitySeconds: 225,
      timeZone: "Africa/Tunis",
    },
    access: "Approximately 25 km from Tozeur by road.",
    facilities: ["Guesthouses", "Cafés"],
    accessibility: null,
    sourceUrl: "https://eclipse.gsfc.nasa.gov/SEsearch/SEsearchmap.php?Ecl=20270802",
    verifiedOn: "2026-01-15",
    notes:
      "Sample record for development. Confirm exact circumstances against the official NASA data before publishing.",
    imageAlt: "Traditional architecture in the oasis town of Nefta",
  },
  {
    slug: "chott-el-jerid",
    name: "Chott el Jerid",
    region: "South West",
    summary:
      "A large salt lake with wide open horizons, offering unobstructed views but little shelter or infrastructure.",
    latitude: 33.7,
    longitude: 8.4,
    visibility: "total",
    circumstances: {
      firstContact: "2027-08-02T09:54:00+01:00",
      secondContact: "2027-08-02T11:07:00+01:00",
      maximum: "2027-08-02T11:09:00+01:00",
      thirdContact: "2027-08-02T11:11:00+01:00",
      fourthContact: "2027-08-02T12:25:00+01:00",
      totalitySeconds: 235,
      timeZone: "Africa/Tunis",
    },
    access: "Crossed by the main road between Tozeur and Kebili.",
    facilities: ["Viewpoints"],
    accessibility: null,
    sourceUrl: "https://eclipse.gsfc.nasa.gov/SEsearch/SEsearchmap.php?Ecl=20270802",
    verifiedOn: "2026-01-15",
    notes:
      "Sample record for development. High heat, glare and lack of shade require careful planning.",
    imageAlt: "Salt flats of Chott el Jerid at sunset",
  },
  {
    slug: "gabes",
    name: "Gabès",
    region: "South East",
    summary:
      "A coastal city with an oasis by the sea, offering a humid alternative to the inland desert plains.",
    latitude: 33.8815,
    longitude: 10.0982,
    visibility: "partial",
    circumstances: {
      firstContact: "2027-08-02T09:57:00+01:00",
      secondContact: null,
      maximum: "2027-08-02T11:11:00+01:00",
      thirdContact: null,
      fourthContact: "2027-08-02T12:28:00+01:00",
      totalitySeconds: null,
      timeZone: "Africa/Tunis",
    },
    access: "Reachable by road, rail and bus along the coastal corridor.",
    facilities: ["Hotels", "Restaurants", "Rail", "Medical services"],
    accessibility: null,
    sourceUrl: "https://eclipse.gsfc.nasa.gov/SEsearch/SEsearchmap.php?Ecl=20270802",
    verifiedOn: "2026-01-15",
    notes:
      "Sample record for development. Gabès lies outside the path of totality and will experience a partial eclipse.",
    imageAlt: "Coastal oasis and seafront at Gabès",
  },
  {
    slug: "tunis",
    name: "Tunis",
    region: "North East",
    summary:
      "The capital, with the country's largest transport hub, museums and the nearby ruins of Carthage.",
    latitude: 36.8065,
    longitude: 10.1815,
    visibility: "partial",
    circumstances: {
      firstContact: "2027-08-02T10:00:00+01:00",
      secondContact: null,
      maximum: "2027-08-02T11:14:00+01:00",
      thirdContact: null,
      fourthContact: "2027-08-02T12:30:00+01:00",
      totalitySeconds: null,
      timeZone: "Africa/Tunis",
    },
    access: "International airport, rail, metro and road connections.",
    facilities: ["Hotels", "Restaurants", "Airport", "Rail", "Medical services"],
    accessibility: null,
    sourceUrl: "https://eclipse.gsfc.nasa.gov/SEsearch/SEsearchmap.php?Ecl=20270802",
    verifiedOn: "2026-01-15",
    notes:
      "Sample record for development. Tunis is outside the path of totality.",
    imageAlt: "Medina rooftops and cityscape of Tunis",
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
