import test, { expect } from "@playwright/test"

test("Firefox: High entropy user-agent data not available", async ({
  page
}) => {
  await page.goto("http://localhost:3000/")

  await expect(
    page.getByText("High entropy user agent data not available in this browser")
  ).toBeVisible()
})
