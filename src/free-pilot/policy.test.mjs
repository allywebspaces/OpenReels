import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadReviewedPilot, sceneDurationFrames } from './policy.mjs';
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
