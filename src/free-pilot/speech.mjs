export function speechPlan(scene) {
  const parts = scene.speechParts ?? [{text:scene.narration, speed:1.1, pauseAfterMs:0}];
  if (!parts.length || parts.some(p => !p || typeof p.text !== 'string' || !p.text.trim() || !Number.isFinite(p.speed) || p.speed <= 0 || p.speed > 2 || !Number.isFinite(p.pauseAfterMs) || p.pauseAfterMs < 0 || p.pauseAfterMs > 2000 || (p.phonemes !== undefined && (p.text !== 'Would you open it?' || p.phonemes !== 'wʊd jˈuː ˈoʊpən ɪt?')))) {
    throw new Error('Invalid reviewed speech delivery.');
  }
  if (parts.map(p => p.text.trim()).join(' ') !== scene.narration.trim()) throw new Error('Speech parts must match the reviewed narration exactly.');
  return parts;
}

export function assembleSpeech(clips, fps = 30) {
  const sampleRate = clips[0]?.sampleRate;
  if (!Number.isFinite(sampleRate) || sampleRate <= 0 || clips.some(c => c.sampleRate !== sampleRate)) throw new Error('Invalid speech sample rate.');
  let samples = 0;
  const cues = [];
  for (const clip of clips) {
    if (!(clip.audio instanceof Float32Array) || !clip.audio.length || !Number.isFinite(clip.pauseAfterMs) || clip.pauseAfterMs < 0 || clip.pauseAfterMs > 2000) throw new Error('Invalid speech clip.');
    cues.push({text:clip.text, startFrame:Math.ceil(samples / sampleRate * fps), endFrame:Math.ceil((samples + clip.audio.length) / sampleRate * fps)});
    samples += clip.audio.length + Math.round(clip.pauseAfterMs / 1000 * sampleRate);
  }
  const audio = new Float32Array(samples);
  let offset = 0;
  for (const clip of clips) {
    audio.set(clip.audio, offset);
    offset += clip.audio.length + Math.round(clip.pauseAfterMs / 1000 * sampleRate);
  }
  return {audio, sampleRate, cues};
}
