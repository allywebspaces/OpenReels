// Visual-only candidate: no TTS/model/provider calls. Reuse the approved AAC stream.
import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import {experimentPaths, verifyVisualExperiment, sha256} from '../src/free-pilot/visual-experiment-policy.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
if(args.length>1 || (args.length===1 && args[0]!=='--check')) throw new Error('Use visual-experiment.mjs [--check]');
const {manifest,props}=verifyVisualExperiment();
if(args[0]==='--check') {console.log(JSON.stringify({mode:'visual-experiment-check',language:manifest.language,baselineVerified:true,paidApiCalls:0}));process.exit(0);}
const output=resolve(root,'output/micro-drama-visual-experiment');mkdirSync(output,{recursive:true});
const {bundle}=await import('@remotion/bundler');
const {selectComposition,renderStill,renderMedia}=await import('@remotion/renderer');
const serveUrl=await bundle({entryPoint:fileURLToPath(experimentPaths.visual)});
const composition=await selectComposition({serveUrl,id:'MicroDramaVisualExperiment',inputProps:props});
const reviewFrames=[0,120,121,196,519,520,560,576,577,620,1327,1338];
for(const frame of reviewFrames) await renderStill({serveUrl,composition,inputProps:props,frame,output:resolve(output,`frame-${String(frame).padStart(4,'0')}.png`)});
const silent=resolve(output,'visual-only.mp4');
await renderMedia({serveUrl,composition,inputProps:props,codec:'h264',audioCodec:null,outputLocation:silent,concurrency:2});
const candidate=resolve(output,'pilot.mp4');const baseline=fileURLToPath(experimentPaths.video);
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',silent,'-i',baseline,'-map','0:v:0','-map','1:a:0','-c','copy',candidate]);
const audioHash=path=>sha256(execFileSync('ffmpeg',['-v','error','-i',path,'-map','0:a:0','-c:a','copy','-f','adts','pipe:1'],{maxBuffer:8*1024*1024}));
const baselineAudioSha256=audioHash(baseline),candidateAudioSha256=audioHash(candidate);
if(baselineAudioSha256!==candidateAudioSha256) throw new Error('Approved audio was not preserved.');
execFileSync('ffmpeg',['-v','error','-i',candidate,'-f','null','-']);
const media=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=codec_name,width,height,r_frame_rate','-show_entries','format=duration','-of','json',candidate],{encoding:'utf8'}));
writeFileSync(resolve(output,'report.json'),JSON.stringify({language:'English',mode:'visual-only-experiment',baselineVideoSha256:manifest.baselineVideoSha256,candidateVideoSha256:sha256(readFileSync(candidate)),baselineAudioSha256,candidateAudioSha256,audioStreamIdentical:true,compositionSeconds:composition.durationInFrames/composition.fps,media,reviewFrames,decodePassed:true,visualInspection:'pending; frame export alone is not visual review',listeningAssessment:'not performed; approved encoded audio stream preserved',paidApiCalls:0,published:false},null,2)+'\n');
console.log(`Saved ${candidate}; approved AAC stream identical. Visual inspection remains required.`);

