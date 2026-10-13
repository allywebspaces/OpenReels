import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadReviewedPilot, sceneDurationFrames } from './policy.mjs';
import * as policy from './policy.mjs';
test('free pilot accepts the pinned English script', () => {
  const p = loadReviewedPilot(); assert.equal(p.language, 'English');
  assert.equal(p.scenes.length, 5); assert.ok(p.scenes.every(s => s.narration.length > 10));
});
test('free pilot rejects changed content before downloading or generating assets', () => {
  const dir = mkdtempSync(join(tmpdir(), 'free-policy-'));
  try {
    const p = loadReviewedPilot(); p.scenes[0].narration = 'Bonjour tout le monde';
    const path = join(dir, 'changed.json'); writeFileSync(path, JSON.stringify(p));
    assert.throws(() => loadReviewedPilot(path), /reviewed English pilot/);
  } finally { rmSync(dir, {recursive:true}); }
});
test('scene duration covers the full audio and a short pause without cutting speech', () => {
  assert.equal(sceneDurationFrames(24001, 24000), 40);
  assert.equal(sceneDurationFrames(240000, 24000), 309);
  assert.throws(() => sceneDurationFrames(0, 24000), /Invalid/);
});
test('free pilot rejects unreviewed visual text before downloading assets', () => {
  const dir = mkdtempSync(join(tmpdir(), 'free-visual-policy-'));
  try {
    const path = join(dir, 'Root.tsx');
    writeFileSync(path, 'export const caption = "Bonjour";');
    assert.throws(() => loadReviewedPilot(undefined, path), /reviewed English visuals/);
  } finally { rmSync(dir, {recursive:true}); }
});
test('loads a separate reviewed English micro-drama without replacing productivity', () => {
  assert.equal(typeof policy.loadReviewedPreset, 'function');
  const p = policy.loadReviewedPreset('micro-drama');
  assert.equal(p.language, 'English');
  assert.equal(p.scenes.length, 5);
  assert.match(p.title, /Midnight/);
  assert.equal(loadReviewedPilot().title, 'Turn meeting notes into actions');
});
test('unknown free presets fail before provider execution', () => {
  assert.equal(typeof policy.loadReviewedPreset, 'function');
  assert.throws(() => policy.loadReviewedPreset('unknown'), /Unknown free preset/);
});
