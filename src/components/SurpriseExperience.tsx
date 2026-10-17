"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { surprise } from "@/config/surprise";
import { WelcomeScreen } from "./WelcomeScreen";
import { SurpriseScene } from "./SurpriseScene";
import { LoveLetter, type LetterOrigin } from "./LoveLetter";
import { Heart, PageOrnaments, Sparkle } from "./Ornaments";
import { useMotionPreference } from "@/hooks/useMotionPreference";

const theme = Object.fromEntries(Object.entries(surprise.theme).map(([key, value]) => [`--${key}`, value])) as CSSProperties;

export function SurpriseExperience() {
  const [scene, setScene] = useState<"welcome" | "surprise">("welcome");
  const [opening, setOpening] = useState(false);
  const [letter, setLetter] = useState<LetterOrigin | null>(null);
  const [replayed, setReplayed] = useState(false);
  const [envelopeVersion, setEnvelopeVersion] = useState(0);
  const [hidden, setHidden] = useState(false);
  // The first client render must match SSR, including Motion's gesture tabindex.
  // Keep the opening button disabled until its handler has been hydrated.
  const { ready: hydrated, reduced, manual, system, setReduced, resetToSystem } = useMotionPreference();
  const motionButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  function replay() {
    setLetter(null);
    setOpening(false);
    setReplayed(true);
    setScene("welcome");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function closeLetter() {
    setLetter(null);
    setEnvelopeVersion(v => v + 1);
    // The envelope remount resets the folding state before keyboard focus returns.
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>("[data-testid='open-letter']")?.focus({ preventScroll: true }));
  }

  return <MotionConfig reducedMotion={reduced ? "always" : "never"}>
    <div className={`experience ${scene === "surprise" ? "experience-revealed" : ""}`} style={theme} data-paused={hidden || !!letter} data-motion={hydrated ? (reduced ? "reduced" : "full") : "system"}>
      <PageOrnaments />
      <header className="site-header"><div className="wordmark"><Sparkle /><span>a little sunshine<span className="wordmark-dot">.</span></span></div>
        <div className="header-details"><span className="header-note">a little love, from {surprise.from}<Heart /></span>
          <button ref={motionButton} type="button" className="motion-control" disabled={!hydrated} aria-label={reduced ? "Enable animations" : "Reduce animations"} aria-describedby="motion-source" onClick={() => setReduced(!reduced)}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" /><path className="motion-icon-off" d="M8 6 L14 10 L8 14Z" fill="currentColor" /><path className="motion-icon-on" d="M8 6V14M12 6V14" stroke="currentColor" strokeWidth="1.5" /></svg><span className="motion-label-on" aria-hidden="true">Motion on</span><span className="motion-label-off" aria-hidden="true">Motion off</span>
          </button>
          {manual && <button type="button" className="motion-reset" aria-label="Use system motion setting" title="Use system motion setting" onClick={() => {
            resetToSystem();
            requestAnimationFrame(() => motionButton.current?.focus({preventScroll:true}));
          }}><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 7 A6 6 0 1 1 4 13 M4 3V7H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
          <span id="motion-source" className="sr-only" aria-live="polite">{system ? "Following your system motion setting for this visit." : manual ? "Using your motion choice for this visit." : "Animations are on for this visit."}</span>
        </div>
      </header>
      <main id="main-content">
        <AnimatePresence mode="wait" initial={false}>
          {scene === "welcome" ? <WelcomeScreen key="welcome" reduced={reduced} opening={opening || !hydrated} replayed={replayed} onOpen={() => { if (!opening && hydrated) { setOpening(true); setScene("surprise"); } }} />
            : <SurpriseScene key="surprise" reduced={reduced} onOpenLetter={setLetter} onReplay={replay} envelopeVersion={envelopeVersion} />}
        </AnimatePresence>
      </main>
      <footer className="site-footer"><Heart /><span>{surprise.closingMessage}</span></footer>
      {letter && <LoveLetter reduced={reduced} origin={letter} onClose={closeLetter} onReplay={replay} />}
      <noscript><div className="noscript-note">Please enable JavaScript to open your little surprise. 💜</div></noscript>
    </div>
  </MotionConfig>;
}
