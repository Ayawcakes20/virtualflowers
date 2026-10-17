"use client";

import { motion } from "motion/react";
import { surprise } from "@/config/surprise";

const leaves = [
  [258, 317, -66, 1.05], [303, 310, 55, 1.1], [232, 282, -96, .85],
  [348, 297, 80, 1], [194, 255, -55, .8], [400, 266, 54, .8],
  [258, 232, -26, .83], [333, 211, 66, .75], [225, 342, -104, 1.1],
  [365, 343, 94, 1.1], [289, 193, -39, .85], [373, 242, 23, .85],
];

export function FlowerLeaves({ reduced }: { reduced: boolean }) {
  return <g>{leaves.map(([x, y, angle, scale], i) => (
    <g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <motion.g initial={reduced ? false : { scaleX: .02, scaleY: .2, rotate: 23 }} animate={{ scaleX: 1, scaleY: 1, rotate: 0 }}
        style={{ originX: 0, originY: 0, transformBox: "view-box" }}
        transition={{ duration: reduced ? 0 : .8 * surprise.timing.growthSpeed, delay: reduced ? 0 : (1.35 + i * .095) * surprise.timing.growthSpeed }}>
        <path d="M0 0 C-30 -12 -30 -47 -7 -68 C14 -48 30 -14 0 0Z" fill={i % 2 === 0 ? "url(#leaf-green)" : "#729460"} stroke="#5D8054" strokeWidth="1" />
        <path d="M0 -2 Q-8 -31 -7 -60 M-5 -27 L-18 -39 M-7 -39 L3 -49 M-2 -15 L9 -30" stroke="#BDCE96" strokeWidth="1" fill="none" />
      </motion.g>
    </g>
  ))}</g>;
}
