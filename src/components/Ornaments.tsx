import type { CSSProperties } from "react";

export function Heart({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className} style={style}><path d="M16 27C12 24 2 17 3 10C4 2 13 3 16 9C20 2 29 3 29 11C29 17 20 25 16 27Z" fill="currentColor" /></svg>;
}

export function Sparkle({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}><path d="M16 2Q17 15 30 16Q17 17 16 30Q15 17 2 16Q15 15 16 2Z" fill="currentColor" /></svg>;
}

export function PageOrnaments() {
  return <div className="page-ornaments" aria-hidden="true">
    <Heart className="ambient-heart ambient-heart-one" />
    <Heart className="ambient-heart ambient-heart-two" />
    <Sparkle className="ambient-star ambient-star-one" />
    <Sparkle className="ambient-star ambient-star-two" />
    <svg className="corner-doodle corner-doodle-left" viewBox="0 0 180 180"><path d="M-10 85 C30 27 112 63 87 111 C64 145 31 105 72 83 C116 61 156 96 173 148 M12 27 L24 38 M47 10 L52 29 M10 56 L27 60" /></svg>
    <svg className="corner-doodle corner-doodle-right" viewBox="0 0 180 180"><path d="M-10 85 C30 27 112 63 87 111 C64 145 31 105 72 83 C116 61 156 96 173 148" /></svg>
  </div>;
}
