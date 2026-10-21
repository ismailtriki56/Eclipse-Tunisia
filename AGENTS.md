<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ECLIPSE TUNISIA — Persistent Development Instructions

## Project Context
- **Name**: Eclipse Tunisia (https://github.com/ismailtriki56/Eclipse-Tunisia)
- **Goal**: Full-stack tourism technology platform for the 2 August 2027 total solar eclipse in Tunisia.
- **Tech Stack**: Next.js 16+ App Router, React 19, TypeScript, Tailwind CSS v4, MapLibre GL, @google/genai SDK.

## Core Rules & Verification
- Astronomical accuracy: Besselian calculations from `src/lib/eclipse` are validated via `npm run verify:eclipse`. Never hardcode approximate timings.
- Map: Use MapLibre GL with real Tunisian coordinates and the GeoJSON totality path from `src/data/eclipse-path-2027.coordinates.ts`.
- AI: All Gemini API calls are strictly server-side in `app/api/*` using `@google/genai` with model `gemini-3.8-flash` and `process.env.GEMINI_API_KEY`.
- No fake bookings: Maintain clear sample notices on demo listings and mock request forms.
- Zero-pill styling: Render metadata as quiet typography with separators (`·`), reserving bordered/pill shapes for interactive controls.

