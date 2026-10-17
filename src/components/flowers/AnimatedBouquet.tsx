"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { surprise } from "@/config/surprise";
import { AnimatedSunflower, type Flower } from "./AnimatedSunflower";
import { FlowerStem } from "./FlowerStem";
import { FlowerLeaves } from "./FlowerLeaves";
import { BouquetWrapper } from "./BouquetWrapper";

export const sunflowers: Flower[] = [
  { x: 300, y: 153, size: .96, tilt: -7, delay: 2 },
  { x: 219, y: 204, size: .82, tilt: -23, delay: 2.45 },
  { x: 378, y: 201, size: .88, tilt: 14, delay: 2.8 },
  { x: 288, y: 254, size: 1.02, tilt: 8, delay: 3.25 },
  { x: 182, y: 279, size: .66, tilt: -17, delay: 3.6 },
  { x: 414, y: 286, size: .69, tilt: 24, delay: 3.95 },
  { x: 353, y: 313, size: .64, tilt: -10, delay: 4.2 },
];

const smallFlowers = [
  [245, 143, 12, 0], [351, 139, 13, 1], [162, 227, 12, 0],
  [427, 230, 13, 1], [221, 299, 17, 1], [243, 331, 11, 0],
  [391, 338, 13, 0], [324, 191, 10, 0], [177, 333, 11, 1],
  [402, 154, 9, 0], [264, 189, 10, 1], [313, 333, 9, 0],
];

export const bouquetFinishedAt = Math.max(...sunflowers.map(f => f.delay + .15 + 16 * .018 + surprise.timing.petalDuration), 6.65) * surprise.timing.growthSpeed;

export const AnimatedBouquet = memo(function AnimatedBouquet({ reduced, onBloomComplete }: { reduced: boolean; onBloomComplete: () => void }) {
  return <g data-testid="bouquet" className="bouquet-sway">
    <BouquetWrapper reduced={reduced} back />
    {sunflowers.map((flower, i) => <FlowerStem key={i} flower={flower} reduced={reduced} />)}
    {smallFlowers.map(([x, y], i) => <motion.path key={i} d={`M302 429 Q${x} 330 ${x} ${y}`} fill="none" stroke="#79996C" strokeWidth="2"
      initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : (1.8 + i * .12) * surprise.timing.growthSpeed }} />)}
    <FlowerLeaves reduced={reduced} />
    {sunflowers.map((flower, i) => <AnimatedSunflower key={i} flower={flower} reduced={reduced} />)}
    {smallFlowers.map(([x, y, size, purple], i) => <g key={i} transform={`translate(${x} ${y}) scale(${size / 20})`}>
      {Array.from({ length: purple ? 6 : 7 }, (_, p) => <g key={p} transform={`rotate(${p * 360 / (purple ? 6 : 7)})`}>
        <motion.path d="M0 0 C-24 -13 -19 -35 0 -30 C19 -35 24 -13 0 0Z"
          initial={reduced ? false : { scaleY: .02, scaleX: .2 }} animate={{ scaleX: 1, scaleY: 1 }}
          style={{ originX: 0, originY: 0, transformBox: "view-box" }}
          transition={{ duration: reduced ? 0 : .7 * surprise.timing.growthSpeed, delay: reduced ? 0 : (4.6 + i * .11 + p * .025) * surprise.timing.growthSpeed }}
          fill={purple ? "url(#petal-purple)" : "#FFFCF3"} stroke={purple ? "#A184C4" : "#E3DAC8"} strokeWidth="1" />
      </g>)}
      <motion.circle r="6" fill={purple ? "#F1CE6E" : "#D8B566"} initial={{ scale: reduced ? 1 : 0 }} animate={{ scale: 1 }} transition={{ delay: reduced ? 0 : (4.7 + i * .11) * surprise.timing.growthSpeed }} />
    </g>)}
    {/* Baby's breath: only a few small clusters, no expensive SVG filters. */}
    {[ [203,165], [368,172], [150,303], [437,313], [266,116] ].map(([x, y], i) => <motion.g key={i}
      initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : (5.6 + i * .1) * surprise.timing.growthSpeed }}>
      <path d={`M${x + 6} ${y + 33} l-8 -27 m8 27 l12 -23 m-12 23 l-18 -10`} stroke="#879E77" fill="none" strokeWidth="1.2" />
      {[[0,0],[-7,5],[8,6],[18,9],[-13,22],[22,19]].map(([dx, dy], p) => <circle key={p} cx={x + dx} cy={y + dy} r={3 + p % 2} fill="#FFFCF2" stroke="#E4DCC9" strokeWidth=".5" />)}
    </motion.g>)}
    <BouquetWrapper reduced={reduced} />
    {/* The completion cue is driven by Motion's timeline, not a detached timeout. */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? .15 : bouquetFinishedAt, ease: "linear" }} onAnimationComplete={onBloomComplete} />
  </g>;
});

export function BouquetGradients() {
  return <defs>
    <linearGradient id="petal-gold" x1="0" y1="0" x2="0.15" y2="1"><stop stopColor="#FFDC6A" /><stop offset=".52" stopColor="#F7BC38" /><stop offset="1" stopColor="#E69326" /></linearGradient>
    <linearGradient id="petal-light" x1="0" y1="0" x2="0.15" y2="1"><stop stopColor="#FFF0A1" /><stop offset=".55" stopColor="#FFDC58" /><stop offset="1" stopColor="#F0B32F" /></linearGradient>
    <radialGradient id="sunflower-center" cx=".4" cy=".35"><stop stopColor="#88592F" /><stop offset="1" stopColor="#5A382A" /></radialGradient>
    <linearGradient id="leaf-green" x2="1" y2=".7"><stop stopColor="#A1B67D" /><stop offset="1" stopColor="#557A4D" /></linearGradient>
    <linearGradient id="petal-purple" x2=".7" y2="1"><stop stopColor="var(--lavender)" /><stop offset="1" stopColor="var(--violet)" /></linearGradient>
    <linearGradient id="wrapper-lavender" x1="0" x2="1" y2=".5"><stop stopColor="var(--lavender)" /><stop offset=".5" stopColor="var(--lilac)" /><stop offset="1" stopColor="var(--violet)" /></linearGradient>
    <radialGradient id="teddy-fur" cx=".35" cy=".25"><stop stopColor="#C99D70" /><stop offset="1" stopColor="#A77850" /></radialGradient>
    <linearGradient id="sky" x2=".2" y2="1"><stop stopColor="var(--lavender)" /><stop offset="1" stopColor="#F8F4F5" /></linearGradient>
  </defs>;
}
