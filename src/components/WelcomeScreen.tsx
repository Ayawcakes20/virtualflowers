"use client";

import { motion } from "motion/react";
import { surprise } from "@/config/surprise";
import { EnvelopeArt } from "./LoveEnvelope";
import { Heart, Sparkle } from "./Ornaments";

export function WelcomeScreen({ onOpen, opening, reduced, replayed }: {
  onOpen: () => void; opening: boolean; reduced: boolean; replayed: boolean;
}) {
  return <motion.section className="welcome-screen" aria-labelledby="welcome-title" data-testid="welcome-screen"
    initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: reduced ? 0 : -18, scale: reduced ? 1 : .98 }}
    transition={{ duration: reduced ? .15 : surprise.timing.transition }}>
    <div className="welcome-card">
      <span className="card-corner corner-tl">✦</span><span className="card-corner corner-br">✦</span>
      <p className="eyebrow welcome-eyebrow">A SPECIAL DELIVERY FOR YOU</p>
      <div className="welcome-envelope" aria-hidden="true">
        <Heart className="envelope-heart heart-one" /><Heart className="envelope-heart heart-two" /><Heart className="envelope-heart heart-three" />
        <Sparkle className="envelope-sparkle sparkle-one" /><Sparkle className="envelope-sparkle sparkle-two" />
        <div className="welcome-envelope-inner"><EnvelopeArt /></div>
        <span className="envelope-shadow" />
      </div>
      <p className="greeting">{surprise.girlfriendName ? `Hi ${surprise.girlfriendName}! 💜` : surprise.welcome.greeting}</p>
      <h1 id="welcome-title">{surprise.welcome.headline[0]}<br /><em>{surprise.welcome.headline[1]}</em></h1>
      <p className="welcome-message">{surprise.welcome.message}</p>
      <motion.button autoFocus={replayed} type="button" className="primary-button" onClick={onOpen} disabled={opening}
        whileHover={reduced ? undefined : { y: -2 }} whileTap={reduced ? undefined : { scale: .97 }}>
        <span>{surprise.welcome.button}</span><span className="button-arrow" aria-hidden="true">↗</span>
      </motion.button>
      <p className="welcome-footnote">{surprise.welcome.footnote}</p>
    </div>
  </motion.section>;
}
