import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, interpolate, registerRoot, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

type Scene = {heading: string; label: string; items: string[]; narration: string; audio: string; durationInFrames: number};
type Props = {scenes: Scene[]};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const accent = '#a9dbdf';

// Original, procedural artwork: the identical crooked frame and blue slipper
// connect the received photograph to Maya's hallway. No external visual assets.
const Hallway: React.FC<{knocking?: boolean; compact?: boolean}> = ({knocking = false, compact = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pulse = knocking ? Math.max(0, Math.sin(frame / fps * Math.PI * 2.4)) : 0;
  return <svg viewBox="0 0 560 520" style={{width: '100%', height: '100%', display: 'block'}}>
    <defs>
      <linearGradient id={compact ? 'photo-wall' : 'hall-wall'} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#27323d" /><stop offset="1" stopColor="#0b111b" /></linearGradient>
      <linearGradient id={compact ? 'photo-door' : 'hall-door'} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#15202a" /><stop offset=".5" stopColor="#39434b" /><stop offset="1" stopColor="#202b35" /></linearGradient>
    </defs>
    <rect width="560" height="520" fill={`url(#${compact ? 'photo-wall' : 'hall-wall'})`} />
    <path d="M0 0L122 64V420L0 520Z" fill="#34424c" />
    <path d="M560 0L452 64V420L560 520Z" fill="#202c37" />
    <path d="M0 520L122 420H452L560 520Z" fill="#151c28" />
    <path d="M122 420L0 520M452 420L560 520M282 420V520" stroke="#4b5660" strokeWidth="2" />
    <rect x="176" y="64" width="220" height="363" fill="#090e14" stroke="#52616c" strokeWidth="10" />
    <rect x="186" y="74" width="200" height="345" fill={`url(#${compact ? 'photo-door' : 'hall-door'})`} />
    <rect x="209" y="100" width="154" height="134" rx="4" fill="none" stroke="#53606a" strokeWidth="3" />
    <rect x="209" y="254" width="154" height="140" rx="4" fill="none" stroke="#53606a" strokeWidth="3" />
    <circle cx="286" cy="170" r="5" fill="#d9c59b" />
    <circle cx="352" cy="265" r="10" fill="#c4b28c" />
    <rect x="346" y="266" width="9" height="34" rx="4" fill="#a4957b" />
    <g transform="rotate(-10 77 206)"><rect x="37" y="146" width="80" height="120" fill="#8d7c67" /><rect x="44" y="153" width="66" height="106" fill="#17222d" /><path d="M48 240L69 202L81 218L102 187V252H48Z" fill="#657581" /></g>
    <ellipse cx="399" cy="465" rx="38" ry="17" fill="#09131d" opacity=".8" />
    <path d="M367 464Q364 448 382 444L408 449Q434 458 420 469L381 477Q368 477 367 464Z" fill="#4294ae" />
    <path d="M380 449Q397 445 407 454L400 464L379 462Z" fill="#72bad0" />
    <rect x="194" y="415" width="183" height="3" fill="#e6c28d" opacity=".65" />
    {knocking ? <><circle cx="287" cy="257" r={34 + pulse * 25} fill="none" stroke="#dfb481" strokeWidth="2" opacity={pulse * .7} /><circle cx="287" cy="257" r={65 + pulse * 25} fill="none" stroke="#dfb481" strokeWidth="2" opacity={pulse * .35} /></> : null}
  </svg>;
};

const Phone: React.FC<{scene: Scene; photo?: boolean; last?: boolean}> = ({scene, photo = false, last = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <div style={{width: 460, margin: '0 auto', background: '#070d16', border: '5px solid #5c6b7b', borderRadius: 42, padding: photo ? '14px 20px 20px' : '20px 24px 34px', boxShadow: '0 28px 70px #0009', scale: interpolate(frame, [0, scene.durationInFrames], [1, 1.035], clamp)}}>
    <div style={{margin: photo ? '0 auto 12px' : '0 auto 22px', width: 115, height: 13, borderRadius: 12, background: '#1d2733'}} />
    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#abc0d0', marginBottom: photo ? 14 : 24}}><span>{last && frame >= fps * 2 ? '23:59' : '00:00'}</span><span>MESSAGES</span></div>
    <div style={{display: 'flex', alignItems: 'center', gap: 14, paddingBottom: photo ? 14 : 22, borderBottom: '1px solid #344454'}}><div style={{width: 49, height: 49, borderRadius: '50%', background: '#283c50', display: 'grid', placeItems: 'center', fontSize: 24, color: accent}}>M</div><div><div style={{fontSize: 29, color: '#ecf4fc', fontWeight: 700}}>{photo ? 'My number' : scene.items[0]}</div><div style={{fontSize: 20, color: '#8ba3b6', marginTop: 4}}>Maya</div></div></div>
    {photo ? <div style={{marginTop: 16, border: '1px solid #687b8b', borderRadius: 14, overflow: 'hidden'}}><div style={{height: 208}}><Hallway compact /></div><div style={{padding: '8px 15px', color: '#bbceda', fontSize: 18}}>{scene.items[0]} · {scene.items[1]}</div></div> : <div style={{marginTop: 30, marginBottom: 36, background: last ? '#382b35' : '#243a49', border: `1px solid ${last ? '#97707e' : '#547e8d'}`, borderRadius: '21px 21px 21px 4px', padding: '26px 23px', color: '#f3f8fc', fontSize: 38, fontWeight: 600, lineHeight: 1.22, opacity: interpolate(frame, [0, fps * .45], [.55, 1], clamp)}}>{scene.items[1]}</div>}
  </div>;
};

const Panel: React.FC<{scene: Scene; index: number}> = ({scene, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 70% 36%, #283443 0%, #101925 50%, #060b12 100%)', fontFamily: 'Arial, sans-serif', color: '#f0f5fb'}}>
    <div style={{position: 'absolute', left: 48, top: 48, fontSize: 20, letterSpacing: 2.4, color: accent}}>MIDNIGHT STORIES · ORIGINAL FICTION</div>
    <div style={{position: 'absolute', left: 48, right: 48, top: 106, fontSize: 18, letterSpacing: 1.5, color: '#b3a08d'}}>{scene.label}</div>
    <div style={{position: 'absolute', left: 48, right: 48, top: 146, fontSize: 54, fontWeight: 800, lineHeight: 1.1}}>{scene.heading}</div>
    <div style={{position: 'absolute', left: 48, right: 48, top: 310, height: 542, opacity: interpolate(frame, [0, fps * .3], [.35, 1], clamp)}}>
      {index === 0 ? <Phone scene={scene} /> : index === 1 ? <div style={{border: '1px solid #526271', borderRadius: 18, overflow: 'hidden', height: 525, position: 'relative'}}><Hallway knocking /><div style={{position: 'absolute', top: 36, right: 28, display: 'flex', flexDirection: 'column', gap: 12}}>{scene.items.map((item, i) => <div key={i} style={{fontSize: 25, letterSpacing: 2, color: '#ead0ac', opacity: interpolate(frame, [fps * (i * .6), fps * (i * .6 + .15)], [0, 1], clamp)}}>{item}</div>)}</div></div> : index === 2 ? <Phone scene={scene} photo /> : index === 3 ? <Phone scene={scene} last /> : <div style={{border: '1px solid #526271', borderRadius: 18, overflow: 'hidden', height: 525, position: 'relative'}}><Hallway /><div style={{position: 'absolute', left: 28, top: 22, border: '1px solid #536774', background: '#08121bea', borderRadius: 10, padding: '13px 19px', fontFamily: 'monospace', fontSize: 37, color: accent}}>{frame < fps * 1.4 ? scene.items[0] : scene.items[1]}</div><div style={{position: 'absolute', bottom: 22, left: 28, right: 28, background: '#09121ced', padding: '16px 22px', borderRadius: 12, color: '#d9f2ee', fontSize: 28, textAlign: 'center'}}>The lock stays closed.</div></div>}
    </div>
    {index === 4 ? <div style={{position: 'absolute', top: 871, left: 48, right: 48, textAlign: 'center', fontSize: 30, fontWeight: 700, color: accent}}>{scene.items[2]}</div> : null}
    <div style={{position: 'absolute', left: 48, right: 48, bottom: 140, padding: '22px 24px', background: '#050c15f5', border: '1px solid #384d60', borderRadius: 16, color: '#f6f9ff', fontSize: 29, lineHeight: 1.36, textAlign: 'center'}}>{scene.narration}</div>
    <div style={{position: 'absolute', left: 48, right: 48, bottom: 82, height: 4, background: '#ffffff20'}}><div style={{height: 4, background: accent, width: `${Math.min(100, frame / scene.durationInFrames * 100)}%`}} /></div>
    <div style={{position: 'absolute', left: 48, bottom: 42, fontSize: 18, color: '#8ba2b6'}}>THE MESSAGE AT MIDNIGHT</div>
    <div style={{position: 'absolute', right: 48, bottom: 42, fontSize: 18, color: '#8ba2b6'}}>{index + 1} / 5</div>
    <Audio src={staticFile(scene.audio)} />
  </AbsoluteFill>;
};

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
