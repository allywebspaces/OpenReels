import React from 'react';
import { AbsoluteFill, Audio, Composition, Sequence, interpolate, registerRoot, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

type Scene = { heading: string; label: string; items: string[]; narration: string; audio: string; durationInFrames: number };
type Props = { scenes: Scene[] };

// This fictional example is reviewed together with this source file by the free pilot policy.
const example = {
  notes: ['Alex sends the draft by Friday.', 'Sam reviews the budget.', 'Book a demo by Monday.'],
  prompt: 'Use only these notes. List each action, its owner, and its deadline in a table. Write “Not specified” for missing information. Do not guess. Write in English.',
  rows: [
    {action: 'Send the draft', owner: 'Alex', deadline: 'Friday'},
    {action: 'Review the budget', owner: 'Sam', deadline: 'Not specified'},
    {action: 'Book a demo', owner: 'Not specified', deadline: 'Monday'},
  ],
};
const colors = {mint: '#71e6bd', ink: '#122f3b', muted: '#5b7280', amber: '#946111', paper: '#f2f7f8'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Reveal: React.FC<{delay: number; children: React.ReactNode}> = ({delay, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entry = spring({frame: frame - delay, fps, config: {damping: 200}});
  return <div style={{opacity: interpolate(frame, [delay, delay + fps * 0.35], [0, 1], clamp), translate: `0px ${(1 - entry) * 16}px`}}>{children}</div>;
};

const Window: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => <div style={{background: colors.paper, borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 60px #00000033', color: colors.ink}}>
  <div style={{height: 66, padding: '0 24px', background: '#dfeaed', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #c9d9df'}}>
    <div style={{display: 'flex', gap: 7}}>{['#94aeb8', '#a9bec7', '#bfd0d6'].map(color => <div key={color} style={{width: 10, height: 10, borderRadius: '50%', background: color}} />)}</div>
    <div style={{fontSize: 23, fontWeight: 700}}>{title}</div>
    <div style={{width: 44}} />
  </div>
  {children}
</div>;

const Notes: React.FC = () => {
  const {fps} = useVideoConfig();
  return <Window title="Meeting notes"><div style={{padding: '28px 26px 30px'}}>
    <div style={{fontSize: 21, color: colors.muted, marginBottom: 22}}>Three notes. Two missing details.</div>
    {example.notes.map((note, i) => <Reveal key={note} delay={fps * (0.2 + i * 0.18)}><div style={{display: 'flex', alignItems: 'center', gap: 17, minHeight: 112, borderTop: '1px solid #d9e3e7'}}>
      <span style={{fontSize: 22, color: colors.muted, width: 28}}>{String(i + 1).padStart(2, '0')}</span>
      <span style={{fontSize: 30, fontWeight: 600, lineHeight: 1.3}}>{note}</span>
    </div></Reveal>)}
    <div style={{marginTop: 20, borderRadius: 12, padding: '15px 18px', background: '#e0edf1', fontSize: 22, color: colors.muted}}>No deadline for Sam. No owner for the demo.</div>
  </div></Window>;
};

const Prompt: React.FC = () => {
  const {fps} = useVideoConfig();
  return <Window title="Prompt workspace"><div style={{padding: 20}}>
    <div style={{fontSize: 20, letterSpacing: 1.5, color: colors.muted, fontWeight: 700}}>SOURCE NOTES</div>
    <div style={{marginTop: 14, padding: '14px 16px', border: '1px solid #ccdce2', borderRadius: 12, background: '#fff', fontSize: 22, lineHeight: 1.45}}>{example.notes.map(note => <div key={note}>{note}</div>)}</div>
    <Reveal delay={fps * 0.25}><div style={{marginTop: 20, borderLeft: '5px solid #278869', borderRadius: 12, padding: '18px 19px', background: '#dff1e9'}}>
      <div style={{fontSize: 18, letterSpacing: 1.5, color: '#287657', marginBottom: 10, fontWeight: 700}}>EXACT PROMPT</div>
      <div style={{fontSize: 26, lineHeight: 1.38, fontWeight: 600}}>{example.prompt}</div>
    </div></Reveal>
  </div></Window>;
};

const ActionTable: React.FC<{final?: boolean}> = ({final = false}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  return <Window title={final ? 'Action list' : 'Extracted actions'}>
    <div style={{padding: '25px 20px 28px'}}>
      <div style={{display: 'grid', gridTemplateColumns: '1.35fr .82fr 1fr', gap: 8, padding: '0 10px 17px', fontSize: 20, fontWeight: 700, color: colors.muted}}><span>ACTION</span><span>OWNER</span><span>DEADLINE</span></div>
      {example.rows.map((row, i) => <Reveal key={row.action} delay={fps * (0.16 + i * 0.16)}><div style={{display: 'grid', gridTemplateColumns: '1.35fr .82fr 1fr', gap: 8, alignItems: 'stretch', borderTop: '1px solid #cedee4', padding: '18px 0', minHeight: 106}}>
        {[row.action, row.owner, row.deadline].map((value, column) => <div key={column} style={{display: 'flex', alignItems: 'center', padding: '9px 10px', borderRadius: 9, background: value === 'Not specified' ? '#fff0ce' : 'transparent', color: value === 'Not specified' ? colors.amber : colors.ink, fontSize: column === 0 ? 27 : 25, lineHeight: 1.22, fontWeight: 600, boxShadow: value === 'Not specified' && !final ? `inset 0 0 0 ${interpolate(frame, [fps * 0.7, fps * 1], [0, 2], clamp)}px #d29d40` : undefined}}>{value}</div>)}
      </div></Reveal>)}
      <div style={{marginTop: 20, padding: '18px 16px', borderRadius: 12, background: final ? '#dff1e9' : '#fff0ce', color: final ? '#25634d' : colors.amber, fontSize: 25, lineHeight: 1.3, fontWeight: 700}}>{final ? 'Keep the gaps visible. Follow up with the team.' : 'Missing information stays “Not specified”.'}</div>
    </div>
  </Window>;
};

const Verification: React.FC = () => {
  const {fps} = useVideoConfig();
  return <Window title="Check against the notes"><div style={{padding: '26px 24px'}}>
    {example.rows.map((row, i) => <Reveal key={row.action} delay={fps * (0.15 + i * 0.16)}><div style={{background: '#fff', border: '1px solid #d0e0e5', borderRadius: 14, padding: '18px 20px', marginBottom: 16}}>
      <div style={{fontSize: 24, fontWeight: 700, marginBottom: 10}}>{example.notes[i]}</div>
      <div style={{fontSize: 23, color: i === 0 ? '#287657' : colors.amber, lineHeight: 1.3}}>{i === 0 ? 'Owner and deadline match the notes.' : i === 1 ? 'Deadline: Not specified' : 'Owner: Not specified'}</div>
    </div></Reveal>)}
    <div style={{fontSize: 25, lineHeight: 1.35, color: colors.muted, marginTop: 22}}>Ask the team to confirm the gaps.<br /><strong style={{color: colors.ink}}>No confirmation shown in this example.</strong></div>
  </div></Window>;
};

const Panel: React.FC<{scene: Scene; index: number}> = ({scene, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entry = spring({frame, fps, config: {damping: 200}});
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 100% 0%, #204958, transparent 60%), linear-gradient(150deg, #102332, #071017)', color: '#f7fafb', fontFamily: 'Arial, sans-serif', padding: 48}}>
    <div style={{fontSize: 21, letterSpacing: 2.4, color: colors.mint}}>AI MONEY INDIA · PRACTICAL AI</div>
    <div style={{marginTop: 43, color: colors.mint, fontSize: 18, letterSpacing: 1.7}}>{scene.label}</div>
    <div style={{marginTop: 15, fontSize: 51, fontWeight: 800, lineHeight: 1.08, opacity: entry, translate: `0px ${(1 - entry) * 20}px`}}>{scene.heading}</div>
    <div style={{position: 'absolute', top: 294, left: 48, right: 48}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15, fontSize: 20, color: '#afc7d1'}}><span style={{width: 8, height: 8, borderRadius: '50%', background: colors.mint}} />Fictional example</div>
      {index === 0 ? <Notes /> : index === 1 ? <Prompt /> : index === 2 ? <ActionTable /> : index === 3 ? <Verification /> : <ActionTable final />}
    </div>
    <div style={{position: 'absolute', left: 48, right: 48, bottom: 140, fontSize: 25, lineHeight: 1.4, textAlign: 'center', background: '#030a10', border: '1px solid #203b48', borderRadius: 18, padding: '22px 24px'}}>{scene.narration}</div>
    <div style={{position: 'absolute', left: 48, right: 48, bottom: 75, height: 5, background: '#ffffff22', borderRadius: 4, overflow: 'hidden'}}>
      <div style={{width: `${Math.min(100, frame / scene.durationInFrames * 100)}%`, height: 5, background: colors.mint}} />
    </div>
    <div style={{position: 'absolute', right: 48, bottom: 36, fontSize: 18, color: '#829aa7'}}>STEP {index + 1} / 5</div>
    <Audio src={staticFile(scene.audio)} />
  </AbsoluteFill>;
};
const Pilot: React.FC<Props> = ({scenes}) => {
  const {fps} = useVideoConfig();
  let start = 0;
  return <AbsoluteFill>{scenes.map((scene, index) => {
    const from = start; start += scene.durationInFrames;
    return <Sequence key={index} from={from} durationInFrames={scene.durationInFrames} premountFor={fps}><Panel scene={scene} index={index} /></Sequence>;
  })}</AbsoluteFill>;
};
const Root = () => <Composition id="FreeEnglishPilot" component={Pilot} width={720} height={1280} fps={30} durationInFrames={30} defaultProps={{scenes: [] as Scene[]}} calculateMetadata={({props}) => ({durationInFrames: Math.max(30, props.scenes.reduce((n, s) => n + s.durationInFrames, 0))})} />;
registerRoot(Root);
