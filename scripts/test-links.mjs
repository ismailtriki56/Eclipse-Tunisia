const base = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const locales = ["en", "fr", "ar"];
const routes = [
  "",
  "/eclipse",
  "/explorer",
  "/destinations",
  "/packages",
  "/packages/mahdia-signature",
  "/packages/eclipse-breakfast",
  "/packages/sfax-signature",
  "/packages/kerkennah-island-escape",
  "/stays",
  "/flights",
  "/plan",
  "/experiences",
  "/safety",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/providers",
];

let failures = 0;

for (const locale of locales) {
  for (const route of routes) {
    const url = `${base}/${locale}${route}`;
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status >= 400) {
        console.error(`FAIL ${response.status} ${url}`);
        failures += 1;
        continue;
      }
      if (response.status >= 300 && response.status < 400) {
        console.error(`FAIL redirect ${response.status} ${url}`);
        failures += 1;
        continue;
      }
      const html = await response.text();
      if (/href="#"|href=""/.test(html)) {
        console.error(`FAIL empty link on ${url}`);
        failures += 1;
      }
      if (!html.includes(`lang="${locale}"`)) {
        console.error(`FAIL missing lang="${locale}" on ${url}`);
        failures += 1;
      }
      console.log(`ok ${url}`);
    } catch (error) {
      console.error(`FAIL ${url}: ${error instanceof Error ? error.message : error}`);
      failures += 1;
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} link check(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${locales.length * routes.length} route checks passed.`);
