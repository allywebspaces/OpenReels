// Reviewed English pilot. No paid SDK, LLM call, API key or provider fallback.
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadReviewedPilot, sceneDurationFrames, REVIEWED_PILOT_HASH } from '../src/free-pilot/policy.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pilot = loadReviewedPilot();
const output = resolve(root, 'output/free-pilot');
if (process.argv.includes('--check')) {
  console.log(JSON.stringify({mode:'free-pilot-check', language:'English', apiCalls:0, paidApiCostUsd:0, title:pilot.title}));
  process.exit(0);
}
try {
  await mkdir(output, {recursive:true});
  const assets=resolve(output, 'assets'); await mkdir(assets,{recursive:true});
  console.log('Downloading local voice model if needed. No paid API calls or credentials used.');
  const {KokoroTTS} = await import('kokoro-js');
  const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {dtype:'q8', device:'cpu'});
  const scenes=[];
  for (const [i,scene] of pilot.scenes.entries()) {
    console.log(`Local English narration ${i+1}/${pilot.scenes.length}`);
    const audio=await tts.generate(scene.narration, {voice:'af_bella', speed:1.1});
    const filename=`scene-${i+1}.wav`;
    await writeFile(resolve(assets,filename),Buffer.from(audio.toWav()));
    scenes.push({...scene,audio:filename,durationInFrames:sceneDurationFrames(audio.audio.length,audio.sampling_rate)});
  }
  const comparisonText = pilot.scenes[0].narration;
  const calm = await tts.generate(comparisonText, {voice:'af_heart', speed:1});
  await writeFile(resolve(output,'comparison-calm.wav'),Buffer.from(calm.toWav()));
  await copyFile(resolve(assets,'scene-1.wav'),resolve(output,'comparison-energetic.wav'));
  for (const name of ['comparison-calm', 'comparison-energetic']) {
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', resolve(output, `${name}.wav`), '-codec:a', 'libmp3lame', '-b:a', '128k', resolve(output, `${name}.mp3`)], {stdio:'inherit'});
  }
  const inputProps={scenes};
  await writeFile(resolve(output,'pilot.json'),JSON.stringify(inputProps,null,2));
  const {bundle} = await import('@remotion/bundler');
  const {selectComposition,renderMedia,renderStill} = await import('@remotion/renderer');
  console.log('Rendering template visuals and scene captions.');
  const serveUrl=await bundle({entryPoint:resolve(root,'src/free-pilot/Root.tsx'),publicDir:assets});
  const composition=await selectComposition({serveUrl,id:'FreeEnglishPilot',inputProps});
  await renderStill({serveUrl,composition,inputProps,frame:60,output:resolve(output,'preview.png')});
  await renderMedia({serveUrl,composition,inputProps,codec:'h264',outputLocation:resolve(output,'pilot.mp4'),concurrency:2});
  const report={mode:'free-pilot',language:'English',paidApiCalls:0,paidApiCostUsd:0,reviewedScriptHash:REVIEWED_PILOT_HASH,width:composition.width,height:composition.height,fps:composition.fps,durationSeconds:composition.durationInFrames/composition.fps,voice:'local Kokoro af_bella', voiceSpeed:1.1,visuals:'original template graphics',captions:'scene text synchronized to each scene audio; not word-level transcription',script:'fixed reviewed English preset',comparisonSamples:['comparison-calm.mp3','comparison-energetic.mp3'],published:false};
  await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));
  console.log(`Saved ${resolve(output,'pilot.mp4')}`);
} catch(error) {
  console.error(`Free pilot failed: ${error.message}. No paid fallback is available.`);
  process.exit(1);
}
