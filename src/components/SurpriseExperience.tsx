"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { surprise } from "@/config/surprise";
import { WelcomeScreen } from "./WelcomeScreen";
import { SurpriseScene } from "./SurpriseScene";
import { LoveLetter, type LetterOrigin } from "./LoveLetter";
import { Heart, PageOrnaments, Sparkle } from "./Ornaments";

const theme = Object.fromEntries(Object.entries(surprise.theme).map(([key, value]) => [`--${key}`, value])) as CSSProperties;
const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function SurpriseExperience() {
  const [scene, setScene] = useState<"welcome" | "surprise">("welcome");
  const [opening, setOpening] = useState(false);
  const [letter, setLetter] = useState<LetterOrigin | null>(null);
  const [replayed, setReplayed] = useState(false);
  const [envelopeVersion, setEnvelopeVersion] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [motionChoice, setMotionChoice] = useState<boolean | null>(null);
  // The first client render must match SSR, including Motion's gesture tabindex.
  // Keep the opening button disabled until its handler has been hydrated.
  const hydrated = useSyncExternalStore(subscribeHydration, clientSnapshot, serverSnapshot);
  const motionPreference = useReducedMotion();
  const reduced = hydrated && (motionChoice ?? !!motionPreference);

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
          <button type="button" className="motion-control" disabled={!hydrated} aria-label={reduced ? "Enable animations" : "Reduce animations"} onClick={() => setMotionChoice(!reduced)}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" />{reduced ? <path d="M8 6 L14 10 L8 14Z" fill="currentColor" /> : <path d="M8 6V14M12 6V14" stroke="currentColor" strokeWidth="1.5" />}</svg><span>Motion {reduced ? "off" : "on"}</span>
          </button>
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
