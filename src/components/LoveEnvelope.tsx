"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { surprise } from "@/config/surprise";
import { Heart } from "./Ornaments";

type Fold = "sealed" | "flap" | "lifting";

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
    <motion.div className="envelope-flap" initial={false} animate={{ rotateX: stage !== "sealed" ? 180 : 0 }}
      style={{ transformOrigin: "50% 0%" }}
      transition={{ duration: reduced ? .1 : surprise.timing.envelopeFold, ease: "easeInOut" }}
      onAnimationComplete={() => { if (stage === "flap") onFlapComplete?.(); }}>
      <svg viewBox="0 0 200 80"><path d="M1 2 H199 L110 72 Q100 80 90 72Z" fill="#E9DCF3" stroke="#BEA2D0" strokeWidth="1.3" /></svg>
    </motion.div>
    <motion.div className="envelope-seal" animate={{ opacity: stage === "sealed" ? 1 : 0 }} transition={{ duration: .15 }}><Heart /></motion.div>
  </div>;
}

export function LoveEnvelope({ reduced, onOpen }: { reduced: boolean; onOpen: () => void }) {
  const [stage, setStage] = useState<Fold>("sealed");
  return <motion.div className="letter-invitation" initial={{ opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
    <button type="button" className="letter-button" disabled={stage !== "sealed"}
      onClick={() => setStage("flap")} aria-label={surprise.scene.letterButton} aria-haspopup="dialog" data-testid="open-letter">
      <div className={`small-envelope ${stage === "sealed" ? "envelope-float" : ""}`}><EnvelopeArt stage={stage} reduced={reduced} onFlapComplete={() => setStage("lifting")} onPaperComplete={onOpen} /></div>
      <span>{surprise.scene.letterButton}<span aria-hidden="true" className="letter-arrow">↗</span></span>
    </button>
  </motion.div>;
}
