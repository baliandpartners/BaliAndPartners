import { test, expect } from "./fixtures";

test("desktop header includes Contact once and navigation keeps focus and scroll correct", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", {
    name: "Main navigation",
    exact: true,
  });
  await expect(nav.getByRole("link")).toHaveCount(5);
  await nav.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator("main h1")).toContainText("substance");
  await expect(page.locator("#main-content")).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
  await expect(
    page
      .locator(".footer-nav")
      .getByRole("link", { name: "Contact", exact: true }),
  ).toHaveCount(1);
});

for (const width of [320, 768, 1000]) {
  test(`Contact is directly accessible in the compact header at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const contact = page.locator(".header-mobile-contact");
    await expect(contact).toBeVisible();
    await contact.click();
    await expect(page).toHaveURL(/\/contact$/);
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page
        .getByRole("navigation", { name: "Expanded navigation" })
        .getByRole("link", { name: /Contact/ }),
    ).toHaveCount(1);
    await page.keyboard.press("Escape");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
  });
}

test("fine pointer responds to controls and artwork without capturing clicks", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  const artwork = page.locator(".editorial-art");
  await artwork.hover({ position: { x: 60, y: 100 } });
  await expect
    .poll(() => artwork.evaluate((el) => el.style.getPropertyValue("--art-x")))
    .not.toBe("");
  const ring = page.locator(".precision-cursor");
  await expect(ring).toHaveAttribute("data-visible", "true");
  expect(await ring.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe(
    "none",
  );
  const contact = page
    .locator(".desktop-nav")
    .getByRole("link", { name: "Contact" });
  await contact.hover();
  await expect(ring).toHaveAttribute("data-active", "true");
  await contact.click();
  await expect(page.locator(".enquiry-form")).toBeVisible();
  await page.getByLabel("Your name").hover();
  await expect(ring).toHaveAttribute("data-visible", "false");
});

test("motion preference persists and page content stays available", async ({
  page,
}) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Reduce visual motion" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page
    .getByRole("link", { name: "Explore our expertise", exact: true })
    .click();
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
});

test("system reduced motion wins and touch pointers keep the ordinary experience", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page.mouse.move(400, 300);
  await expect(page.locator(".precision-cursor")).toBeHidden();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await page.locator(".editorial-art").dispatchEvent("pointermove", {
    pointerType: "touch",
    clientX: 400,
    clientY: 300,
  });
  await expect(page.locator(".precision-cursor")).toHaveAttribute(
    "data-visible",
    "false",
  );
});

test("navigation works without View Transitions and motion controls tolerate blocked storage", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, "startViewTransition", {
      value: undefined,
      configurable: true,
    });
    Storage.prototype.getItem = () => {
      throw new Error("Storage disabled");
    };
    Storage.prototype.setItem = () => {
      throw new Error("Storage disabled");
    };
  });
  await page.goto("/");
  await page
    .getByRole("link", { name: "Explore our expertise", exact: true })
    .click();
  await expect(page).toHaveURL(/\/expertise$/);
  await expect(page.locator("main h1")).toBeVisible();
  await page.getByRole("button", { name: "Reduce visual motion" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
});

test("rapid internal navigation follows the last requested destination", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await page.evaluate(() => {
    (
      document.querySelector(
        '.desktop-nav a[href="/about"]',
      ) as HTMLAnchorElement
    ).click();
    (
      document.querySelector(
        '.desktop-nav a[href="/expertise"]',
      ) as HTMLAnchorElement
    ).click();
  });
  await expect(page).toHaveURL(/\/expertise$/);
  await expect(page.locator("main h1")).toContainText("Substance");
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.dataset.transition ?? "finished",
      ),
    )
    .toBe("finished");
});

test("native page transitions finish promptly and Back restores the previous page", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await page
    .getByRole("link", { name: "Explore our expertise", exact: true })
    .click();
  await expect(page).toHaveURL(/\/expertise$/);
  await expect
    .poll(
      () =>
        page.evaluate(
          () => document.documentElement.dataset.transition ?? "finished",
        ),
      { timeout: 1500 },
    )
    .toBe("finished");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("main h1")).toContainText("Legal substance");
});

test.describe("Touch experience", () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  test("touch navigation keeps cursor effects off", async ({ page }) => {
    await page.goto("/");
    await page.locator(".header-mobile-contact").tap();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator(".precision-cursor")).toBeHidden();
  });
});
