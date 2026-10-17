import { expect, test, type Page } from "@playwright/test";
import { MOTION_STORAGE_KEY } from "../src/lib/motion-preference";

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  return errors;
}

async function expectMotion(page: Page, enabled: boolean) {
  await expect(page.locator("html")).toHaveAttribute("data-motion-preference", enabled ? "full" : "reduced");
  await expect(page.locator(".experience")).toHaveAttribute("data-motion", enabled ? "full" : "reduced");
  await expect(page.getByRole("button", { name: enabled ? "Reduce animations" : "Enable animations", exact:true })).toBeEnabled();
  await expect(page.locator(enabled ? ".motion-label-on" : ".motion-label-off")).toBeVisible();
  await expect(page.locator(enabled ? ".motion-label-off" : ".motion-label-on")).toBeHidden();
  await expect(page.locator(".ambient-twinkle").first()).toHaveCSS("animation-name", enabled ? "twinkle" : "none");
}

test("motion defaults on, follows OS changes, and remembers both manual choices", async ({ page, context }) => {
  const errors = collectErrors(page);
  await page.emulateMedia({ reducedMotion:"no-preference" });
  await page.goto("/");
  await expectMotion(page, true);
  expect(await page.evaluate(key => localStorage.getItem(key), MOTION_STORAGE_KEY)).toBeNull();
  // An unsaved visitor follows live accessibility changes without a refresh.
  await page.emulateMedia({ reducedMotion:"reduce" });
  await expectMotion(page, false);
  await page.emulateMedia({ reducedMotion:"no-preference" });
  await expectMotion(page, true);

  await page.getByRole("button", { name:"Reduce animations", exact:true }).click();
  await expectMotion(page, false);
  expect(await page.evaluate(key => localStorage.getItem(key), MOTION_STORAGE_KEY)).toBe("reduced");
  await page.reload();
  await expectMotion(page, false);

  // A saved ON choice takes precedence even when the OS requests reduced motion.
  await page.emulateMedia({ reducedMotion:"reduce" });
  await page.getByRole("button", { name:"Enable animations", exact:true }).click();
  await expectMotion(page, true);
  expect(await page.evaluate(key => localStorage.getItem(key), MOTION_STORAGE_KEY)).toBe("full");
  await page.reload();
  await expectMotion(page, true);
  const star = page.locator(".ambient-twinkle").first();
  const initial = await star.evaluate(el => getComputedStyle(el).transform);
  await expect.poll(() => star.evaluate(el => getComputedStyle(el).transform)).not.toBe(initial);

  // Changes in another tab of the same origin are reflected without a refresh.
  const other = await context.newPage();
  await other.emulateMedia({ reducedMotion:"reduce" });
  await other.goto("/");
  await expectMotion(other, true);
  await other.getByRole("button", { name:"Reduce animations", exact:true }).click();
  await expectMotion(page, false);
  await page.emulateMedia({ reducedMotion:"no-preference" });
  await page.reload();
  await expectMotion(page, false);
  await other.close();
  expect(errors).toEqual([]);
});

test("saved preferences and the toggle label are correct before React hydrates", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/");
  for (const scenario of [
    { saved:"full", system:"reduce", enabled:true },
    { saved:"reduced", system:"no-preference", enabled:false },
    { saved:"invalid-value", system:"reduce", enabled:false },
  ] as const) {
    await page.emulateMedia({ reducedMotion:scenario.system });
    await page.evaluate(({key,value}) => localStorage.setItem(key,value), { key:MOTION_STORAGE_KEY, value:scenario.saved });
    let release!: () => void;
    const hydration = new Promise<void>(resolve => { release = resolve; });
    // Hold Next's client bundles; the ordinary inline head script must suffice.
    await page.route(/\/_next\/static\/.*\.js(?:\?.*)?$/, async route => {
      await hydration;
      await route.continue();
    });
    try {
      await page.reload({ waitUntil:"commit" });
      await expect(page.locator("html")).toHaveAttribute("data-motion-preference", scenario.enabled ? "full" : "reduced");
      await expect(page.locator(".experience")).toHaveAttribute("data-motion", "system");
      await expect(page.locator(".motion-control")).toBeDisabled();
      await expect(page.locator(scenario.enabled ? ".motion-label-on" : ".motion-label-off")).toBeVisible();
      await expect(page.locator(".ambient-twinkle").first()).toHaveCSS("animation-name", scenario.enabled ? "twinkle" : "none");
    } finally {
      release();
      await page.unrouteAll({ behavior:"wait" });
    }
    await expectMotion(page, scenario.enabled);
  }
  expect(errors).toEqual([]);
});

test("blocked storage retains accessible defaults and a working session toggle", async ({ page }) => {
  const errors = collectErrors(page);
  await page.addInitScript(() => {
    for (const method of ["getItem","setItem"] as const) {
      Object.defineProperty(Storage.prototype, method, { configurable:true, value:() => { throw new DOMException("Storage blocked", "SecurityError"); } });
    }
  });
  await page.emulateMedia({ reducedMotion:"reduce" });
  await page.goto("/");
  await expectMotion(page, false);
  await page.getByRole("button", { name:"Enable animations", exact:true }).click();
  await expectMotion(page, true);
  await page.getByRole("button", { name:"Reduce animations", exact:true }).click();
  await expectMotion(page, false);
  await page.reload();
  await expectMotion(page, false);
  expect(errors).toEqual([]);
});
