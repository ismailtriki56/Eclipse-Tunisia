# AGENTS.md — ECLIPSE TUNISIA
## Complete Product, Design, Engineering, and Business Specification

**Document type:** Primary project context and development specification  
**Product name:** Eclipse Tunisia  
**Product category:** Eclipse tourism discovery, trip planning, and booking platform  
**Primary event:** Total solar eclipse of August 2, 2027  
**Primary market:** Visitors travelling to Tunisia for the 2027 solar eclipse, alongside local travellers and Tunisian tourism providers  
**Primary goal:** Build a professional, attractive, reliable, commercially viable web application that helps people plan and book their eclipse experience in Tunisia.

This document is the authoritative starting point for the project. Assume you have never heard of this product before. Do not assume any previous conversation, undocumented requirements, existing architecture, or completed features.

The product owner is an independent student developer with intermediate Python experience and limited experience building production-grade full-stack web applications. Explain important technical decisions in accessible language, but do not lower engineering or design standards.

---

# 1. PRODUCT OVERVIEW

## 1.1 What is Eclipse Tunisia?

Eclipse Tunisia is a digital travel platform built around the total solar eclipse occurring on August 2, 2027.

It helps visitors answer five important questions:

1. Where should I travel in Tunisia to experience the eclipse?
2. What will I actually see from my chosen location, and when?
3. How do I organise my transport, accommodation, and activities?
4. Which local experiences can I book with trustworthy providers?
5. How can I organise my trip without researching dozens of disconnected websites?

The application combines verified astronomical information, destination discovery, tourism experiences, itinerary planning, and booking functionality in one coherent experience.

It must be a functioning product rather than a static landing page, a generic tourism template, or an AI chatbot wrapped in an attractive interface.

## 1.2 Product positioning

Position the product as a specialised travel companion for the 2027 eclipse in Tunisia.

It is not intended to replace every existing travel agency, hotel platform, or astronomical resource. Instead, it connects eclipse-specific planning with relevant Tunisian tourism experiences.

The product should communicate three values:

- **Clarity:** Visitors can understand their options without needing specialist astronomical knowledge.
- **Trust:** Important facts, prices, providers, and booking statuses are accurate and clearly presented.
- **Convenience:** Visitors can discover experiences, create itineraries, and make booking requests in one place.

Brand promise:

**Discover. Plan. Experience.**

Primary homepage action:

**Explore Eclipse Experiences**

Secondary action:

**Plan My Trip**

Primary brand name: Eclipse Tunisia.

Before public launch, domain availability, social handles, trademark conflicts, and any relevant naming restrictions must be checked. Do not claim the name is legally available without verification.

## 1.3 The core product principle

Every major feature must help the visitor make a real decision or complete a real task.

Do not add a feature merely because it looks impressive in a demonstration.

A feature is valuable when it helps users discover a suitable location, understand the eclipse, plan a feasible trip, find a legitimate provider, or complete a booking.

---

# 2. EVENT CONTEXT AND ASTRONOMICAL ACCURACY

## 2.1 The event

The central event is the total solar eclipse on August 2, 2027.

A total solar eclipse is visible only within the path of totality. Locations outside that path experience a partial eclipse, even if they are relatively close to locations experiencing totality.

The app must make this distinction unmistakable.

Never suggest that every location in Tunisia experiences totality.

## 2.2 Trusted data sources

Use authoritative astronomical information, including:

- NASA's eclipse resources: https://eclipse.gsfc.nasa.gov/
- NASA's published 2027 eclipse data and maps.
- Other reputable astronomical institutions when useful for independent verification.

Use official Tunisian tourism, transport, public-safety, and local-government sources where available.

Third-party websites can supplement these sources, but their information must be evaluated before it is displayed as authoritative.

## 2.3 Information required for each viewing location

Where reliable data are available, store:

- Location name.
- Geographic coordinates.
- Whether totality is visible.
- Eclipse circumstances for that specific location.
- Local time of first contact, second contact, maximum eclipse, third contact, and fourth contact, where applicable.
- Duration of totality, where applicable.
- Local time zone used for display.
- Source URL.
- Date the data were last verified.
- Notes about access, facilities, and practical travel considerations.

Do not invent missing values. If precise local timings have not been verified, show an appropriate explanation instead of a fabricated countdown or time.

Calculate times using validated data and correct time-zone handling. Never hardcode a single countdown that incorrectly represents every viewing location.

## 2.4 Viewing safety

Provide a dedicated safety section explaining that looking directly at the Sun is unsafe except during the brief phase of totality, when the Sun is completely covered by the Moon.

During all partial phases, users must use suitable, undamaged solar-viewing protection that meets recognised safety standards, or use an appropriate indirect viewing method.

Ordinary sunglasses are not sufficient.

Explain that the safe viewing conditions depend on the actual eclipse phase and that users must follow reputable astronomical safety guidance.

Do not sell unverified solar glasses or describe ordinary eyewear as suitable solar protection.

## 2.5 Weather information

Weather is relevant to viewing decisions, but forecasts cannot guarantee visibility.

If a weather service is integrated:

- Display the forecast provider and forecast timestamp.
- Distinguish forecasts from historical climate information.
- Explain uncertainty, especially for forecasts far in advance.
- Handle unavailable forecasts gracefully.
- Never promise clear skies.

Weather integration is optional for the initial release and must not delay the core product.

---

# 3. TARGET AUDIENCES

## 3.1 International visitors

These users may be visiting Tunisia for the first time. They need clear English-language information, straightforward navigation, reliable prices, transport guidance, and reassurance about bookings.

They may have different budgets, arrival dates, travel preferences, and levels of astronomical knowledge.

The interface should avoid unexplained scientific terminology.

## 3.2 Tunisian residents

Local users may want to travel to a viewing location, book an excursion, join a guided experience, or discover places they have not visited before.

The platform should not assume every user needs a hotel or an international travel itinerary.

## 3.3 Tourism providers

Potential partners include legitimate tour operators, licensed or otherwise appropriately authorised guides where required, transport providers, accommodation businesses, and organisers of local cultural experiences.

They need a clear way to present services, provide prices, manage availability, and receive booking requests.

Do not imply that a business has partnered with the platform until the relationship is confirmed.

## 3.4 Platform administrators

Administrators need to review listings, manage providers, moderate content, oversee bookings, resolve operational issues, and maintain trustworthy information.

Administrative functionality must be protected by appropriate authentication and permissions.

---

# 4. CORE USER JOURNEYS

## 4.1 Visitor discovers the event

1. The visitor opens the homepage.
2. The main headline explains the eclipse experience in Tunisia.
3. The visitor explores viewing locations or available experiences.
4. The visitor compares relevant options.
5. The visitor saves a location or begins planning a trip.

The first screen must explain the product immediately. Avoid forcing users to read a long introduction before they can take action.

## 4.2 Visitor finds a viewing location

1. The visitor opens the eclipse explorer.
2. The visitor sees a map and searchable list of locations.
3. The visitor filters for totality, accessibility, facilities, or other supported attributes.
4. The visitor opens a location detail page.
5. The visitor reviews verified eclipse timings and practical travel information.
6. The visitor saves the location or adds it to an itinerary.

Every location recommendation must be grounded in verified data.

## 4.3 Visitor plans a trip with AI

1. The visitor enters travel dates, budget, arrival city, interests, group size, and other relevant preferences.
2. The application identifies suitable locations and available experiences from its data.
3. The application generates an itinerary that respects the visitor's constraints.
4. Each recommendation links to a real destination or listing.
5. The visitor edits, saves, or regenerates the itinerary.
6. The visitor can continue to relevant booking requests.

The AI must not invent confirmed reservations, prices, provider availability, or transport schedules.

## 4.4 Visitor books an experience

1. The visitor opens an experience listing.
2. The visitor checks the provider, inclusions, price, date, group size, and cancellation policy.
3. The visitor enters the required booking information.
4. The application validates the request.
5. The booking is recorded with a clear status.
6. The visitor receives a confirmation appropriate to that status.

A booking request is not the same as a confirmed reservation. Make the distinction explicit throughout the interface.

## 4.5 Provider manages an experience

1. An authorised provider signs in.
2. The provider creates or edits a listing.
3. The provider submits it for review if required.
4. The provider manages availability and incoming booking requests.
5. The provider updates booking statuses according to the permitted workflow.

Providers must not be able to edit another provider's listings or access unrelated customers' information.

---

# 5. PRODUCT FEATURES AND PRIORITIES

## 5.1 Homepage

Build a visually distinctive, high-quality landing page.

It should include:

- Clear brand identity.
- A strong headline explaining the eclipse travel experience.
- A primary action to explore experiences.
- A secondary action to plan a trip.
- A relevant, high-quality hero image or carefully designed eclipse visual.
- A preview of the eclipse explorer.
- A small selection of real or clearly labelled sample experiences.
- An explanation of how the platform works.
- Essential viewing-safety information.
- A section for tourism providers interested in joining.
- A clear footer with contact, policies, and relevant information.

Avoid overwhelming visitors with too many sections or competing calls to action.

The hero must look excellent on mobile as well as desktop.

## 5.2 Eclipse Explorer

This is one of the defining features of the product.

Requirements:

- Interactive map with relevant Tunisian locations.
- Searchable location list.
- Clear visual distinction between total and partial eclipse viewing.
- Location detail pages or panels.
- Verified astronomical circumstances and local timings.
- Duration of totality where applicable.
- Links to relevant experiences and itineraries.
- Accessible controls and a list-based alternative to the map.
- Loading, empty, and error states.

Use MapLibre GL JS or another suitable mapping technology if compatible with the architecture.

Do not draw a supposedly accurate path of totality from manually guessed coordinates. Use validated geographic data and an appropriate projection or map layer.

The map must remain useful when external map tiles are unavailable.

## 5.3 Destination pages

Each destination page should contain verified, useful information:

- Destination name and overview.
- Photographs that may legally be used.
- Eclipse visibility classification.
- Location-specific timing information.
- Travel and access information.
- Facilities and accessibility information where verified.
- Relevant nearby experiences.
- Source attribution and verification date for critical facts.
- A clear action to save the destination or plan a trip.

Do not automatically assume that every destination has restaurants, hotels, accessible facilities, or transport services.

## 5.4 Experiences marketplace

The marketplace allows providers to advertise bookable tourism experiences.

Potential categories include:

- Guided eclipse-viewing excursions.
- Transport to suitable viewing areas.
- Local cultural experiences.
- Guided visits to historical sites.
- Food and culinary experiences.
- Multi-day tourism packages.
- Accommodation offers, if suitable providers participate.

Each listing should support the fields that are relevant to its category:

- Listing title and description.
- Provider identity and contact information.
- Location.
- Price and currency.
- Pricing basis, such as per person or per group.
- Included and excluded services.
- Dates and availability.
- Group-size limits where relevant.
- Duration.
- Meeting point.
- Accessibility information where known.
- Cancellation and refund terms.
- Listing status and verification status.
- Photographs and relevant source information.

Never fabricate providers, customer reviews, booking counts, star ratings, or availability.

Use clearly labelled sample data only in development and never misrepresent sample listings as real inventory.

## 5.5 AI itinerary planner

The planner is a major differentiating feature.

It should collect only the information needed to produce a useful plan.

Possible inputs:

- Arrival and departure dates.
- Arrival city or accommodation area.
- Budget and currency.
- Group size.
- Interests.
- Desired pace.
- Transport preferences.
- Accessibility needs, if voluntarily provided.
- Preferred viewing experience.

The system should then:

1. Validate the user's inputs.
2. Retrieve relevant destinations and legitimate listings.
3. Filter options using real constraints.
4. Build a feasible suggested itinerary.
5. Explain why each destination or experience is recommended.
6. Link every bookable recommendation to its actual listing.
7. Identify assumptions, missing information, and approximate costs.
8. Let the user edit and save the itinerary.

Use an LLM API through a server-side integration. Do not expose the API key in client-side code.

The AI should not be the source of truth for astronomical data, prices, inventory, or bookings. Retrieve these from the relevant trusted data source or database.

If the AI provider is unavailable, display a useful fallback such as manual itinerary building rather than breaking the application.

Do not implement expensive autonomous agent loops or unnecessary AI infrastructure in the initial version.

## 5.6 Accounts and saved plans

If authentication is implemented, users should be able to:

- Create an account and sign in securely.
- Save destinations.
- Save and edit itineraries.
- View their own booking requests.
- Access relevant booking details.
- Manage appropriate account information.

Do not force visitors to register before browsing public content.

Allow guest browsing. Decide whether guest booking is appropriate based on the implementation and provider requirements.

## 5.7 Booking management

Implement a clear booking lifecycle.

Possible statuses include:

- Draft.
- Pending provider response.
- Confirmed.
- Declined.
- Cancelled.
- Completed.

Use only the statuses needed by the actual workflow.

Every transition must be controlled by server-side logic and appropriate permissions.

Prevent accidental duplicate requests where possible. Make errors recoverable and communicate the outcome clearly.

Store booking dates, quantities, pricing information, and relevant listing details in a way that preserves an accurate booking record even if the provider later edits the listing.

## 5.8 Digital tickets and QR codes

Once a booking is confirmed, the platform may issue a digital ticket.

Requirements:

- A unique ticket identifier.
- A QR code containing an opaque identifier or secure ticket reference, not sensitive personal information.
- Server-side validation when scanning.
- Protection against unauthorised ticket reuse.
- A clear check-in status.
- Appropriate permissions for the provider or organiser scanning tickets.

Do not claim a QR code proves a booking is paid or confirmed unless the backend validates that status.

## 5.9 Provider dashboard

Providers should be able to:

- Manage their own profile.
- Create and edit experiences.
- Submit listings for review.
- Manage availability where supported.
- View their own booking requests.
- Update booking statuses where authorised.
- Review relevant booking details.
- See simple operational summaries.

The dashboard should be usable on mobile devices.

Do not build complex accounting, automatic provider payouts, or advanced analytics until there is a real business need.

## 5.10 Administration

A protected administrative interface may provide:

- Provider approval and suspension.
- Listing moderation.
- Destination and astronomical data management.
- Booking oversight.
- Reporting of incorrect information.
- Basic operational statistics.
- Audit history for important administrative actions.

Never implement administrator access through a publicly visible button or a hardcoded client-side role.

## 5.11 Search, filters, and discovery

Support search and filtering for real available content.

Potential filters include:

- Experience category.
- Location.
- Price range.
- Date.
- Duration.
- Group size.
- Accessibility attributes where verified.
- Availability.

Show a useful empty state when nothing matches.

## 5.12 Languages and currencies

English should be the initial language, with a structure that allows future French and Arabic localisation.

Do not implement incomplete translations that mix languages unpredictably.

Store currency values with an explicit currency code and use appropriate formatting.

Do not assume all providers charge in the same currency.

Arabic support may require right-to-left layout handling. Add it properly rather than merely translating text.

## 5.13 Eclipse Day Companion

A later release may include:

- Saved viewing location.
- Location-specific countdown.
- Local eclipse phase timings.
- Essential travel and safety information.
- Saved itinerary.
- Offline access to essential information where implemented and tested.
- Practical emergency information.

Do not promise emergency response, live tracking, or offline features that have not been implemented.

---

# 6. BUSINESS MODEL

The product should eventually generate revenue, but commercial features must be introduced responsibly.

## 6.1 Potential revenue sources

### Booking commission

Earn an agreed commission for completed bookings from participating providers.

### Provider subscriptions

Offer optional paid tools or enhanced listings if providers demonstrate a willingness to pay.

### Sponsored placements

Allow clearly labelled promotional listings when they are useful and do not undermine trust.

### Curated packages

Offer bundled experiences through legitimate providers with clear pricing, responsibilities, and cancellation terms.

### Digital passes

Consider a paid pass only if it offers genuine benefits beyond information already available for free.

Do not introduce a paywall for essential eclipse-safety information.

## 6.2 Commercial validation

Before building complex monetisation:

- Speak with potential visitors.
- Interview tourism providers.
- Confirm that providers are willing to participate.
- Understand booking and cancellation responsibilities.
- Investigate local legal and payment requirements.
- Test a basic booking workflow.
- Measure whether users actually want the service.

Do not assume that a polished app automatically creates demand.

## 6.3 Payments

Payment integration is not required for the first working prototype.

Before implementing payments, investigate:

- Availability for a Tunisia-based operator.
- Support for relevant domestic and international payment methods.
- Merchant eligibility and verification requirements.
- Fees and settlement currencies.
- Refunds and disputes.
- Provider payout arrangements.
- Applicable consumer, tax, privacy, and tourism rules.

Never store card numbers or security codes in the application's database.

Never claim payment success based only on a frontend redirect.

Use the payment provider's verified server-side notifications and transaction status.

Do not invent API credentials or assume that a payment provider is available for the intended business model.

---

# 7. DESIGN SYSTEM AND VISUAL DIRECTION

## 7.1 Brand personality

Eclipse Tunisia should feel:

- Premium.
- Modern.
- Trustworthy.
- International.
- Calm and easy to navigate.
- Connected to astronomy and Tunisian culture.
- Commercially credible.

Avoid a childish space theme or an overly technical astronomy dashboard.

The design should balance the excitement of the eclipse with the practicality of a travel-booking platform.

## 7.2 Suggested colour palette

Use these as starting design tokens, subject to contrast and visual testing:

- Midnight navy: `#101820`
- Deep blue: `#172A3A`
- Solar gold: `#E8B85A`
- Warm ivory: `#FAF8F2`
- White: `#FFFFFF`
- Primary text: `#1C252E`
- Secondary text: `#66717C`
- Borders: `#E2E5E8`
- Success: an accessible green.
- Error: an accessible red.

Use gold sparingly for important actions and eclipse-related accents. Avoid placing small gold text on white when contrast is insufficient.

Use dark sections for dramatic storytelling and light surfaces for forms, listings, prices, and booking flows.

## 7.3 Typography

Choose a professional, highly legible font system.

Typography should have a clear hierarchy for:

- Main headlines.
- Section headings.
- Card titles.
- Body text.
- Prices and key facts.
- Captions and supporting metadata.

Do not use excessive font sizes, weights, or decorative typefaces.

## 7.4 Layout and spacing

Establish consistent spacing, container widths, grid rules, and responsive breakpoints.

Use generous whitespace where it improves readability.

Keep booking cards, forms, filters, and navigation visually consistent.

Ensure that important information remains easy to scan.

## 7.5 Photography and visual assets

Use high-quality images relevant to Tunisia, eclipse viewing, desert landscapes, culture, and travel.

Prefer properly licensed or original assets.

Do not use misleading photographs that imply a location or experience provides something it does not.

Optimise image sizes and provide meaningful alternative text.

Use consistent image proportions and sensible fallbacks when an image is unavailable.

## 7.6 Motion and interaction

Use restrained animation for transitions, menus, map interactions, and feedback.

Respect reduced-motion preferences.

Avoid decorative motion that slows navigation or distracts from booking.

Provide clear hover, focus, pressed, loading, success, and error states.

## 7.7 Responsive design

Design for mobile first, then expand for tablet and desktop.

The mobile experience must include:

- Clear navigation.
- Comfortable touch targets.
- Readable forms.
- Useful map controls.
- Easy access to prices and booking actions.
- No horizontal overflow.
- Accessible alternatives when map interaction is difficult.

Never treat responsive design as a final cosmetic patch.

## 7.8 Quality benchmark

Aim for the polish of a reputable modern travel startup.

Evaluate the result for hierarchy, spacing, typography, image quality, clarity, accessibility, responsiveness, and trust.

Do not copy another company's branding or protected assets.

---

# 8. TECHNICAL ARCHITECTURE

## 8.1 General rule

Inspect the existing project before selecting or changing technologies.

If the project already has a sound architecture, retain it where practical. If a migration is genuinely necessary, explain the benefit, cost, risks, and alternative before making destructive changes.

Do not assume that any framework or integration is already installed.

## 8.2 Preferred stack

If starting from scratch or if compatible with the existing project:

### Frontend
- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- Accessible reusable components.

### Backend and data
- Supabase.
- PostgreSQL.
- Supabase Auth if user authentication is required.
- Server-side application logic for privileged actions.

### Mapping
- MapLibre GL JS or a suitable alternative.
- A legitimate tile source with terms compatible with the application.
- Validated eclipse geographic data.

### AI
- A suitable LLM API accessed from server-side code.
- Structured itinerary inputs and outputs.
- Database-grounded recommendations.
- Graceful fallback when the service is unavailable.

### Deployment
Select hosting that supports the chosen framework and is permitted for the intended commercial use.

Check service quotas, usage terms, data policies, and operational costs before production deployment.

## 8.3 Database design

Design the schema based on real workflows, not just the visual interface.

Potential tables include:

- `profiles`
- `destinations`
- `eclipse_events`
- `eclipse_circumstances`
- `providers`
- `experiences`
- `experience_availability`
- `itineraries`
- `itinerary_items`
- `bookings`
- `booking_items`
- `tickets`
- `reviews`
- `admin_audit_logs`

These are suggested entities, not a requirement to create every table immediately.

Define foreign keys, data types, constraints, indexes, and relationships properly.

Store astronomical circumstances with sufficient location and source context. Do not store one set of eclipse timings as if it applies identically to every destination.

For bookings, preserve agreed pricing and relevant booking details so later listing edits do not silently alter an existing reservation.

Do not create fake reviews or booking records to make dashboards look populated.

## 8.4 Authentication and permissions

Use secure, supported authentication mechanisms.

Enforce access control at the server and database levels.

For Supabase:

- Configure Row Level Security on tables exposed through the API.
- Permit customers to access only their own private data.
- Permit providers to manage only their authorised resources.
- Restrict administrative actions to verified administrator roles.
- Never expose the service-role key in client-side bundles.
- Test both permitted and forbidden access paths.

Do not rely solely on hiding interface buttons to protect data.

## 8.5 API design

Keep integrations separated from UI components.

Validate all external and user-supplied inputs.

Use sensible error handling, timeouts, rate limits, and logging that avoids exposing sensitive information.

Never treat content returned by an AI model or an external listing as executable instructions.

Do not send unnecessary personal information to AI providers.

## 8.6 Environment variables

Use a local environment file for secrets where supported.

Provide an `.env.example` file containing variable names and harmless placeholders only.

Never commit real credentials.

Never print secrets in terminal output, application errors, screenshots, or documentation.

If a key is accidentally exposed, advise the project owner to revoke and replace it.

## 8.7 Type safety and validation

Use TypeScript types for application data.

Validate important inputs on the server using an appropriate schema-validation library if compatible with the project.

Handle malformed responses and unexpected null values.

Do not use unsafe type assertions merely to silence errors.

## 8.8 Performance

Avoid unnecessary dependencies and excessive client-side JavaScript.

Use appropriate image optimisation and lazy loading.

Paginate large listings where necessary.

Avoid repeated API calls that can be cached safely.

Keep the homepage fast and ensure that the map does not prevent essential content from loading.

## 8.9 Testing

Use the project's existing test tools where practical.

Add suitable checks for:

- TypeScript.
- Linting.
- Production builds.
- Core booking logic.
- Authentication and permissions.
- Data validation.
- AI output handling.
- Responsive layout.
- Error and empty states.

Do not claim tests passed if they were not run.

---

# 9. AI ITINERARY SYSTEM: DETAILED REQUIREMENTS

## 9.1 Data flow

Use this general process:

1. Collect and validate user preferences.
2. Retrieve relevant destinations, providers, listings, and availability from trusted sources.
3. Filter candidates according to the visitor's constraints.
4. Provide the filtered information to the AI.
5. Ask the AI to produce a structured itinerary.
6. Validate the returned structure.
7. Check that references point to existing records.
8. Display the itinerary with source-linked listings.
9. Allow edits and saving.

## 9.2 Hard constraints

The AI must not recommend an itinerary as feasible if it violates known hard constraints, such as unavailable experiences, impossible booking dates, or verified travel restrictions.

If travel-time data are missing, mark the relevant time as unknown or approximate instead of inventing precision.

Do not assume transport is available merely because two destinations appear close together on a map.

## 9.3 Output structure

Where practical, request structured output containing:

- Itinerary title.
- Summary.
- Dates.
- Day-by-day activities.
- Destination identifiers.
- Experience identifiers.
- Estimated costs with explicit currencies.
- Travel considerations.
- Assumptions.
- Missing information.
- Safety notes where relevant.

Validate the output before rendering it.

## 9.4 Cost calculation

Calculate totals using application code and verified price data, not arithmetic generated by the LLM alone.

Clearly distinguish confirmed prices from estimates and exclude unknown costs from any claimed guaranteed total.

## 9.5 Privacy and abuse prevention

Do not place API keys in prompts or browser code.

Limit request size and frequency.

Avoid sending names, emails, phone numbers, or booking details to the AI unless genuinely necessary.

Treat model output as untrusted data and render it safely.

---

# 10. CONTENT, TRUST, AND LEGAL CONSIDERATIONS

The platform must distinguish between verified information, provider-supplied information, estimates, and editorial recommendations.

Display appropriate policies for:

- Privacy.
- Terms of use.
- Booking and cancellation.
- Refunds.
- Provider responsibilities.
- Contact and support.

These documents must reflect the actual business model and applicable requirements. Do not invent a claim that the business is licensed, insured, government-approved, or officially affiliated with NASA or another organisation.

Do not imply that the platform is the official organiser of the eclipse.

Use accurate, respectful descriptions of Tunisian places and culture.

Do not invent safety assurances or promise that every excursion is suitable for every visitor.

Investigate applicable Tunisian and international obligations before operating commercial bookings, accepting payments, or processing personal information.

---

# 11. DEVELOPMENT PLAN

Work toward the full product, but implement and verify it in stages.

## Stage 0 — Audit and plan

- Inspect all project files.
- Identify the stack and existing functionality.
- Identify missing dependencies and environment variables.
- Determine what is already implemented.
- Report architectural risks.
- Produce an implementation plan.
- Do not overwrite the existing project or make destructive changes without approval.

## Stage 1 — Visual foundation

- Establish the brand identity.
- Create design tokens and reusable components.
- Build the responsive homepage.
- Implement the main navigation and footer.
- Create consistent buttons, cards, typography, and forms.
- Test mobile and desktop layouts.

## Stage 2 — Eclipse explorer

- Verify the astronomical data source.
- Build the location data model.
- Add map and list views.
- Add location detail pages.
- Display local eclipse circumstances and sources.
- Add safety information.

## Stage 3 — Experience discovery

- Build the experience listing model.
- Add search, filters, and detail pages.
- Establish the distinction between sample and real listings.
- Implement provider information and clear pricing presentation.

## Stage 4 — Database and authentication

- Configure the database.
- Add migrations or reproducible schema setup.
- Configure authentication if needed.
- Enforce access controls.
- Test authorised and unauthorised access.

## Stage 5 — AI itinerary planner

- Add validated inputs.
- Retrieve real data.
- Integrate the model server-side.
- Validate structured output.
- Calculate costs using application code.
- Add useful fallback behaviour.

## Stage 6 — Booking workflow

- Add booking requests.
- Validate inventory and dates.
- Implement statuses and notifications.
- Prevent unauthorised access.
- Test edge cases and duplicate requests.

## Stage 7 — Provider and admin tools

- Add listing management.
- Add booking management.
- Add administrative review.
- Enforce role permissions.

## Stage 8 — Digital tickets

- Generate secure ticket references.
- Implement QR codes.
- Validate tickets on the server.
- Test check-in and duplicate-use prevention.

## Stage 9 — Production preparation

- Run checks and production builds.
- Fix bugs and responsive issues.
- Review access control and secrets.
- Review loading, error, and empty states.
- Verify important content and links.
- Check commercial terms for external services.
- Document deployment and maintenance.

Stages may overlap when dependencies permit, but do not skip verification.

---

# 12. WORKING INDEPENDENTLY WITH THE CODING AGENT

The agent should be proactive, but not reckless.

## 12.1 Inspect before modifying

Always inspect the files relevant to a task before changing them.

Understand existing components, conventions, dependencies, and data structures.

Do not rewrite a working feature merely because a different approach is fashionable.

## 12.2 Use plan-first development

For substantial work, briefly state:

- What will be built.
- Which files or systems will change.
- What dependencies are required.
- What risks exist.
- How success will be tested.

Then implement the feature in coherent steps.

Do not repeatedly interrupt the owner for approval of routine, reversible decisions. Use sensible defaults and document them.

Ask for input when a decision is irreversible, affects business commitments, requires paid services, exposes sensitive data, or cannot safely be inferred.

## 12.3 Preserve working code

Before major refactoring, check version-control status.

Never discard uncommitted user work.

Do not run destructive database commands or delete user data without explicit approval.

Use small changes and maintain a working application whenever possible.

## 12.4 Be honest about completion

After each substantial task, report:

- Features implemented.
- Files or systems changed.
- Tests and commands run.
- Results of those checks.
- External setup still required.
- Known bugs or limitations.
- Next recommended task.

Never state that an integration is complete merely because a placeholder interface exists.

## 12.5 Protect the owner's learning

Explain major architectural decisions in straightforward terms.

When an error occurs, identify its cause and explain the fix briefly.

Do not overwhelm the owner with unnecessary theory, but do not conceal important trade-offs.

---

# 13. DEFINITION OF A PROFESSIONAL RELEASE

The application is not production-ready merely because the homepage looks polished.

Before calling it production-ready, confirm that:

- Core pages work on mobile and desktop.
- Eclipse information is verified and location-specific.
- Users can find useful destinations and experiences.
- Listing details and prices are grounded in real data.
- AI recommendations reference real records.
- Booking requests are stored and statuses are accurate.
- Authentication and access controls are tested.
- Sensitive credentials are protected.
- Error and loading states are handled.
- Essential content remains usable if optional services fail.
- Relevant tests and production builds pass.
- Privacy and commercial requirements have been reviewed.
- External service costs and terms are understood.
- Deployment and maintenance instructions are documented.

If some requirements are not met, clearly identify the application as a prototype or limited release rather than claiming full production readiness.

---

# 14. FINAL OPERATING INSTRUCTIONS

The objective is to build a complete, polished, commercially credible eclipse travel platform for Tunisia.

Prioritise:

1. Trustworthiness and factual accuracy.
2. A distinctive, professional visual identity.
3. A genuinely useful eclipse explorer.
4. Real tourism listings and feasible trip planning.
5. A reliable booking workflow.
6. Secure and maintainable engineering.
7. Cost-conscious development.
8. Evidence of actual user and provider demand.

Do not optimise for the number of features, the amount of generated code, or the apparent complexity of the technology.

Optimise for a coherent product that people can understand, trust, and use.

**Start by auditing the actual codebase and proposing the implementation plan. Preserve existing work. Then build incrementally, test each major feature, and continue toward the complete product without pretending unimplemented functionality already works.**