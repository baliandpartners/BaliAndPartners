import { test, expect } from "./fixtures";

for (const route of ["/", "/about"]) {
  for (const width of [390, 1440]) {
    test(`approved founder portrait loads on ${route} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const image = page.getByRole("img", {
        name: "Shashwat Bali, founder of Bali & Partners",
      });
      await image.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();
      await expect
        .poll(() =>
          image.evaluate(
            (el) =>
              (el as HTMLImageElement).complete &&
              (el as HTMLImageElement).naturalWidth > 0,
          ),
        )
        .toBe(true);
      const dimensions = await image.evaluate((el) => {
        const img = el as HTMLImageElement;
        const box = img.getBoundingClientRect();
        return {
          origin: new URL(img.currentSrc).origin,
          site: location.origin,
          naturalRatio: img.naturalWidth / img.naturalHeight,
          displayedRatio: box.width / box.height,
          width: box.width,
          height: box.height,
        };
      });
      expect(dimensions.origin).toBe(dimensions.site);
      expect(
        Math.abs(dimensions.naturalRatio - dimensions.displayedRatio),
      ).toBeLessThan(0.01);
      expect(dimensions.width).toBeGreaterThan(250);
      await expect(page.locator(".founder-portrait figcaption")).toContainText(
        "Shashwat Bali",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
    });
  }
}
