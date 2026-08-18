import { expect, test } from "@playwright/test";

test("shows an error when booking data cannot be loaded", async ({ page }) => {
  await page.route("**/api/screenings/screening/1", async (route) => {
    await route.abort();
  });

  await page.goto("/booking/1");

  await expect(page.getByRole("alert")).toHaveText("Failed to load screening.");
});
