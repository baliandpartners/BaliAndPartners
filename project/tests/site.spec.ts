import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { articles, services } from "../src/data/content";

const principal = [
  "/",
  "/expertise",
  "/approach",
  "/insights",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];
const routes = [
  ...principal,
  ...services.map((s) => `/expertise/${s.slug}`),
  ...articles.map((a) => `/insights/${a.slug}`),
];
const production = process.env.TEST_SITE_MODE === "production";

for (const route of routes) {
  test(`render and metadata ${route}`, async ({ page, request }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page).toHaveTitle(/Bali & Partners/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.{50,}/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      production && !route.startsWith("/insights/")
        ? "index, follow"
        : "noindex, nofollow",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://www.baliandpartners.in${route}`,
    );
    const html = await (await request.get(route)).text();
    expect(html).toContain("<h1");
    expect(html).not.toContain("<!--app-html-->");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () =>
          document.fonts.check('16px "Newsreader Variable"') &&
          document.fonts.check('16px "DM Sans Variable"'),
      ),
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.every(
            (img) =>
              (img as HTMLImageElement).complete &&
              (img as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("deployment indexing matches the intended release mode", async ({
  request,
}) => {
  const manifest = await (await request.get("/build-manifest.json")).json();
  expect(manifest.mode).toBe(production ? "production" : "preview");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(production ? "Allow: /" : "Disallow: /");
  if (production)
    expect(robots).toContain("https://www.baliandpartners.in/sitemap.xml");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("https://www.baliandpartners.in/about");
  for (const article of articles) expect(sitemap).not.toContain(article.slug);
  const response = await request.get("/");
  expect(response.headers()["x-robots-tag"]).toBe(
    production ? undefined : "noindex, nofollow",
  );
});

for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
  test(`responsive layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      ...principal,
      "/expertise/professional-communications",
      "/insights/precision-before-publication",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `Overflow at ${route} (${width}px)`).toBeLessThanOrEqual(
        1,
      );
    }
  });
}

test("desktop navigation, all internal destinations and real 404", async ({
  page,
  request,
}) => {
  const paths = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((items) => items.map((a) => a.getAttribute("href")!));
    links.forEach((href) => paths.add(href.split("#")[0]));
    const fragments = await page
      .locator('a[href^="#"]')
      .evaluateAll((items) =>
        items.map((a) => a.getAttribute("href")!.slice(1)),
      );
    for (const id of fragments)
      expect(
        await page.locator(`[id="${id}"]`).count(),
        `${route} #${id}`,
      ).toBeGreaterThan(0);
  }
  for (const path of paths)
    expect((await request.get(path)).status(), path).toBe(200);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "Expertise", exact: true })
    .click();
  await expect(page).toHaveURL(/\/expertise$/);
  await expect(page).toHaveTitle(/Our expertise/);
  expect((await request.get("/this-page-does-not-exist")).status()).toBe(404);
  await page.goto("/this-page-does-not-exist");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "clearer path",
  );
});

test("mobile navigation traps focus, supports Escape and follows a route", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const open = page.getByRole("button", { name: "Open navigation" });
  await open.click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  expect(
    await page.evaluate(() =>
      document.querySelector("dialog")?.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await dialog.getByRole("link", { name: /Contact/ }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "substance",
  );
});

test("editorial exhibit preserves qualifications and keyboard tab selection", async ({
  page,
}) => {
  await page.goto("/");
  const source = page.getByRole("tab", { name: /Source/ });
  await source.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Structure/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("tabpanel")).toContainText(
    "Email does not constitute notice",
  );
  await page.keyboard.press("End");
  await expect(page.getByRole("tabpanel")).toContainText(
    "Email does not count as notice",
  );
  await page.keyboard.press("Home");
  await expect(source).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Explore structure" }).click();
  await expect(page.getByRole("tab", { name: /Structure/ })).toBeFocused();
});

test("method controls, article filters, empty state and article navigation", async ({
  page,
}) => {
  await page.goto("/approach");
  await page.getByRole("button", { name: /Research/ }).click();
  await expect(page.locator("#method-detail")).toContainText(
    "Establish the substance",
  );
  await page.goto("/insights");
  await page
    .getByRole("searchbox", { name: "Search perspectives" })
    .fill("precision");
  await expect(page.locator(".insight-entry")).toHaveCount(1);
  await page.getByRole("searchbox").fill("no matching item 123");
  await expect(
    page.getByRole("heading", { name: "No perspectives found." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "View all perspectives" }).click();
  await expect(page.locator(".insight-entry")).toHaveCount(3);
  await page
    .getByRole("button", { name: articles[0].category, exact: true })
    .click();
  await expect(page.locator(".insight-entry")).toHaveCount(
    articles.filter((a) => a.category === articles[0].category).length,
  );
  await page.getByRole("link", { name: articles[0].title }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    articles[0].title,
  );
  await expect(page.locator(".article-sample-note")).toContainText(
    "Editorial sample",
  );
});

test("enquiry validates and prepares a real email draft without sending or persisting", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.url());
  });
  await page.goto("/contact");
  await page
    .getByRole("button", { name: "Prepare email", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("highlighted fields");
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.getByLabel("Your name").fill("Review Person");
  await page.getByLabel("Work email").fill("not-an-email");
  await page
    .getByRole("button", { name: "Prepare email", exact: true })
    .click();
  await expect(
    page.getByText("Please enter a valid email address."),
  ).toBeVisible();
  await page.getByLabel("Work email").fill("review@example.test");
  await page.getByLabel("Nature of enquiry").selectOption("Content strategy");
  await page
    .getByLabel("A brief outline")
    .fill("Please discuss an editorial plan. This is a local test.");
  await page
    .getByRole("button", { name: "Prepare email", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your draft is prepared." }),
  ).toBeVisible();
  await expect(page.getByText(/No message has been sent yet/)).toBeVisible();
  const href = await page
    .getByRole("link", { name: "Open email draft" })
    .getAttribute("href");
  expect(decodeURIComponent(href!)).toContain(
    "mailto:Shashwat@baliandpartners.in?subject=Website enquiry: Content strategy",
  );
  expect(decodeURIComponent(href!)).toContain("review@example.test");
  expect(posts).toEqual([]);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Copy draft", exact: true }).click();
  await expect(page.getByLabel("Email draft to copy")).toHaveValue(
    /review@example.test/,
  );
});

test("reduced motion and keyboard skip link", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

for (const width of [390, 1440]) {
  test(`accessibility review at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      ...principal,
      "/expertise/legal-research",
      "/insights/precision-before-publication",
    ]) {
      await page.goto(route);
      await page.evaluate(() =>
        Promise.all(
          document.getAnimations().map((animation) => animation.finished),
        ),
      );
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
        route,
      ).toEqual([]);
    }
  });
}
