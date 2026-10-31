# Eclipse Tunisia — Progress Tracking

## Itinerary Preference Matching & Vercel Prep (current session)

### Root cause

- `src/app/api/plan/generate/route.ts` did not use the selected interests to
  choose destinations. Its fallback produced a fixed day-by-day template, so
  Coastal could still return Kairouan, Chott el Jerid, or Matmata.
- Several UI interests were ignored entirely: `nature` was not a selectable
  UI option, while `troglodyte`, `totality`, `astronomy`, and `photography`
  had no destination metadata or ranking effect.
- The Gemini path sent the entire catalogue and prose interests without a
  validated shortlist. The client received `isFallback` but never displayed it.
- A rotation bug in `src/lib/itinerary/recommend.ts` could place the wrong
  destination on 2 August 2027. A "partial" eclipse priority could therefore
  show a total-eclipse location on eclipse day. This is now fixed and covered
  by tests.

### Changes made

- `src/data/destinations.ts`: added a required `themes` array to every one of
  the 13 destinations (`coast`, `history`, `nature`, `culture`, `desert`,
  `family`, `food`, `troglodyte`, `photography`).
- Added the shared itinerary engine:
  - `src/lib/itinerary/types.ts` — preference, recommendation, plan and API
    outcome types.
  - `src/lib/itinerary/dates.ts` — date ranges and the fixed eclipse date.
  - `src/lib/itinerary/metadata.ts` — interest aliases, labels, family/theme
    helpers.
  - `src/lib/itinerary/recommend.ts` — preference filtering, eclipse
    eligibility, theme balancing, geographic ordering and transparent warnings.
  - `src/lib/itinerary/plan-builder.ts` — verified activities and computed
    eclipse contact times; no invented timings.
  - `src/lib/itinerary/service.ts` — Gemini ordering of a validated shortlist,
    response validation, and local fallback.
- `src/app/api/plan/generate/route.ts`: now a thin validated API wrapper around
  the service. `GEMINI_API_KEY` is read only on the server.
- `src/components/plan/itinerary-planner.tsx`: added History and Nature theme
  controls, renamed the theme labels, removed the two non-destination theme
  buttons (`totality`, `astronomy`), and displays API notices/warnings. Eclipse
  viewing stays controlled by the dedicated Eclipse Viewing Priority setting.
- `tests/itinerary.test.ts` (new): 13 preference, eclipse-priority, fallback and
  Gemini-validation tests.
- `package.json`: added `npm test`.
- `next.config.ts`: enables `output: "standalone"` locally but not on Vercel.
- `scripts/prepare-standalone.mjs`: skips safely on Vercel or when standalone
  output is disabled.
- `.env.example`: documents only the optional `GEMINI_API_KEY`; removed unused
  platform/Supabase placeholders.

### What the planner now does

- Coastal, History, Nature, Culture, Desert, and the other themes are matched
  from structured destination data, not guessed from prose.
- If there are not enough matches, the API returns a clear warning and labels
  the extra stops as alternatives. It does not silently swap in unrelated
  destinations.
- Legacy eclipse/astronomy interest values are no longer silent no-ops: they
  produce a warning explaining that Eclipse Viewing Priority controls this.
- Eclipse priority is explicit: `totality` requires a total-eclipse location,
  `partial` requires a partial location, and `flexible` accepts either.
- Gemini may only reorder a validated shortlist. Unknown destinations, missing
  dates, repeated dates, or an eclipse day that violates the selected priority
  are rejected, and the local engine is used instead.
- Local fallback notices explain why Gemini was not used and confirm that the
  selected preferences were still applied.

### Verification performed

- `npm test`: **13/13 passed**.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npm run verify:eclipse`: **37/37 checks passed**.
- `npm run build`: pass; standalone assets copied for local `npm start`.
- `VERCEL=1 npm run build`: pass; prepare script skipped as intended.
- Production standalone API smoke test without a key:
  `POST /api/plan/generate` returned `200`, `generationMethod: "local"`,
  five unique coastal stops, and Mahdia (total eclipse) on 2 August 2027.
- Not verified: a live Gemini call (no real API key in this workspace) and a
  full browser click-through after the UI label changes. Gemini success,
  failure, and rejection paths are covered with mocked clients; the UI/build
  compiles successfully.

### Environment and deployment

- `GEMINI_API_KEY` is the only application environment variable. It is
  optional; without it the local engine runs.
- Keep it server-side. Never expose it with a `NEXT_PUBLIC_` prefix.
- Vercel: import the repository, optionally add `GEMINI_API_KEY`, and deploy.
  Vercel uses its own build output; the local standalone copy is disabled
  automatically.
- Local production: `npm run build` then `npm start` (runs
  `.next/standalone/server.js`).

## Map Failure Diagnosis & Fix (previous session)

### Root cause

The map component was not failing in development. In a real browser it
initialised Leaflet, rendered 16 OpenStreetMap tiles and 13 destination
markers. The stuck-loading screen reproduced only in the **production
standalone deployment**:

- `next.config.ts` sets `output: "standalone"`.
- `npm start` was `next start`, which refuses to run with standalone output.
- Running `.next/standalone/server.js` directly returned the HTML page with
  `200`, but every `/_next/static/*.js` request returned `404`. Next.js does
  not copy `.next/static` or `public/` into `.next/standalone/` automatically.
- With no client bundle, the server-rendered "Loading 2027 Eclipse Geospatial
  Map…" overlay never clears, and every client-side control (map + planner) is
  inert. This matches the reported combination of a stuck map and dead
  Add/Delete/Generate/Save controls.

A second, independent click-target bug was found: `DestinationCard` used a
stretched link (`after:absolute after:inset-0`) without a positioned ancestor.
On `/explorer`, the Tunis card's overlay escaped its card and intercepted
pointer events over the toolbar, making the map/grid toggle unclickable.

### Changes made

- `package.json`: added a `postbuild` step and changed `start` to run the
  standalone server.
- `scripts/prepare-standalone.mjs` (new): copies `.next/static` and `public/`
  into `.next/standalone/` after every build.
- `src/components/map/interactive-map.tsx`:
  - Spinner now clears only after the first real map tile renders.
  - 10-second tile watchdog shows a visible OpenStreetMap error with a Retry
    button if every tile request fails.
  - 8-second init watchdog prevents an indefinite loading screen if Leaflet
    itself never initialises.
  - Retry resets tile counters and rebuilds the map cleanly.
  - Timers and layer/marker refs are cleared on unmount.
  - Popups are reopened after the marker layer is rebuilt on selection.
- `src/components/explorer/explorer-view.tsx`: toolbar raised above cards
  (`relative z-10`).
- `src/components/destination-card.tsx`: card is now a positioned stacking
  context (`relative z-0`) so its stretched link stays inside the card.

### Verification performed

- `npm run typecheck`, `npm run lint`, `npm run build`: pass.
- `npm run verify:eclipse`: 37/37 checks pass.
- Production standalone build tested in headless Chrome:
  - `/explorer`: 580 px map, 16 tiles loaded, 13 markers, OSM attribution,
    no spinner and no error. Zoom changed tiles from z7 to z8.
  - Dragging changed `.leaflet-map-pane` transform and tile set.
  - Sidebar selection switched the active destination to Djerba and opened
    its popup; clicking the Matmata marker selected Matmata and opened its
    popup.
  - Grid ↔ map toggle remounted exactly one map with no console errors.
  - Homepage embedded map loaded correctly.
  - Tile failure: blocking `tile.openstreetmap.org` showed the visible error
    and Retry after ~9.4 s, hid the spinner, and kept the destination list
    usable. Unblocking and clicking Retry recovered to 16 tiles.
- Planner tested against the same production build:
  - Add Day: 5 → 6 days.
  - Add Stop: 3 → 4 stops.
  - Delete Stop: 4 → 3 stops.
  - Eclipse Viewing Priority: Partial selected and its hint updated.
  - Expedition Highlights & Themes: theme toggled.
  - Save Itinerary: wrote a saved trip to `localStorage`.
  - Generate Itinerary: API returned `200` and replaced the plan.
  - Delete Day: 6 → 5 days.
  - No page errors during these interactions.

### Remaining limitations

- Browser verification used temporary Playwright scripts outside the
  repository; there is no committed end-to-end test suite yet.
- Public OpenStreetMap tiles are appropriate for development and light
  traffic but not for launch-scale usage; use a commercial or self-hosted
  tile provider before launch.
- `maplibre-gl` remains declared in `package.json` but is no longer used by
  the map.
- No database, authentication, payments or real provider inventory exists.
  Booking/inquiry submissions are local prototype records only.

## Audit & Verification Baseline
- **Original Repo**: https://github.com/ismailtriki56/Eclipse-Tunisia
- **Framework**: Next.js 16.4.2 (App Router), React 19.3.0, Tailwind CSS v4, TypeScript 5
- **Dependencies Installed**:
  - `@google/genai`: Official SDK for server-side Gemini AI assistant
  - `lucide-react`: Standard icon library
  - `maplibre-gl`: Interactive map rendering engine

## Completed Work (Phases 1 through 7)

### 1. Interactive Map Engine (`src/components/map/interactive-map.tsx`)
- Fully interactive MapLibre GL map with Carto Voyager vector style and OpenStreetMap raster fallback.
- Exact NASA totality path overlay rendered using GeoJSON:
  - Totality band polygon fill (`#e9b64d` with 0.22 opacity)
  - Center line (`#0d1826` high-contrast track)
  - Northern & Southern limit lines (dashed gold boundary)
- Interactive glowing markers for every destination in Tunisia.
- Synchronization between map pins and destination directory: clicking a marker zooms/pans to location, highlights card, and updates circumstances.
- Filter toolbar: All, Totality Only, Partial, Desert Oasis, Coast, Cultural/Roman.
- Layer toggle to turn on/off the totality path overlay and reset view to Whole Tunisia.
- Mobile touch support and graceful WebGL error handling.

### 2. Eclipse Astronomical Science Page (`src/app/eclipse/page.tsx`)
- Created the dedicated astronomical guide page (fixed the broken `/eclipse` header navigation link).
- Features key astronomical metrics (6m 23s maximum totality, magnitude 1.052, 258 km path width, >95% August clear sky rate).
- In-depth explanation of Saros cycle 136, perigee/aphelion celestial mechanics, and why this is the "Eclipse of the Century".
- Detailed climatology analysis of southern Tunisia's sub-5% cloud probability.
- Side-by-side comparison between 100% Totality vs. 99% Partial eclipse.
- Embedded interactive MapLibre GL map preview.
- Direct citations and outbound links to NASA GSFC Catalogue and Five Millennium Canon of Solar Eclipses.

### 3. Functional Itinerary Planner (`src/app/plan/page.tsx`, `src/components/plan/itinerary-planner.tsx`)
- Replaced placeholder page with a complete client-side itinerary planner.
- Multi-day trip structure with custom duration, pre-configured around the 2 August 2027 eclipse.
- Day 3 (August 2, 2027) Totality Verification Check:
  - Analyzes the scheduled base location and mathematically verifies if it lies in the path of totality.
  - Displays duration of darkness (e.g., "Tozeur · 2m 04s at 11:05 local time") or displays a clear warning if outside the path.
- Add, reorder (Move Up/Down), and delete activities.
- Modal to add activities directly from the destination directory, bookable experiences, or custom items.
- "Save in Browser" button storing itinerary persistently in `localStorage` (`eclipse_tunisia_itinerary_v2`).
- "Print / PDF" export button for clean offline summaries.
- Pre-population support via URL parameter `?addDest=<slug>` with interactive confirmation.

### 4. Server-Side Gemini AI Travel Assistant (`src/app/api/plan/generate/route.ts`)
- Next.js API route using `@google/genai` with model `gemini-3.8-flash`.
- Telemetry configured with User-Agent `aistudio-build`.
- System instructions strictly grounded in real Tunisian destinations and NASA eclipse circumstances.
- Enforces astronomical constraint: user MUST be in a totality location on 2 August 2027 morning.
- Built-in fallback system: If `GEMINI_API_KEY` is not configured, provides a curated 5-day expedition plan and presents clear instructions on adding the key in AI Studio Secrets panel.
- "Generate Custom Itinerary" button directly applies the generated itinerary into the interactive planner editor.

### 5. Destinations & Experiences Enhancements
- Created `DestinationsView` (`src/components/destinations/destinations-view.tsx`) with search, region filter tabs, and totality filter.
- Created `ExperienceCatalog` (`src/components/experiences/experience-catalog.tsx`) with category tabs (Eclipse Viewing, Culture, Transfers, Food) and search.
- Built `BookingRequestCard` (`src/components/experiences/booking-request-card.tsx`) with real booking request forms, date selection, party size, and transparent prototype notices.
- Updated `ExplorerPreview` on homepage (`src/components/home/explorer-preview.tsx`) with an interactive Map vs. Card Grid switcher.

### 6. Tests & Build Verification
- `npm run verify:eclipse`: All 37 checks passed (NASA GSFC greatest eclipse, Besselian polynomial path limits, contact ordering C1 ≤ C2 ≤ Mid ≤ C3 ≤ C4).
- `compile_applet`: Production build succeeded.
- `lint_applet`: ESLint passed with 0 errors and 0 warnings.

## Remaining & Future Work (Phases 8-9)
- Real backend database (PostgreSQL via Cloud SQL) for persistent user accounts and saved trips.
- Authentic provider onboarding portal (`/providers`) for local Tunisian guides and 4x4 drivers.
- Secure payment gateway integration for real bookings.
- Committed end-to-end browser tests for the map and itinerary planner.
- Replace public OSM tiles with a production tile provider before launch.

## Exact Next Task
- Review the uncommitted itinerary-preference changes, then run a browser
  click-through of `/plan` with History/Nature selected if visual confirmation
  is required. A real Gemini call still needs a valid `GEMINI_API_KEY`.
- After approval, deploy to Vercel and spot-check the API. Do not push or
  deploy without explicit permission.
- Later: review the remaining placeholder pages (`/about`, `/contact`,
  `/providers`, `/privacy`, `/terms`) and decide whether to add a provider
  onboarding flow or a database-backed saved-trip store.

## 2026 Redesign — Phase 0 (baseline)

- Audited routes, i18n, data files, map and CTA surfaces. Full notes in
  `docs/PLAN.md`.
- Baseline `npm run build` passes: 56 pages, `/api/plan/generate` dynamic.
  Log: `docs/build-baseline.log`.
- Decision: move all pages under `/[locale]`, add middleware redirects, and
  keep `api` outside the locale segment.
- Assumption: secondary editorial pages remain English this pass; primary
  surfaces are fully translated. Recorded in `docs/PLAN.md`.

## 2026 Redesign — Phase 1 (i18n, enquiry, validation)

- Moved every page under `src/app/[locale]`; `src/proxy.ts` now handles locale
  redirects (Next 16 replacement for `middleware.ts`).
- Added `LanguageProvider`/`useLanguage`, `getDictionary`, cookie
  `NEXT_LOCALE`, and a client language switcher with `aria-pressed` state.
- Rewrote `en`, `fr` and `ar` dictionaries as clean UTF-8 with matching keys
  (291 each). Arabic renders RTL via the locale layout.
- Home rebuilt from localized sections: hero, stats band, partners strip,
  featured packages, path table, travel tools, safety banner and countdown.
- Rebuilt package cards and package detail pages with illustrative-price
  notices, availability badges, waitlist mode and a localized `QuoteForm`.
- Added `POST /api/enquiry` with validation, a honeypot, optional Resend
  delivery and console logging when email is not configured.
- Removed the AI planner and `@google/genai`; `/plan` is now a localized
  enquiry page. `package.json` scripts now include `i18n:check` and
  `test:links`.
- Added Sfax and Kerkennah destinations plus three packages: day-trip
  `eclipse-breakfast`, `sfax-signature` and `kerkennah-island-escape`.
- Verified: `npm run i18n:check` (291 keys), `npm run typecheck`, `npm run
  lint`, `npm test` (6/6), `npm run verify:eclipse` (37 checks), `npm run
  build` (200 pages) and `npm run test:links` (57 routes).
- Remaining: translate the secondary editorial pages and the stays directory,
  clean remaining mojibake in `src/data/flights.ts` and
  `src/data/destinations.ts`, and harden the map with a tile-error fallback.

## 2026 Redesign — Phase 2 (data correctness & map polish)

- Confirmed there is no remaining mojibake: `config.ts`, `fr.ts`,
  `flights.ts` and `experiences.ts` are clean UTF-8 (0 replacement characters).
- Added `images.eclipseHero` pointing at the local
  `public/hero/eclipse.jpg` (Wikimedia Commons, CC BY 4.0, Brucewaters) and
  switched the homepage hero to it. The hero now renders its required credit.
- `StatsBand` derives the greatest-eclipse clock from
  `eclipseFacts.greatestEclipseLocal`; removed the duplicated hardcoded time
  from the `en`/`fr`/`ar` `stats.greatestLabel` values.
- Removed hardcoded eclipse timings from package summaries and itineraries
  (`mahdia-signature`, `djerba-total-totality`, `sahara-eclipse-oasis`).
  Contact times stay computed through `circumstancesFor` and are shown on the
  package page.
- Replaced remaining hardcoded times in `/eclipse` and `/explorer` with
  `eclipseFacts` and computed durations; removed the hardcoded 4m37s from the
  Djerba airport note.
- Map: wired every label to the existing `t.map` dictionary (loading, error,
  controls, legend, filters, search, sidebar, buttons), made destination and
  plan links locale-aware, classified Sfax and Kerkennah as coast, derived the
  legend duration from computed circumstances, removed the `11:05` fallback,
  added an empty-filter message and set RTL direction inside Arabic popups.
- Verified: `npm run typecheck`, `npm run lint`, `npm run i18n:check` (291
  keys), `npm test` (6/6) and `npm run build` (200 pages).
- Remaining: destination names/regions and editorial summaries in the map and
  destination pages are still English data; package itinerary, included and
  excluded lists still render from English data; secondary editorial pages and
  the stays directory are not yet translated.

## 2026 Redesign — Phase 3 (verified stays directory)

- Extended `Stay` with `stars`, `amenities`, `photoKeys` and added four verified
  properties: Radisson Hotel Sfax, Borj Dhiafa (Sfax), Cercina Hotel and Beit
  El Ezz (Kerkennah). Every entry links to an official site.
- Added local Iberostar photos to `src/data/images.ts`
  (`iberostarRoyalElMansourExterior`, `iberostarRoyalElMansourGrounds`,
  CC BY 2.0, Sharon Hahn Darlin) with required attribution.
- Rebuilt `StaysDirectory` around `t.stays`: localized filters, counts, compare
  panel and card chrome, star/guesthouse labels, amenity labels, official-site
  and rate-search actions, photo or “photo coming soon” placeholder, and the
  per-hotel eclipse note from `hotelText`.
- Added `stayAmenities` and new `stays` keys to `en`, `fr` and `ar`; added
  eclipse notes for the four new properties.
- Verified: `npm run typecheck`, `npm run lint`, `npm run i18n:check` (333
  keys), `npm test` (6/6) and `npm run build` (200 pages).
- Remaining: hotel summaries, settings, characters, highlights and best-for
  lists are still English data; only the Iberostar has licensed photos. The
  package itinerary/included/excluded lists, destination editorial data and
  secondary editorial pages are still English.

## 2026 Redesign — Phase 4 (localized package detail)

- Added a `packageDetail` dictionary section (en/fr/ar) covering every package:
  area, best-for list, included and excluded lists, day-by-day itinerary, and
  the three `eclipse-breakfast` variants.
- Package detail and package listing pages now read those fields with the
  English data as fallback, so itinerary copy, inclusions, exclusions, areas,
  best-for labels and variant descriptions all switch with the locale.
- Verified: `npm run typecheck`, `npm run lint`, `npm run i18n:check` (369
  keys), `npm test` (6/6) and `npm run build` (200 pages).
- Remaining: destination names, regions and editorial summaries are still
  English data; hotel summaries, settings, characters, highlights and best-for
  lists are still English data; only the Iberostar has licensed photos; the
  secondary editorial pages remain English.

## 2026 Redesign — Phase 5 (localized hotel copy)

- Added a `hotelDetail` dictionary section (en/fr/ar) for all 11 properties:
  setting, character, summary, highlights and best-for list.
- `StaysDirectory` now renders localized hotel copy in cards and the compare
  table, falling back to `src/data/stays.ts`. Package detail hotel lists use the
  localized character line too.
- Verified: `npm run typecheck`, `npm run lint`, `npm run i18n:check` (424
  keys), `npm test` (6/6) and `npm run build` (200 pages). Confirmed 0
  replacement characters in all three locale files.
- Remaining: destination names, regions and editorial summaries are still
  English data; only the Iberostar has licensed photos; the secondary editorial
  pages remain English.

## 2026 Redesign — Phase 6a (localized destination names and summaries)

- Added a `destinationText` dictionary section (en/fr/ar) with name, region and
  summary for all 15 destinations, plus `destinations` and `explorer` page copy.
- Added `src/lib/destination-text.ts` with an English-data fallback and wired it
  into destination cards, the destinations and explorer indexes and detail
  pages, the map popups/sidebar, the home path table, package hotel lists,
  experience cards and the eclipse table.
- Search and region filters now match localized names, regions and summaries.
- Verified: `npm run typecheck`, `npm run lint`, `npm run i18n:check` (502
  keys), `npm test` (6/6) and `npm run build` (200 pages). Confirmed 0
  replacement characters in all three locale files.
- Remaining: destination access, facilities, notes and practicalities are still
  English; only the Iberostar has licensed photos; secondary editorial pages
  remain English.

## 2026 Redesign — Phase 6b (localized destination detail content)

- Added `destinationDetail` (access, facilities, notes, practicalities) for all
  15 destinations in en/fr/ar, plus a shared `facilityText` map and a
  `destinationPage` label section for the circumstances panels.
- Destination and explorer detail pages now render localized access, notes,
  facilities, practicalities, contact labels, metric labels and navigation
  actions. Practicalities are shown as a list rather than a comma-joined string.
- Verified: `npm run typecheck`, `npm run lint`, `npm run i18n:check` (618
  keys), `npm test` (6/6) and `npm run build` (200 pages). Confirmed 0
  replacement characters in all three locale files.
- Remaining: secondary editorial pages (about, contact, safety, privacy, terms,
  providers) are still English; only the Iberostar has licensed photos.
