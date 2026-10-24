import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const base = process.argv[2] || "http://127.0.0.1:4173";
const output = resolve(process.argv[3] || "/workspace/bali-audit/final");
await mkdir(output, { recursive: true });
const { routes } = JSON.parse(
  await readFile("dist/build-manifest.json", "utf8"),
);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const report = {
  base,
  capturedAt: new Date().toISOString(),
  pages: [],
  controls: [],
  links: [],
  blocked: null,
};
const widths = [320, 375, 390, 430, 768, 1024, 1440, 1920];
try {
  const proxy =
    process.env.AUDIT_PROXY_TRANSPORT === "1"
      ? { server: process.env.HTTPS_PROXY || process.env.https_proxy }
      : undefined;
  const page = await browser.newPage({ proxy });
  if (proxy)
    await page.route(`${new URL(base).origin}/**`, async (route) => {
      const response = await page.request.fetch(route.request());
      await route.fulfill({ response });
    });
  try {
    await page.goto(base, { timeout: 20000 });
  } catch (error) {
    report.blocked = error.message;
    throw error;
  }
  for (const route of [
    ...routes,
    "/audit-missing-page",
    "/expertise/audit-missing",
    "/insights/audit-missing",
  ]) {
    const errors = [],
      networkFailures = [];
    const onError = (error) => errors.push(error.message);
    const onRequest = (request) => {
      if (request.failure()?.errorText !== "net::ERR_ABORTED")
        networkFailures.push({
          url: request.url(),
          error: request.failure()?.errorText,
        });
    };
    page.on("pageerror", onError);
    page.on("requestfailed", onRequest);
    const response = await page.goto(base + route);
    await page.evaluate(() => document.fonts.ready);
    const info = await page.evaluate(() => ({
      title: document.title,
      canonical: document
        .querySelector('link[rel="canonical"]')
        ?.getAttribute("href"),
      robots: document
        .querySelector('meta[name="robots"]')
        ?.getAttribute("content"),
      description: document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content"),
      h1: [...document.querySelectorAll("h1")].map((el) => el.textContent),
      images: [...document.images].map((el) => ({
        src: el.src,
        loaded: el.complete && el.naturalWidth > 0,
      })),
      fragments: [...document.querySelectorAll('a[href^="#"]')].map((el) => ({
        href: el.getAttribute("href"),
        exists: !!document.getElementById(
          decodeURIComponent(el.getAttribute("href").slice(1)),
        ),
      })),
      placeholders: /Lorem ipsum|\[CLIENT NAME\]|\[INSERT PHOTO\]/i.test(
        document.body.innerText,
      ),
    }));
    const viewports = [];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      );
      viewports.push({ width, overflow });
      if (width === 390 || width === 1440) {
        const name = route.replaceAll("/", "-").replace(/^-/, "") || "home";
        await page.screenshot({
          path: `${output}/${name}-${width}.png`,
          fullPage: true,
          animations: "disabled",
        });
        await page.screenshot({
          path: `${output}/${name}-${width}-first-screen.png`,
          animations: "disabled",
        });
      }
      if (width === 390 || width === 1440) {
        const controls = await page
          .locator("a,button,input,select,textarea,summary")
          .evaluateAll((elements) =>
            elements
              .filter((el) => el.getClientRects().length)
              .map((el) => ({
                tag: el.tagName.toLowerCase(),
                role: el.getAttribute("role"),
                name:
                  el.getAttribute("aria-label") ||
                  el.innerText?.trim() ||
                  el.labels?.[0]?.innerText ||
                  el.getAttribute("placeholder") ||
                  "",
                href: el.getAttribute("href"),
                type: el.getAttribute("type"),
                options:
                  el.tagName === "SELECT"
                    ? [...el.options].map((option) => option.value)
                    : undefined,
              })),
          );
        report.controls.push({ route, width, controls });
      }
    }
    // Inventory controls revealed only after user interaction.
    const recordState = async (state) => {
      const controls = await page
        .locator("a,button,input,select,textarea,summary")
        .evaluateAll((elements) =>
          elements
            .filter((el) => el.getClientRects().length)
            .map((el) => ({
              tag: el.tagName.toLowerCase(),
              role: el.getAttribute("role"),
              name:
                el.getAttribute("aria-label") ||
                el.innerText?.trim() ||
                el.labels?.[0]?.innerText ||
                "",
              href: el.getAttribute("href"),
              type: el.getAttribute("type"),
            })),
        );
      report.controls.push({
        route,
        width: page.viewportSize().width,
        state,
        controls,
      });
    };
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open navigation" }).click();
    await recordState("mobile menu open");
    await page.getByRole("button", { name: "Close navigation" }).click();
    if (route === "/") {
      for (const stage of ["Source", "Structure", "Clarity"]) {
        await page.getByRole("tab", { name: new RegExp(stage) }).click();
        await recordState(`editorial stage: ${stage}`);
      }
    }
    if (route === "/contact") {
      await page.getByLabel("Your name").fill("Local audit");
      await page
        .getByLabel(/Email address|Work email/)
        .fill("audit@example.test");
      await page
        .getByLabel("Nature of enquiry")
        .selectOption("Content strategy");
      await page
        .getByLabel("A brief outline")
        .fill("Local-only audit draft; never sent.");
      await page
        .getByRole("button", { name: "Prepare email", exact: true })
        .click();
      await recordState("prepared unsent draft");
      await page.evaluate(() =>
        Object.defineProperty(navigator, "clipboard", {
          value: undefined,
          configurable: true,
        }),
      );
      await page
        .getByRole("button", { name: "Copy draft", exact: true })
        .click();
      await recordState("manual draft copy");
    }
    if (route.startsWith("/insights/") && routes.includes(route)) {
      await page.evaluate(() =>
        Object.defineProperty(navigator, "clipboard", {
          value: undefined,
          configurable: true,
        }),
      );
      await page.getByRole("button", { name: "Copy article link" }).click();
      await recordState("manual article-link copy");
    }
    report.pages.push({
      route,
      status: response.status(),
      ...info,
      errors,
      networkFailures,
      viewports,
    });
    page.off("pageerror", onError);
    page.off("requestfailed", onRequest);
  }
  const internal = [
    ...new Set(
      report.controls
        .flatMap((entry) => entry.controls.map((control) => control.href))
        .filter((href) => href?.startsWith("/")),
    ),
  ];
  for (const href of internal) {
    const response = await page.request.get(base + href);
    report.links.push({ href, status: response.status() });
  }
  const failures = report.pages.filter(
    (p) =>
      p.errors.length ||
      p.networkFailures.length ||
      p.images.some((i) => !i.loaded) ||
      p.fragments.some((f) => !f.exists) ||
      p.viewports.some((v) => v.overflow > 1) ||
      p.placeholders ||
      p.status !== (routes.includes(p.route) ? 200 : 404),
  );
  if (failures.length || report.links.some((link) => link.status !== 200))
    process.exitCode = 1;
  console.log(
    `${report.pages.length} routes, ${report.controls.length} control inventories, ${report.links.length} internal destinations; ${failures.length} page failures.`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await writeFile(
    `${output}/audit.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  for (const context of browser.contexts())
    await context.unrouteAll({ behavior: "wait" });
  await browser.close();
}
