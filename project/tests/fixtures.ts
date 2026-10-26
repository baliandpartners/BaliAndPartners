import { test as base, expect, type Page } from "@playwright/test";

/** Optional verified HTTPS transport for cloud Chromium's separate CA store. */
export async function configureHostedTransport(page: Page) {
  if (process.env.HOSTED_AUDIT_TRANSPORT !== "1") return;
  const origin = new URL(process.env.PLAYWRIGHT_BASE_URL!).origin;
  await page.route(`${origin}/**`, async (route) => {
    const response = await page.request.fetch(route.request());
    if (!route.request().failure()) await route.fulfill({ response });
  });
}

export const test = base.extend({
  page: async ({ page }, runTest) => {
    await configureHostedTransport(page);
    await runTest(page);
    if (process.env.HOSTED_AUDIT_TRANSPORT === "1") {
      // Navigation can abandon proxied requests; teardown must not wait for
      // a network-idle event belonging to a document that is no longer active.
      await page.unrouteAll({ behavior: "ignoreErrors" });
    }
  },
});
export { expect };
