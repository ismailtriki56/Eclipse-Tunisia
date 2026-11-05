import { expect, test } from "@playwright/test";

test("map lists verified destinations with computed durations", async ({
  page,
}) => {
  await page.goto("/en/eclipse");

  await expect(page.locator(".leaflet-container")).toBeVisible({
    timeout: 20_000,
  });

  await page.getByRole("button", { name: /Sfax/ }).first().click();
  await expect(page.getByRole("link", { name: "View details" })).toHaveAttribute(
    "href",
    "/en/destinations/sfax",
  );
  await expect(page.getByText("5 min 39 s").first()).toBeVisible();

  await page.getByRole("button", { name: /Kerkennah/ }).first().click();
  await expect(page.getByRole("link", { name: "View details" })).toHaveAttribute(
    "href",
    "/en/destinations/kerkennah",
  );
  await expect(page.getByText("5 min 38 s").first()).toBeVisible();
});
