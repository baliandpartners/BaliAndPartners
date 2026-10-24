import { test, expect, configureHostedTransport } from "./fixtures";
import {
  articles,
  services,
  isIndexableArticle,
  validateArticles,
  type Article,
} from "../src/data/content";

test("homepage capability previews, all process steps and specimen controls", async ({
  page,
}) => {
  await page.goto("/");
  for (const service of services) {
    const link = page
      .locator(".capability-row")
      .filter({ hasText: service.shortTitle });
    await link.focus();
    await expect(page.locator(".capability-aside > p")).toHaveText(
      service.description,
    );
    await expect(link).toHaveAttribute("href", `/expertise/${service.slug}`);
  }
  for (const name of ["Discover", "Research", "Develop", "Review", "Deliver"]) {
    const step = page
      .locator(".method-timeline button")
      .filter({ hasText: name });
    await step.focus();
    await page.keyboard.press("Enter");
    await expect(step).toHaveAttribute("aria-expanded", "true");
    await expect(step.locator(".method-copy")).toBeVisible();
  }
  const source = page.getByRole("tab", { name: /Source/ });
  await source.click();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: /Clarity/ })).toBeFocused();
  await page.getByRole("button", { name: "Revisit the source" }).click();
  await expect(source).toBeFocused();
  await page.getByRole("button", { name: "Explore structure" }).click();
  await page.getByRole("button", { name: "Explore clarity" }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Email does not count as notice",
  );
  await page.getByRole("link", { name: "A little more perspective" }).click();
  await expect(page).toHaveURL(/#perspective$/);
  await page.getByRole("link", { name: "Back to top" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
});

test("all services retain commissioning detail, enquiry and next-service navigation", async ({
  page,
}) => {
  for (const [index, service] of services.entries()) {
    await page.goto(`/expertise/${service.slug}`);
    await page.reload();
    await expect(page.locator("h1")).toHaveText(service.title);
    await expect(page.locator(".service-commissioning")).toContainText(
      service.firstAssignment,
    );
    await page.getByRole("link", { name: "Discuss an assignment" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await page.goBack();
    await page.locator(".next-capability a").click();
    await expect(page).toHaveURL(
      new RegExp(`/expertise/${services[(index + 1) % services.length].slug}$`),
    );
  }
});

test("approach selectors and every disclosure work from keyboard", async ({
  page,
}) => {
  await page.goto("/approach");
  for (const name of ["Discover", "Research", "Develop", "Review", "Deliver"]) {
    const button = page
      .locator(".method-steps button")
      .filter({ hasText: name });
    await button.focus();
    await page.keyboard.press("Space");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#method-detail h3")).not.toBeEmpty();
  }
  for (const disclosure of await page.locator("details").all()) {
    await disclosure.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(disclosure.locator("p")).toBeVisible();
  }
});

test("reading-room filters combine, reset and survive browser back", async ({
  page,
}) => {
  await page.goto("/insights");
  for (const article of articles) {
    await page
      .getByRole("button", { name: article.category, exact: true })
      .click();
    await page.getByRole("searchbox").fill(article.title.split(" ")[0]);
    await expect(page.locator(".insight-entry")).toHaveCount(1);
    await page.getByRole("link", { name: article.title }).click();
    await page.goBack();
    await expect(page.getByRole("searchbox")).toHaveValue(
      article.title.split(" ")[0],
    );
    await expect(page.locator(".insight-entry")).toHaveCount(1);
  }
  await page.getByRole("searchbox").fill("no matching content");
  await page.getByRole("button", { name: "View all perspectives" }).click();
  await expect(page.locator(".insight-entry")).toHaveCount(articles.length);
  await page.getByRole("searchbox").fill("writing");
  await expect(page.locator(".insight-entry")).toHaveCount(1);
});

test("every article supports copy, selectable fallback, anchors, progress and related links", async ({
  page,
}) => {
  for (const article of articles) {
    await page.goto(`/insights/${article.slug}`);
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            (window as unknown as { copied: string }).copied = value;
          },
        },
      }),
    );
    await page.getByRole("button", { name: "Copy article link" }).click();
    await expect(page.getByRole("status")).toContainText("Link copied.");
    expect(
      await page.evaluate(
        () => (window as unknown as { copied: string }).copied,
      ),
    ).toBe(`https://www.baliandpartners.in/insights/${article.slug}`);
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: undefined,
      }),
    );
    await page.getByRole("button", { name: "Copy article link" }).click();
    await expect(page.getByLabel("Article link to copy")).toBeFocused();
    await expect(page.getByLabel("Article link to copy")).toHaveValue(
      `https://www.baliandpartners.in/insights/${article.slug}`,
    );
    for (const section of article.sections) {
      await page.locator(`.article-sidebar a[href="#${section.id}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#${section.id}$`));
      await expect(page.locator(`#${section.id}`)).toBeInViewport();
    }
    await expect
      .poll(() =>
        page
          .locator(".reading-progress span")
          .evaluate((el) =>
            parseFloat((el as HTMLElement).style.transform.slice(7)),
          ),
      )
      .toBeGreaterThan(0);
    await page.locator(".related-reading > a").first().click();
    await expect(page.locator("h1")).not.toHaveText(article.title);
  }
});

test("enquiry choices and clipboard success preserve honest draft semantics", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Local Test");
  await page.getByLabel("Email address").fill("visitor@example.test");
  await page
    .getByLabel("A brief outline")
    .fill("A research assignment for review.");
  const select = page.getByLabel("Nature of enquiry");
  for (const value of await select
    .locator("option")
    .evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLOptionElement).value).filter(Boolean),
    )) {
    await select.selectOption(value);
    await page
      .getByRole("button", { name: "Prepare email", exact: true })
      .click();
    await expect(
      page.getByRole("link", { name: "Open email draft" }),
    ).toHaveAttribute(
      "href",
      new RegExp(
        encodeURIComponent(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      ),
    );
  }
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          (window as unknown as { draft: string }).draft = value;
        },
      },
    }),
  );
  await page.getByRole("button", { name: "Copy draft", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Draft copied" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => (window as unknown as { draft: string }).draft),
  ).toContain("visitor@example.test");
  await expect(
    page.getByText("No message has been sent yet.", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("A brief outline").fill("Changed draft");
  await expect(
    page.getByRole("link", { name: "Open email draft" }),
  ).toHaveCount(0);
  await expect(page.locator(".enquiry-character-count")).toHaveText("13/1500");
});

test("unknown slugs, malformed fragments and canonical redirects are safe", async ({
  page,
  request,
}) => {
  for (const route of ["/expertise/unknown", "/insights/unknown", "/unknown"]) {
    const response = await request.get(route);
    expect(response.status()).toBe(404);
    await page.goto(route);
    await expect(page.locator("h1")).toContainText("clearer path");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
  }
  for (const route of ["/about/", "/about.html", "/about/index.html"]) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe("/about");
  }
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#%E0%A4%A");
  await expect(page.locator("h1")).toBeVisible();
  expect(errors).toEqual([]);
});

test("touch and landscape navigation close, restore focus and release body scrolling", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    proxy:
      process.env.HOSTED_AUDIT_TRANSPORT === "1"
        ? { server: process.env.HTTPS_PROXY || process.env.https_proxy! }
        : undefined,
    viewport: { width: 667, height: 375 },
    hasTouch: true,
    isMobile: true,
  });
  await configureHostedTransport(context);
  const page = await context.newPage();
  await page.goto(baseURL!);
  const open = page.getByRole("button", { name: "Open navigation" });
  await open.tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await page.getByRole("button", { name: "Close navigation" }).tap();
  await expect(open).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await open.tap();
  await page.touchscreen.tap(3, 3);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await open.tap();
  await page.getByRole("dialog").getByRole("link", { name: /About/ }).tap();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await context.unrouteAll({ behavior: "wait" });
  await context.close();
});

test("publication validation rejects incomplete, unapproved and broken-source content", () => {
  expect(() => validateArticles(articles)).not.toThrow();
  expect(articles.every((article) => !isIndexableArticle(article))).toBe(true);
  // Test-only record; never included in the website content collection.
  const fixture: Article = {
    ...articles[0],
    kind: "publication",
    label: "Legal perspective",
    approved: true,
    author: { name: "Test fixture" },
    publishedAt: "2026-10-22",
    jurisdiction: "Test only",
    sources: [
      {
        id: "authority",
        title: "Test source",
        citation: "Fixture citation",
        url: "https://example.test/source",
      },
    ],
    qualifications: "Test fixture only",
    disclaimer: "Not published",
    indexable: true,
  };
  expect(() => validateArticles([fixture])).not.toThrow();
  expect(isIndexableArticle(fixture)).toBe(true);
  expect(() =>
    validateArticles([{ ...fixture, approved: false } as unknown as Article]),
  ).toThrow();
  expect(() =>
    validateArticles([{ ...fixture, publishedAt: "2026-02-30" }]),
  ).toThrow();
  expect(() => validateArticles([{ ...fixture, sources: [] }])).toThrow();
  expect(() =>
    validateArticles([
      {
        ...fixture,
        sections: [{ ...fixture.sections[0], sourceIds: ["missing"] }],
      },
    ]),
  ).toThrow();
  expect(() =>
    validateArticles([
      {
        ...fixture,
        sources: [{ ...fixture.sources[0], url: "javascript:alert(1)" }],
      },
    ]),
  ).toThrow();
});
