"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { surprise } from "@/config/surprise";
import { Heart } from "./Ornaments";
import type { LetterOrigin } from "./LoveLetter";

type Fold = "sealed" | "forward" | "release" | "flap" | "lifting";

export function EnvelopeArt({ stage = "sealed", reduced = false, onFlapComplete, onPaperComplete }: {
  stage?: Fold; reduced?: boolean; onFlapComplete?: () => void; onPaperComplete?: () => void;
}) {
  return <div className={`envelope-art envelope-is-${stage}`} aria-hidden="true">
    <div className="envelope-back" />
    <motion.div className="envelope-paper" initial={false}
      animate={{ y: stage === "lifting" ? "-60%" : "0%", scale: stage === "lifting" ? 1.05 : 1 }}
      transition={{ duration: reduced ? .1 : surprise.timing.paperLift, ease: "easeInOut" }}
      onAnimationComplete={() => { if (stage === "lifting") onPaperComplete?.(); }}>
      <Heart /><span /><span /><span />
    </motion.div>
    <svg className="envelope-front" viewBox="0 0 200 132" fill="none"><path d="M2 4 L100 75 L198 4 V126 Q198 130 192 130 H8 Q2 130 2 124Z" fill="#DCC9EB" stroke="#B79ACB" strokeWidth="1.3" /><path d="M2 126 L78 66 Q100 50 122 66 L198 126" fill="#E7D7F0" stroke="#C4A8D5" strokeWidth="1" /></svg>
    <motion.div className="envelope-flap" initial={false} animate={{ rotateX: stage === "flap" || stage === "lifting" ? 180 : 0 }}
      style={{ transformOrigin: "50% 0%" }}
      transition={{ duration: reduced ? .1 : surprise.timing.envelopeFold, ease: "easeInOut" }}
      onAnimationComplete={() => { if (stage === "flap") onFlapComplete?.(); }}>
      <svg viewBox="0 0 200 80"><path d="M1 2 H199 L110 72 Q100 80 90 72Z" fill="#E9DCF3" stroke="#BEA2D0" strokeWidth="1.3" /></svg>
    </motion.div>
    <motion.div className="envelope-seal" animate={{ opacity: stage === "sealed" || stage === "forward" ? 1 : 0, y: stage === "sealed" || stage === "forward" ? 0 : 9, rotate: stage === "release" ? 18 : 0 }} transition={{ duration: reduced ? .01 : .2 }} onAnimationComplete={() => { if (stage === "release") onFlapComplete?.(); }}><Heart /></motion.div>
  </div>;
}

export function LoveEnvelope({ reduced, onOpen }: { reduced: boolean; onOpen: (origin: LetterOrigin) => void }) {
  const [stage, setStage] = useState<Fold>("sealed");
  const envelope = useRef<HTMLDivElement>(null);
  function openLetter() {
    const box = envelope.current?.getBoundingClientRect();
    if (box) onOpen({ x: box.x + box.width / 2 - window.innerWidth / 2, y: box.y + box.height / 2 - window.innerHeight / 2 });
  }
  const unfolded = stage !== "sealed" && stage !== "forward";
  return <div className="secret-letter" data-stage={stage}>
    <button type="button" className="secret-letter-button" disabled={stage !== "sealed"}
      onClick={() => setStage("forward")} aria-label={surprise.scene.hiddenLetterLabel} aria-haspopup="dialog" data-testid="open-letter">
      <motion.div className="secret-heart" initial={{ opacity: 0 }}
        animate={{ opacity: unfolded ? 0 : 1, y: stage === "forward" ? -8 : 0, scale: stage === "forward" ? 1.15 : 1 }}
        transition={{ duration: reduced ? .01 : surprise.timing.envelopeForward }}
        onAnimationComplete={() => { if (stage === "forward") setStage("release"); }}>
        <svg viewBox="-30 -30 60 60" aria-hidden="true"><g className="secret-heart-idle" transform="rotate(13)">
          <path d="M0 22 C-12 12 -34 -5 -22 -21 C-13 -32 -2 -25 0 -16 C2 -25 13 -32 22 -21 C34 -5 12 12 0 22Z" fill="#FFF8ED" stroke="#B99ACA" strokeWidth="1.5" />
          <path d="M0 6 C-21 -9 -8 -18 0 -8 C8 -18 21 -9 0 6Z" fill="#A07BB5" />
          <path className="seal-glimmer" d="M-12 -17 l1 4 4 1 -4 1 -1 4 -1 -4 -4 -1 4 -1Z" fill="#FFF" />
        </g></svg>
      </motion.div>
    </button>
    <motion.div ref={envelope} className="secret-envelope" aria-hidden="true" initial={false}
      animate={{ opacity: unfolded ? 1 : 0, y: unfolded ? -15 : 0, scale: unfolded ? 1 : .35, rotate: unfolded ? -5 : 13 }}
      transition={{ duration: reduced ? .01 : .22, ease: "easeOut" }}>
      {unfolded && <EnvelopeArt stage={stage} reduced={reduced}
        onFlapComplete={() => setStage(stage === "release" ? "flap" : "lifting")} onPaperComplete={openLetter} />}
    </motion.div>
  </div>;
}
