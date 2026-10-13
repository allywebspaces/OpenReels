import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = (...args) => spawnSync(process.execPath, ['memory.mjs', ...args], {
  cwd: new URL('.', import.meta.url), encoding: 'utf8', timeout: 20000,
});

test('retrieves approved voice with source evidence from the real MCP server', () => {
  const result = run('search', 'voice');
  assert.equal(result.status, 0, result.stderr);
  const answer = JSON.parse(result.stdout);
  assert.match(JSON.stringify(answer), /af_bella/);
  assert.match(JSON.stringify(answer), /VOICE_AND_MONETIZATION_RESEARCH/);
});

test('refuses empty retrieval instead of flooding context with the whole graph', () => {
  const result = run('search', '');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /non-empty/);
});

test('reports missing facts without inventing a match', () => {
  const result = run('search', 'nonexistentfact789');
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).entities, []);
});

test('caps broad retrieval and reports omitted facts without breaking JSON', () => {
  const dir = mkdtempSync(join(tmpdir(), 'openreels-memory-'));
  try {
    const path = join(dir, 'facts.jsonl');
    writeFileSync(path, Array.from({ length: 20 }, (_, i) => JSON.stringify({
      type: 'entity', name: `Budget${i}`, entityType: 'test', observations: ['Evidence ' + 'x'.repeat(700)],
    })).join('\n') + '\n');
    const result = spawnSync(process.execPath, ['memory.mjs', 'search', 'Budget'], {
      cwd: new URL('.', import.meta.url), encoding: 'utf8', timeout: 20000,
      env: { ...process.env, MEMORY_FILE_PATH: path },
    });
    assert.equal(result.status, 0, result.stderr);
    const answer = JSON.parse(result.stdout);
    assert.ok(answer.entities.length > 0);
    assert.ok(answer.omittedEntities > 0);
    assert.equal(answer.entities.length + answer.omittedEntities, 20);
    assert.ok(Buffer.byteLength(result.stdout.trim()) <= 6000);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('rejects corrupted memory instead of reporting a misleading no-match', () => {
  const dir = mkdtempSync(join(tmpdir(), 'openreels-memory-invalid-'));
  try {
    const path = join(dir, 'facts.jsonl');
    for (const contents of ['{broken}\n', '{"type":"entity","name":"Broken"}\n']) {
      writeFileSync(path, contents);
      const result = spawnSync(process.execPath, ['memory.mjs', 'search', 'Broken'], {
        cwd: new URL('.', import.meta.url), encoding: 'utf8', timeout: 20000,
        env: { ...process.env, MEMORY_FILE_PATH: path },
      });
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Invalid memory record/);
      assert.equal(result.stdout, '');
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
