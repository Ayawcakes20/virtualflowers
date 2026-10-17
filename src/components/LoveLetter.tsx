"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { surprise } from "@/config/surprise";
import { Heart } from "./Ornaments";

// Envelope center relative to the viewport center, captured on interaction.
export type LetterOrigin = { x: number; y: number };

export function LoveLetter({ onClose, onReplay, reduced, origin }: { onClose: () => void; onReplay: () => void; reduced: boolean; origin: LetterOrigin }) {
  const ref = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    headingRef.current?.focus({ preventScroll: true });
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; dialog?.close(); };
  }, []);

  return <dialog className="letter-dialog" ref={ref} aria-labelledby="letter-title" onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.article className="letter-paper"
      initial={{ opacity: reduced ? 0 : .6, x: reduced ? 0 : origin.x, y: reduced ? 0 : origin.y, scaleX: reduced ? 1 : .2, scaleY: reduced ? 1 : .1, rotateX: reduced ? 0 : -18 }}
      animate={{ opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1, rotateX: 0 }}
      transition={{ duration: reduced ? .1 : surprise.timing.letterUnfold, ease: [.2,.72,.25,1] }} style={{ transformOrigin: "50% 50%", transformPerspective: 1200 }}>
      <div className="paper-fold fold-one" aria-hidden="true" /><div className="paper-fold fold-two" aria-hidden="true" />
      <button className="letter-x" aria-label="Close letter" type="button" onClick={onClose}>×</button>
      <div className="letter-top-heart"><Heart /></div>
      <p className="eyebrow">{surprise.letter.eyebrow}</p>
      <h2 id="letter-title" tabIndex={-1} ref={headingRef}>{surprise.letter.salutation}</h2>
      <div className="letter-copy">{surprise.letter.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
      <div className="letter-signature"><span>{surprise.letter.closing}</span><strong>{surprise.from}<Heart /></strong></div>
      <div className="letter-actions"><button type="button" onClick={onClose} className="primary-button">Close Letter<span aria-hidden="true">♡</span></button><button type="button" onClick={onReplay} className="text-button"><span aria-hidden="true">↻</span> Watch Again</button></div>
    </motion.article>
  </dialog>;
}
