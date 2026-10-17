import { defineConfig, devices } from "@playwright/test";

const sizes = [
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "desktop", width: 1440, height: 1000 },
];

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  timeout: 35000,
  expect: { timeout: 10000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [...["chromium", "webkit"].flatMap(engine => sizes.map(size => ({
    name: `${engine}-${size.name}`,
    use: {
      browserName: engine as "chromium" | "webkit",
      ...(engine === "chromium" ? { channel: "chrome" } : {}),
      viewport: { width: size.width, height: size.height },
      hasTouch: size.name !== "desktop",
    },
  }))),
  { name: "android-pixel", use: { ...devices["Pixel 7"], browserName: "chromium", channel: "chrome", deviceScaleFactor: 2 } },
  { name: "ios-iphone", use: { ...devices["iPhone 13"], browserName: "webkit", deviceScaleFactor: 2 } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60000,
  },
});
