import { en } from "../src/i18n/locales/en";
import { fr } from "../src/i18n/locales/fr";
import { ar } from "../src/i18n/locales/ar";
import { de } from "../src/i18n/locales/de";
import { it } from "../src/i18n/locales/it";
import { es } from "../src/i18n/locales/es";

type Dict = Record<string, unknown>;

function flatten(value: unknown, prefix = ""): [string, unknown][] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [[prefix, value]];
  }
  return Object.entries(value as Dict).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key),
  );
}

function placeholders(value: unknown): string[] {
  if (typeof value === "string") {
    return [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
  }
  if (value === null || typeof value !== "object") return [];
  return Object.values(value as Dict).flatMap(placeholders);
}

const dictionaries = { fr, ar, de, it, es };
const base = new Map(flatten(en));
let failures = 0;

for (const [name, dictionary] of Object.entries(dictionaries)) {
  const keys = new Map(flatten(dictionary));
  for (const key of base.keys()) {
    if (!keys.has(key)) {
      console.error(`[${name}] missing key: ${key}`);
      failures += 1;
    }
  }
  for (const key of keys.keys()) {
    if (!base.has(key)) {
      console.error(`[${name}] extra key: ${key}`);
      failures += 1;
    }
  }
  for (const [key, value] of keys) {
    if (typeof value === "string" && value.trim().length === 0) {
      console.error(`[${name}] empty value: ${key}`);
      failures += 1;
    }
  }
}

const enPlaceholders = new Map(
  [...base].map(([key, value]) => [key, placeholders(value).join("|")]),
);

for (const [name, dictionary] of Object.entries(dictionaries)) {
  const keys = new Map(flatten(dictionary));
  for (const [key, value] of keys) {
    const expected = enPlaceholders.get(key);
    if (expected === undefined) continue;
    const actual = placeholders(value).join("|");
    if (expected !== actual) {
      console.error(
        `[${name}] placeholder mismatch at ${key}: expected {${expected}} got {${actual}}`,
      );
      failures += 1;
    }
  }
}

if (failures > 0) {
  console.error(`i18n check failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log(
  `i18n check passed: ${base.size} keys across en, fr, ar, de, it and es.`,
);
