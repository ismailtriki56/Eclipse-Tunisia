export interface Airport {
  iata: string;
  name: string;
  city: string;
  role: string;
  bestFor: string;
  note: string;
  searchUrl: string;
}

export interface FlightSearchInput {
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string;
  travellers: number;
}

const dateLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));

export function flightSearchUrl(input: FlightSearchInput): string {
  const origin = input.origin.trim().toUpperCase() || "LHR";
  const destination = input.destination.trim().toUpperCase() || "TUN";
  const query = `Flights from ${origin} to ${destination} on ${dateLabel(input.departDate)} through ${dateLabel(input.returnDate)} for ${input.travellers} traveller${input.travellers === 1 ? "" : "s"}`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
}

export function timetableUrl(origin: string, destination: string): string {
  const from = origin.trim().toUpperCase() || "LHR";
  const to = destination.trim().toUpperCase() || "TUN";
  return `https://www.flightconnections.com/flights-from-${encodeURIComponent(from)}-to-${encodeURIComponent(to)}`;
}

export const airports: Airport[] = [
  {
    iata: "TUN",
    name: "Tunis–Carthage International Airport",
    city: "Tunis",
    role: "Primary international gateway",
    bestFor: "Year-round arrivals and the northern coast",
    note: "The capital's main airport, with the widest choice of onward road and rail connections.",
    searchUrl:
      "https://www.google.com/travel/flights?q=Flights%20to%20TUN%20for%20August%202027",
  },
  {
    iata: "MIR",
    name: "Monastir Habib Bourguiba International Airport",
    city: "Monastir",
    role: "Closest gateway to Mahdia",
    bestFor: "Mahdia, Sousse and the central coast",
    note: "The practical arrival point for a Mahdia package: the transfer is much shorter than from Tunis.",
    searchUrl:
      "https://www.google.com/travel/flights?q=Flights%20to%20MIR%20for%20August%202027",
  },
  {
    iata: "NBE",
    name: "Enfidha–Hammamet International Airport",
    city: "Enfidha",
    role: "Central coast gateway",
    bestFor: "Sousse, Hammamet and the A1 corridor",
    note: "A modern airport serving the central coast, with direct access to the motorway network.",
    searchUrl:
      "https://www.google.com/travel/flights?q=Flights%20to%20NBE%20for%20August%202027",
  },
  {
    iata: "DJE",
    name: "Djerba–Zarzis International Airport",
    city: "Djerba",
    role: "Southern island gateway",
    bestFor: "Djerba, Gabès and the south-east",
    note: "The most direct arrival point for Djerba, where our verified island locations see 4 minutes 37 seconds of totality.",
    searchUrl:
      "https://www.google.com/travel/flights?q=Flights%20to%20DJE%20for%20August%202027",
  },
  {
    iata: "TOE",
    name: "Tozeur–Nefta International Airport",
    city: "Tozeur",
    role: "Desert gateway",
    bestFor: "Tozeur, Nefta and Chott el Jerid",
    note: "A smaller airport with limited service. Check current routes before building a desert itinerary around it.",
    searchUrl:
      "https://www.google.com/travel/flights?q=Flights%20to%20TOE%20for%20August%202027",
  },
  {
    iata: "SFA",
    name: "Sfax–Thyna International Airport",
    city: "Sfax",
    role: "Central-east gateway",
    bestFor: "Sfax, Kerkennah and the central coast",
    note: "A useful alternative for the central coast, with fewer international connections than Tunis.",
    searchUrl:
      "https://www.google.com/travel/flights?q=Flights%20to%20SFA%20for%20August%202027",
  },
  {
    iata: "GAE",
    name: "Gabès–Matmata International Airport",
    city: "Gabès",
    role: "Southern alternative",
    bestFor: "Gabès, Matmata and the southern coast",
    note: "A small regional airport. Confirm schedules before relying on it for an eclipse arrival.",
    searchUrl:
      "https://www.google.com/travel/flights?q=Flights%20to%20GAE%20for%20August%202027",
  },
];

export const commonOrigins = [
  { iata: "LHR", city: "London Heathrow" },
  { iata: "LGW", city: "London Gatwick" },
  { iata: "CDG", city: "Paris Charles de Gaulle" },
  { iata: "ORY", city: "Paris Orly" },
  { iata: "FRA", city: "Frankfurt" },
  { iata: "FCO", city: "Rome Fiumicino" },
  { iata: "MAD", city: "Madrid" },
  { iata: "AMS", city: "Amsterdam" },
  { iata: "IST", city: "Istanbul" },
  { iata: "DXB", city: "Dubai" },
  { iata: "JFK", city: "New York JFK" },
  { iata: "YUL", city: "Montréal" },
];
