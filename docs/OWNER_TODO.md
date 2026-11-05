# Owner Actions

Items the site owner must supply or approve. The site keeps honest
placeholders until these are resolved.

## Brand and photography

- [ ] Review `public/hero/eclipse.jpg`. It is a 2400×1350 composite with a dark
      left third for the headline and a warm coastal right side. Replace it only
      with an owner-approved, openly licensed photograph of at least 2400px and
      record the author, licence and source page in `src/data/images.ts`.
- [ ] Supply three openly licensed photos for each stay that currently has none:
      Mahdia Palace Thalasso, Radisson Blu Palace Djerba, Hasdrubal Prestige
      Djerba, Anantara Sahara Tozeur, Mövenpick Resort Marine & Spa Sousse,
      Radisson Hotel Sfax, Borj Dhiafa Sfax, Hotel Cercina Kerkennah and
      Beit El Ezz Kerkennah. Wikimedia Commons has no verified photos for these
      properties, so the site shows "Photo coming soon".
- [ ] Do not copy photos from Booking.com, Expedia, Tripadvisor or Google, and
      do not create or download airline logos. Official partner logos may be
      added only after the owner supplies the file and sets `confirmed: true` in
      `src/data/partners.ts`.

## Astronomy and content

- [ ] Accept that the Sfax maximum is **10:11:29 Africa/Tunis** (09:11:29 UT).
      The review comment asking for 11:11 local cannot be implemented without
      applying UTC+1 twice. A unit test protects the correct value.
- [ ] Confirm the illustrative availability states in `src/data/availability.ts`
      remain clearly labelled. They are demo states, not live inventory.
- [ ] Enable the optional experiences catalogue with
      `NEXT_PUBLIC_EXPERIENCES_ENABLED=true` only after its content and booking
      request copy have been reviewed.

## Operations

- [ ] Set `RESEND_API_KEY` and the enquiry recipient before expecting email
      delivery from `POST /api/enquiry`.
- [ ] Refresh `docs/screenshots` after any owner-supplied hero or hotel photo
      changes: `npm run test:e2e:screenshots`.
- [ ] Re-run `npm run verify:eclipse` after any change to `src/lib/eclipse` or
      `src/data/eclipse-path-2027.coordinates.ts`.
