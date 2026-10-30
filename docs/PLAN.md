# Eclipse Tunisia — Working Plan (2026 redesign)

This plan describes the codebase as found before the redesign and the approach
taken. It is a living document; see `docs/PROGRESS.md` for what has actually
landed.

## 1. Current routes (baseline)

App Router, `src/app/`:

| Route | Purpose |
| --- | --- |
| `/` | Home (hero, why Tunisia, campaigns, packages, map preview, tools, experiences, how it works, safety, provider CTA) |
| `/about` | About |
| `/contact` | Contact |
| `/destinations`, `/destinations/[slug]` | Destination directory and detail |
| `/eclipse` | Eclipse science + map |
| `/experiences`, `/experiences/[slug]` | Experience catalogue and detail |
| `/explorer`, `/explorer/[slug]` | Map explorer + destination detail |
| `/flights` | Airport / flight-search page |
| `/packages`, `/packages/[slug]` | Package list and detail |
| `/plan` | Client-side itinerary planner with a Gemini "generate" call |
| `/privacy`, `/terms`, `/safety`, `/providers` | Static pages |
| `/stays` | Hotel directory |
| `/api/plan/generate` | Gemini route handler (to be removed) |

## 2. How translations work (baseline)

- `src/i18n/config.ts` declares `en`, `fr`, `ar` and directions.
- `src/i18n/locales/{en,fr,ar}.ts` hold dictionaries.
- `src/context/language-context.tsx` is a client provider. It stores the
  locale in React state + `localStorage`, flips `<html lang/dir>` on the client.
- No URL locale. Server components and most pages are hard-coded in English.
- The Arabic locale file is corrupted (mojibake) and must be rewritten.

### Chosen approach

- Add real URL locales: `/en/...`, `/fr/...`, `/ar/...`.
- Move all page routes under `src/app/[locale]/`; keep `src/app/api` outside.
- `src/middleware.ts` redirects unprefixed paths to the preferred locale
  (`NEXT_LOCALE` cookie, default `en`) and keeps API/static paths untouched.
- `LanguageProvider` receives the locale from the server layout (no
  `localStorage`-driven state). The switcher navigates to the same path with a
  new locale and writes the cookie. Arabic sets `dir="rtl"`.
- All primary surfaces (nav, footer, hero, home sections, packages, package
  detail, quote form, map controls, hotel cards) read from the dictionaries.
  Secondary editorial pages stay English in this pass; this is recorded as an
  assumption in `docs/PROGRESS.md`.

## 3. Where data lives

| Data | File |
| --- | --- |
| Destinations + themes + coordinates | `src/data/destinations.ts` |
| Eclipse path GeoJSON | `src/data/eclipse-path-2027.coordinates.ts` |
| Packages | `src/data/packages.ts` |
| Hotels / stays | `src/data/stays.ts` |
| Flights / airports | `src/data/flights.ts` |
| Experiences | `src/data/experiences.ts` |
| Images + attribution | `src/data/images.ts` |
| Campaigns | `src/data/campaigns.ts` |
| Eclipse engine | `src/lib/eclipse/*` |
| Computed circumstances | `src/lib/eclipse/destinations.ts` (`circumstancesFor`) |

All eclipse durations must come from `circumstancesFor()`; never type them by
hand. `npm run verify:eclipse` validates the engine against NASA.

## 4. Components with buttons / links

- Layout: `site-header.tsx` (nav, language switcher, plan CTA, mobile menu),
  `site-footer.tsx` (link columns, NASA link), `logo.tsx`.
- Home: `hero.tsx`, `featured-packages.tsx`, `travel-tools.tsx`,
  `safety-section.tsx`, `campaign-wall.tsx`, `explorer-preview.tsx`,
  `destinations-preview.tsx`, `featured-experiences.tsx`, `how-it-works.tsx`,
  `provider-cta.tsx`, `countdown.tsx`.
- Map: `interactive-map.tsx` (filters, layer toggles, reset, zoom, popups,
  detail/plan links).
- Packages: `package-card.tsx`, `package-customizer.tsx`.
- Stays: `stays-directory.tsx`.
- Flights: `flight-search.tsx`.
- Experiences: `experience-catalog.tsx`, `booking-request-card.tsx`.
- Plan: `itinerary-planner.tsx`.
- UI primitives: `ui/button.tsx`, `ui/card.tsx`, `ui/badge.tsx`.

A full audit is produced in `docs/BUTTON_AUDIT.md`.

## 5. Baseline verification

- `npm run build`: pass (56 static pages, `/api/plan/generate` dynamic).
- Baseline log: `docs/build-baseline.log`.
- Node 20+, Next 16.4.2, React 19.3.0, Tailwind v4, Leaflet 1.9.4.

## 6. Assumptions

- There is no payment or booking engine; all packages remain illustrative.
- `@google/genai`, the `/api/plan/generate` route, and all AI copy are removed.
  `/plan` becomes the Request-a-quote page.
- Hotel photos are only shown when a licence-safe file exists. Until the owner
  supplies Wikimedia/press-kit files, hotels show a neutral "Photo coming soon"
  placeholder and are listed in `docs/PROGRESS.md`.
- Partner logos are never fabricated. `data/partners.ts` ships empty.
- Prices are illustrative planning figures in TND/USD, flagged for the owner to
  confirm.
