# Eclipse Tunisia

A trip discovery, planning and booking platform for the total solar eclipse of
2 August 2027 in Tunisia.

**Brand promise:** Discover. Plan. Experience.

## What this is

Eclipse Tunisia helps visitors decide where to travel to see totality, what
they will actually see and when, and how to organise transport, accommodation,
experiences and bookings — in one place.

The full product, design, engineering and business specification lives in
[`writing-block.md`](./writing-block.md). That document is the authoritative
reference for all work on this project.

## Current status

This is a working prototype, not a finished commercial product. What exists
today:

- A responsive homepage with brand identity, hero, interactive explorer
  preview, experiences, how-it-works, viewing safety and provider sections.
- A verified eclipse engine (`src/lib/eclipse`) that computes Besselian
  circumstances for Tunisian locations. `npm run verify:eclipse` passes 37
  checks against NASA GSFC published data.
- An Eclipse Explorer with an interactive **Leaflet + OpenStreetMap** map:
  totality band, centre line, limits, destination markers, search/filters and
  synchronised destination cards. The full location list remains usable if
  map tiles cannot load, and a visible error/retry state is shown.
- Destinations, explorer and experiences listing/detail pages. Experience
  inventory is clearly labelled **sample** data.
- An interactive itinerary planner (`/plan`) with add/delete/reorder stops,
  add/delete days, eclipse-day verification, themes/priority controls, local
  save/load, JSON/print export and an operator inquiry form (no fake bookings).
- A server-side Gemini itinerary endpoint (`/api/plan/generate`) with a
  deterministic fallback when `GEMINI_API_KEY` is not configured.
- A viewing safety guide and static policy/placeholder pages.

What does **not** exist yet (do not assume otherwise):

- A database, authentication, real provider inventory, payments or a real
  booking workflow.
- Authoritative provider partnerships — every listed experience is a sample.
- Production-grade map hosting: the app uses the public OpenStreetMap tile
  service, which is suitable for development and light traffic but not for a
  large-scale launch.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command                | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start the development server                 |
| `npm run build`        | Production build + standalone asset copy     |
| `npm run start`        | Serve the standalone build on port 3000      |
| `npm run lint`         | Run ESLint                                   |
| `npm run typecheck`    | Run the TypeScript compiler                  |
| `npm run verify:eclipse` | Validate the eclipse engine against NASA   |

The project uses `output: "standalone"`. `npm run build` runs
`scripts/prepare-standalone.mjs` automatically, which copies `.next/static`
and `public/` into `.next/standalone/`. Without those copies the server
returns the HTML shell but every `/_next/static/*.js` request 404s, so client
components never hydrate (the map spinner never clears and planner buttons do
nothing). Use `npm start` or `node .next/standalone/server.js`; plain
`next start` is incompatible with standalone output.

## Configuration

Copy `.env.example` to `.env.local` and fill in real values when integrations
are added. Never commit `.env.local` or real credentials. No secrets are
required to run the current foundation.

## Data and trust

- Eclipse circumstances are computed from NASA Besselian elements rather than
  hardcoded, and are checked by `npm run verify:eclipse`. See
  [`docs/eclipse-data.md`](./docs/eclipse-data.md) and
  [`docs/PROGRESS.md`](./docs/PROGRESS.md).
- Sample listings are labelled "Sample" in the interface and are not real
  providers. The inquiry form records a local prototype request; it does not
  transmit a real booking or take payment.
- Destination photographs are credited to their Wikimedia Commons sources in
  the interface.

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Leaflet with
OpenStreetMap raster tiles, `@google/genai` (server-side only). `maplibre-gl`
is still declared as a dependency but is no longer used by the map component.
