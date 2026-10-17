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
  await expect(page.getByRole("button", {name:enabled ? "Reduce animations" : "Enable animations",exact:true})).toBeEnabled();
  await expect(page.locator(enabled ? ".motion-label-on" : ".motion-label-off")).toBeVisible();
  await expect(page.locator(enabled ? ".motion-label-off" : ".motion-label-on")).toBeHidden();
  await expect(page.locator(".ambient-twinkle").first()).toHaveCSS("animation-name", enabled ? "twinkle" : "none");
}

test("every visit starts ON regardless of system or legacy stored preferences", async ({page}) => {
  const errors = collectErrors(page);
  await page.goto("/");
  for (const system of ["no-preference","reduce"] as const) {
    for (const saved of [null,"full","reduced"]) {
      await page.evaluate(({key,value}) => value === null ? localStorage.removeItem(key) : localStorage.setItem(key,value), {key:MOTION_STORAGE_KEY,value:saved});
      await page.emulateMedia({reducedMotion:system});
      await page.reload();
      await expectMotion(page, true);
      expect(await page.evaluate(key=>localStorage.getItem(key), MOTION_STORAGE_KEY)).toBe(saved);
      await expect(page.getByTestId("bouquet")).toHaveCount(0);
      const star = page.locator(".ambient-twinkle").first();
      const before = await star.evaluate(el=>getComputedStyle(el).transform);
      await expect.poll(()=>star.evaluate(el=>getComputedStyle(el).transform)).not.toBe(before);
    }
  }
  expect(errors).toEqual([]);
});

test("manual controls work with blocked storage and refresh starts a new animated visit", async ({page}) => {
  const errors = collectErrors(page);
  await page.addInitScript(() => {
    for (const method of ["getItem","setItem","removeItem"] as const) {
      Object.defineProperty(Storage.prototype,method,{configurable:true,value:()=>{throw new DOMException("Storage blocked","SecurityError");}});
    }
  });
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await expectMotion(page, true);
  await page.getByRole("button",{name:"Reduce animations",exact:true}).click();
  await expectMotion(page, false);
  await page.emulateMedia({reducedMotion:"no-preference"});
  await expectMotion(page, false);
  await page.getByRole("button",{name:"Enable animations",exact:true}).click();
  await expectMotion(page, true);
  await expect(page.getByTestId("bouquet")).toHaveCount(0);
  await page.getByRole("button",{name:"Reduce animations",exact:true}).click();
  await expectMotion(page, false);
  await page.reload();
  await expectMotion(page, true);
  await page.getByRole("button",{name:"Reduce animations",exact:true}).click();
  await page.goto("about:blank");
  await page.goBack();
  await expectMotion(page,true);
  expect(errors).toEqual([]);
});

test("extension-injected body attributes do not cause an application hydration error", async ({page}) => {
  const errors = collectErrors(page);
  await page.addInitScript(() => {
    const inject = () => {
      if (!document.body) return false;
      document.body.setAttribute("data-new-gr-c-s-check-loaded","8.937.0");
      document.body.setAttribute("data-gr-ext-installed","");
      return true;
    };
    if (!inject()) {
      const observer = new MutationObserver(()=>{if(inject())observer.disconnect();});
      observer.observe(document.documentElement || document,{childList:true,subtree:true});
    }
  });
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await expect(page.locator("body")).toHaveAttribute("data-gr-ext-installed","");
  await expectMotion(page,true);
  await expect(page.getByTestId("bouquet")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("Motion ON is correct before React hydration even with saved OFF and reduced OS", async ({page}) => {
  const errors = collectErrors(page);
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await page.evaluate(key=>localStorage.setItem(key,"reduced"),MOTION_STORAGE_KEY);
  let release!:()=>void;
  const hydration = new Promise<void>(resolve=>{release=resolve;});
  await page.route(/\/_next\/static\/.*\.js(?:\?.*)?$/,async route=>{await hydration;await route.continue();});
  try {
    await page.reload({waitUntil:"commit"});
    await expect(page.locator("html")).toHaveAttribute("data-motion-preference","full");
    await expect(page.locator(".experience")).toHaveAttribute("data-motion","system");
    await expect(page.locator(".motion-control")).toBeDisabled();
    await expect(page.locator(".motion-label-on")).toBeVisible();
    await expect(page.locator(".ambient-twinkle").first()).toHaveCSS("animation-name","twinkle");
  } finally {
    release();
    await page.unrouteAll({behavior:"wait"});
  }
  await expectMotion(page,true);
  expect(await page.evaluate(key=>localStorage.getItem(key),MOTION_STORAGE_KEY)).toBe("reduced");
  expect(errors).toEqual([]);
});

test("system opt-in, manual changes, and the completed bouquet animate correctly", async ({page},info) => {
  const errors = collectErrors(page);
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await expectMotion(page,true);
  const originalViewport = page.viewportSize()!;
  await page.setViewportSize({width:1280,height:720});
  await page.evaluate(()=>document.fonts.ready);
  const envelopeBox = await page.locator(".welcome-envelope-inner").boundingBox();
  const greetingBox = await page.locator(".greeting").boundingBox();
  expect(envelopeBox!.y+envelopeBox!.height).toBeLessThanOrEqual(greetingBox!.y);
  await page.setViewportSize(originalViewport);
  await page.getByRole("button",{name:"Reduce animations",exact:true}).click();
  const reset = page.getByRole("button",{name:"Use system motion setting",exact:true});
  const box = await reset.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await reset.click();
  await expectMotion(page,false);
  await expect(page.getByRole("button",{name:"Enable animations",exact:true})).toBeFocused();
  await expect(page.locator("#motion-source")).toHaveText("Following your system motion setting for this visit.");
  await page.emulateMedia({reducedMotion:"no-preference"});
  await expectMotion(page,true);
  await page.emulateMedia({reducedMotion:"reduce"});
  await expectMotion(page,false);
  await page.getByRole("button",{name:"Enable animations",exact:true}).click();
  await expectMotion(page,true);
  await expect(page.getByTestId("bouquet")).toHaveCount(0);
  await page.screenshot({path:info.outputPath("manual-motion-header.png"),fullPage:true});
  await page.getByRole("button",{name:"Open My Surprise"}).click();
  await expect(page.getByRole("button",{name:"Open hidden letter",exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Reduce animations",exact:true}).click();
  for (const selector of [".ambient-heart",".cloud",".butterfly",".wing-left",".bouquet-sway"]) {
    await expect(page.locator(selector).first()).toHaveCSS("animation-name","none");
  }
  await page.getByRole("button",{name:"Enable animations",exact:true}).click();
  for (const selector of [".ambient-heart",".cloud",".butterfly",".wing-left",".bouquet-sway"]) {
    const moving = page.locator(selector).first();
    const before = await moving.evaluate(el=>getComputedStyle(el).transform);
    await expect.poll(()=>moving.evaluate(el=>getComputedStyle(el).transform)).not.toBe(before);
  }
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.setViewportSize({width:320,height:760});
  const control = await reset.boundingBox();
  expect(control!.x+control!.width).toBeLessThanOrEqual(320);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
