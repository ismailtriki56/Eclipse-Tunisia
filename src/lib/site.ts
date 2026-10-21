export const site = {
  name: "Eclipse Tunisia",
  tagline: "The 2027 total solar eclipse, from the Sahara to the Gulf of Tunis.",
  description:
    "Plan your total solar eclipse trip to Tunisia for 2 August 2027: verified viewing locations computed from NASA data, real experiences, and an itinerary builder.",
  eventDate: "2 August 2027",
  eventDateIso: "2027-08-02",
  /** The instant of greatest eclipse, in UTC. */
  greatestEclipseUtc: "2027-08-02T10:06:34Z",
  copyrightYear: 2026,
  nasaEclipseUrl: "https://eclipse.gsfc.nasa.gov/SEsearch/SEdata.php?Ecl=+20270802",
  nasaMapUrl:
    "https://eclipse.gsfc.nasa.gov/SEsearch/SEsearchmap.php?Ecl=20270802",
} as const;

export const nav = [
  { href: "/eclipse", label: "The Eclipse" },
  { href: "/explorer", label: "Explorer" },
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences", label: "Experiences" },
  { href: "/plan", label: "Plan" },
  { href: "/safety", label: "Safety" },
] as const;
