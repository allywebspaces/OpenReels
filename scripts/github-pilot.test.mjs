import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const call = (env) => spawnSync(process.execPath, ['scripts/github-pilot.mjs'], {
  encoding: 'utf8', env: { ...process.env, GOOGLE_API_KEY: '', APPROVE_API_CHARGES: '', ...env },
});
test('paid modes refuse to start without explicit charge acknowledgement', () => {
  for (const mode of ['plan', 'render']) {
    const r = call({ PILOT_MODE: mode, GOOGLE_API_KEY: 'fake-key' });
    assert.equal(r.status, 1); assert.match(r.stderr, /I_APPROVE_API_CHARGES/);
  }
});
test('check mode requires a secret but never exposes it or calls a provider', () => {
  assert.equal(call({ PILOT_MODE: 'check' }).status, 1);
  const r = call({ PILOT_MODE: 'check', GOOGLE_API_KEY: 'fake-private-key', PILOT_TOPIC: 'Meeting notes; $(exit 9)' });
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!r.stdout.includes('fake-private-key'));
  assert.match(r.stdout, /offline-preview/);
  assert.match(r.stdout, /Meeting notes;/);
});
test('unknown modes fail closed', () => {
  assert.equal(call({ PILOT_MODE: 'other', GOOGLE_API_KEY: 'fake-key' }).status, 1);
});
