<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ECLIPSE TUNISIA — Persistent Development Instructions

## Project Context
- **Name**: Eclipse Tunisia (https://github.com/ismailtriki56/Eclipse-Tunisia)
- **Goal**: Full-stack tourism technology platform for the 2 August 2027 total solar eclipse in Tunisia.
- **Tech Stack**: Next.js 16+ App Router, React 19, TypeScript, Tailwind CSS v4, Leaflet with OpenStreetMap tiles, Resend for enquiry email.

## Core Rules & Verification
- Astronomical accuracy: Besselian calculations from `src/lib/eclipse` are validated via `npm run verify:eclipse`. Never hardcode approximate timings.
- Map: Use Leaflet with real Tunisian coordinates and the GeoJSON totality path from `src/data/eclipse-path-2027.coordinates.ts`. Always provide a non-map destination list and a retry state for tile failures.
- Localization: Every user-facing string, metadata title, placeholder and accessible label must exist in `src/i18n/locales/{en,fr,ar}.ts`. Run `npm run i18n:check`, `npm run typecheck`, `npm run lint` and `npm test` before committing.
- Enquiries: `POST /api/enquiry` validates input and emails via Resend when `RESEND_API_KEY` is set; never add a second unvalidated submission path.
- No fake bookings: Maintain clear sample notices on demo listings and mock request forms.
- Photos: Only use openly licensed images, store them locally under `public/`, and record author, licence and source page in `src/data/images.ts`.
- Zero-pill styling: Render metadata as quiet typography with separators (`·`), reserving bordered/pill shapes for interactive controls.

