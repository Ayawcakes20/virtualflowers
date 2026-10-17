# A Little Sunshine For You 💜

A personal, animated flower surprise from Paulo. Built with Next.js App Router, TypeScript, React, Tailwind CSS, Motion for React, original SVG illustrations, and CSS animation.

Source repository: [Ayawcakes20/virtualflowers](https://github.com/Ayawcakes20/virtualflowers). **The application has not been deployed to Vercel.** It is ready for local preview and deployment when you choose to publish the website.

## Run locally

Use Node.js 22.13+ or Node.js 24 LTS, and npm. The implementation was built with Node 24.11.1. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). To check the production version, stop the development server first, then run:

```sh
npm run build
npm start
```

No environment variables, accounts, databases, API keys, audio, or paid services are needed by the app. Fonts are bundled locally; it makes no runtime requests to Google Fonts. All interactions run in the browser.

## The experience

1. The welcome screen contains a sealed envelope, drifting clouds and hearts, twinkling stars, soft light motes, and a moving lavender gradient. The bouquet and all flower SVG elements are **absent from the DOM** until **Open My Surprise 💜** is activated.
2. A short exit transition leads into the illustrated postcard. Purple paper forms, green stems draw upward, leaves unfold, and buds open into seven layered sunflowers.
3. The sunflowers have **266 separately animated petals**. Each petal's Bézier path moves through folded, cupped, and fully open shapes, with independently staggered pivots, highlights, and veins. These are real SVG geometry and transform animations, not raster illustrations sliding into view.
4. Twelve smaller lavender/cream flowers and baby's breath finish the bouquet. The larger teddy bounces in, breathes, blinks, and occasionally waves. The detailed Taters popcorn kernels pop into place. Two butterflies flutter around the scene. Clouds, rays, petals, leaves, and flower corollas continue subtle secondary motion.
5. After approximately **4.4 seconds** of growing, a small cream heart seal becomes part of the purple wrapper. It is the secret letter control: there is no visible label, tooltip, instruction, large envelope, or automatic opening. Its native button has a 44×44px touch target and the screen-reader name **Open hidden letter**.
6. Tapping the heart lifts the folded card, reveals the little envelope, releases its seal, hinges the flap open, and lifts the cream paper. The stationery then unfolds from that position into the unchanged letter. Close Letter or Escape returns focus to the heart. Watch Again returns to the welcome screen; a new tap starts the complete growth sequence again.

The illustrated objects remain in one SVG coordinate system: desktop gets a larger landscape postcard, while phones use a tighter square view that keeps every essential object visible. The heart control is anchored to the same wrapper coordinates at both aspect ratios. Every background ornament owns its animation; layer containers do not animate. Twenty-four SVG sparkles have separate sizes, brightness, rotations, periods, and negative phases. Eight lavender/pink/cream hearts follow varied drifting paths, four clouds drift at different rates and directions, twelve small motes rise, and two occasional light trails cross the margins. The lavender light layers move independently. Two original butterflies hover around the bouquet on separate flight paths with different rests; each wing rotates around its attachment point with its own hinge animation. All parameters are deterministic.

The letter uses native modal `<dialog>` behavior, a labeled heading, focus containment, a scrollable paper, and focus restoration. **Every new visit starts with Motion on**, including when the browser reports reduced motion or an older OFF preference is stored. This follows the latest explicit request that she decides whether to turn the animation off. The existing **Motion on/off** control immediately changes the experience for the current visit. Refreshing or reopening starts animated again. Turning Motion on never opens the surprise or letter automatically. Ambient CSS animations pause while the document is hidden or the letter is open; SVG growth animations are finite and unmount on replay.

### Motion preference initialization

The current policy is **new visit → Motion on; manual controls → current visit only**. This intentionally replaces the previous saved-choice/system-default policy. The reported Firefox state (`savedChoice: "reduced"`, `systemReduced: true`) explained the earlier OFF behavior; it was expected under that previous policy. Existing `little-sunshine:motion:v1` values are left untouched and no longer determine startup. No motion selection is written to browser storage.

`src/lib/motion-preference.ts` sets full motion before the first paint, so the visible label and ambient CSS start consistently while React loads. `src/hooks/useMotionPreference.ts` uses `useSyncExternalStore` with a stable server snapshot and a primitive per-document state to drive CSS, `MotionConfig`, and SVG growth together. A `pageshow` handler also restores Motion on when returning through the browser's back/forward cache. The session toggle works even when storage is blocked. After a manual selection, a keyboard-accessible reset icon offers **Use system motion setting** for that visit; following the system is now an explicit choice, and reopening still starts ON. Focus returns to the main motion button after using it. All listeners are removed on unmount. No OS/browser settings, cookies, personal data, or server storage are modified.

### Local Firefox troubleshooting

Keep the terminal running `npm run dev` open while previewing. Repeated `/_next/...hmr` WebSocket failures mean the development server stopped or restarted; restart it and reload the tab. They do not mean the flower geometry failed. A production server has no development HMR connection.

The screenshot's `getItem is not defined` console error comes from calling `getItem(...)` on its own. The correct read-only command is `localStorage.getItem('little-sunshine:motion:v1')`. A returned legacy `reduced` value is retained but no longer controls startup under the current policy.

The supplied hydration screenshot identifies Grammarly's `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed` attributes on `<body>`. That is extension mutation before hydration, a [documented cause of hydration warnings](https://nextjs.org/docs/messages/react-hydration-error). The otherwise static body wrapper now has a shallow hydration exception; application-subtree checks remain active, and a browser test injects those exact attributes. If an extension continues interfering, [turn Grammarly off for localhost](https://support.grammarly.com/hc/en-us/articles/115000091612-Turn-off-Grammarly-on-one-or-more-websites) and reload.

To confirm the current startup policy in Firefox: open the site, verify **Motion on**, turn it off and observe the loops stop, then refresh and verify **Motion on** again. Old stored OFF values and the OS's reduced-motion setting do not suppress the initial animation. A fresh private window also starts ON. The bouquet still requires **Open My Surprise**.

The personalized letter's eyebrow, salutation, four paragraphs, and closing are preserved from the current configuration, including the latest manual letter edit. Browser tests compare the rendered paragraphs with that configuration.

## Personalize it

Edit **`src/config/surprise.ts`**. Personal text is kept in this one file.

```ts
girlfriendName: "Her name", // or leave empty for "Hi love! 💜"
from: "Paulo",
```

Change `welcome` for the first screen, `scene.heading` and `scene.subtitle` for the postcard heading, `letter.salutation`, `letter.paragraphs`, and `letter.closing` for the love letter, and `closingMessage` for the footer. Each entry in `letter.paragraphs` becomes a separate paragraph. React renders the strings as text, so no HTML is needed. Longer letters scroll within the modal.

Change `theme` for the principal colors. Fine illustration details and secondary tones are in the SVG components and `src/app/globals.css`; natural sunflower yellows, leaf greens, and teddy browns have their own palettes. `timing.growthSpeed` defaults to `0.66`; `0.55` is faster and `0.8` slower. Other `timing` entries tune stems, petals, decoration entrances, the envelope approach, flap, paper lift, and final unfolding. Envelope availability is calculated from the bouquet choreography rather than an unrelated timeout.

For changing bouquet density and placement, edit `sunflowers` and `smallFlowers` in `src/components/flowers/AnimatedBouquet.tsx`. Sunflowers share the same stem endpoints and bloom coordinates. The initial and final petal paths in `BloomingPetal.tsx` must keep matching SVG commands for smooth interpolation. Motion's `originX` / `originY` are explicitly set with `transformBox: "view-box"` to preserve local flower pivots.

## Source structure

```text
src/
  app/                    App Router page, metadata, styles, favicon
  config/surprise.ts      Personal copy, palette, animation timing
  components/
    SurpriseExperience    Welcome / postcard / modal state and replay
    WelcomeScreen         Sealed opening screen, no flowers
    SurpriseScene         Greeting-card composition and reveal completion
    LoveEnvelope          Hidden wrapper heart, seal release, flap, paper lift
    LoveLetter            Accessible native modal and personal message
    Ornaments             Independent sky, stars, hearts, lights, hinged butterflies
    flowers/              Petals, sunflower layers, stems, leaves, wrapper
    illustrations/        Teddy, popcorn, sun, clouds, grass, drifting petals
  hooks/useMotionPreference.ts  Per-visit motion and optional system subscription
  lib/motion-preference.ts      Always-ON pre-paint initialization, legacy key
tests/surprise.spec.ts     End-to-end interaction and layout checks
tests/motion-preference.spec.ts  Always-ON visits, controls, hydration, extension regression
tests/firefox.spec.ts     Native Firefox settings, surprise, per-visit choices
playwright.config.ts      Chrome + WebKit, phone and desktop widths
```

## Research and selected techniques

Research included the actual runnable code snippets in the official guides and source inspection of the public example below. No proprietary animation, reference image, generated image, stock asset, official Taters logo, or third-party flower component was incorporated.

| Source | Technique / decision |
| --- | --- |
| [Motion: SVG animation](https://motion.dev/docs/react-svg-animation) | Use normalized `pathLength` for growing stems and interpolate compatible `d` attributes for real petal morphing. Explicit local transform origins keep petals attached. |
| [Motion: React animation](https://motion.dev/docs/react-animation) | Use declarative initial/animate states, easing, per-petal delays, and AnimatePresence for the scene transition. Completion callbacks sequence the envelope flap, paper lift, and modal. |
| [Motion: accessibility](https://motion.dev/docs/react-accessibility) | Drive MotionConfig, geometry animation, and delays from the same per-visit state. Manual OFF simplifies the experience immediately; the optional system mode is explicitly selected. The latest startup policy deliberately begins animated on every new visit. |
| [MDN: SVG `d`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/d) | Original cubic Bézier shapes give pointed, cupped petals rather than circles or emoji. The folded and open shapes use matching commands. |
| [MDN: CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations/Using) | Small transform-based loops handle clouds, rays, teddy breathing, bouquet sway, and four drifting petals. CSS media queries disable loops for reduced motion. |
| [web.dev: high-performance CSS animation](https://web.dev/articles/animations-guide) | Ambient clouds, hearts, butterflies, light gradients, and motes move using transform/opacity instead of repeatedly changing layout. Gradient artwork is moved as a layer; background-position is not animated. Particle counts stay bounded and no particle library is used. |
| [MDN: transform-origin](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-origin) | Explicit local pivots let leaves flutter, the teddy blink, butterflies flap, and flower corollas breathe without disconnecting from their stems. |
| [MDN: animation-delay](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-delay) | Negative delays start ornaments at different positions in their cycles immediately. Each sparkle, heart, cloud, and butterfly has a deterministic period and phase; static layer containers prevent synchronized group movement. |
| [React: useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore), [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), and [MDN: matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) | Keep the initial server/client snapshot identical and use a primitive snapshot for per-visit state. System changes affect only explicitly selected system mode. Legacy stored values are not removed or read at startup. |
| [MDN: transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transforms/Using) and [rotateX](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/transform-function/rotateX) | A perspective container and top-hinged rotateX transform make the envelope flap physically fold before the paper rises. |
| [MDN: dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) | Native showModal provides focus containment and inert background content. Explicit close buttons and Escape are supported. |
| [GSAP Timeline documentation](https://gsap.com/docs/v3/GSAP/Timeline/) | Reviewed relative sequencing and timeline composition. Motion handles this choreography completely, so GSAP is not installed. |
| [Lotus example source, chirag-exists](https://github.com/chirag-exists/Lotus/blob/main/index.html) and [repository README / terms](https://github.com/chirag-exists/Lotus#readme) | Inspected its actual layered Bézier-petal construction, per-petal pivots, and eased opening loop. The current source uses Three.js, despite the README describing an additional SVG variant. Its README offers personal/educational use without a standard license file. No code or assets were reused; this project uses independently written SVG components. |
| [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), bundled Next.js guides, and [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) | App Router project setup, current Tailwind PostCSS integration, static prerendering, and default Vercel compatibility. |

### Attributions and licenses

- All bouquet, bear, popcorn, envelope, sky, and decorative vectors were drawn directly in source for this project. The attached references informed the composition and color direction, and are not distributed as website assets.
- “Taters” is plain illustrative text on an original snack container, not an official logo file or brand artwork. The name belongs to its owner; this is an unaffiliated personal gift.
- Motion, Next.js, React, React DOM, and Tailwind CSS use MIT licenses. Installed dependency license files remain with their packages. [Motion license](https://github.com/motiondivision/motion/blob/main/LICENSE.md).
- DM Sans by the DM Sans Project Authors and Cormorant Garamond by the Cormorant Project Authors use **SIL Open Font License 1.1**. The full notices are bundled in `public/licenses/`. See [DM Sans](https://github.com/googlefonts/dm-fonts) and [Cormorant](https://github.com/CatharsisFonts/Cormorant).

## Checks and browser tests

```sh
npm run lint
npm run typecheck
npm run build
```

The Playwright suite uses installed Google Chrome, installed [Mozilla Firefox](https://www.mozilla.org/firefox/), and Playwright WebKit. Firefox uses Playwright's `moz-firefox` WebDriver BiDi channel and isolated profiles with real `ui.prefersReducedMotion` settings. It does not modify the installed browser's personal profile. To prepare WebKit:

```sh
npx playwright install webkit
npm run test:e2e
```

If Google Chrome is not installed, install it or remove `channel: "chrome"` from `playwright.config.ts` and run `npx playwright install chromium webkit`. Install regular Mozilla Firefox to run the two Firefox profile projects. The suite can start its own development server, or reuse localhost:3000.

The **72-test matrix** covers Chrome and WebKit at **375×812, 390×844, 430×932, and 1440×1000**, Android Pixel 7 and iPhone 13 profiles, and native Firefox desktop profiles with normal/reduced system settings. It checks startup under every combination of system and legacy stored preference, actual star/heart/cloud/wing/flight/sway transforms, independent animation timing, genuine petal morphing and pivots, manual OFF/ON, optional system mode, refresh/back navigation, blocked storage, before-hydration labels, and extension-injected body attributes. It also verifies flower absence before the first tap, teddy/popcorn, the secret heart, exact configured letter, envelope ordering, keyboard/touch controls, focus restoration, replay, and horizontal overflow. Small header controls are additionally checked at 320px. Screenshots are saved under `test-results/`; the HTML report is in `playwright-report/`.

Browser-engine emulation is not a physical iPhone/Android device test. Real-device responsiveness and frame rate should also be checked on the phone used for the gift; no hardware-specific frame-rate guarantee is claimed.

### Initial verification — October 18, 2026

- Dependency installation completed successfully.
- `npm run lint`: passed with no warnings or errors.
- `npm run typecheck`: passed.
- `npm run build`: passed; the homepage, not-found page, and SVG icon are statically generated.
- `npm run test:e2e` against the **optimized production server**: **16 passed (1.4 minutes)** across all eight browser/viewport combinations, with normal and reduced motion.
- Both test flows check browser console errors; the final production run reported none.
- Actual rendered screenshots were inspected for welcome, growing flowers, the completed bouquet, and the letter, including mobile and desktop compositions.
- At the initial verification stage, no public deployment, GitHub push, or physical-device test had been performed.

### Immersive refinement verification — October 18, 2026

- Lint, TypeScript, and the optimized production build all passed after the refinements.
- The original updated 16-test Chrome/WebKit matrix passed against the development app.
- The final **20-test production matrix passed (1.8 minutes)**, including the original widths plus Android Pixel 7 (412×839) and iPhone 13 (390×664) mobile profiles, with normal and reduced motion.
- Both browser flows checked runtime/console errors and the exact four letter paragraphs; all passed. The full letter configuration block also matched its saved pre-edit baseline exactly.
- Rendered phone and desktop screenshots, intermediate bud/opening frames, and actual changing cloud transforms were inspected. Essential illustration bounds and the visible letter invitation were verified at each viewport.
- The refined source is committed to the existing GitHub repository; no Vercel deployment or physical-device test is part of this revision.

### Living background and hidden letter verification — October 18, 2026

- `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- `npm run test:e2e` against the optimized production application: **20 passed (2.1 minutes)**. This includes Chrome and WebKit phone/desktop widths, Android Pixel 7 and iPhone 13 profiles, actual touch activation, keyboard Space, independent ambient motion and wing transforms, opening-stage order, reduced motion, and explicit motion opt-in/out. The test flows reported no console/runtime errors or horizontal overflow.
- The whole `letter` configuration block matched the saved pre-edit baseline exactly; the browser suite also checked all four paragraphs verbatim.
- Phone and desktop screenshots were inspected. The live in-app preview reported reduced motion enabled, explaining its static appearance. Explicitly enabling Motion restored the independent loops; changing star, heart, flight, and wing transforms were sampled in the running preview. The hidden heart and preserved letter were opened and inspected there too.
- `.gitignore` exclusions were verified for dependencies, builds, local QA files, reports, and environment files. No generated screenshots or reports are uploaded.
- Verification uses browser engines and device profiles, not physical phone hardware. No Vercel deployment was performed.

### Persistent motion preference verification — October 18, 2026

- Lint, TypeScript, and the optimized production build passed.
- **50 Chrome/WebKit production tests passed**, including phone/desktop widths, Android/iPhone profiles, motion defaults, both saved overrides across refreshes, system changes, cross-tab synchronization, invalid stored values, and blocked storage. Held client bundles verified correct labels and CSS before hydration. The original surprise, real petal morphing, hidden letter, focus, and replay flows also passed.
- **Two native Mozilla Firefox 158 production profile tests passed (16 seconds)**, using actual normal/reduced settings. They verified the reported media preference, automatic star motion, real flower growth, hidden-letter content and controls, replay, and saved ON/OFF overrides across refreshes. Together with the Chrome/WebKit matrix, this verified all 52 tests at that revision; the current startup policy and suite supersede it.
- The downloaded Playwright Firefox builds could not start on this Windows installation because of a side-by-side `mozglue` assembly error, even after reinstalling. Installed Firefox works through the supported `moz-firefox` BiDi channel. Its media-emulation limitations are avoided by using real temporary profile settings; no OS setting or personal browser profile was modified.
- The tested flows reported no application console/runtime errors. A rendered phone welcome screenshot was inspected; artwork and letter source files are unchanged. This is browser/device-profile testing, not physical-phone testing. No Vercel deployment was performed.

### Always-ON visits and hydration verification — October 18, 2026

- The latest explicit request supersedes the previous persistence policy: each new visit starts with Motion ON, regardless of OS preference or legacy stored OFF. Only an explicit per-visit choice changes it. Existing stored values are not deleted.
- `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- `npm run test:e2e -- --max-failures=1` against the optimized production app: **72 passed (4.1 minutes)**. The matrix includes Chrome/WebKit widths, Android/iPhone profiles, and installed Firefox with native normal/reduced settings. It exercises actual movement, manual OFF/ON, refresh/back navigation, initial hydration with saved OFF, blocked storage, optional system mode, and the exact Grammarly body-attribute regression.
- Phone and desktop screenshots were inspected. The running in-app browser reported `prefers-reduced-motion: reduce` while showing Motion ON with changing star/heart transforms and zero flower petals before the surprise tap. A short-desktop envelope overlap was corrected and verified at 1280×720; motion controls also fit at 320px.
- The app's illustrations, envelope/letter source, and personalized configuration match the pre-edit Git revision. A stale test's hard-coded paragraph was updated to follow the latest configured letter. No application console/runtime errors were reported in the final test flows.
- Verification uses browser engines/device profiles, not physical phone hardware. No Vercel deployment was performed.

## GitHub repository

This project uses the existing [Ayawcakes20/virtualflowers](https://github.com/Ayawcakes20/virtualflowers) repository and its `main` branch. To work from a fresh checkout:

```sh
git clone https://github.com/Ayawcakes20/virtualflowers.git
cd virtualflowers
npm ci
npm run dev
```

`node_modules`, build artifacts, local QA images, test reports, temporary files, private keys, and environment files are excluded by `.gitignore`. Keep `package-lock.json` committed for repeatable installs. Publishing source to GitHub does not deploy the website to Vercel.

## Deploy to Vercel when ready

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the GitHub repository. If using a private repository, grant Vercel access to that repository.
3. Select **Next.js**, project root `./`, install command `npm ci`, and build command `npm run build`. Keep the output directory at its framework default. No environment variables are required.
4. Choose a supported Node.js 22 or 24 runtime, then deploy. This is the step that publishes the gift; only do it when you are ready.
5. Open the generated HTTPS URL on a phone and test the first tap, flower growth, and letter. Check the deployment's visitor-access settings so your girlfriend can open the link.

The project uses standard Next.js routing and needs no custom `vercel.json`. The homepage is statically prerendered; it does not require a custom backend. Official guides: [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [Git deployment integration](https://vercel.com/docs/git).

### Update the live gift

Edit `src/config/surprise.ts`, preview locally, and run lint, typecheck, and build. Commit and push the update to the production branch:

```sh
git add .
git commit -m "Personalize the letter"
git push
```

Vercel's connected Git integration builds a new deployment. Wait for **Ready** before sharing; the production URL continues to point to the latest successful production deployment. Branches / pull requests can be reviewed as previews before merging into the production branch.
