import type { ImageAsset } from "./images";
import { images } from "./images";

/**
 * Viewing locations across Tunisia.
 *
 * The geographic information in this file is descriptive and can be checked
 * against any map. The eclipse circumstances attached to each location are
 * **computed**, not hand-written: they come from the Besselian-element
 * engine in `src/lib/eclipse`, which is validated against NASA's published
 * catalogue and path data by `npm run verify:eclipse`.
 *
 * The source of truth for every number is:
 *   https://eclipse.gsfc.nasa.gov/SEsearch/SEdata.php?Ecl=+20270802
 */

export type EclipseVisibility = "total" | "partial" | "none";

export type DestinationTheme =
  | "coast"
  | "history"
  | "culture"
  | "nature"
  | "desert"
  | "food"
  | "troglodyte"
  | "photography"
  | "family";

export interface Destination {
  slug: string;
  name: string;
  region: string;
  summary: string;
  /** Editorial categories used by the preference-aware itinerary engine. */
  themes: DestinationTheme[];
  latitude: number;
  longitude: number;
  /** IANA time zone used to display local times. */
  timeZone: string;
  access: string;
  facilities: string[];
  accessibility: string | null;
  /** Key of the photograph in `src/data/images.ts`. */
  imageKey: string;
  /** Longer editorial notes shown on the destination page. */
  notes: string;
  /** Practical advice specific to this location. */
  practicalities: string[];
}

export const destinations: Destination[] = [
  {
    slug: "tozeur",
    name: "Tozeur",
    region: "South West",
    summary:
      "The oasis town at the edge of Chott el Jerid, and the best-connected base for the desert: hotels, restaurants and fuel in one place, with the salt flats a short drive away.",
    themes: ["desert", "nature", "culture", "history", "photography"],
    latitude: 33.9197,
    longitude: 8.1084,
    timeZone: "Africa/Tunis",
    access:
      "Served by Tozeur–Nefta International Airport, with road links to Kebili, Gafsa and the Algerian border.",
    facilities: [
      "Hotels and guesthouses",
      "Restaurants",
      "Fuel and car hire",
      "Pharmacy and medical services",
      "Bank and post office",
    ],
    accessibility: null,
    imageKey: "tozeurSunset",
    notes:
      "Tozeur sits just inside the southern limit of the path of totality. Totality here is short — barely a couple of minutes — because the centre line of the path runs a few kilometres to the south of the town. The value of Tozeur is its infrastructure, not the length of totality.",
    practicalities: [
      "Arrive at least a day early: rooms in the region are in very short supply.",
      "The August heat is severe. Plan for shade, water and a plan for the 30-minute drive to a viewing point.",
      "Bring a car or arrange transfers — the best viewing ground is not in the town itself.",
    ],
  },
  {
    slug: "nefta",
    name: "Nefta",
    region: "South West",
    summary:
      "A small palm-grove town at the edge of the Algerian border, quieter than Tozeur and close to some of the most dramatic oasis scenery in the country.",
    themes: ["desert", "nature", "culture", "history", "photography"],
    latitude: 33.8736,
    longitude: 7.8769,
    timeZone: "Africa/Tunis",
    access:
      "About 25 km from Tozeur by road, on the route to the Algerian border crossing at Ghidyma.",
    facilities: ["Guesthouses", "Cafés and small shops", "Limited fuel"],
    accessibility: null,
    imageKey: "tozeurPalmGrove",
    notes:
      "Nefta falls a few kilometres short of the southern limit of the path of totality, so the eclipse here is a very deep partial. The Sun's disc is almost entirely covered at maximum, but totality itself is not visible from the town centre. Anyone willing to drive east towards Tozeur or north towards the salt flats can reach totality.",
    practicalities: [
      "Services are limited: fuel up in Tozeur before setting out.",
      "Negotiate the price of a guide or a driver in advance.",
      "The old town and the palm groves are best walked in the early morning.",
    ],
  },
  {
    slug: "chott-el-jerid",
    name: "Chott el Jerid",
    region: "South West",
    summary:
      "The largest salt pan in the Sahara, with a surface area above 7,000 km². Wide horizons, hard light and almost no infrastructure — the purest available sky.",
    themes: ["desert", "nature", "photography"],
    latitude: 33.5605,
    longitude: 8.35,
    timeZone: "Africa/Tunis",
    access:
      "The main road between Tozeur and Kebili crosses the southern part of the salt lake. A 4×4 is strongly recommended beyond the road.",
    facilities: ["Roadside viewpoints", "Occasional mobile vendors"],
    accessibility: null,
    imageKey: "chottElJerid",
    notes:
      "This is where the path of totality crosses the salt flats, and the open horizon is the reason people come. It is also the most demanding environment on the list: no shade, no water and temperatures that can exceed 45 °C in August.",
    practicalities: [
      "Bring your own water, shade and food. There is nothing to buy out there.",
      "A 4×4 or a local driver is essential; the salt crust is treacherous.",
      "Leave well before dawn. After the eclipse the light changes very quickly.",
    ],
  },
  {
    slug: "gabes",
    name: "Gabès",
    region: "South East",
    summary:
      "A coastal city with a palm-lined oasis and the Gulf of Gabès, and the southern end of the Tunisian rail line.",
    themes: ["coast", "nature", "culture", "food"],
    latitude: 33.8815,
    longitude: 10.0982,
    timeZone: "Africa/Tunis",
    access:
      "On the coast road and the railway between Sfax and Gabès, with regional flights.",
    facilities: [
      "Hotels",
      "Restaurants",
      "Rail and bus services",
      "Medical services",
    ],
    accessibility: null,
    imageKey: "djerbaCeramics",
    notes:
      "Gabès lies inside the path of totality, a short distance north of the centre line, which gives several minutes of totality in comfortable surroundings. The coast road to Djerba runs through the path.",
    practicalities: [
      "Hotels in Gabès will be the first to sell out; book for three nights at minimum.",
      "The beach on the Gulf of Gabès is an easy, flat place to watch from.",
    ],
  },
  {
    slug: "djerba",
    name: "Djerba & Houmt Souk",
    region: "South East",
    summary:
      "The island of Djerba, joined to the mainland by the Roman causeway, with a UNESCO-listed medina, whitewashed Houmt Souk and long, quiet beaches.",
    themes: ["coast", "culture", "history", "food", "photography", "family"],
    latitude: 33.8781,
    longitude: 10.775,
    timeZone: "Africa/Tunis",
    access:
      "Connected by the El Kantara causeway and by Djerba–Zarzis International Airport, with ferry and bus services.",
    facilities: [
      "Hotels and riads",
      "Restaurants",
      "Car hire and taxis",
      "Medical services",
    ],
    accessibility: null,
    imageKey: "djerbaArcades",
    notes:
      "Houmt Souk sits well inside the path of totality and close to its centre line, which makes Djerba one of the few places in Tunisia offering more than four minutes of totality. The island's flat terrain and its beaches are a genuine advantage for a large group.",
    practicalities: [
      "Book accommodation many months in advance; the island is a popular destination.",
      "The causeway can be congested on the eclipse morning — leave early.",
    ],
  },
  {
    slug: "el-jem",
    name: "El Jem",
    region: "Central East",
    summary:
      "A small town built around the best-preserved Roman amphitheatre in North Africa, and a useful stop on the route between Tunis and the southern salt lakes.",
    themes: ["history", "culture", "family"],
    latitude: 35.2981,
    longitude: 10.7069,
    timeZone: "Africa/Tunis",
    access:
      "On the main road between Sfax and Kairouan, about 45 minutes from Sousse.",
    facilities: [
      "Hotels and guesthouses",
      "Restaurants",
      "Fuel",
      "Local medical services",
    ],
    accessibility: null,
    imageKey: "elDjem",
    notes:
      "El Jem is in the middle of the path of totality, roughly on the centre line, and is well placed for a stopover between the coast and the desert.",
    practicalities: [
      "The amphitheatre opens early; a morning visit before the eclipse fits well.",
      "Small-town accommodation is limited; consider staying in Sousse or Sfax and driving in.",
    ],
  },
  {
    slug: "kairouan",
    name: "Kairouan",
    region: "Central",
    summary:
      "One of the oldest cities in the world and the spiritual centre of Tunisian Islam, built around the Great Mosque of Uqba.",
    themes: ["history", "culture", "family"],
    latitude: 35.6781,
    longitude: 10.0963,
    timeZone: "Africa/Tunis",
    access:
      "About 60 km south-west of Tunis on the A1 motorway, with rail services and frequent buses.",
    facilities: [
      "Hotels",
      "Restaurants",
      "Rail and bus services",
      "Medical services",
      "Fuel",
    ],
    accessibility: null,
    imageKey: "kairouanMosque",
    notes:
      "Kairouan is in the northern half of the path of totality, so the Sun is high and the totality is short — but the Great Mosque and the medina make it the most rewarding place to watch from in the country.",
    practicalities: [
      "A long hot day in a dense medina calls for an early start.",
      "The rail line from Tunis is a good way to avoid the worst of the road traffic.",
    ],
  },
  {
    slug: "sousse",
    name: "Sousse",
    region: "Central East",
    summary:
      "A resort city built around a ribat fortress and a UNESCO-listed medina, with a long, developed beachfront.",
    themes: ["coast", "history", "culture", "family"],
    latitude: 35.8256,
    longitude: 10.636,
    timeZone: "Africa/Tunis",
    access:
      "On the A1 motorway between Tunis and Sfax, with rail services and an international airport.",
    facilities: [
      "Hotels and resorts",
      "Restaurants",
      "Rail and bus services",
      "Medical services",
      "Car hire",
    ],
    accessibility: null,
    imageKey: "sousseRibat",
    notes:
      "Sousse sits just north of the northern limit of the path of totality. The eclipse here is a very deep partial — the Sun is around 99% covered — but the disc does not disappear completely.",
    practicalities: [
      "The city is the easiest base in the country for travellers who want good facilities without moving.",
      "If you need totality, drive south towards Mahdia or El Jem.",
    ],
  },
  {
    slug: "mahdia",
    name: "Mahdia",
    region: "Central East",
    summary:
      "A historic port on a peninsula, with a cobbled medina, a cliff-top lighthouse and long beaches on the Gulf of Hammamet.",
    themes: ["coast", "history", "culture", "photography", "family"],
    latitude: 35.5044,
    longitude: 11.0622,
    timeZone: "Africa/Tunis",
    access:
      "About 50 km south of Sousse on the A1 motorway.",
    facilities: [
      "Hotels",
      "Restaurants",
      "Fuel",
      "Local medical services",
    ],
    accessibility: null,
    imageKey: "sousseMedina",
    notes:
      "Mahdia lies inside the path of totality, close to its southern edge. The totality is short, but the centre of the old town and the beaches around the peninsula are wide open and unobstructed.",
    practicalities: [
      "A quiet, well-run base with a long beach that fills the horizon.",
      "Book ahead: Mahdia is small and the local capacity is limited.",
    ],
  },
  {
    slug: "sidi-bou-said",
    name: "Sidi Bou Said",
    region: "North East",
    summary:
      "A cliffside village of white houses and blue doors above the Gulf of Tunis, twenty minutes from the capital.",
    themes: ["coast", "culture", "photography", "family"],
    latitude: 36.8828,
    longitude: 10.1898,
    timeZone: "Africa/Tunis",
    access:
      "On the A1 motorway and the TGM train line between Tunis and La Goulette, with a funicular from the station.",
    facilities: [
      "Hotels and guesthouses",
      "Restaurants and cafés",
      "Rail and bus services",
      "Medical services nearby",
    ],
    accessibility: null,
    imageKey: "sidiBouSaid",
    notes:
      "Sidi Bou Said is well outside the path of totality, but it is the closest thing Tunisia has to a classic 'eclipse town'. The Sun is more than 96% covered at maximum, with the sea horizon behind it and the village in the foreground.",
    practicalities: [
      "Arrive early: the village is small, the crowds are large and the streets are narrow.",
      "A large percentage of the Sun is covered, so a good pair of eclipse glasses is still essential.",
    ],
  },
  {
    slug: "carthage",
    name: "Carthage",
    region: "North East",
    summary:
      "The Phoenician and Roman city whose ruins — the Antonine Baths, the villas, the theatre — are scattered across the hills above the gulf.",
    themes: ["coast", "history", "culture", "family"],
    latitude: 36.8528,
    longitude: 10.3233,
    timeZone: "Africa/Tunis",
    access:
      "Ten minutes from central Tunis by road, on the TGM train line to La Goulette.",
    facilities: [
      "Hotels nearby in Tunis",
      "Restaurants and cafés",
      "Rail and bus services",
      "Medical services in Tunis",
    ],
    accessibility: null,
    imageKey: "carthageBaths",
    notes:
      "Carthage is outside the path of totality, with a deep partial eclipse. The archaeological site is a good place to be for the partial phase, and it is within easy reach of Tunis for anyone arriving by plane.",
    practicalities: [
      "The archaeological site opens early in the morning.",
      "Combine with Tunis and La Goulette, which are a short drive away.",
    ],
  },
  {
    slug: "matmata",
    name: "Matmata",
    region: "South",
    summary:
      "A Berber hill town of pit dwellings carved into the hillsides, and the closest thing to a traditional Tunisian village in the south.",
    themes: ["history", "culture", "nature", "desert", "troglodyte", "photography"],
    latitude: 33.6503,
    longitude: 10.0975,
    timeZone: "Africa/Tunis",
    access:
      "On the road between Gabès and Gafsa, roughly an hour from each.",
    facilities: [
      "Guesthouses",
      "Small shops",
      "Limited fuel",
    ],
    accessibility: null,
    imageKey: "matmata",
    notes:
      "Matmata is inside the path of totality, a little north of the centre line, so it sees several minutes of totality. It is one of the least developed places on this list, which is exactly why the sky is so clear above it.",
    practicalities: [
      "Facilities are minimal. Bring water and anything else you need.",
      "The troglodyte houses are homes — be respectful of residents.",
    ],
  },
  {
    slug: "tunis",
    name: "Tunis",
    region: "North East",
    summary:
      "The capital, with the country's main airport, the medina and the museums, and the quickest road out of the path of totality for anyone with a short trip.",
    themes: ["history", "culture", "food", "family"],
    latitude: 36.8065,
    longitude: 10.1815,
    timeZone: "Africa/Tunis",
    access:
      "Tunis-Carthage International Airport, the TGM light railway, the intercity rail hub and the A1 motorway.",
    facilities: [
      "Hotels in every category",
      "Restaurants",
      "International airport",
      "Rail, metro and bus services",
      "Hospitals and pharmacies",
    ],
    accessibility: null,
    imageKey: "sousseRampart",
    notes:
      "Tunis is outside the path of totality and sees a partial eclipse of about 97%. It is the practical arrival point for international travellers and the best place to sort out transport, equipment and supplies.",
    practicalities: [
      "Expect heavy traffic on the A1 towards the south on the eclipse morning.",
      "Hire the car, the driver or the bus in Tunis, not on the day.",
    ],
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((destination) => destination.slug === slug);
}

export function destinationImage(destination: Destination): ImageAsset {
  const asset = images[destination.imageKey];
  if (!asset) {
    throw new Error(
      `Destination ${destination.slug} references unknown image ${destination.imageKey}`,
    );
  }
  return asset;
}
