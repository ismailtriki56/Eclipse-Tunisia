import test from "node:test";
import assert from "node:assert/strict";
import { packages, getPackage } from "../src/data/packages";
import { getDestination } from "../src/data/destinations";
import { circumstancesFor } from "../src/lib/eclipse/destinations";
import { packagePlannerHref, quotePackage } from "../src/lib/packages";

const mahdia = getPackage("mahdia-signature");

function requireMahdia() {
  assert.ok(mahdia, "Mahdia package must exist");
  return mahdia;
}

test("Every package is illustrative and has a unique route", () => {
  assert.equal(packages.length, 3);
  assert.equal(new Set(packages.map((pkg) => pkg.slug)).size, packages.length);
  for (const pkg of packages) {
    assert.equal(pkg.isIllustrative, true);
    assert.ok(pkg.basePricePerPerson > 0);
    assert.ok(pkg.itinerary.length >= pkg.nights);
    assert.ok(pkg.roomOptions.length > 0);
    assert.ok(pkg.addOns.length > 0);
  }
});

test("Every package base is inside totality and quotes the computed duration", () => {
  for (const pkg of packages) {
    const destination = getDestination(pkg.destinationSlug);
    assert.ok(destination, `unknown destination ${pkg.destinationSlug}`);
    const circumstances = circumstancesFor(destination);
    assert.equal(circumstances.visibility, "total");
    assert.ok((circumstances.centralDurationSeconds ?? 0) > 0);
    assert.ok(circumstances.localTimes.secondContact);
    assert.ok(circumstances.localTimes.thirdContact);
  }

  const djerba = getPackage("djerba-total-totality");
  assert.ok(djerba);
  const djerbaCircumstances = circumstancesFor(
    getDestination(djerba.destinationSlug)!,
  );
  assert.equal(Math.round(djerbaCircumstances.centralDurationSeconds ?? 0), 277);
});

test("Base quote is per person, with the single supplement applied once", () => {
  const pkg = requireMahdia();
  const shared = quotePackage(pkg, {
    nights: pkg.nights,
    travellers: 2,
    roomId: "standard",
    addOnIds: [],
  });
  assert.equal(shared.perPerson, pkg.basePricePerPerson);
  assert.equal(shared.total, pkg.basePricePerPerson * 2);
  assert.equal(shared.singleSupplement, 0);

  const solo = quotePackage(pkg, {
    nights: pkg.nights,
    travellers: 1,
    roomId: "standard",
    addOnIds: [],
  });
  assert.equal(solo.total, pkg.basePricePerPerson + pkg.singleSupplement);
  assert.equal(solo.singleSupplement, pkg.singleSupplement);
});

test("Quote handles extra nights, room upgrades and add-ons", () => {
  const pkg = requireMahdia();
  const quote = quotePackage(pkg, {
    nights: 6,
    travellers: 2,
    roomId: "sea-view",
    addOnIds: ["photography-clinic", "private-guide"],
  });

  const expectedPerPerson =
    pkg.basePricePerPerson +
    (6 - pkg.nights) * pkg.nightlyAdjustment +
    95 +
    120 +
    75;

  assert.equal(quote.perPerson, expectedPerPerson);
  assert.equal(quote.total, expectedPerPerson * 2);
  assert.ok(quote.lines.some((line) => line.label === "Sea-view room"));
  assert.ok(
    quote.lines.some((line) => line.label === "Eclipse photography clinic"),
  );
});

test("Planner link carries the chosen dates, group size and family preference", () => {
  const pkg = requireMahdia();
  const href = packagePlannerHref(pkg, {
    nights: 4,
    travellers: 4,
    roomId: "standard",
    addOnIds: [],
    startDate: "2027-07-31",
    familyFriendly: true,
  });
  const url = new URL(href, "https://example.com");
  assert.equal(url.pathname, "/plan");
  assert.equal(url.searchParams.get("addDest"), "mahdia");
  assert.equal(url.searchParams.get("startDate"), "2027-07-31");
  assert.equal(url.searchParams.get("endDate"), "2027-08-04");
  assert.equal(url.searchParams.get("groupSize"), "4");
  assert.equal(url.searchParams.get("family"), "1");
  assert.equal(url.searchParams.get("pace"), "relaxed");
  assert.equal(url.searchParams.get("eclipsePreference"), "totality");
});

test("Planner link without family preference does not add a family flag", () => {
  const pkg = requireMahdia();
  const url = new URL(
    packagePlannerHref(pkg, {
      nights: 4,
      travellers: 2,
      roomId: "standard",
      addOnIds: [],
      startDate: "2027-07-31",
    }),
    "https://example.com",
  );
  assert.equal(url.searchParams.has("family"), false);
  assert.equal(url.searchParams.get("pace"), "moderate");
});
