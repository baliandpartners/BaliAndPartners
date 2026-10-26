import type { Page, Route } from "@playwright/test";

/** Browser-only API contract fixture. Real database acceptance is verified separately. */
export async function mockEnquiryApi(
  page: Page,
  submit?: (route: Route, body: Record<string, unknown>) => Promise<void>,
) {
  const submissions: Record<string, unknown>[] = [];
  await page.route("**/api/enquiries", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        json: { challenge: "browser-contract-test-challenge" },
      });
      return;
    }
    const body = route.request().postDataJSON();
    submissions.push(body);
    if (submit) await submit(route, body);
    else
      await route.fulfill({
        status: 201,
        json: { received: true, reference: body.requestId },
      });
  });
  return submissions;
}
export async function fillEnquiry(page: Page) {
  await page.getByLabel("Your name").fill("Browser Test");
  await page.getByLabel("Email address").fill("browser@example.test");
  await page.getByLabel("Nature of enquiry").selectOption("Content strategy");
  await page
    .getByLabel("A brief outline")
    .fill("A research and editorial assignment.");
  await page.getByRole("checkbox").check();
}
