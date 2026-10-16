import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {reviewedPresetConfig, loadReviewedPreset} from './policy.mjs';
import {speechPlan} from './speech.mjs';

test('emotional drama is a separate pinned English preset with exact speech parts', () => {
  const config = reviewedPresetConfig('emotional-drama');
  assert.equal(config.folder, 'emotional-drama/');
  assert.equal(config.output, 'emotional-drama');
  assert.match(config.scriptHash, /^[a-f0-9]{64}$/);
  assert.match(config.visualHash, /^[a-f0-9]{64}$/);
  const pilot = loadReviewedPreset('emotional-drama');
  assert.equal(pilot.language, 'English');
  assert.equal(pilot.title, 'The Folded Notes');
  assert.equal(pilot.scenes.length, 5);
  for (const scene of pilot.scenes) assert.equal(speechPlan(scene).map(p => p.text).join(' '), scene.narration);
  assert.equal(loadReviewedPreset('micro-drama').title, 'The Message at Midnight');
  assert.equal(loadReviewedPreset('productivity').title, 'Turn meeting notes into actions');
});

test('emotional drama check exits without model imports or asset generation', () => {
  const result = spawnSync(process.execPath, ['scripts/free-pilot.mjs', '--preset', 'emotional-drama', '--check'], {encoding:'utf8'});
  assert.equal(result.status, 0, result.stderr);
  const check = JSON.parse(result.stdout);
  assert.equal(check.title, 'The Folded Notes');
  assert.equal(check.language, 'English');
  assert.equal(check.apiCalls, 0);
});

for (const [file, message] of [['pilot.json', /reviewed English pilot/], ['Root.tsx', /reviewed English visuals/]]) {
  test(`emotional drama rejects changed ${file} before model download`, () => {
    // Real runner in an isolated fixture, deliberately without node_modules.
    // A missing hash check would reach the asset/model path instead of this error.
    const dir = mkdtempSync(join(tmpdir(), 'emotional-policy-'));
    try {
      mkdirSync(join(dir, 'scripts'), {recursive:true});
      mkdirSync(join(dir, 'src/free-pilot'), {recursive:true});
      cpSync('scripts/free-pilot.mjs', join(dir, 'scripts/free-pilot.mjs'));
      for (const name of ['policy.mjs', 'speech.mjs', 'emotional-drama']) cpSync(`src/free-pilot/${name}`, join(dir, `src/free-pilot/${name}`), {recursive:true});
      const target = join(dir, 'src/free-pilot/emotional-drama', file);
      const raw = readFileSync(target, 'utf8');
      writeFileSync(target, file.endsWith('.json') ? raw.replace('Nina', 'Bonjour') : raw + '\n// unreviewed visual change\n');
      const result = spawnSync(process.execPath, [join(dir, 'scripts/free-pilot.mjs'), '--preset', 'emotional-drama'], {encoding:'utf8'});
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, message);
      assert.doesNotMatch(result.stdout, /Downloading local voice/);
    } finally {rmSync(dir, {recursive:true});}
  });
}
