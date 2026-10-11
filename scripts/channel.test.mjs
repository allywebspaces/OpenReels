import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const cli = fileURLToPath(new URL('./channel.mjs', import.meta.url));
const call = (...args) => spawnSync(process.execPath, [cli, ...args], { cwd: '/tmp', encoding: 'utf8' });
test('default is an offline preview, works outside the repository, and preserves topic literally', () => {
  const topic = 'An idea; $(touch /tmp/never-run-content-factory)';
  const r = call('ai-money-india', topic);
  assert.equal(r.status, 0, r.stderr);
  const plan = JSON.parse(r.stdout);
  assert.equal(plan.mode, 'offline-preview');
  assert.equal(plan.args[0], topic);
  assert.equal(plan.cwd, root.replace(/\/$/, ''));
  assert.ok(plan.args.includes('--no-video'));
  assert.ok(!plan.args.includes('--yes'));
});
test('unknown channel and unknown options fail before any generation', () => {
  for (const args of [['not-a-channel', 'topic'], ['ai-money-india', 'topic', '--yes']]) {
    const r = call(...args);
    assert.notEqual(r.status, 0);
  }
});
test('all five channel briefs and archetypes resolve', () => {
  const r = call('--list');
  assert.equal(r.status, 0, r.stderr);
  const profiles = JSON.parse(r.stdout);
  assert.equal(profiles.length, 5);
  for (const profile of profiles) {
    assert.equal(profile.language, 'English');
    const p = JSON.parse(call(profile.id, 'test topic').stdout);
    const brief = p.args[p.args.indexOf('--direction') + 1];
    assert.ok(readFileSync(brief, 'utf8').length > 100);
    assert.ok(existsSync(`${root}/src/config/archetypes/${profile.archetype.replaceAll('_', '-')}.json`));
  }
});
test('Instagram and Kling selections reach upstream arguments explicitly', () => {
  const r = call('micro-drama', 'The missing letter', '--platform', 'instagram', '--video', 'kling');
  assert.equal(r.status, 0, r.stderr);
  const p = JSON.parse(r.stdout);
  assert.equal(p.args[p.args.indexOf('--platform') + 1], 'instagram');
  assert.equal(p.args[p.args.indexOf('--video-provider') + 1], 'fal');
  assert.ok(!p.args.includes('--no-video'));
});
test('research plan execution is marked as potentially billable', () => {
  const p = JSON.parse(call('silver-life-india', 'A safer phone', '--mode', 'plan').stdout);
  assert.ok(p.args.includes('--dry-run'));
  assert.match(p.notice, /can incur API charges/i);
});
test('default pilot arguments are accepted by the actual CLI and disable generated video', () => {
  const preview = JSON.parse(call('ai-money-india', 'Meeting notes').stdout);
  const code = `import { parseArgs } from './src/cli/args.ts'; process.execArgv = []; process.argv = ['node', 'openreels', ...JSON.parse(process.env.CLI_TEST_ARGS)]; console.log(JSON.stringify(parseArgs()));`;
  const r = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '--eval', code], {
    cwd: root, encoding: 'utf8', env: { ...process.env, CLI_TEST_ARGS: JSON.stringify([...preview.args, '--yes']) },
  });
  assert.equal(r.status, 0, r.stderr);
  const parsed = JSON.parse(r.stdout);
  assert.equal(parsed.noVideo, true);
  assert.equal(parsed.provider, 'gemini');
  assert.equal(parsed.musicProvider, 'bundled');
  assert.equal(parsed.ttsProvider, 'gemini-tts');
});
