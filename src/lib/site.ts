export const site = {
  name: "Eclipse Tunisia",
  tagline: "Discover. Plan. Experience.",
  description:
    "Plan and book your total solar eclipse experience in Tunisia for the eclipse of 2 August 2027: verified viewing locations, real tourism experiences and trip planning in one place.",
  eventDate: "2 August 2027",
  copyrightYear: 2026,
  nasaEclipseUrl: "https://eclipse.gsfc.nasa.gov/",
} as const;

export const nav = [
  { href: "/explorer", label: "Eclipse Explorer" },
  { href: "/experiences", label: "Experiences" },
  { href: "/plan", label: "Plan My Trip" },
  { href: "/safety", label: "Viewing Safety" },
] as const;
