# Eclipse data sourcing

## Status: development placeholders

The eclipse circumstances in `src/data/destinations.ts` are **illustrative
placeholders** for development. They are **not verified** and must not be
presented to users as authoritative.

## Required verification before launch

1. Retrieve the official circumstances for the total solar eclipse of
   **2 August 2027** from NASA's eclipse resources:
   - https://eclipse.gsfc.nasa.gov/
   - The published 2027 eclipse map and local circumstances tables.
2. For each Tunisian location, record:
   - Whether it lies inside the path of totality.
   - Local time of first, second, third and fourth contact (where applicable).
   - Local time of maximum eclipse.
   - Duration of totality (where applicable).
   - The time zone used for display.
   - The source URL and the date the data were last verified.
3. Confirm time-zone handling. All Tunisian locations currently use
   `Africa/Tunis`. Displayed times are computed with `Intl.DateTimeFormat`
   in `src/lib/format.ts` — never hardcode a single countdown for every
   location.

## Rules enforced in code

- A `null` circumstance renders as "Not applicable", never as a guessed time.
- A `null` totality duration renders as "None".
- Every destination carries `sourceUrl` and `verifiedOn` so provenance is
  visible in the UI.

## Not yet implemented

- The interactive map (MapLibre GL JS) and a validated path-of-totality layer.
- A list-based accessible alternative to the map.
- Weather integration (optional; must not delay core features).
