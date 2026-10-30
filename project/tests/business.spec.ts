import { test, expect } from "./fixtures";
import { mockEnquiryApi, fillEnquiry } from "./enquiry-mock";
import AxeBuilder from "@axe-core/playwright";
import { demonstrations } from "../src/data/demonstrations";

for (const width of [390, 1440])
  test(`service discovery carries choices into a private project brief at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const submissions = await mockEnquiryApi(page);
    await page.route("**/api/metrics", (route) =>
      route.fulfill({ status: 204 }),
    );
    await page.goto("/expertise#service-finder");
    await page
      .getByLabel("Your professional category")
      .selectOption("Law firm");
    await page.getByLabel("What do you need?").selectOption("Content strategy");
    await page
      .getByLabel("Approximate scope")
      .selectOption("A series of related pieces");
    await page.getByLabel("Assignment type").selectOption("Recurring support");
    await page.getByRole("button", { name: "Find my starting point" }).click();
    await expect(page.locator(".discovery-result")).toContainText(
      "Content Strategy",
    );
    await page.getByRole("link", { name: "Build your project brief" }).click();
    await expect(
      page.getByRole("radio", { name: "Project brief", exact: true }),
    ).toBeChecked();
    await expect(page.getByLabel("Your professional category")).toHaveValue(
      "Law firm",
    );
    await expect(page.getByLabel("Nature of enquiry")).toHaveValue(
      "Content strategy",
    );
    await expect(page.getByLabel("Assignment type")).toHaveValue(
      "Recurring support",
    );
    await page.getByLabel("Anticipated volume").selectOption("2–5 pieces");
    await page.getByLabel("Preferred timeline").selectOption("Within a month");
    await fillEnquiry(page);
    const axe = await new AxeBuilder({ page })
      .include(".enquiry-composer")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(axe.violations).toEqual([]);
    await page
      .getByRole("button", { name: "Send enquiry", exact: true })
      .click();
    await expect(page.locator(".enquiry-receipt")).toBeFocused();
    expect(submissions[0].projectBrief).toEqual({
      profession: "Law firm",
      scope: "A series of related pieces",
      engagement: "Recurring support",
      volume: "2–5 pieces",
      timeline: "Within a month",
    });
    expect(page.url()).not.toContain("browser@example");
  });

test("incomplete brief cannot submit and general enquiry can still be selected", async ({
  page,
}) => {
  const submissions = await mockEnquiryApi(page);
  await page.goto("/contact?mode=project&profession=invalid&service=invalid");
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  expect(submissions).toHaveLength(0);
  await expect(page.getByLabel("Your professional category")).toBeFocused();
  await page
    .getByRole("radio", { name: "General enquiry", exact: true })
    .check();
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.locator(".enquiry-receipt")).toBeVisible();
  expect(submissions[0].projectBrief).toBeUndefined();
});

test("each editorial study supports all keyboard stages and meaningful content", async ({
  page,
}) => {
  await page.goto("/");
  for (const item of demonstrations) {
    await page
      .getByLabel("Explore an editorial study")
      .selectOption({ label: item.name });
    const panel = page.getByRole("tabpanel");
    await expect(panel).toContainText("Fictional demonstration");
    await expect(panel).toContainText(item.copy[0]);
    await page.getByRole("tab", { name: /^Source/ }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(panel).toContainText(item.copy[1]);
    await page.keyboard.press("End");
    await expect(panel).toContainText(item.copy[2]);
  }
  const axe = await new AxeBuilder({ page })
    .include(".editorial-specimen")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
});

test("measurement strips personal URL information and honours opt-out", async ({
  page,
}) => {
  const bodies: Record<string, unknown>[] = [];
  await page.route("**/api/metrics", async (route) => {
    bodies.push(route.request().postDataJSON());
    await route.fulfill({ status: 204 });
  });
  await page.goto("/privacy?q=private-person@example.test");
  await expect.poll(() => bodies.length).toBeGreaterThan(0);
  expect(bodies[0]).toEqual({ event: "page_view", route: "/privacy" });
  await page
    .getByRole("button", { name: "Turn off anonymous measurement" })
    .click();
  const before = bodies.length;
  await page.goto("/expertise");
  await page.waitForTimeout(300);
  expect(bodies).toHaveLength(before);
});

test("browser privacy preference disables measurement", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true }),
  );
  let calls = 0;
  await page.route("**/api/metrics", async (route) => {
    calls++;
    await route.fulfill({ status: 204 });
  });
  await page.goto("/privacy");
  await expect(
    page.getByRole("button", { name: "Enable anonymous measurement" }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Enable anonymous measurement" })
    .click();
  await page.goto("/expertise");
  expect(calls).toBe(0);
});

test("service-specific brief and recurring support links preserve commissioning context", async ({
  page,
}) => {
  await mockEnquiryApi(page);
  await page.goto("/expertise/legal-research");
  await page.getByRole("link", { name: "Discuss recurring support" }).click();
  await expect(page.getByLabel("Nature of enquiry")).toHaveValue(
    "Legal research & analysis",
  );
  await expect(page.getByLabel("Assignment type")).toHaveValue(
    "Recurring support",
  );
});
