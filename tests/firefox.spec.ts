import { expect, test } from "@playwright/test";
import { MOTION_STORAGE_KEY } from "../src/lib/motion-preference";
import { surprise } from "../src/config/surprise";

// Use actual Firefox profile preferences: the BiDi driver's media emulation is
// incomplete. Profiles are temporary and do not change the visitor's browser.
test("native Firefox motion preference, bloom, secret letter, and saved overrides", async ({ page }, info) => {
  const reduced = info.project.name === "firefox-reduced";
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(reduced);
  await expect(page.locator(".experience")).toHaveAttribute("data-motion", reduced ? "reduced" : "full");
  await expect(page.locator(".ambient-twinkle").first()).toHaveCSS("animation-name", reduced ? "none" : "twinkle");
  if (!reduced) {
    const star = page.locator(".ambient-twinkle").first();
    const initial = await star.evaluate(el => getComputedStyle(el).transform);
    await expect.poll(() => star.evaluate(el => getComputedStyle(el).transform)).not.toBe(initial);
  }
  await expect(page.getByTestId("bouquet")).toHaveCount(0);
  await page.getByRole("button", {name:"Open My Surprise"}).click();
  await expect(page.getByTestId("surprise-scene")).toBeVisible();
  if (!reduced) {
    const petal = page.locator("[data-petal]").first();
    const initial = await petal.getAttribute("d");
    await expect.poll(() => petal.getAttribute("d")).not.toBe(initial);
  }
  await expect(page.getByRole("button", {name:"Open hidden letter",exact:true})).toBeVisible();
  await expect(page.getByTestId("teddy-bear")).toBeVisible();
  await expect(page.getByTestId("taters-popcorn")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", {name:"Open hidden letter",exact:true}).press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".letter-copy p")).toHaveText([...surprise.letter.paragraphs]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:info.outputPath("firefox-letter.png"),fullPage:true});
  await page.getByRole("button", {name:"Close Letter",exact:true}).click();
  await expect(page.getByRole("button", {name:"Open hidden letter",exact:true})).toBeFocused();
  await page.getByRole("button", {name:"Watch Again"}).click();
  await expect(page.getByTestId("bouquet")).toHaveCount(0);

  for (const enabled of [reduced,!reduced]) {
    await page.getByRole("button", {name:enabled ? "Enable animations" : "Reduce animations",exact:true}).click();
    const expected = enabled ? "full" : "reduced";
    await expect(page.locator(".experience")).toHaveAttribute("data-motion", expected);
    expect(await page.evaluate(key => localStorage.getItem(key), MOTION_STORAGE_KEY)).toBe(expected);
    await page.reload();
    await expect(page.locator(".experience")).toHaveAttribute("data-motion", expected);
    await expect(page.locator(".ambient-twinkle").first()).toHaveCSS("animation-name", enabled ? "twinkle" : "none");
  }
  expect(errors).toEqual([]);
});
