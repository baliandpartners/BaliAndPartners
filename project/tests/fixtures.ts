import { test as base, expect, type BrowserContext } from "@playwright/test";

/** Optional verified HTTPS transport for cloud Chromium's separate CA store. */
export async function configureHostedTransport(context: BrowserContext) {
  if (process.env.HOSTED_AUDIT_TRANSPORT !== "1") return;
  const origin = new URL(process.env.PLAYWRIGHT_BASE_URL!).origin;
  await context.route(`${origin}/**`, async (route) => {
    const response = await context.request.fetch(route.request());
    await route.fulfill({ response });
  });
}

export const test = base.extend({
  context: async ({ context }, use) => {
    await configureHostedTransport(context);
    await use(context);
    await context.unrouteAll({ behavior: "wait" });
  },
});
export { expect };
