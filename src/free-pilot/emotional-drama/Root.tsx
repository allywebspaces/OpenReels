import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, interpolate, registerRoot, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

type Cue = {text: string; startFrame: number; endFrame: number};
type Scene = {cues: Cue[]; heading: string; label: string; items: string[]; narration: string; audio: string; durationInFrames: number};
type Props = {scenes: Scene[]};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ink = '#263839';
const cream = '#f7ebce';

// Original vector artwork. Notes remain folded until the evening reveal.
const FoldedNote: React.FC<{x: number; y: number; angle?: number; color?: string}> = ({x, y, angle = 0, color = cream}) => <g transform={`translate(${x} ${y}) rotate(${angle} 83 53)`}>
  <rect x="5" y="8" width="166" height="106" rx="5" fill="#111b2333" />
  <rect width="166" height="106" rx="5" fill={color} stroke="#b5a384" strokeWidth="2" />
  <path d="M2 3L83 60L164 3M2 103L58 55M164 103L108 55" fill="none" stroke="#c6b695" strokeWidth="2" />
</g>;

const Lunchbox: React.FC<{empty?: boolean; note?: boolean; noteShift?: number}> = ({empty = false, note = false, noteShift = 0}) => <>
  <ellipse cx="300" cy="514" rx="230" ry="25" fill="#111b232c" />
  <rect x="90" y="80" width="420" height="180" rx="42" fill="#457d7b" stroke="#244e50" strokeWidth="8" />
  <rect x="120" y="104" width="360" height="129" rx="25" fill="#76a6a0" stroke="#578c86" strokeWidth="3" />
  <path d="M245 83V61Q245 40 266 40H334Q355 40 355 61V83" fill="none" stroke="#d4b67d" strokeWidth="14" />
  <rect x="78" y="248" width="444" height="258" rx="45" fill="#315f5d" stroke="#224e4e" strokeWidth="8" />
  <rect x="104" y="274" width="392" height="204" rx="27" fill="#d9d5b7" stroke="#afbdac" strokeWidth="4" />
  <path d="M313 279V473" stroke="#a4b2a0" strokeWidth="5" />
  {empty ? null : <>
    <path d="M126 431L209 300L289 431Z" fill="#d6b77c" stroke="#9c7e4a" strokeWidth="3" />
    <path d="M140 423L209 315L275 423Z" fill="#ede1b9" />
    <path d="M150 410L211 328L266 411" fill="none" stroke="#7c9a66" strokeWidth="8" />
    <circle cx="398" cy="363" r="49" fill="#b15d4e" /><path d="M395 316Q397 291 416 297" fill="none" stroke="#655335" strokeWidth="8" />
    <path d="M404 307Q428 293 436 316Q415 324 404 307" fill="#789266" />
  </>}
  {note ? <FoldedNote x={198} y={318 + noteShift} angle={-7} /> : null}
  <rect x="268" y="489" width="64" height="28" rx="8" fill="#d4b67d" />
</>;

const Drawer: React.FC<{extraNote?: boolean; revealPaper?: boolean; showLine?: boolean; line?: string}> = ({extraNote = false, revealPaper = false, showLine = false, line = ''}) => <>
  <rect x="54" y="140" width="492" height="350" rx="13" fill="#8d6651" stroke="#654936" strokeWidth="6" />
  <path d="M65 150H535V250H65Z" fill="#ae8765" />
  <path d="M78 278L121 234H479L522 278V478H78Z" fill="#382f2a" />
  <FoldedNote x={130} y={287} angle={-14} color="#e2d8bc" />
  <FoldedNote x={278} y={302} angle={9} color="#efdcb7" />
  <FoldedNote x={181} y={349} angle={-3} />
  {extraNote ? <FoldedNote x={266} y={376} angle={15} color="#e9c997" /> : null}
  <path d="M69 434H531L546 518H54Z" fill="#bb906c" stroke="#73523d" strokeWidth="5" />
  <rect x="249" y="473" width="102" height="15" rx="7" fill="#71533f" />
  {revealPaper ? <g>
    <rect x="110" y="74" width="386" height="385" rx="9" fill="#0c172a33" />
    <rect x="102" y="66" width="386" height="385" rx="9" fill={cream} stroke="#c4ad85" strokeWidth="3" />
    <path d="M102 258H488" stroke="#ded0af" strokeWidth="2" />
    <circle cx="295" cy="163" r="48" fill="none" stroke="#877d60" strokeWidth="3" />
    <circle cx="280" cy="153" r="3" fill="#877d60" /><circle cx="311" cy="153" r="3" fill="#877d60" />
    <path d="M276 175Q295 194 315 175M295 99V85M348 114L359 104M359 163H373M242 114L231 104M231 163H217" fill="none" stroke="#877d60" strokeWidth="3" strokeLinecap="round" />
    {showLine ? <foreignObject x="140" y="295" width="310" height="120"><div style={{fontFamily: 'Georgia, serif', color: ink, fontSize: 37, lineHeight: 1.24, textAlign: 'center'}}>{line}</div></foreignObject> : null}
  </g> : null}
</>;

export const Panel: React.FC<{scene: Scene; index: number}> = ({scene, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cues = scene.cues ?? [];
  const reached = (cueIndex: number) => cues[cueIndex] !== undefined && frame >= cues[cueIndex].startFrame;
  const activeCue = cues.find(cue => frame >= cue.startFrame && frame < cue.endFrame);
  const prideVisible = index === 3 && reached(3);
  const foldCue = cues[2];
  const noteShift = index === 4 && foldCue ? interpolate(frame, [foldCue.startFrame, foldCue.startFrame + fps * .65], [-35, 0], clamp) : 0;
  return <AbsoluteFill style={{background: index === 2 ? 'radial-gradient(ellipse at 50% 38%, #4b5759 0%, #243336 65%, #1a2529 100%)' : 'radial-gradient(ellipse at 50% 38%, #52615b 0%, #293e3e 65%, #1a2b2e 100%)', fontFamily: 'Arial, sans-serif', color: '#f6f0e4'}}>
    <div style={{position: 'absolute', left: 56, top: 74, fontSize: 19, letterSpacing: 2.2, color: '#d0d0bb'}}>ORIGINAL FICTION</div>
    <div style={{position: 'absolute', left: 56, top: 115, fontSize: 31, fontWeight: 600, color: '#f0e1c3'}}>The Folded Notes</div>
    <div style={{position: 'absolute', top: 216, left: 56, fontSize: 19, letterSpacing: 1.8, color: '#c5cdbf'}}>{index === 0 ? '' : scene.label}</div>
    <div style={{position: 'absolute', top: 295, left: 60, width: 600, height: 570, opacity: interpolate(frame, [0, fps * .22], [.5, 1], clamp), scale: interpolate(frame, [0, scene.durationInFrames], [1, 1.025], clamp)}}>
      <svg viewBox="0 0 600 570" style={{width: '100%', height: '100%', display: 'block'}}>
        {index === 0 ? <Lunchbox note /> : index === 1 ? <Drawer extraNote={reached(2)} /> : index === 2 ? reached(2) ? <g data-artwork="empty-lunchbox"><Lunchbox empty /></g> : <g data-artwork="closed-lunchbox">
          <ellipse cx="300" cy="514" rx="230" ry="25" fill="#111b232c" />
          <path d="M245 258V232Q245 210 266 210H334Q355 210 355 232V258" fill="none" stroke="#d4b67d" strokeWidth="14" />
          <rect x="90" y="252" width="420" height="254" rx="42" fill="#457d7b" stroke="#244e50" strokeWidth="8" />
          <rect x="120" y="282" width="360" height="191" rx="25" fill="#76a6a0" stroke="#578c86" strokeWidth="3" />
          <rect x="268" y="489" width="64" height="28" rx="8" fill="#d4b67d" />
        </g> : index === 3 ? <Drawer extraNote revealPaper={reached(1)} showLine={prideVisible} line={scene.items[0]} /> : <Lunchbox note={reached(2)} noteShift={noteShift} />}
      </svg>
    </div>
    {/* The pride line is the dramatic object at its exact cue; do not duplicate it below. */}
    {activeCue && !prideVisible ? <div style={{position: 'absolute', left: 56, right: 56, top: 988, minHeight: 118, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 22px', boxSizing: 'border-box', background: '#14272cf2', border: '1px solid #6b8074', borderRadius: 14, fontSize: 31, lineHeight: 1.36, textAlign: 'center', color: '#fff8ea'}}>{activeCue.text}</div> : null}
    <div style={{position: 'absolute', left: 56, right: 56, top: 1170, height: 3, background: '#ffffff20'}}><div style={{height: 3, background: '#cdbb8f', width: `${Math.min(100, frame / Math.max(1, scene.durationInFrames - 1) * 100)}%`}} /></div>
    <Audio src={staticFile(scene.audio)} />
  </AbsoluteFill>;
};

// Fixed reviewed scenes form one template; cues are measured from local speech clips.
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
