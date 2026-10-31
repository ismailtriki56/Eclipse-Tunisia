import { en } from "../src/i18n/locales/en";
import { fr } from "../src/i18n/locales/fr";
import { ar } from "../src/i18n/locales/ar";

type Dict = Record<string, unknown>;

function flatten(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
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

const base = new Set(flatten(en));
let failures = 0;

for (const [name, dictionary] of Object.entries({ fr, ar })) {
  const keys = new Set(flatten(dictionary));
  for (const key of base) {
    if (!keys.has(key)) {
      console.error(`[${name}] missing key: ${key}`);
      failures += 1;
    }
  }
  for (const key of keys) {
    if (!base.has(key)) {
      console.error(`[${name}] extra key: ${key}`);
      failures += 1;
    }
  }
}

const enPlaceholders = new Set(placeholders(en));
for (const [name, dictionary] of Object.entries({ fr, ar })) {
  for (const token of placeholders(dictionary)) {
    if (!enPlaceholders.has(token)) {
      console.error(`[${name}] unknown placeholder: {${token}}`);
      failures += 1;
    }
  }
}

if (failures > 0) {
  console.error(`i18n check failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log(`i18n check passed: ${base.size} keys in en, fr and ar.`);
