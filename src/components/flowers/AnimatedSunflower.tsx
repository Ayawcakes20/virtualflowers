"use client";

import { motion } from "motion/react";
import { BloomingPetal } from "./BloomingPetal";
import { surprise } from "@/config/surprise";

export type Flower = { x: number; y: number; size: number; tilt: number; delay: number };

const seeds = Array.from({ length: 74 }, (_, i) => {
  const a = i * 2.39996;
  const r = Math.sqrt(i / 74) * 22;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r, r: i % 3 === 0 ? 1.25 : 0.85 };
});

export function AnimatedSunflower({ flower, reduced }: { flower: Flower; reduced: boolean }) {
  const delay = reduced ? 0 : flower.delay * surprise.timing.growthSpeed;
  const stagger = reduced ? 0 : 0.018 * surprise.timing.growthSpeed;
  return (
    <g transform={`translate(${flower.x} ${flower.y}) rotate(${flower.tilt}) scale(${flower.size})`} data-flower="sunflower">
      <motion.path d="M-16 9 Q-31 -6 -13 -26 Q0 -45 14 -24 Q32 -6 17 10Z" fill="#6D934B"
        initial={{ scale: reduced ? 1 : 0 }} animate={{ scale: [null, 0.6, 0.4] }}
        style={{ originX: 0, originY: "5px", transformBox: "view-box" }} transition={{ duration: reduced ? 0 : 1.5, delay: Math.max(0, delay - 0.5) }} />
      {Array.from({ length: 21 }, (_, i) => <BloomingPetal key={`outer-${i}`} angle={i * 360 / 21} delay={delay + i * stagger} inner={false} reduced={reduced} />)}
      <g transform="scale(.81) rotate(9)">
        {Array.from({ length: 17 }, (_, i) => <BloomingPetal key={`inner-${i}`} angle={i * 360 / 17} delay={delay + 0.15 * (reduced ? 0 : surprise.timing.growthSpeed) + i * stagger} inner reduced={reduced} />)}
      </g>
      <motion.g initial={reduced ? false : { scale: 0.12 }} animate={{ scale: 1 }}
        transition={{ duration: reduced ? 0 : 1.05 * surprise.timing.growthSpeed, delay: delay + stagger * 12 }}
        style={{ originX: 0, originY: 0, transformBox: "view-box" }}>
        <circle r="27" fill="#9B662C" />
        <circle r="24" fill="url(#sunflower-center)" stroke="#7F4E2A" strokeWidth="1" />
        {seeds.map((seed, i) => <ellipse key={i} cx={seed.x} cy={seed.y} rx={seed.r} ry={seed.r * 1.2} fill={i % 3 === 0 ? "#C79453" : "#9A6D40"} transform={`rotate(${i * 13} ${seed.x} ${seed.y})`} />)}
        <path d="M-15 -13 Q-4 -23 8 -18" fill="none" stroke="#E0B66F" strokeWidth="1.5" opacity=".5" />
      </motion.g>
    </g>
  );
}
