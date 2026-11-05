import assert from "node:assert/strict";
import { test } from "node:test";
import { availability, availabilityFor } from "../src/data/availability";
import { packages } from "../src/data/packages";

test("availability covers every package and is explicitly illustrative", () => {
  for (const pkg of packages) {
    assert.ok(
      availability[pkg.slug],
      `${pkg.slug} needs an explicit illustrative availability state`,
    );
  }
  assert.equal(Object.keys(availability).length, packages.length);
});

test("the demo shows open, limited and sold-out states", () => {
  const states = new Set(Object.values(availability));
  assert.ok(states.has("open"));
  assert.ok(states.has("limited"));
  assert.ok(states.has("sold_out"));
});

test("sold-out packages route to the waiting list state", () => {
  const soldOut = packages.filter((pkg) => availabilityFor(pkg.slug) === "sold_out");
  assert.ok(soldOut.length >= 1);
});
