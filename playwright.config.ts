import type { PlaywrightTestConfig } from "@playwright/test"

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./tests",
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "Desktop Chromium",
      testDir: "./tests/chromium/",
      use: {
        browserName: "chromium",
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: "Desktop Safari",
      testDir: "./tests/webkit/",
      use: {
        browserName: "webkit",
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: "Desktop Firefox",
      testDir: "./tests/firefox/",
      use: {
        browserName: "firefox",
        viewport: { width: 1280, height: 720 }
      }
    }
  ],
  webServer: {
    command: "npm run start",
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  }
}

export default config
