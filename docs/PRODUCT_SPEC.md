# Eclipse Tunisia — Product Specification

## 1. Executive Summary & Vision

Eclipse Tunisia is a premier tourism technology and expedition planning platform designed for the monumental total solar eclipse of **2 August 2027**. Tunisia sits directly in the path of maximum visibility, offering up to **6 minutes and 23 seconds of totality** under the clear desert and Mediterranean skies of North Africa.

The platform bridges astronomical precision with high-touch travel discovery:
- **Scientific Foundation**: Verified eclipse circumstances computed from NASA Goddard Space Flight Center (GSFC) Besselian elements (Five Millennium Canon of Solar Eclipses) and local coordinates across Tunisia.
- **Interactive Geospatial Exploration**: High-performance interactive MapLibre GL map rendering the exact path of totality (northern limit, central line, southern limit) and destination markers across the South West oases, coastal cities, and Sahara gateway.
- **Authentic Travel Curation**: Real Tunisian destinations (Tozeur, Nefta, Chott el Jerid, Gabès, Matmata, Kairouan, Djerba, Sousse, El Djem) paired with verified photography and sample bookable experiences.
- **Dynamic Itinerary Builder**: Full client-side trip planner with custom travel dates, drag-and-drop/reorder activity management, day-by-day scheduling, and persistent local storage.
- **Server-Side Gemini AI Travel Assistant**: AI expedition architect grounded in real Tunisian destinations and eclipse timings, utilizing Google GenAI SDK (`gemini-3.8-flash`) with resilient fallbacks for unconfigured environments.

## 2. Core Users & Personas

1. **The Eclipse Chaser / Umbraophile**: Demands exact contact timings (C1, C2, Max, C3, C4), totality duration in seconds, sun altitude, magnitude, diameter ratio, and cloud cover history.
2. **The Cultural Traveler**: Wants to combine the 6-minute celestial event with Roman ruins (El Djem, Carthage), troglodyte Berber villages (Matmata), Saharan salt lakes (Chott el Jerid), and Islamic architecture (Kairouan).
3. **The Local Tourism Provider**: Tour operators, 4x4 desert drivers, oasis guides, and desert camps seeking to receive direct booking inquiries.

## 3. Architecture & Tech Stack

- **Framework**: Next.js 16+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens (`navy`, `ivory`, `gold`, `sand`, `clay`, `teal`)
- **Map Engine**: MapLibre GL with responsive markers, GeoJSON totality band overlay, and open vector/raster basemaps
- **AI Integration**: Server-side Next.js route (`/api/plan/generate`) via `@google/genai` with system instructions grounded in the actual dataset
- **Typography**: Geist Sans, Geist Mono, Fraunces (Display Serif)
- **Icons**: `lucide-react`
- **Data Integrity**: Astronomical computations validated via `verify:eclipse` test suite against NASA GSFC tables
