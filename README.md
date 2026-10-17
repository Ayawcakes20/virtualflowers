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

1. The welcome screen contains a sealed envelope and hearts. The bouquet and all flower SVG elements are **absent from the DOM** until the surprise button is activated.
2. A short exit transition leads into the illustrated postcard. Purple paper forms, green stems draw upward, leaves unfold, and buds open into seven layered sunflowers.
3. The sunflowers have **266 separately animated petals**. Each petal's Bézier path changes from a narrow folded bud to a long curved petal while its angle opens around the flower's local origin. These are real SVG geometry and transform animations, not raster illustrations sliding into view.
4. Twelve smaller lavender/cream flowers and baby's breath finish the bouquet. A teddy bear bounces in and waves gently; an original purple Taters popcorn cup arrives with popping kernels. Clouds drift, rays rotate, a few petals float, and the bouquet sways slightly.
5. After approximately seven seconds, the letter invitation appears in front of the bottom of the wrapper, below the flowers. It never opens on its own.
6. Tapping it folds the flap back, lifts out the paper, and unfolds a readable letter. Close Letter or Escape returns to the bouquet. Watch Again returns to the sealed welcome screen; a new tap starts the complete growth sequence again.

The illustrated objects remain in the same SVG coordinate system at every screen size, so their relationships do not rearrange on phones. Large buttons work with touch and keyboard. The letter uses native modal `<dialog>` behavior, a labeled heading, focus containment, a scrollable paper, and focus restoration. Reduced motion shows the completed bouquet after the intentional first tap, skips the growth, removes ambient loops, and shortens the letter transition. Ambient CSS animations pause while the document is hidden or the letter is open; SVG growth animations are finite and unmount on replay.

## Personalize it

Edit **`src/config/surprise.ts`**. Personal text is kept in this one file.

```ts
girlfriendName: "Her name", // or leave empty for "Hi love! 💜"
from: "Paulo",
```

Change `welcome` for the first screen, `scene.heading` and `scene.subtitle` for the postcard heading, `letter.salutation`, `letter.paragraphs`, and `letter.closing` for the love letter, and `closingMessage` for the footer. Each entry in `letter.paragraphs` becomes a separate paragraph. React renders the strings as text, so no HTML is needed. Longer letters scroll within the modal.

Change `theme` for the principal colors. Fine illustration details and secondary tones are in the SVG components and `src/app/globals.css`; natural sunflower yellows, leaf greens, and teddy browns have their own palettes. Change `timing.growthSpeed` to scale the growth sequence (e.g. `0.8` is faster, `1.2` slower), and the other `timing` entries to tune stems, petals, decoration entrances, and envelope folding. Envelope availability is calculated from the bouquet choreography rather than an unrelated timeout.

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
    LoveEnvelope          Flap hinge and paper-lift sequence
    LoveLetter            Accessible native modal and personal message
    Ornaments             Original heart / sparkle / doodle vectors
    flowers/              Petals, sunflower layers, stems, leaves, wrapper
    illustrations/        Teddy, popcorn, sun, clouds, grass, drifting petals
tests/surprise.spec.ts     End-to-end interaction and layout checks
playwright.config.ts      Chrome + WebKit, phone and desktop widths
```

## Research and selected techniques

Research included the actual runnable code snippets in the official guides and source inspection of the public example below. No proprietary animation, reference image, generated image, stock asset, official Taters logo, or third-party flower component was incorporated.

| Source | Technique / decision |
| --- | --- |
| [Motion: SVG animation](https://motion.dev/docs/react-svg-animation) | Use normalized `pathLength` for growing stems and interpolate compatible `d` attributes for real petal morphing. Explicit local transform origins keep petals attached. |
| [Motion: React animation](https://motion.dev/docs/react-animation) | Use declarative initial/animate states, easing, per-petal delays, and AnimatePresence for the scene transition. Completion callbacks sequence the envelope flap, paper lift, and modal. |
| [Motion: accessibility](https://motion.dev/docs/react-accessibility) | Combine MotionConfig with useReducedMotion; geometry animation and delays are also explicitly bypassed for reduced motion. |
| [MDN: SVG `d`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/d) | Original cubic Bézier shapes give pointed, cupped petals rather than circles or emoji. The folded and open shapes use matching commands. |
| [MDN: CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations/Using) | Small transform-based loops handle clouds, rays, teddy breathing, bouquet sway, and four drifting petals. CSS media queries disable loops for reduced motion. |
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

The Playwright suite uses installed Google Chrome and Playwright WebKit. To prepare WebKit:

```sh
npx playwright install webkit
npm run test:e2e
```

If Google Chrome is not installed, install it or remove `channel: "chrome"` from `playwright.config.ts` and run `npx playwright install chromium webkit`. The suite can start its own development server, or reuse localhost:3000.

The 16-test matrix covers Chrome and WebKit at **375×812, 390×844, 430×932, and 1440×1000**, both with normal motion and reduced motion. It checks initial flower absence, changing petal geometry, correct final pivots, decoration visibility, delayed envelope availability, flap/paper ordering, letter text, native keyboard controls, focus restoration, repeated opening, replay reset, touch-target size, and horizontal overflow. Screenshots of welcome, growth, bouquet, and letter are saved under `test-results/` when the suite runs. The HTML report is in `playwright-report/`.

Browser-engine emulation is not a physical iPhone/Android device test. Real-device responsiveness and frame rate should also be checked on the phone used for the gift; no hardware-specific frame-rate guarantee is claimed.

### Verification performed — October 18, 2026

- Dependency installation completed successfully.
- `npm run lint`: passed with no warnings or errors.
- `npm run typecheck`: passed.
- `npm run build`: passed; the homepage, not-found page, and SVG icon are statically generated.
- `npm run test:e2e` against the **optimized production server**: **16 passed (1.4 minutes)** across all eight browser/viewport combinations, with normal and reduced motion.
- Both test flows check browser console errors; the final production run reported none.
- Actual rendered screenshots were inspected for welcome, growing flowers, the completed bouquet, and the letter, including mobile and desktop compositions.
- No public deployment, GitHub push, or physical-device test was performed.

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
