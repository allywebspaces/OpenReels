import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
export const REVIEWED_PILOT_HASH = 'f29a1fdba849bd173ad215fa194c7dd09e3e0052bdf714d12d40d0e78981e886';
export const REVIEWED_VISUAL_HASH = '44e0777bda9fb07964aa1120302ea8b79b1579cae0d99a2b660cdd884a225d0c';
export const MICRO_DRAMA_SCRIPT_HASH = '62a958b400ce80790fd558a086d4af172eca1b2a7b487adeb20627024e3bd096';
export const MICRO_DRAMA_VISUAL_HASH = 'f2ed12cbb5ec850d036a9c5a2885ce9cf7d6488ddc7560094a60cbd5c0228041';
export const EMOTIONAL_DRAMA_SCRIPT_HASH = 'ee163f59cbe7b2559f01f0d9a5133b18f160f04de41c0933cf09c8143d07f472';
export const EMOTIONAL_DRAMA_VISUAL_HASH = 'b9aea2c6aed2a192daddb27c3aaa1c3bfdfe60c95988484835a29059bef24492';
export const TWIST_DRAMA_SCRIPT_HASH = '6ae65e7c93b224f2f20f516b3c22a174f05e153d80d98eb954c112273a580a4d';
export const TWIST_DRAMA_VISUAL_HASH = 'c25ba3d11d33687f1e4ab1141454b0a288d1b51de45b3ea39b37b1d09312817b';
export function reviewedPresetConfig(name = 'productivity') {
  if (name === 'productivity') return {folder:'', output:'free-pilot', scriptHash:REVIEWED_PILOT_HASH, visualHash:REVIEWED_VISUAL_HASH};
  if (name === 'micro-drama') return {folder:'micro-drama/', output:'micro-drama', scriptHash:MICRO_DRAMA_SCRIPT_HASH, visualHash:MICRO_DRAMA_VISUAL_HASH};
  if (name === 'emotional-drama') return {folder:'emotional-drama/', output:'emotional-drama', scriptHash:EMOTIONAL_DRAMA_SCRIPT_HASH, visualHash:EMOTIONAL_DRAMA_VISUAL_HASH};
  if (name === 'twist-drama') return {folder:'twist-drama/', output:'twist-drama', scriptHash:TWIST_DRAMA_SCRIPT_HASH, visualHash:TWIST_DRAMA_VISUAL_HASH};
  throw new Error('Unknown free preset. Use productivity, micro-drama, emotional-drama or twist-drama.');
}
export function loadReviewedPreset(name = 'productivity') {
  const config = reviewedPresetConfig(name);
  return verifyPreset(new URL(`./${config.folder}pilot.json`, import.meta.url), new URL(`./${config.folder}Root.tsx`, import.meta.url), config.scriptHash, config.visualHash);
}
export function loadReviewedPilot(path = new URL('./pilot.json', import.meta.url), visualPath = new URL('./Root.tsx', import.meta.url)) {
  return verifyPreset(path, visualPath, REVIEWED_PILOT_HASH, REVIEWED_VISUAL_HASH);
}
function verifyPreset(path, visualPath, scriptHash, visualHash) {
  const raw = readFileSync(path);
  if (createHash('sha256').update(raw).digest('hex') !== scriptHash) {
    throw new Error('Free mode accepts only the reviewed English pilot. Script changes require an English review and a new pinned hash.');
  }
  const pilot = JSON.parse(raw);
  if (pilot.language !== 'English' || pilot.scenes.length !== 5) throw new Error('Invalid reviewed pilot.');
  if (createHash('sha256').update(readFileSync(visualPath)).digest('hex') !== visualHash) {
    throw new Error('Free mode accepts only the reviewed English visuals. Visual changes require an English review and a new pinned hash.');
  }
  return pilot;
}
export function sceneDurationFrames(samples, sampleRate, fps = 30) {
  if (!Number.isInteger(samples) || samples <= 0 || !Number.isFinite(sampleRate) || sampleRate <= 0) {
    throw new Error('Invalid local audio duration.');
  }
  return Math.ceil(samples / sampleRate * fps) + Math.ceil(0.3 * fps);
}
