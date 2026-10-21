# Eclipse Tunisia — Implementation Plan

## Phase 1: Audit & Repository Baseline (Completed)
- Analyzed codebase: Next.js 16 App Router, MapLibre GL installed, NASA Besselian calculations in `src/lib/eclipse`.
- Fixed dev script port binding (`3000` on `0.0.0.0`) and added standalone output to `next.config.ts`.
- Verified compilation and eslint clean baseline.
- Installed `@google/genai` and `lucide-react`.

## Phase 2: Design System, Navigation & Layout Polish
- Fix missing navigation route `/eclipse` (The Eclipse astronomical guide page).
- Enhance global navigation, active route styling, and footer links.
- Apply zero-pill typography and domain-native Tunisian aesthetics (terracotta clay, Saharan sand, corona gold, night navy).

## Phase 3: Interactive Map Component (MapLibre GL)
- Build `src/components/map/eclipse-map.tsx`:
  - Full MapLibre GL instance with Carto / OSM tiles.
  - GeoJSON layer rendering NASA totality path (polygon between northern and southern limits, plus central line).
  - Custom interactive markers for each destination in Tunisia with totality indicator (gold glowing ring for totality, slate ring for partial).
  - Selected destination popup card with photograph, region, duration/obscuration, and link to detail page.
  - Category and Totality filter bar (All, In Totality, Desert Oasis, Coast & Sahel, Cultural & Roman).
  - Interactive destination sidebar sync: clicking a card zooms and pans to marker; clicking a marker highlights the card.
  - Mobile responsive collapse & touch controls.
  - Safe error boundary and graceful fallback state.

## Phase 4: Homepage & Destination Discovery Enhancements
- Embed interactive Map section directly on the homepage with full screen modal or embedded view.
- Update `destinations/page.tsx` with search, region filters, totality filters, and map toggle.
- Create `/eclipse/page.tsx` for complete astronomical science, August climate statistics, timeline of the day, and viewing science.
- Ensure all detail pages (`/destinations/[slug]`, `/explorer/[slug]`, `/experiences/[slug]`) have "Add to Itinerary" integration.

## Phase 5: Functional Itinerary Planner
- Build interactive planner in `src/app/plan/page.tsx`:
  - Date selector (arrival/departure, pre-set to July 31 – August 4, 2027 around the eclipse).
  - Day-by-day itinerary view with August 2 highlighted as **Eclipse Totality Day**.
  - Add destinations and experiences to specific days.
  - Reorder activities within and across days (move up/down, remove, add notes).
  - Trip summary: total duration, eclipse day viewing location, estimated budget in TND.
  - Local persistence using browser `localStorage` (auto-saves and can be reset).
  - Export itinerary as printable summary or JSON.

## Phase 6: Gemini AI Travel Assistant
- Server-side API route `/api/plan/generate`:
  - Uses `@google/genai` with model `gemini-3.8-flash`.
  - Configures system instructions with the actual Tunisian destinations (Tozeur, Nefta, Chott el Jerid, Matmata, Gabès, Kairouan, Djerba, El Djem, Sousse) and NASA eclipse circumstances.
  - Generates custom day-by-day plan tailored to user preferences (pace, budget, interests, group size).
  - Fallback logic: If `GEMINI_API_KEY` is not configured, provides a curated 5-day Eclipse Expedition plan and displays an informative banner with instructions on enabling Gemini in AI Studio Secrets.
  - "Apply to Itinerary" button to populate the plan directly into the interactive planner!

## Phase 7: Verification & Documentation
- Run `npm run verify:eclipse`, `compile_applet`, and `lint_applet`.
- Update `AGENTS.md` and `docs/PROGRESS.md`.
