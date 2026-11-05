import assert from "node:assert/strict";
import { test } from "node:test";
import { formatDuration } from "../src/lib/format";
import {
  allCircumstances,
  circumstancesFor,
  localTime,
} from "../src/lib/eclipse/destinations";
import { getDestination } from "../src/data/destinations";

test("formatDuration truncates to whole seconds without float artefacts", () => {
  assert.equal(formatDuration(277.30099999999999), "4 min 37 s");
  assert.equal(formatDuration(37.999), "37 s");
  assert.equal(formatDuration(59.5), "59 s");
  assert.equal(formatDuration(0), "0 s");
  assert.equal(formatDuration(null), null);
});

test("formatDuration accepts localized unit labels", () => {
  assert.equal(
    formatDuration(277, { minute: "دقيقة", second: "ثانية" }),
    "4 دقيقة 37 ثانية",
  );
});

test("Sfax maximum is shown in Africa/Tunis (UTC+1), not UT", () => {
  const sfax = getDestination("sfax");
  assert.ok(sfax);
  const circumstances = circumstancesFor(sfax);

  assert.equal(localTime(circumstances.maximum, "UTC"), "09:11:29");
  assert.match(circumstances.localTimes.maximum ?? "", /^10:11:2\d$/);
  assert.notEqual(
    circumstances.localTimes.maximum,
    localTime(circumstances.maximum, "UTC"),
  );
});

test("every displayed contact time is shifted from its UT value", () => {
  for (const circumstances of allCircumstances()) {
    for (const key of [
      "firstContact",
      "secondContact",
      "maximum",
      "thirdContact",
      "fourthContact",
    ] as const) {
      const local = circumstances.localTimes[key];
      if (!local) continue;
      const utc = localTime(circumstances[key], "UTC");
      assert.ok(utc);
      assert.notEqual(
        local,
        utc,
        `${circumstances.destination.slug} ${key} must not display UT as local`,
      );
    }
  }
});
