import { test, expect } from "./fixtures";
import { mockEnquiryApi, fillEnquiry } from "./enquiry-mock";
import AxeBuilder from "@axe-core/playwright";

test("submission waits for confirmation, prevents duplicates and focuses its receipt", async ({
  page,
}) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const submissions = await mockEnquiryApi(page, async (route, body) => {
    await pending;
    await route.fulfill({
      status: 201,
      json: { received: true, reference: body.requestId },
    });
  });
  await page.goto("/contact");
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Submitting…" }),
  ).toBeDisabled();
  await expect(page.getByLabel("Your name")).toBeDisabled();
  await expect(
    page.getByRole("heading", { name: "Your enquiry is received." }),
  ).toHaveCount(0);
  release();
  await expect(page.locator(".enquiry-receipt")).toBeFocused();
  expect(submissions).toHaveLength(1);
  await expect(page.locator(".enquiry-reference")).toContainText(
    String(submissions[0].requestId),
  );
  await page.getByRole("button", { name: "Send another enquiry" }).click();
  await expect(page.getByLabel("Your name")).toHaveValue("");
});

test("unconfirmed network failure preserves values and retries with the same request ID", async ({
  page,
}) => {
  let attempts = 0;
  const submissions = await mockEnquiryApi(page, async (route, body) => {
    if (++attempts === 1) await route.abort("failed");
    else
      await route.fulfill({
        json: { received: true, reference: body.requestId },
      });
  });
  await page.goto("/contact");
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "could not confirm receipt",
  );
  await expect(page.getByLabel("Your name")).toHaveValue("Browser Test");
  await expect(page.getByRole("checkbox")).toBeChecked();
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.locator(".enquiry-receipt")).toBeVisible();
  expect(submissions[0].requestId).toBe(submissions[1].requestId);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test("callback accepts phone without email and records the preferred time", async ({
  page,
}) => {
  const submissions = await mockEnquiryApi(page);
  await page.goto("/contact");
  await fillEnquiry(page);
  await page.getByRole("radio", { name: "Request a callback" }).check();
  await page.getByLabel("Email address").fill("");
  await page
    .getByRole("button", { name: "Request a callback", exact: true })
    .click();
  await expect(page.getByLabel("Telephone number")).toBeFocused();
  await page.getByLabel("Telephone number").fill("+91 98765 43210");
  await page
    .getByLabel("Preferred callback time")
    .selectOption("Morning · 9 am–12 pm IST");
  await page
    .getByRole("button", { name: "Request a callback", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your callback request is received." }),
  ).toBeVisible();
  expect(submissions[0]).toMatchObject({
    email: "",
    phone: "+91 98765 43210",
    contactPreference: "callback",
    callbackWindow: "Morning · 9 am–12 pm IST",
    consent: true,
  });
});

test("missing consent never submits and modified retries receive a new ID", async ({
  page,
}) => {
  const submissions = await mockEnquiryApi(page, async (route) => {
    await route.fulfill({
      status: 503,
      json: { error: "temporarily_unavailable" },
    });
  });
  await page.goto("/contact");
  await fillEnquiry(page);
  await page.getByRole("checkbox").uncheck();
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.getByRole("checkbox")).toBeFocused();
  expect(submissions).toHaveLength(0);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "could not confirm receipt",
  );
  await page.getByLabel("A brief outline").fill("A different assignment.");
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  expect(submissions[0].requestId).not.toBe(submissions[1].requestId);
});

for (const error of ["rate_limited", "challenge_expired", "request_conflict"]) {
  test(`server ${error} keeps the request unconfirmed and explains recovery`, async ({
    page,
  }) => {
    await mockEnquiryApi(page, async (route) => {
      await route.fulfill({
        status:
          error === "rate_limited"
            ? 429
            : error === "request_conflict"
              ? 409
              : 400,
        json: { error },
      });
    });
    await page.goto("/contact");
    await fillEnquiry(page);
    await page
      .getByRole("button", { name: "Send enquiry", exact: true })
      .click();
    await expect(page.getByRole("alert")).toContainText(
      error === "rate_limited"
        ? "try again in an hour"
        : error === "challenge_expired"
          ? "session was refreshed"
          : "reference was already used",
    );
    await expect(page.locator(".enquiry-receipt")).toHaveCount(0);
    await expect(page.getByLabel("Your name")).toHaveValue("Browser Test");
  });
}

test("unconfigured API disables submission with honest recovery", async ({
  page,
}) => {
  await page.route("**/api/enquiries", (route) =>
    route.fulfill({ status: 503, json: { error: "temporarily_unavailable" } }),
  );
  await page.goto("/contact");
  await expect(page.getByRole("alert")).toContainText(
    "temporarily unavailable",
  );
  await expect(
    page.getByRole("button", { name: "Send enquiry", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Try again", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Your enquiry is received." }),
  ).toHaveCount(0);
});

test("a malformed success response cannot produce a receipt", async ({
  page,
}) => {
  await mockEnquiryApi(page, async (route) => {
    await route.fulfill({ json: { received: true, reference: "invalid" } });
  });
  await page.goto("/contact");
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "could not confirm receipt",
  );
  await expect(page.locator(".enquiry-receipt")).toHaveCount(0);
});

test("callback and receipt accessibility at mobile and desktop widths", async ({
  page,
}) => {
  await mockEnquiryApi(page);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contact");
    await fillEnquiry(page);
    await page.getByRole("radio", { name: "Request a callback" }).check();
    await page.getByLabel("Telephone number").fill("+91 98765 43210");
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Request a callback", exact: true })
      .click();
    await expect(page.locator(".enquiry-receipt")).toBeVisible();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  }
});

test("Try again restores an unavailable form and permits a confirmed submission", async ({
  page,
}) => {
  let available = false;
  await page.route("**/api/enquiries", async (route) => {
    if (!available)
      return route.fulfill({
        status: 503,
        json: { error: "temporarily_unavailable" },
      });
    if (route.request().method() === "GET")
      return route.fulfill({ json: { challenge: "browser-contract-fixture" } });
    const body = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      json: { received: true, reference: body.requestId },
    });
  });
  await page.goto("/contact");
  await expect(page.getByRole("alert")).toContainText(
    "temporarily unavailable",
  );
  available = true;
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.getByLabel("Your name")).toBeEnabled();
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.locator(".enquiry-receipt")).toBeVisible();
});
