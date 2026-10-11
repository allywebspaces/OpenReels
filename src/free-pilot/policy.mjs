import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
export const REVIEWED_PILOT_HASH = 'c7f2e1d381e662cfc0dafd0437e2a2d968a8ee4cf2f23112faff9120dd8e3062';
export function loadReviewedPilot(path = new URL('./pilot.json', import.meta.url)) {
  const raw = readFileSync(path);
  if (createHash('sha256').update(raw).digest('hex') !== REVIEWED_PILOT_HASH) {
    throw new Error('Free mode accepts only the reviewed English pilot. Script changes require an English review and a new pinned hash.');
  }
  const pilot = JSON.parse(raw);
  if (pilot.language !== 'English' || pilot.scenes.length !== 5) throw new Error('Invalid reviewed pilot.');
  return pilot;
}
export function sceneDurationFrames(samples, sampleRate, fps = 30) {
  if (!Number.isInteger(samples) || samples <= 0 || !Number.isFinite(sampleRate) || sampleRate <= 0) {
    throw new Error('Invalid local audio duration.');
  }
  return Math.ceil(samples / sampleRate * fps) + Math.ceil(0.3 * fps);
}
