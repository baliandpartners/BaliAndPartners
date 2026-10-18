import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const output = resolve(process.argv[2] || "review-artifacts/screenshots");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const routes = [
  "/",
  "/expertise",
  "/approach",
  "/insights",
  "/about",
  "/contact",
  "/expertise/legal-research",
  "/insights/precision-before-publication",
  "/privacy",
  "/terms",
];
const summary = [];
for (const width of [1440, 390]) {
  const page = await browser.newPage({
    viewport: { width, height: width === 390 ? 844 : 1000 },
  });
  for (const route of routes) {
    const errors = [];
    const listener = (error) => errors.push(error.message);
    page.on("pageerror", listener);
    await page.goto(`http://127.0.0.1:4173${route}`, {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    const name = `${route.replaceAll("/", "-").replace(/^-/, "") || "home"}-${width}`;
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
    await page.screenshot({ path: `${output}/${name}-first-screen.png` });
    summary.push({
      route,
      width,
      title: await page.title(),
      errors,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
    page.off("pageerror", listener);
  }
  await page.close();
}
await writeFile(
  `${output}/capture-report.json`,
  `${JSON.stringify(summary, null, 2)}\n`,
);
await browser.close();
console.log(
  `Captured ${summary.length} page/viewport combinations in ${output}`,
);
