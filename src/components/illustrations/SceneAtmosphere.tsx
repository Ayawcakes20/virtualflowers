"use client";

import type { CSSProperties } from "react";

export function AnimatedSun() {
  return <g transform="translate(78 86)">
    <circle r="43" fill="#F5D995" opacity=".16" />
    <g className="sun-rays">{Array.from({length:12},(_,i)=><path key={i} d="M0 -32 L0 -40" transform={`rotate(${i*30})`} stroke="#EFC568" strokeWidth="2" strokeLinecap="round" />)}</g>
    <circle r="23" fill="#F8DC8D" />
    <path d="M-9 0 Q-6 -5 -3 0 M5 0 Q8 -5 11 0 M-4 7 Q1 12 6 7" stroke="#B48B48" fill="none" strokeWidth="1.5" strokeLinecap="round" />
    <ellipse cx="-13" cy="6" rx="4" ry="2" fill="#EABF7B" /><ellipse cx="15" cy="6" rx="4" ry="2" fill="#EABF7B" />
  </g>;
}

export function FloatingClouds() {
  return <g fill="#FFFCFA" opacity=".86">
    {[[179,69,.72],[441,100,.95],[91,214,.6],[488,245,.65]].map(([x,y,s],i)=><g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
      <path className={`cloud cloud-${i}`} d="M-43 11 C-62 10 -58 -13 -41 -12 C-43 -31 -18 -37 -8 -21 C5 -38 31 -28 30 -10 C53 -15 62 11 41 13Z" />
    </g>)}
  </g>;
}

export function FloatingPetals({ reduced }: { reduced: boolean }) {
  return <g>{[[95,315,-20],[493,344,30],[457,168,15],[135,149,-25]].map(([x,y,r],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
    <path className={reduced ? "" : "drifting-petal"} d="M0 0 Q-18 -18 -5 -30 Q17 -19 0 0Z" fill={i%2 ? "#C5ACDE" : "#E9C263"} opacity={reduced ? .6 : 0}
      style={{ animationDuration: `${12+i}s`, animationDelay: `${5+i*1.7}s` } as CSSProperties} />
  </g>)}</g>;
}

export function Grass() {
  return <g>
    <path d="M0 530 Q148 493 300 521 Q470 500 600 530 V590 H0Z" fill="#DFE7C7" />
    <path d="M0 555 Q143 520 298 546 Q450 520 600 547 V590 H0Z" fill="var(--green)" />
    {Array.from({length:42},(_,i)=>{
      const x=i*15-8, y=549+(i%5)*3;
      return <path key={i} d={`M${x} 590 Q${x-15} ${y-12} ${x+2} ${y} Q${x+8} ${y-25} ${x+14} ${y+1} Q${x+27} ${y-14} ${x+29} 590Z`} fill={i%3===0 ? "#A8C294" : i%3===1 ? "#B3CBA0" : "#BED1A8"} />;
    })}
    {[[58,555],[183,570],[422,555],[539,575]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}>
      {[0,72,144,216,288].map(r=><ellipse key={r} cy="-4" rx="2" ry="4" fill="#FFF9ED" transform={`rotate(${r})`} />)}<circle r="2" fill="#EAC56E" />
    </g>)}
  </g>;
}
