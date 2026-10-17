"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { surprise } from "@/config/surprise";
import { WelcomeScreen } from "./WelcomeScreen";
import { SurpriseScene } from "./SurpriseScene";
import { LoveLetter } from "./LoveLetter";
import { Heart, PageOrnaments, Sparkle } from "./Ornaments";

const theme = Object.fromEntries(Object.entries(surprise.theme).map(([key, value]) => [`--${key}`, value])) as CSSProperties;
const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function SurpriseExperience() {
  const [scene, setScene] = useState<"welcome" | "surprise">("welcome");
  const [opening, setOpening] = useState(false);
  const [letter, setLetter] = useState(false);
  const [replayed, setReplayed] = useState(false);
  const [envelopeVersion, setEnvelopeVersion] = useState(0);
  const [hidden, setHidden] = useState(false);
  // The first client render must match SSR, including Motion's gesture tabindex.
  // Keep the opening button disabled until its handler has been hydrated.
  const hydrated = useSyncExternalStore(subscribeHydration, clientSnapshot, serverSnapshot);
  const motionPreference = useReducedMotion();
  const reduced = hydrated && !!motionPreference;

  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  function replay() {
    setLetter(false);
    setOpening(false);
    setReplayed(true);
    setScene("welcome");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function closeLetter() {
    setLetter(false);
    setEnvelopeVersion(v => v + 1);
    // The envelope remount resets the folding state before keyboard focus returns.
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>("[data-testid='open-letter']")?.focus({ preventScroll: true }));
  }

  return <MotionConfig reducedMotion="user">
    <div className={`experience ${scene === "surprise" ? "experience-revealed" : ""}`} style={theme} data-paused={hidden || letter}>
      <PageOrnaments />
      <header className="site-header"><div className="wordmark"><Sparkle /><span>a little sunshine<span className="wordmark-dot">.</span></span></div><span className="header-note">a little love, from {surprise.from}<Heart /></span></header>
      <main id="main-content">
        <AnimatePresence mode="wait" initial={false}>
          {scene === "welcome" ? <WelcomeScreen key="welcome" reduced={reduced} opening={opening || !hydrated} replayed={replayed} onOpen={() => { if (!opening && hydrated) { setOpening(true); setScene("surprise"); } }} />
            : <SurpriseScene key="surprise" reduced={reduced} onOpenLetter={() => setLetter(true)} onReplay={replay} envelopeVersion={envelopeVersion} />}
        </AnimatePresence>
      </main>
      <footer className="site-footer"><Heart /><span>{surprise.closingMessage}</span></footer>
      {letter && <LoveLetter reduced={reduced} onClose={closeLetter} onReplay={replay} />}
      <noscript><div className="noscript-note">Please enable JavaScript to open your little surprise. 💜</div></noscript>
    </div>
  </MotionConfig>;
}
