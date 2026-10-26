import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import { services } from "../src/data/content";

for (const width of [390, 1440]) {
  for (const service of services) {
    test(`${service.shortTitle}: every offering opens and closes at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/expertise/${service.slug}`);
      const rows = page.locator(".deliverable-accordion");
      expect(service.deliverableDetails).toHaveLength(
        service.deliverables.length,
      );
      await expect(rows).toHaveCount(service.deliverables.length);
      for (let index = 0; index < service.deliverables.length; index++) {
        const row = rows.nth(index);
        const trigger = row.locator("summary");
        const description = row.locator(".deliverable-description");
        await expect(trigger).toContainText(service.deliverables[index]);
        await expect(description).not.toBeVisible();
        await trigger.click();
        await expect(description).toBeVisible();
        await expect(description).toHaveText(service.deliverableDetails[index]);
        expect((await description.innerText()).length).toBeGreaterThan(160);
        await trigger.focus();
        await page.keyboard.press("Enter");
        await expect(description).not.toBeVisible();
        await page.keyboard.press("Space");
        await expect(description).toBeVisible();
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
      const results = await new AxeBuilder({ page })
        .include(".service-deliverables")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations).toEqual([]);
      await page.getByRole("link", { name: "Discuss an assignment" }).click();
      await expect(page).toHaveURL(/\/contact$/);
    });
  }
}

test.describe("Progressive enhancement", () => {
  test.use({ javaScriptEnabled: false });
  test("every service disclosure works without JavaScript", async ({
    page,
  }) => {
    for (const service of services) {
      await page.goto(`/expertise/${service.slug}`);
      for (const row of await page.locator(".deliverable-accordion").all()) {
        await row.locator("summary").click();
        await expect(row.locator(".deliverable-description")).toBeVisible();
        await row.locator("summary").click();
        await expect(row.locator(".deliverable-description")).not.toBeVisible();
      }
    }
  });
});
