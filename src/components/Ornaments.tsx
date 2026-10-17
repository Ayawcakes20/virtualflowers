import type { CSSProperties } from "react";

export function Heart({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className} style={style}><path d="M16 27C12 24 2 17 3 10C4 2 13 3 16 9C20 2 29 3 29 11C29 17 20 25 16 27Z" fill="currentColor" /></svg>;
}

export function Sparkle({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}><path d="M16 2Q17 15 30 16Q17 17 16 30Q15 17 2 16Q15 15 16 2Z" fill="currentColor" /></svg>;
}

export function Butterfly({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="-32 -28 64 56" fill="none" aria-hidden="true">
    <g className="butterfly-wing wing-left"><path d="M-1 5 C-38 4 -34 -34 -15 -19 Q-1 -10 -1 5Z" fill="#BA92DB" /><path d="M-1 4 C-29 -7 -26 26 -11 17 Q-3 13 -1 4Z" fill="#D8B8EA" /><path d="M-5 0 Q-15 -15 -23 -13" stroke="#EFE0FF" strokeWidth="1.2" /></g>
    <g className="butterfly-wing wing-right"><path d="M1 5 C38 4 34 -34 15 -19 Q1 -10 1 5Z" fill="#C5A0E1" /><path d="M1 4 C29 -7 26 26 11 17 Q3 13 1 4Z" fill="#E6CEF3" /><path d="M5 0 Q15 -15 23 -13" stroke="#F7EBFF" strokeWidth="1.2" /></g>
    <path d="M0 13 V-9 M0 -7 Q-4 -15 -8 -14 M0 -7 Q4 -15 8 -14" stroke="#8B65AA" strokeWidth="2" strokeLinecap="round" />
  </svg>;
}

export function PageOrnaments({ revealed = false }: { revealed?: boolean }) {
  return <div className="page-ornaments" aria-hidden="true" data-testid="ambient-background">
    <div className="ambient-light light-lavender" /><div className="ambient-light light-cream" />
    <div className="ambient-layer ambient-layer-far">
      {[[1,16,230],[76,9,260],[-7,65,205],[84,74,230]].map(([x,y,w],i)=><svg key={i} className={`ambient-cloud ambient-cloud-${i}`} viewBox="0 0 180 70" style={{left:`${x}%`,top:`${y}%`,width:w,animationDelay:`${i*-6}s`}}>
        <path d="M15 58 C-3 56 1 30 22 31 C20 7 51 -2 68 21 C83 1 116 6 120 29 C147 10 173 30 163 45 C189 45 183 62 166 62 H20Z" fill={i%2 ? "#FFFDF9" : "#EEE1FA"} /><path d="M28 52 Q89 61 152 52" stroke="#D4BFE8" strokeWidth="1" fill="none" opacity=".4" />
      </svg>)}
    </div>
    <div className="ambient-layer ambient-layer-near">
      {[[9,23,20],[88,34,27],[15,72,14],[78,85,19],[46,7,12],[4,48,12],[95,62,13],[65,96,15]].map(([x,y,size],i)=><Heart key={i} className="ambient-heart" style={{left:`${x}%`,top:`${y}%`,width:size,animationDuration:`${9+i*1.7}s`,animationDelay:`${i*-2.3}s`}} />)}
      {Array.from({length:10},(_,i)=><div key={i} className="ambient-twinkle" style={{left:`${7+(i*23)%89}%`,top:`${7+(i*17)%84}%`,animationDelay:`${i*-.65}s`}}><Sparkle /></div>)}
      {Array.from({length:12},(_,i)=><i key={i} className="light-mote" style={{left:`${3+(i*31)%94}%`,top:`${14+(i*19)%78}%`,animationDelay:`${i*-.9}s`,animationDuration:`${6+i%4}s`}} />)}
    </div>
    {revealed && <div className="ambient-butterflies"><Butterfly className="butterfly butterfly-one" /><Butterfly className="butterfly butterfly-two" /></div>}
    <svg className="corner-doodle corner-doodle-left" viewBox="0 0 180 180"><path d="M-10 85 C30 27 112 63 87 111 C64 145 31 105 72 83 C116 61 156 96 173 148 M12 27 L24 38 M47 10 L52 29 M10 56 L27 60" /></svg>
    <svg className="corner-doodle corner-doodle-right" viewBox="0 0 180 180"><path d="M-10 85 C30 27 112 63 87 111 C64 145 31 105 72 83 C116 61 156 96 173 148" /></svg>
  </div>;
}
