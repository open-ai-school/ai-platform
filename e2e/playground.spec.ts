import { test, expect } from "@playwright/test";

test.describe("Playground", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/playground");
  });

  test("playground loads with tabs", async ({ page }) => {
    await expect(page.locator("h1").first()).toBeVisible();
    // Should have clickable tab buttons
    const buttons = page.locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("mini games tab shows a game", async ({ page }) => {
    // The games tab should be active by default
    // Look for game content (buttons, interactive elements)
    await expect(page.locator("button").first()).toBeVisible();
  });

  test("sentiment analysis tab works", async ({ page }) => {
    // Click sentiment tab
    const sentimentTab = page.getByRole("button").filter({ hasText: /sentiment/i });
    if (await sentimentTab.isVisible()) {
      await sentimentTab.click();
      // Should show text input area
      await expect(page.locator("textarea, input[type='text']").first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("all tabs are clickable", async ({ page }) => {
    const tabTexts = ["Sentiment", "Neural", "Sorting", "Token"];
    for (const text of tabTexts) {
      const tab = page.getByRole("button").filter({ hasText: new RegExp(text, "i") });
      if (await tab.isVisible()) {
        await tab.click();
        // Tab content area should have content
        await page.waitForTimeout(300);
      }
    }
  });
});

test.describe("Playground - Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("playground is usable on mobile", async ({ page }) => {
    await page.goto("/en/playground");
    await expect(page.locator("h1").first()).toBeVisible();
    // Tabs should be accessible (scrollable or wrapped)
    const buttons = page.locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
