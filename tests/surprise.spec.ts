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
  const open = page.getByRole("button", { name: "Open My Surprise" });
  await expect(open).toBeVisible();
  await expect(open).toBeEnabled();
  await expect(page.getByTestId("bouquet")).toHaveCount(0);
  await expect(page.locator("[data-petal]")).toHaveCount(0);
  await expect(page.getByTestId("open-letter")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".ambient-cloud")).toHaveCount(4);
  const cloud = page.locator(".ambient-cloud").first();
  const before = await cloud.evaluate(el => getComputedStyle(el).transform);
  await expect.poll(() => cloud.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
  expect(await page.locator(".ambient-twinkle").first().evaluate(el => getComputedStyle(el).animationName)).toBe("twinkle");
  // Sample running effects, not just animation names or screenshots.
  for (const selector of [".ambient-heart", ".ambient-twinkle"]) {
    const effect = page.locator(selector).first();
    const initial = await effect.evaluate(el => getComputedStyle(el).transform);
    await expect.poll(() => effect.evaluate(el => getComputedStyle(el).transform)).not.toBe(initial);
  }
  const independent = await page.evaluate(() => {
    const durations = (selector: string) => Array.from(document.querySelectorAll(selector)).map(el => getComputedStyle(el).animationDuration);
    return {
      parents: Array.from(document.querySelectorAll(".ambient-layer")).map(el => getComputedStyle(el).animationName),
      stars: new Set(durations(".ambient-twinkle")).size,
      hearts: new Set(durations(".ambient-heart")).size,
      clouds: new Set(durations(".ambient-cloud")).size,
      phases: new Set(Array.from(document.querySelectorAll(".ambient-twinkle")).map(el => getComputedStyle(el).animationDelay)).size,
    };
  });
  expect(independent).toEqual({ parents:["none","none"], stars:24, hearts:8, clouds:4, phases:24 });
  await expect(page.locator(".butterfly")).toHaveCount(0);
  await noHorizontalOverflow(page);
  const button = await open.boundingBox();
  expect(button!.height).toBeGreaterThanOrEqual(44);
  expect(button!.y + button!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await page.screenshot({ path: info.outputPath("welcome.png"), fullPage: true });

  // Keyboard activation exercises the same native button as touch.
  await open.focus();
  const revealStart = Date.now();
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
  expect(Date.now() - revealStart).toBeLessThan(7500);
  await expect(page.locator(".butterfly")).toHaveCount(2);
  for (const selector of [".butterfly-one", ".butterfly-two", ".wing-left", ".wing-right"]) {
    const moving = page.locator(selector).first();
    const initial = await moving.evaluate(el => getComputedStyle(el).transform);
    await expect.poll(() => moving.evaluate(el => getComputedStyle(el).transform)).not.toBe(initial);
  }
  const flights = await page.locator(".butterfly").evaluateAll(elements => elements.map(el => {
    const style = getComputedStyle(el);
    return [style.animationName, style.animationDuration, style.animationDelay];
  }));
  expect(flights[0][0]).not.toBe(flights[1][0]);
  expect(flights[0][1]).not.toBe(flights[1][1]);
  expect(flights[0][2]).not.toBe(flights[1][2]);
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
  expect(await page.locator(".teddy-eyes").evaluate(el => getComputedStyle(el).animationName)).toBe("teddy-blink");
  const artBox = await page.locator(".greeting-illustration").boundingBox();
  for (const id of ["teddy-bear", "taters-popcorn", "bouquet"]) {
    const box = await page.getByTestId(id).boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(artBox!.x - 5);
    expect(box!.x + box!.width).toBeLessThanOrEqual(artBox!.x + artBox!.width + 5);
  }
  if (page.viewportSize()!.width >= 800) expect(artBox!.width).toBeGreaterThan(750);
  const envelope = page.getByTestId("open-letter");
  await expect(page.getByRole("button", { name:"Open hidden letter", exact:true })).toBeVisible();
  expect(await envelope.innerText()).toBe("");
  await expect(page.getByText(/Read My Letter|Open My Letter/i)).toHaveCount(0);
  // Admiring the completed bouquet never opens the secret automatically.
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const envelopeBox = await envelope.boundingBox();
  expect(envelopeBox!.height).toBeGreaterThanOrEqual(44);
  expect(envelopeBox!.y + envelopeBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await noHorizontalOverflow(page);
  await page.screenshot({ path: info.outputPath("bouquet.png"), fullPage: true });

  // WebKit may return from a real tap after a short flap transition has ended.
  // Observe the sequence before activation so every physical stage is recorded.
  await page.evaluate(() => {
    const state = window as unknown as { openingStages: {stage:string|null; dialog:boolean}[] };
    state.openingStages = [];
    const target = document.querySelector(".secret-letter")!;
    const observer = new MutationObserver(() => {
      const stage = target.getAttribute("data-stage");
      state.openingStages.push({stage, dialog:!!document.querySelector("dialog")});
      if (stage === "lifting") observer.disconnect();
    });
    observer.observe(target, { attributes:true, attributeFilter:["data-stage"] });
  });
  if (info.project.use.hasTouch) await envelope.tap();
  else await envelope.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { openingStages:unknown }).openingStages)).toEqual([
    {stage:"forward",dialog:false}, {stage:"release",dialog:false}, {stage:"flap",dialog:false}, {stage:"lifting",dialog:false},
  ]);
  await expect(page.getByRole("heading", { name: "My love," })).toBeFocused();
  await expect(page.locator(".letter-copy p")).toHaveText([
    "These flowers may only be virtual, but the love behind them is real.",
    "I made this kind of flowers because I wanted to give you something special. Even though it's just a virtual bouquet, I hope these flowers make you smile and remind you how much you mean to me.",
    "Thank you for making my days brighter and for being someone so wonderful in my life.",
    "I love you so much. 💜",
  ]);
  await expect(dialog).toContainText("the love behind them is real");
  await expect(dialog).toContainText("Paulo");
  await expect(page.locator(".experience")).toHaveAttribute("data-paused", "true");
  expect(await page.locator(".ambient-heart").first().evaluate(el => getComputedStyle(el).animationPlayState)).toBe("paused");
  await noHorizontalOverflow(page);
  await expect(page.locator(".letter-paper")).toHaveCSS("opacity", "1");
  if (page.viewportSize()!.height <= 740) {
    const closeBox = await dialog.getByRole("button", { name: "Close Letter", exact: true }).boundingBox();
    expect(closeBox!.y + closeBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height - 10);
  }
  await page.screenshot({ path: info.outputPath("letter.png"), fullPage: true });
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close Letter", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTestId("open-letter")).toBeFocused();

  // It can be reopened after closing, without replaying or stale fold state.
  await page.getByTestId("open-letter").press("Space");
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
  await page.getByRole("button", { name: "Open My Surprise" }).click();
  await expect(page.getByTestId("open-letter")).toBeVisible({ timeout: 3000 });
  expect(await page.locator(".bouquet-sway").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  for (const selector of [".ambient-cloud", ".ambient-twinkle", ".butterfly", ".teddy-eyes"]) {
    expect(await page.locator(selector).first().evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  }
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByTestId("open-letter").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await noHorizontalOverflow(page);
  await page.screenshot({ path: info.outputPath("reduced-motion-letter.png"), fullPage: true });
  await page.getByRole("button", { name: "Watch Again" }).last().click();
  await expect(page.getByTestId("welcome-screen")).toBeVisible();
  await expect(page.getByTestId("bouquet")).toHaveCount(0);
  // The visitor can explicitly opt into movement, including on a reduced-motion OS.
  await page.getByRole("button", { name:"Enable animations", exact:true }).click();
  await expect(page.locator(".experience")).toHaveAttribute("data-motion", "full");
  expect(await page.locator(".ambient-heart").first().evaluate(el => getComputedStyle(el).animationName)).toBe("heart-wander");
  await page.getByRole("button", { name:"Reduce animations", exact:true }).click();
  expect(await page.locator(".ambient-heart").first().evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  expect(errors).toEqual([]);
});
