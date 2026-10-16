// Reviewed English pilot. No paid SDK, LLM call, API key or provider fallback.
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadReviewedPreset, reviewedPresetConfig, sceneDurationFrames } from '../src/free-pilot/policy.mjs';
import { speechPlan, assembleSpeech } from '../src/free-pilot/speech.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
let presetName = 'productivity';
let check = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--check') check = true;
  else if (args[i] === '--preset' && args[i+1]) presetName = args[++i];
  else { console.error('Use --check and/or --preset productivity|micro-drama|emotional-drama|twist-drama'); process.exit(1); }
}
const config = reviewedPresetConfig(presetName);
const pilot = loadReviewedPreset(presetName);
for (const scene of pilot.scenes) speechPlan(scene);
const output = resolve(root, 'output', config.output);
if (check) {
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
  const { default: wavefile } = await import('wavefile');
  for (const [i,scene] of pilot.scenes.entries()) {
    console.log(`Local English narration ${i+1}/${pilot.scenes.length}`);
    const clips=[];
    for (const part of speechPlan(scene)) {
      const options={voice:'af_bella',speed:part.speed};
      const audio=part.phonemes
        ? await tts.generate_from_ids(tts.tokenizer(part.phonemes).input_ids, options)
        : await tts.generate(part.text, options);
      if (part.text.endsWith('?') && presetName === 'micro-drama') {
        await writeFile(resolve(output,'question-revised.wav'),Buffer.from(audio.toWav()));
        execFileSync('ffmpeg', ['-hide_banner','-loglevel','error','-y','-i',resolve(output,'question-revised.wav'),'-codec:a','libmp3lame','-b:a','128k',resolve(output,'question-revised.mp3')],{stdio:'inherit'});
      }
      clips.push({text:part.text,audio:audio.audio,sampleRate:audio.sampling_rate,pauseAfterMs:part.pauseAfterMs});
    }
    const combined=assembleSpeech(clips);
    const wav=new wavefile.WaveFile();
    wav.fromScratch(1,combined.sampleRate,'32f',combined.audio);
    const filename=`scene-${i+1}.wav`;
    await writeFile(resolve(assets,filename),Buffer.from(wav.toBuffer()));
    scenes.push({...scene,audio:filename,cues:combined.cues,durationInFrames:sceneDurationFrames(combined.audio.length,combined.sampleRate)});
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
  const serveUrl=await bundle({entryPoint:resolve(root,`src/free-pilot/${config.folder}Root.tsx`),publicDir:assets});
  const composition=await selectComposition({serveUrl,id:'FreeEnglishPilot',inputProps});
  await renderStill({serveUrl,composition,inputProps,frame:60,output:resolve(output,'preview.png')});
  let sceneStart = 0;
  for (const [index, scene] of scenes.entries()) {
    const frame = sceneStart + Math.max(0, scene.durationInFrames - 12);
    await renderStill({serveUrl,composition,inputProps,frame,output:resolve(output,`review-scene-${index+1}.png`)});
    sceneStart += scene.durationInFrames;
  }
  await renderMedia({serveUrl,composition,inputProps,codec:'h264',outputLocation:resolve(output,'pilot.mp4'),concurrency:2});
  const report={mode:'free-pilot',preset:presetName,title:pilot.title,language:'English',paidApiCalls:0,paidApiCostUsd:0,reviewedScriptHash:config.scriptHash,reviewedVisualHash:config.visualHash,width:composition.width,height:composition.height,fps:composition.fps,durationSeconds:composition.durationInFrames/composition.fps,voice:'local Kokoro af_bella', voiceSpeed:1.1,visuals:presetName==='micro-drama'?'original illustrated phone, clock and door mystery':presetName==='emotional-drama'?'original illustrated lunchbox, drawer and folded notes':presetName==='twist-drama'?'original illustrated waiting-room bench, toolbox, founder badge and notebook':'original fictional meeting notes, extraction prompt and action table',captions:presetName!=='productivity'?'sentence captions at measured speech-clip boundaries; not word-level transcription':'scene text synchronized to each scene audio; not word-level transcription',questionDelivery:presetName==='micro-drama'?{speed:1,pauseBeforeMs:550,phoneticStress:'you',separateClip:true}:null,script:'fixed reviewed English preset',comparisonSamples:['comparison-calm.mp3','comparison-energetic.mp3'],published:false};
  await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));
  console.log(`Saved ${resolve(output,'pilot.mp4')}`);
} catch(error) {
  console.error(`Free pilot failed: ${error.message}. No paid fallback is available.`);
  process.exit(1);
}
