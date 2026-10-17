"use client";

import { motion } from "motion/react";
import { surprise } from "@/config/surprise";

export function TeddyBear({ reduced }: { reduced: boolean }) {
  return <g transform="translate(464 442) rotate(6)" data-testid="teddy-bear">
    <motion.g initial={reduced ? false : { y: 70, opacity: 0, rotate: 12 }} animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", bounce: .35, duration: reduced ? 0 : 1.1, delay: reduced ? 0 : surprise.timing.teddy * surprise.timing.growthSpeed }}>
      <ellipse cy="66" rx="60" ry="8" fill="#6F7B52" opacity=".1" />
      <g className="teddy-breathe">
        <ellipse cy="24" rx="37" ry="43" fill="url(#teddy-fur)" stroke="#926444" strokeWidth="1.4" />
        <ellipse cy="29" rx="24" ry="29" fill="#D9B58C" />
        <ellipse cx="-31" cy="-43" rx="17" ry="18" fill="#B98A5F" stroke="#956A4C" strokeWidth="1.2" />
        <ellipse cx="32" cy="-43" rx="17" ry="18" fill="#B98A5F" stroke="#956A4C" strokeWidth="1.2" />
        <ellipse cx="-31" cy="-43" rx="10" ry="11" fill="#DFC1A0" />
        <ellipse cx="32" cy="-43" rx="10" ry="11" fill="#DFC1A0" />
        <path d="M-42 -13 C-43 -58 42 -60 43 -12 C46 28 -42 30 -42 -13Z" fill="url(#teddy-fur)" stroke="#9E704D" strokeWidth="1.2" />
        <path d="M-25 -35 Q-10 -48 4 -43 M-23 -32 L-19 -35 M9 -43 L14 -41" stroke="#E0BB8E" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cy="3" rx="20" ry="15" fill="#E7CCAA" />
        <ellipse cx="-15" cy="-14" rx="3.3" ry="4.2" fill="#3F2B25" />
        <ellipse cx="15" cy="-14" rx="3.3" ry="4.2" fill="#3F2B25" />
        <circle cx="-16" cy="-15.5" r="1" fill="white" /><circle cx="14" cy="-15.5" r="1" fill="white" />
        <ellipse cx="-27" cy="-2" rx="6.5" ry="3" fill="#C9877B" opacity=".5" />
        <ellipse cx="27" cy="-2" rx="6.5" ry="3" fill="#C9877B" opacity=".5" />
        <path d="M-7 -2 Q0 -7 7 -2 Q6 5 0 5 Q-6 5 -7 -2" fill="#573A30" />
        <path d="M0 5 V9 M-7 9 Q0 16 7 9" fill="none" stroke="#79503A" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="-36" cy="31" rx="14" ry="25" fill="#B98A61" stroke="#9E704D" strokeWidth="1.2" transform="rotate(-23 -36 31)" />
        <g className="teddy-wave">
          <ellipse cx="39" cy="11" rx="14" ry="25" fill="#BD9169" stroke="#9E704D" strokeWidth="1.2" transform="rotate(37 39 11)" />
          <ellipse cx="47" cy="-2" rx="7" ry="9" fill="#E4C7A2" transform="rotate(37 47 -2)" />
          {[[-1,-1],[5,-3],[9,1]].map(([x,y],i)=><circle key={i} cx={43+x} cy={-12+y} r="2" fill="#E4C7A2" />)}
        </g>
        <ellipse cx="-28" cy="57" rx="23" ry="19" fill="#B1835C" stroke="#956A4C" strokeWidth="1.2" transform="rotate(-17 -28 57)" />
        <ellipse cx="28" cy="57" rx="23" ry="19" fill="#B1835C" stroke="#956A4C" strokeWidth="1.2" transform="rotate(17 28 57)" />
        <ellipse cx="-29" cy="55" rx="13" ry="12" fill="#E1C3A0" transform="rotate(-17 -29 55)" />
        <ellipse cx="29" cy="55" rx="13" ry="12" fill="#E1C3A0" transform="rotate(17 29 55)" />
        <path d="M-2 23 Q-33 -1 -31 23 Q-33 42 -2 29 Q32 43 31 22 Q31 1 -2 23" fill="#BBA0D0" stroke="#9473AC" strokeWidth="1.2" />
        <path d="M-6 29 L-19 55 L-7 50 L-2 55 L5 30 L16 52 L25 46 L11 27" fill="#AD8DC4" />
        <circle cy="26" r="6" fill="#9F7AB6" />
        {[[-22,19],[-21,29],[20,20],[20,30],[-10,45],[16,43]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.3" fill="#F8F1FC" />)}
      </g>
    </motion.g>
  </g>;
}
