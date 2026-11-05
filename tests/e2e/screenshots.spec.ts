import { test } from "@playwright/test";

const pages = [
  { name: "home", path: "/en" },
  { name: "packages", path: "/en/packages" },
  { name: "package-detail", path: "/en/packages/sfax-signature" },
  { name: "stays", path: "/en/stays" },
];

for (const viewport of [
  { width: 1440, height: 1000, suffix: "desktop" },
  { width: 390, height: 844, suffix: "mobile" },
]) {
  test(`capture ${viewport.suffix} screenshots`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });

    for (const entry of pages) {
      await page.goto(entry.path);
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: `docs/screenshots/${entry.name}-${viewport.suffix}.png`,
        fullPage: true,
      });
    }
  });
}
