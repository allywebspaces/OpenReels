import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
export const REVIEWED_PILOT_HASH = 'f29a1fdba849bd173ad215fa194c7dd09e3e0052bdf714d12d40d0e78981e886';
export const REVIEWED_VISUAL_HASH = '44e0777bda9fb07964aa1120302ea8b79b1579cae0d99a2b660cdd884a225d0c';
export const MICRO_DRAMA_SCRIPT_HASH = '62a958b400ce80790fd558a086d4af172eca1b2a7b487adeb20627024e3bd096';
export const MICRO_DRAMA_VISUAL_HASH = 'f2ed12cbb5ec850d036a9c5a2885ce9cf7d6488ddc7560094a60cbd5c0228041';
export function reviewedPresetConfig(name = 'productivity') {
  if (name === 'productivity') return {folder:'', output:'free-pilot', scriptHash:REVIEWED_PILOT_HASH, visualHash:REVIEWED_VISUAL_HASH};
  if (name === 'micro-drama') return {folder:'micro-drama/', output:'micro-drama', scriptHash:MICRO_DRAMA_SCRIPT_HASH, visualHash:MICRO_DRAMA_VISUAL_HASH};
  throw new Error('Unknown free preset. Use productivity or micro-drama.');
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
