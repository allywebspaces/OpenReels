import React from 'react';
import { AbsoluteFill, Audio, Composition, Sequence, interpolate, registerRoot, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

type Scene = { heading: string; label: string; items: string[]; narration: string; audio: string; durationInFrames: number };
type Props = { scenes: Scene[] };
const Panel: React.FC<{scene: Scene; index: number}> = ({scene, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entry = spring({frame, fps, config:{damping:200}});
  return <AbsoluteFill style={{background:'linear-gradient(150deg, #102332, #071017)', color:'#f7fafb', fontFamily:'Arial, sans-serif', padding:55}}>
    <div style={{fontSize:22, letterSpacing:3, color:'#71e6bd'}}>AI MONEY INDIA · PRACTICAL AI</div>
    <div style={{marginTop:100, color:'#71e6bd', fontSize:20, letterSpacing:2}}>{scene.label}</div>
    <div style={{marginTop:22, fontSize:65, fontWeight:800, lineHeight:1.08, opacity:entry, transform:`translateY(${(1-entry)*25}px)`}}>{scene.heading}</div>
    <div style={{marginTop:65, display:'flex', flexDirection:'column', gap:24}}>
      {scene.items.map((item,i) => <div key={item} style={{padding:'22px 24px', borderRadius:20, background:'#ffffff0d', border:'1px solid #ffffff22', fontSize:29, opacity:interpolate(frame,[i*10,i*10+14],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>
        <span style={{color:'#71e6bd', marginRight:18}}>{String(i+1).padStart(2,'0')}</span>{item}
      </div>)}
    </div>
    <div style={{position:'absolute', left:55, right:55, bottom:140, fontSize:25, lineHeight:1.4, textAlign:'center', background:'#030a10', borderRadius:18, padding:24}}>{scene.narration}</div>
    <div style={{position:'absolute', left:55, right:55, bottom:75, height:5, background:'#ffffff22', borderRadius:4}}>
      <div style={{width:`${Math.min(100, frame/scene.durationInFrames*100)}%`, height:5, background:'#71e6bd'}} />
    </div>
    <div style={{position:'absolute', right:55, bottom:36, fontSize:18, color:'#829aa7'}}>STEP {index+1} / 5</div>
    <Audio src={staticFile(scene.audio)} />
  </AbsoluteFill>;
};
const Pilot: React.FC<Props> = ({scenes}) => {
  let start = 0;
  return <AbsoluteFill>{scenes.map((scene,index) => {
    const from=start; start+=scene.durationInFrames;
    return <Sequence key={index} from={from} durationInFrames={scene.durationInFrames} premountFor={30}><Panel scene={scene} index={index}/></Sequence>;
  })}</AbsoluteFill>;
};
const Root = () => <Composition id="FreeEnglishPilot" component={Pilot} width={720} height={1280} fps={30} durationInFrames={30} defaultProps={{scenes:[] as Scene[]}} calculateMetadata={({props}) => ({durationInFrames: Math.max(30, props.scenes.reduce((n,s)=>n+s.durationInFrames,0))})}/>;
registerRoot(Root);
