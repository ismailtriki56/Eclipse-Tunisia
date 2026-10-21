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

This is an early foundation, not a finished product. What exists today:

- A responsive homepage with brand identity, hero, explorer preview,
  experiences, how-it-works, viewing safety and provider sections.
- An Eclipse Explorer listing total and partial eclipse locations, plus
  per-location detail pages with contact times.
- Experience listing pages and detail pages using clearly labelled **sample**
  data.
- A viewing safety guide.
- Layout shell (header, footer, navigation) and reusable UI components.

What does **not** exist yet (do not assume otherwise):

- Verified eclipse data — current values are development placeholders.
- An interactive map (MapLibre GL JS is planned).
- A database, authentication, booking workflow, AI planner or payments.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command             | Purpose                        |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start the development server   |
| `npm run build`     | Production build               |
| `npm run start`     | Serve the production build     |
| `npm run lint`      | Run ESLint                     |
| `npm run typecheck` | Run the TypeScript compiler    |

## Configuration

Copy `.env.example` to `.env.local` and fill in real values when integrations
are added. Never commit `.env.local` or real credentials. No secrets are
required to run the current foundation.

## Data and trust

- Sample listings are labelled "Sample" in the interface and are not real
  providers.
- Eclipse circumstances are unverified placeholders. See
  [`docs/eclipse-data.md`](./docs/eclipse-data.md) for the verification
  process before any data is presented as authoritative.

## Tech stack

Next.js (App Router), React, TypeScript, Tailwind CSS.
