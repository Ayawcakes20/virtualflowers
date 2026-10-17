"use client";

import { motion } from "motion/react";
import { surprise } from "@/config/surprise";
import type { Flower } from "./AnimatedSunflower";

export function FlowerStem({ flower, reduced }: { flower: Flower; reduced: boolean }) {
  const d = `M302 450 Q${280 + (flower.x - 300) * 0.65} 320 ${flower.x} ${flower.y}`;
  return <g data-stem="true">
    <motion.path d={d} stroke="#54794D" strokeWidth="7" fill="none" strokeLinecap="round"
      initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: reduced ? 0 : surprise.timing.stemDuration * surprise.timing.growthSpeed, delay: reduced ? 0 : (flower.delay - 1.25) * surprise.timing.growthSpeed }} />
    <motion.path d={d} stroke="#A5BE72" strokeWidth="2" fill="none" strokeLinecap="round"
      initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }} animate={{ pathLength: 1, opacity: 0.8 }}
      transition={{ duration: reduced ? 0 : surprise.timing.stemDuration * surprise.timing.growthSpeed, delay: reduced ? 0 : (flower.delay - 1.25) * surprise.timing.growthSpeed }} />
  </g>;
}
