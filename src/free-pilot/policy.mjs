import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
export const REVIEWED_PILOT_HASH = 'f29a1fdba849bd173ad215fa194c7dd09e3e0052bdf714d12d40d0e78981e886';
export const REVIEWED_VISUAL_HASH = '44e0777bda9fb07964aa1120302ea8b79b1579cae0d99a2b660cdd884a225d0c';
export function loadReviewedPilot(path = new URL('./pilot.json', import.meta.url), visualPath = new URL('./Root.tsx', import.meta.url)) {
  const raw = readFileSync(path);
  if (createHash('sha256').update(raw).digest('hex') !== REVIEWED_PILOT_HASH) {
    throw new Error('Free mode accepts only the reviewed English pilot. Script changes require an English review and a new pinned hash.');
  }
  const pilot = JSON.parse(raw);
  if (pilot.language !== 'English' || pilot.scenes.length !== 5) throw new Error('Invalid reviewed pilot.');
  if (createHash('sha256').update(readFileSync(visualPath)).digest('hex') !== REVIEWED_VISUAL_HASH) {
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
