import { test, expect } from "@playwright/test"

test("Chromium: Returns high entropy user-agent data", async ({ page }) => {
  await page.goto("http://localhost:3000/")

  await expect(page.getByText("Mobile: No")).toBeVisible()
  await expect(page.getByText("Brands: Chromium, Not_A Brand")).toBeVisible()
  await expect(page.getByText("Architecture: x86")).toBeVisible()
  await expect(page.getByText("Bitness: 64")).toBeVisible()
  await expect(page.getByText("Model:")).toBeVisible()
  await expect(page.getByText("Platform: Linux")).toBeVisible()
  await expect(page.getByText("Wow64: No")).toBeVisible()
  await expect(
    page.getByText("Full Version List: Chromium, Not_A Brand")
  ).toBeVisible()
})
