"use client";

import { motion } from "motion/react";
import { surprise } from "@/config/surprise";

// Matching cubic commands let Motion interpolate the actual petal geometry.
const bud = "M0 -5 C-2 -9 -3 -17 -1 -23 C0 -26 1 -26 2 -22 C4 -15 3 -9 0 -5 Z";
const open = "M0 -13 C-11 -22 -18 -47 -3 -72 C0 -78 2 -77 5 -68 C19 -47 11 -24 0 -13 Z";

export function BloomingPetal({ angle, delay, inner, reduced }: {
  angle: number; delay: number; inner: boolean; reduced: boolean;
}) {
  const duration = reduced ? 0 : surprise.timing.petalDuration * surprise.timing.growthSpeed;
  return (
    <motion.g
      initial={reduced ? false : { rotate: angle * 0.035, opacity: 0 }}
      animate={{ rotate: angle, opacity: 1 }}
      transition={{ duration, delay, ease: [0.22, 0.7, 0.3, 1] }}
      style={{ originX: 0, originY: 0, transformBox: "view-box" }}
    >
      <motion.path
        data-petal="sunflower"
        initial={reduced ? false : { d: bud }}
        animate={{ d: open }}
        transition={{ duration, delay, ease: [0.22, 0.7, 0.3, 1] }}
        fill={inner ? "url(#petal-light)" : "url(#petal-gold)"}
        stroke={inner ? "#E8AE36" : "#DEA134"}
        strokeWidth="0.65"
      />
      <motion.path
        d="M0 -20 Q-2 -44 1 -64" fill="none" stroke="#DBA32B" strokeWidth="0.7" opacity="0.48"
        initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: duration * 0.7, delay: delay + duration * 0.35 }}
      />
    </motion.g>
  );
}
