"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { surprise } from "@/config/surprise";
import { AnimatedBouquet, BouquetGradients } from "./flowers/AnimatedBouquet";
import { AnimatedSun, FloatingClouds, FloatingPetals, Grass } from "./illustrations/SceneAtmosphere";
import { TeddyBear } from "./illustrations/TeddyBear";
import { TatersPopcorn } from "./illustrations/TatersPopcorn";
import { LoveEnvelope } from "./LoveEnvelope";

export function SurpriseScene({ reduced, onOpenLetter, onReplay, envelopeVersion }: {
  reduced: boolean; onOpenLetter: () => void; onReplay: () => void; envelopeVersion: number;
}) {
  const [bloomed, setBloomed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const complete = useCallback(() => setBloomed(true), []);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);

  return <motion.section className="surprise-screen" data-testid="surprise-scene" data-bloomed={bloomed} aria-labelledby="scene-title"
    initial={{ opacity: 0, y: reduced ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? .15 : .5 }}>
    <p className="eyebrow">PICKED WITH LOVE. MADE FOR YOU.</p>
    <h1 id="scene-title" tabIndex={-1} ref={heading}>{surprise.scene.heading[0]}<br /><em>{surprise.scene.heading[1]}</em><span className="heading-heart" aria-hidden="true"> 💜</span><span className="sr-only"> 💜</span></h1>
    <p className="scene-subtitle">{surprise.scene.subtitle}</p>
    <div className="postcard-wrap">
      <span className="postcard-tape tape-left" aria-hidden="true" /><span className="postcard-tape tape-right" aria-hidden="true" />
      <div className="postcard">
        <svg className="greeting-illustration" viewBox="0 0 600 590" role="img" aria-labelledby="bouquet-description">
          <title id="bouquet-description">An animated bouquet of yellow sunflowers and lavender flowers, wrapped in purple paper, with a brown teddy bear and Taters popcorn in a sunny garden.</title>
          <BouquetGradients />
          <path d="M0 0H600V590H0Z" fill="url(#sky)" />
          <AnimatedSun /><FloatingClouds />
          <g fill="#B49BC9" opacity=".65">
            <path d="M510 55 l2 8 8 2 -8 2 -2 8 -2 -8 -8 -2 8 -2Z M115 361 l2 7 7 2 -7 2 -2 7 -2 -7 -7 -2 7 -2Z M481 300 l1 5 5 1 -5 1 -1 5 -1 -5 -5 -1 5 -1Z" />
            <path d="M484 196 C472 185 473 181 478 181 Q483 180 484 185 Q490 177 494 183 Q500 188 484 196Z" />
            <path d="M120 259 C108 248 109 244 114 244 Q119 243 120 248 Q126 240 130 246 Q136 251 120 259Z" />
          </g>
          <ellipse cx="303" cy="508" rx="116" ry="10" fill="#8B7B91" opacity=".08" />
          <AnimatedBouquet reduced={reduced} onBloomComplete={complete} />
          <TeddyBear reduced={reduced} /><TatersPopcorn reduced={reduced} />
          <FloatingPetals reduced={reduced} />
          <Grass />
          <text x="300" y="569" textAnchor="middle" fill="#617A53" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="17" fontStyle="italic">a little sunshine for you</text>
        </svg>
        <div className="postcard-caption"><span>FOR YOU, ALWAYS</span><span aria-hidden="true">♡</span><span>WITH LOVE, {surprise.from.toUpperCase()}</span></div>
      </div>
      {bloomed && <LoveEnvelope key={envelopeVersion} reduced={reduced} onOpen={onOpenLetter} />}
    </div>
    <div className="scene-afterword" aria-live="polite"><p>{bloomed ? surprise.scene.ready : surprise.scene.growing}</p></div>
    {bloomed && <button className="text-button replay-button" type="button" onClick={onReplay}><span aria-hidden="true">↻</span> Watch Again</button>}
  </motion.section>;
}
