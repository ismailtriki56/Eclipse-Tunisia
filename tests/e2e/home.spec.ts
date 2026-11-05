import { expect, test } from "@playwright/test";

test("home page leads with the eclipse and both primary journeys", async ({
  page,
}) => {
  await page.goto("/en");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "longest total solar eclipse",
  );

  const packages = page.getByRole("link", {
    name: "View eclipse packages",
  });
  const path = page.getByRole("link", { name: "Explore the path" });

  await expect(packages).toHaveAttribute("href", "/en/packages");
  await expect(path).toHaveAttribute("href", "/en/explorer");

  await packages.click();
  await expect(page).toHaveURL(/\/en\/packages$/);
  await expect(
    page.getByRole("heading", { name: "Six ways to meet the shadow." }),
  ).toBeVisible();
});
