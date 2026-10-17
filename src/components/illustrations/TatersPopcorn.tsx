"use client";

import { motion } from "motion/react";
import { surprise } from "@/config/surprise";

const kernels = [ [-32,-40],[-16,-48],[0,-40],[19,-47],[33,-36],[-24,-26],[-7,-29],[13,-28],[29,-23],[-37,-18],[0,-17] ];

export function TatersPopcorn({ reduced }: { reduced: boolean }) {
  return <g transform="translate(111 451) rotate(-9) scale(1.15)" data-testid="taters-popcorn">
    <motion.g initial={reduced ? false : { y: 65, rotate: -12, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", bounce: .3, duration: reduced ? 0 : .9, delay: reduced ? 0 : surprise.timing.popcorn * surprise.timing.growthSpeed }}>
      <ellipse cy="54" rx="43" ry="6" fill="#6F7B52" opacity=".1" />
      {kernels.map(([x,y],i)=><motion.g key={i} initial={reduced ? false : { y: 25, scale: .4, rotate: i%2 ? -12 : 12 }} animate={{ y: [null,i%3===0 ? -24 : -10,0], scale: 1, rotate: 0 }}
        transition={{ duration: reduced ? 0 : .75, delay: reduced ? 0 : surprise.timing.popcorn * surprise.timing.growthSpeed + .08 + i * .035 }}>
        <path d={`M${x-9} ${y+5} c-9 -6 -6 -15 1 -15 c0 -9 13 -11 17 -3 c10 -3 16 9 8 15 c0 10 -15 13 -18 5 c-5 3 -10 2 -8 -2Z`} fill={i%3===0 ? "#F7DEA1" : "#FFF1C5"} stroke="#E2C58A" strokeWidth="1" />
        <path d={`M${x+4} ${y+1} q-4 -7 3 -7`} stroke="#D9B36E" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d={`M${x-5} ${y-6} q2 -5 6 -4 M${x+15} ${y-3} q5 1 4 5`} stroke="#FFFBDF" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d={`M${x-2} ${y+7} q5 3 9 0`} stroke="#E8C789" strokeWidth=".8" fill="none" />
      </motion.g>)}
      <path d="M-44 -18 Q0 -10 44 -18 L32 51 Q0 62 -32 51Z" fill="#FFF8E7" stroke="#AB8EBF" strokeWidth="1.5" />
      <path d="M-41 -15 L-25 -14 L-18 55 L-31 51Z M-10 -12 L5 -12 L4 57 L-8 57Z M20 -14 L35 -15 L25 54 L14 57Z" fill="#BDA1D2" />
      <path d="M-44 -18 Q0 -10 44 -18" stroke="#E6D7EE" strokeWidth="4" fill="none" />
      <g transform="rotate(-3)">
        <path d="M-33 3 Q0 -3 33 3 L30 28 Q0 36 -30 28Z" fill="#7B517F" stroke="#F1D987" strokeWidth="1.3" />
        <text y="22" textAnchor="middle" fill="#FFF6D0" fontSize="20" fontWeight="600" fontStyle="italic" fontFamily="Georgia, serif">Taters</text>
      </g>
      <text y="45" textAnchor="middle" fill="#705778" fontSize="5.8" letterSpacing="2" fontFamily="DM Sans, sans-serif">HAPPINESS INSIDE</text>
    </motion.g>
  </g>;
}
