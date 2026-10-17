import { expect, test, type Page } from "@playwright/test";

async function noHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test("surprise stays hidden, genuinely blooms, and opens a replayable letter", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await page.evaluate(() => document.fonts.ready);
  const open = page.getByRole("button", { name: "Open Your Surprise" });
  await expect(open).toBeVisible();
  await expect(open).toBeEnabled();
  await expect(page.getByTestId("bouquet")).toHaveCount(0);
  await expect(page.locator("[data-petal]")).toHaveCount(0);
  await expect(page.getByTestId("open-letter")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await noHorizontalOverflow(page);
  const button = await open.boundingBox();
  expect(button!.height).toBeGreaterThanOrEqual(44);
  expect(button!.y + button!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await page.screenshot({ path: info.outputPath("welcome.png"), fullPage: true });

  // Keyboard activation exercises the same native button as touch.
  await open.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("surprise-scene")).toBeVisible();
  await expect(page.getByTestId("surprise-scene")).toHaveCount(1);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByTestId("open-letter")).toHaveCount(0);
  const firstPetal = page.locator("[data-petal]").first();
  const closedGeometry = await firstPetal.getAttribute("d");
  await expect.poll(() => firstPetal.getAttribute("d")).not.toBe(closedGeometry);
  await page.screenshot({ path: info.outputPath("blooming.png"), fullPage: true });
  await expect(page.getByTestId("open-letter")).toBeVisible({ timeout: 12000 });
  await expect(page.locator("[data-flower]")).toHaveCount(7);
  await expect(page.locator("[data-petal]")).toHaveCount(266);
  await expect(firstPetal).toHaveAttribute("d", "M0 -13 C-11 -22 -18 -47 -3 -72 C0 -78 2 -77 5 -68 C19 -47 11 -24 0 -13 Z");

  // Every rotating petal must keep its local origin at the flower center.
  const maxPivotError = await page.locator("[data-flower]").first().evaluate(head => {
    const inverse = (head as SVGGElement).getCTM()!.inverse();
    return Math.max(...Array.from(head.querySelectorAll("[data-petal]")).map(petal => {
      const matrix = inverse.multiply((petal.parentElement as unknown as SVGGElement).getCTM()!);
      return Math.hypot(matrix.e, matrix.f);
    }));
  });
  expect(maxPivotError).toBeLessThan(.1);
  await expect(page.getByTestId("teddy-bear")).toBeVisible();
  await expect(page.getByTestId("taters-popcorn")).toBeVisible();
  await expect(page.locator("[data-testid='taters-popcorn'] text").first()).toHaveText("Taters");
  const envelope = page.getByTestId("open-letter");
  const envelopeBox = await envelope.boundingBox();
  expect(envelopeBox!.height).toBeGreaterThanOrEqual(44);
  expect(envelopeBox!.y + envelopeBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await noHorizontalOverflow(page);
  await page.screenshot({ path: info.outputPath("bouquet.png"), fullPage: true });

  await envelope.click();
  await expect(page.locator(".envelope-is-flap")).toBeAttached();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".envelope-is-lifting")).toBeAttached();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("heading", { name: "My love," })).toBeFocused();
  await expect(dialog).toContainText("the love behind them is real");
  await expect(dialog).toContainText("Paulo");
  await expect(page.locator(".experience")).toHaveAttribute("data-paused", "true");
  await noHorizontalOverflow(page);
  await page.screenshot({ path: info.outputPath("letter.png"), fullPage: true });
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close Letter", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTestId("open-letter")).toBeFocused();

  // It can be reopened after closing, without replaying or stale fold state.
  await page.getByTestId("open-letter").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close Letter", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Watch Again" }).click();
  await expect(open).toBeVisible();
  await expect(open).toBeFocused();
  await expect(page.getByTestId("bouquet")).toHaveCount(0);
  await open.click();
  await expect(page.getByTestId("surprise-scene")).toBeVisible();
  await expect(page.getByTestId("open-letter")).toHaveCount(0);
  await expect(page.getByTestId("surprise-scene")).toHaveAttribute("data-bloomed", "false");
  expect(errors).toEqual([]);
});

test("reduced motion skips growth but preserves deliberate reveal and letter controls", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("bouquet")).toHaveCount(0);
  await page.getByRole("button", { name: "Open Your Surprise" }).click();
  await expect(page.getByTestId("open-letter")).toBeVisible({ timeout: 3000 });
  expect(await page.locator(".bouquet-sway").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByTestId("open-letter").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await noHorizontalOverflow(page);
  await page.screenshot({ path: info.outputPath("reduced-motion-letter.png"), fullPage: true });
  await page.getByRole("button", { name: "Watch Again" }).last().click();
  await expect(page.getByTestId("welcome-screen")).toBeVisible();
  await expect(page.getByTestId("bouquet")).toHaveCount(0);
  expect(errors).toEqual([]);
});
