import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, interpolate, registerRoot, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

type Cue = {text: string; startFrame: number; endFrame: number};
type Scene = {cues: Cue[]; heading: string; label: string; items: string[]; narration: string; audio: string; durationInFrames: number};
type Props = {scenes: Scene[]};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Original illustrations: no third-party artwork or company identity.
const Bag: React.FC<{x: number; y: number}> = ({x, y}) => <g transform={`translate(${x} ${y})`}>
  <path d="M35 35V16Q35 0 51 0H82Q98 0 98 16V35" fill="none" stroke="#263b48" strokeWidth="10" />
  <rect y="32" width="132" height="114" rx="14" fill="#294656" stroke="#192f3d" strokeWidth="4" />
  <path d="M3 73H129M52 68V88H80V68" fill="none" stroke="#8ba7ac" strokeWidth="5" />
</g>;
const Toolbox = () => <g transform="translate(365 352)">
  <path d="M43 30V9H111V30" fill="none" stroke="#bda98a" strokeWidth="10" />
  <path d="M8 30H148L157 60V137H0V60Z" fill="#b36d49" stroke="#633f32" strokeWidth="4" />
  <path d="M2 76H155M38 33L44 42L35 54M127 116L136 107L145 112" fill="none" stroke="#704732" strokeWidth="3" />
  <rect x="64" y="66" width="26" height="26" rx="3" fill="#ddc19a" />
</g>;
const WaitingBench: React.FC<{bagMoved: boolean}> = ({bagMoved}) => <>
  <ellipse cx="300" cy="505" rx="262" ry="20" fill="#111d2933" />
  <rect x="40" y="194" width="520" height="150" rx="20" fill="#6f9998" stroke="#3a6468" strokeWidth="5" />
  <path d="M210 200V339M388 200V339" stroke="#50797a" strokeWidth="4" />
  <rect x="31" y="333" width="538" height="48" rx="14" fill="#8eaeaa" stroke="#3a6468" strokeWidth="5" />
  <path d="M78 383V484M524 383V484" stroke="#c5baa4" strokeWidth="13" />
  <Bag x={bagMoved ? 81 : 222} y={bagMoved ? 349 : 188} />
  <Toolbox />
  <path d="M369 285H410V335L427 348V368H360V342Z M454 285H495V335L512 348V368H445V342Z" fill="#665044" stroke="#443d36" strokeWidth="3" />
  <path d="M365 356L383 348L398 360M450 356L468 349L486 360" fill="none" stroke="#9b7954" strokeWidth="7" />
  <circle cx="300" cy="93" r="52" fill="#f1e6ce" stroke="#baa88c" strokeWidth="6" />
  <path d="M300 58V94L324 109" fill="none" stroke="#496672" strokeWidth="5" strokeLinecap="round" />
</>;
const Badge: React.FC<{revealed: boolean}> = ({revealed}) => <>
  <ellipse cx="300" cy="510" rx="194" ry="19" fill="#111d2933" />
  <path d="M197 58L265 226H335L404 58" fill="none" stroke="#84a7a6" strokeWidth="24" />
  <rect x="146" y="215" width="308" height="283" rx="22" fill="#f3ead7" stroke="#b8aa90" strokeWidth="5" />
  <rect x="259" y="203" width="82" height="29" rx="8" fill="#c4bda9" />
  <circle cx="300" cy="302" r="37" fill="#a3b7b3" />
  <path d="M239 375Q244 336 300 336Q356 336 361 375" fill="#a3b7b3" />
  {revealed ? <g data-artwork="founder-badge"><text x="300" y="443" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="38" fontWeight="700" fill="#294656">FOUNDER</text></g> : <path d="M242 423H358M264 443H336" stroke="#bcb8a8" strokeWidth="8" strokeLinecap="round" />}
</>;
const Browser = () => <>
  <ellipse cx="300" cy="503" rx="259" ry="20" fill="#111d2933" />
  <rect x="68" y="99" width="464" height="326" rx="17" fill="#263e4a" stroke="#172d38" strokeWidth="7" />
  <rect x="86" y="118" width="428" height="280" rx="5" fill="#ede6d8" />
  <path d="M87 162H513" stroke="#c8cabf" strokeWidth="3" />
  <circle cx="105" cy="139" r="5" fill="#b47e61" /><circle cx="124" cy="139" r="5" fill="#c5ab70" /><circle cx="143" cy="139" r="5" fill="#84a294" />
  <rect x="178" y="130" width="310" height="18" rx="6" fill="#d7d9cf" />
  <rect x="108" y="183" width="260" height="60" rx="5" fill="#a5b8b1" />
  <path d="M110 269H297M110 292H265M110 315H287" stroke="#b8bdb0" strokeWidth="8" />
  <path d="M391 191L423 223M423 191L391 223M389 287L421 319M421 287L389 319" stroke="#b76b52" strokeWidth="6" />
  <text x="300" y="369" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="28" fill="#6f473a">Hard to use.</text>
  <path d="M68 425L29 476Q29 490 48 490H552Q571 490 571 476L532 425Z" fill="#9caaa5" stroke="#5c7275" strokeWidth="5" />
  <path d="M247 459H353" stroke="#657d80" strokeWidth="7" strokeLinecap="round" />
</>;
const Notebook: React.FC<{showOffer: boolean; offer: string}> = ({showOffer, offer}) => <g data-artwork="open-notebook">
  <ellipse cx="300" cy="513" rx="260" ry="19" fill="#111d2933" />
  <path d="M40 115Q159 80 300 118Q441 80 560 115V487Q433 460 300 499Q167 460 40 487Z" fill="#647d78" stroke="#344f50" strokeWidth="5" />
  <path d="M52 99Q176 72 300 110Q424 72 548 99V471Q424 445 300 483Q176 445 52 471Z" fill="#f4e9cd" stroke="#c5b48c" strokeWidth="3" />
  <path d="M300 111V482" stroke="#c9b990" strokeWidth="4" />
  <text x="78" y="160" fontFamily="Arial, sans-serif" fontSize="25" fontWeight="700" fill="#425d60">Website notes</text>
  <path d="M80 194H264M80 232H245M80 270H260M80 308H231M80 346H256M80 384H236" stroke="#9daaa0" strokeWidth="7" strokeLinecap="round" />
  {showOffer ? <foreignObject data-artwork="job-offer" x="326" y="192" width="197" height="225"><div style={{fontFamily: 'Georgia, serif', fontSize: 37, lineHeight: 1.22, color: '#294656', textAlign: 'center'}}>{offer}</div></foreignObject> : <path d="M332 194H517M332 232H497M332 270H511M332 308H482" stroke="#c8c0a7" strokeWidth="3" />}
</g>;

export const Panel: React.FC<{scene: Scene; index: number}> = ({scene, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reached = (cueIndex: number) => scene.cues[cueIndex] !== undefined && frame >= scene.cues[cueIndex].startFrame;
  const activeCue = scene.cues.find(cue => frame >= cue.startFrame && frame < cue.endFrame);
  const offerVisible = index === 4 && reached(2);
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #516f74 0%, #263f4c 65%, #182c39 100%)', fontFamily: 'Arial, sans-serif', color: '#f5ecd9'}}>
    <div style={{position: 'absolute', left: 56, top: 74, fontSize: 19, letterSpacing: 2.2, color: '#c4d0c8'}}>ORIGINAL FICTION</div>
    <div style={{position: 'absolute', left: 56, top: 115, fontSize: 31, fontWeight: 600}}>The Waiting Room</div>
    <div style={{position: 'absolute', left: 56, top: 216, fontSize: 19, letterSpacing: 1.8, color: '#c4d0c8'}}>{scene.label}</div>
    <div style={{position: 'absolute', left: 60, top: 295, width: 600, height: 570, opacity: interpolate(frame, [0, fps * .22], [.5, 1], clamp), scale: interpolate(frame, [0, scene.durationInFrames], [1, 1.025], clamp)}}>
      <svg viewBox="0 0 600 570" style={{width: '100%', height: '100%', display: 'block'}}>
        {index < 2 ? <WaitingBench bagMoved={index === 1} /> : index === 2 ? <Badge revealed={reached(1)} /> : index === 3 ? <Browser /> : <Notebook showOffer={offerVisible} offer={scene.items[0] ?? 'How soon can you start?'} />}
      </svg>
    </div>
    {/* At the final cue, the notebook is the sole visible offer text. */}
    {activeCue && !offerVisible ? <div style={{position: 'absolute', left: 56, right: 56, top: 988, minHeight: 118, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 22px', boxSizing: 'border-box', background: '#172f3cf2', border: '1px solid #78928d', borderRadius: 14, fontSize: 31, lineHeight: 1.36, textAlign: 'center', color: '#fff8ea'}}>{activeCue.text}</div> : null}
    <div style={{position: 'absolute', left: 56, right: 56, top: 1170, height: 3, background: '#ffffff20'}}><div style={{height: 3, background: '#cdbb8f', width: `${Math.min(100, frame / Math.max(1, scene.durationInFrames - 1) * 100)}%`}} /></div>
    <Audio src={staticFile(scene.audio)} />
  </AbsoluteFill>;
};

// The five fixed scenes intentionally share one measured-cue template.
const Pilot: React.FC<Props> = ({scenes}) => {
  const {fps} = useVideoConfig();
  let start = 0;
  return <AbsoluteFill>{scenes.map((scene, index) => {
    const from = start;
    start += scene.durationInFrames;
    return <Sequence key={index} from={from} durationInFrames={scene.durationInFrames} premountFor={fps}><Panel scene={scene} index={index} /></Sequence>;
  })}</AbsoluteFill>;
};
const Root = () => <Composition id="FreeEnglishPilot" component={Pilot} width={720} height={1280} fps={30} durationInFrames={30} defaultProps={{scenes: [] as Scene[]}} calculateMetadata={({props}) => ({durationInFrames: Math.max(30, props.scenes.reduce((n, scene) => n + scene.durationInFrames, 0))})} />;
registerRoot(Root);
