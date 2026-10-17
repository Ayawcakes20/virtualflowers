import type { CSSProperties } from "react";

type AmbientStyle = CSSProperties & Record<`--${string}`, string | number>;

export function Heart({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className} style={style}><path d="M16 27C12 24 2 17 3 10C4 2 13 3 16 9C20 2 29 3 29 11C29 17 20 25 16 27Z" fill="currentColor" /></svg>;
}

export function Sparkle({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}><path d="M16 2Q17 15 30 16Q17 17 16 30Q15 17 2 16Q15 15 16 2Z" fill="currentColor" /></svg>;
}

// Fixed positions and negative phases keep server and client markup identical.
const stars = [
  [6,12,12],[94,17,19],[13,30,8],[89,34,13],[3,49,17],[97,56,9],
  [10,67,11],[91,74,18],[6,88,8],[84,91,12],[28,9,9],[71,13,11],
  [3,24,8],[98,39,13],[17,85,16],[81,64,8],[23,95,10],[67,94,8],
  [15,54,8],[85,48,11],[4,76,13],[96,89,10],[42,5,7],[57,97,12],
];
const hearts = [[8,25,19],[94,39,23],[4,62,13],[92,82,18],[21,12,12],[76,96,14],[15,91,16],[97,16,11]];
const heartColors = ["#AE80C6", "#D39DB8", "#FFFCF5"];

function AmbientStar({ star, index }: { star: number[]; index: number }) {
  const [x,y,size] = star;
  const style: AmbientStyle = { left:`${x}%`, top:`${y}%`, width:size,
    "--duration":`${2.3 + index * .137}s`, "--phase":`${-index * .83 - .4}s`,
    "--turn":`${index % 2 ? -22 : 34}deg`, "--shine": .55 + (index % 4) * .12,
    color:index % 5 === 0 ? "#C29955" : index % 3 === 0 ? "#FFFCF3" : "#A675BF" };
  return <div className="ambient-twinkle" style={style}><Sparkle /></div>;
}

function AmbientHeart({ heart, index }: { heart: number[]; index: number }) {
  const [x,y,size] = heart;
  const style: AmbientStyle = { left:`${x}%`, top:`${y}%`, width:size, color:heartColors[index % 3],
    "--duration":`${10.5 + index * 1.31}s`, "--phase":`${-index * 2.37 - 1.8}s`,
    "--dx":`${index % 2 ? -26 : 24}px`, "--dy":`${index % 3 === 0 ? -100 : -53}px`,
    "--bend":`${index % 2 ? 17 : -15}px`, "--tilt":`${index % 2 ? 19 : -24}deg` };
  return <Heart className="ambient-heart" style={style} />;
}

export function Butterfly({ className = "", pink = false, style }: { className?: string; pink?: boolean; style?: CSSProperties }) {
  return <svg className={`butterfly ${className}`} style={style} viewBox="0 0 64 56" fill="none" aria-hidden="true">
    <g transform="translate(32 28)">
      <g className="butterfly-wing wing-left"><path d="M-1 5 C-38 4 -34 -34 -15 -19 Q-1 -10 -1 5Z" fill={pink ? "#DCADC7" : "#AE83CE"} /><path d="M-1 4 C-29 -7 -26 26 -11 17 Q-3 13 -1 4Z" fill={pink ? "#F3D9D8" : "#DAC2EF"} /><path d="M-5 0 Q-15 -15 -23 -13 M-5 6 Q-15 6 -18 13" stroke="#FFF6E7" strokeWidth="1.3" /><circle cx="-18" cy="-11" r="2.5" fill="#FFF7DD" /></g>
      <g className="butterfly-wing wing-right"><path d="M1 5 C38 4 34 -34 15 -19 Q1 -10 1 5Z" fill={pink ? "#E6BDCF" : "#C09CDD"} /><path d="M1 4 C29 -7 26 26 11 17 Q3 13 1 4Z" fill={pink ? "#FFF0DB" : "#EAD9F5"} /><path d="M5 0 Q15 -15 23 -13 M5 6 Q15 6 18 13" stroke="#FFF9EB" strokeWidth="1.3" /><circle cx="18" cy="-11" r="2.5" fill="#FFF7DD" /></g>
      <path d="M0 13 V-9 M0 -7 Q-4 -15 -8 -14 M0 -7 Q4 -15 8 -14" stroke="#86629F" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>;
}

export function SceneButterflies() {
  return <div className="scene-butterflies" aria-hidden="true">
    <Butterfly className="butterfly-one" style={{ "--flight-duration":"17.3s", "--flight-phase":"-3.8s", "--wing-speed":".57s", "--dx":"36px", "--dy":"-32px", "--bend":"-14px" } as AmbientStyle} />
    <Butterfly className="butterfly-two" pink style={{ "--flight-duration":"23.7s", "--flight-phase":"-13.2s", "--wing-speed":".73s", "--dx":"-31px", "--dy":"-48px", "--bend":"19px" } as AmbientStyle} />
  </div>;
}

export function PageOrnaments() {
  return <div className="page-ornaments" aria-hidden="true" data-testid="ambient-background">
    <div className="ambient-light light-lavender" /><div className="ambient-light light-cream" />
    <div className="ambient-layer ambient-layer-far">
      {[[0,13,230],[79,8,260],[-5,70,205],[85,77,230]].map(([x,y,w],i)=><svg key={i} className="ambient-cloud" viewBox="0 0 180 70" style={{left:`${x}%`,top:`${y}%`,width:w,"--duration":`${27+i*6.3}s`,"--phase":`${-7-i*9.7}s`,"--cloud-start":`${i%2 ? 36 : -44}px`,"--cloud-end":`${i%2 ? -48 : 52}px`,opacity:.58+i*.05} as AmbientStyle}>
        <path d="M15 58 C-3 56 1 30 22 31 C20 7 51 -2 68 21 C83 1 116 6 120 29 C147 10 173 30 163 45 C189 45 183 62 166 62 H20Z" fill={i%2 ? "#FFFDF9" : "#E8D8F5"} /><path d="M28 52 Q89 61 152 52" stroke="#C5A5DE" strokeWidth="1" fill="none" opacity=".4" />
      </svg>)}
    </div>
    <div className="ambient-layer ambient-layer-near">
      {hearts.map((heart,index)=><AmbientHeart key={index} heart={heart} index={index} />)}
      {stars.map((star,index)=><AmbientStar key={index} star={star} index={index} />)}
      {Array.from({length:12},(_,i)=><i key={i} className="light-mote" style={{left:`${i%2 ? 91+i%6 : 3+i%10}%`,top:`${14+(i*19)%78}%`,"--phase":`${i*-.93}s`,"--duration":`${6+i*.37}s`,"--dx":`${i%2 ? -13 : 17}px`} as AmbientStyle} />)}
      <i className="shooting-sparkle shooting-one" /><i className="shooting-sparkle shooting-two" />
    </div>
    <svg className="corner-doodle corner-doodle-left" viewBox="0 0 180 180"><path d="M-10 85 C30 27 112 63 87 111 C64 145 31 105 72 83 C116 61 156 96 173 148 M12 27 L24 38 M47 10 L52 29 M10 56 L27 60" /></svg>
    <svg className="corner-doodle corner-doodle-right" viewBox="0 0 180 180"><path d="M-10 85 C30 27 112 63 87 111 C64 145 31 105 72 83 C116 61 156 96 173 148" /></svg>
  </div>;
}
