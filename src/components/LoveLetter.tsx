"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { surprise } from "@/config/surprise";
import { Heart } from "./Ornaments";

export function LoveLetter({ onClose, onReplay, reduced }: { onClose: () => void; onReplay: () => void; reduced: boolean }) {
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
    <motion.article className="letter-paper" initial={{ opacity: 0, y: reduced ? 0 : 40, scaleY: reduced ? 1 : .72 }} animate={{ opacity: 1, y: 0, scaleY: 1 }}
      transition={{ duration: reduced ? .15 : .65, ease: [.22,.7,.3,1] }} style={{ transformOrigin: "50% 100%" }}>
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
