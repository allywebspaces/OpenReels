#!/usr/bin/env node
// Offline by default. Provider execution requires an explicit --run.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { spawnSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    list: { type: 'boolean' }, run: { type: 'boolean' },
    mode: { type: 'string', default: 'render' },
    platform: { type: 'string', default: 'youtube' },
    video: { type: 'string', default: 'none' },
  } });
  const profiles = JSON.parse(readFileSync(resolve(root, 'channels/catalog.json'), 'utf8'));
  if (values.list) {
    console.log(JSON.stringify(profiles, null, 2));
    process.exit(0);
  }
  const [id, topic] = positionals;
  const profile = profiles.find(p => p.id === id);
  if (!profile) throw new Error('Unknown channel. Run: node scripts/channel.mjs --list');
  if (profile.language !== 'English') throw new Error('English-only guardrail: channel language must be English.');
  if (positionals.length !== 2 || !topic?.trim() || topic.startsWith('-')) {
    throw new Error('Supply one quoted topic, not a CLI flag. Example: node scripts/channel.mjs ai-money-india "Turn meeting notes into actions"');
  }
  if (!['plan', 'render'].includes(values.mode)) throw new Error('mode must be plan or render');
  if (!['youtube', 'instagram'].includes(values.platform)) throw new Error('platform must be youtube or instagram');
  if (!['none', 'veo', 'kling'].includes(values.video)) throw new Error('video must be none, veo or kling');
  const args = [topic, '--provider', 'google', '--music-provider', 'bundled',
    '--tts-provider', 'gemini-tts', '--archetype', profile.archetype,
    '--direction', resolve(root, 'channels', `${id}.md`),
    '--platform', values.platform, '--output', resolve(root, 'output', id, values.platform)];
  if (values.video === 'none') args.push('--no-video');
  else args.push('--video-provider', values.video === 'veo' ? 'gemini' : 'fal');
  if (values.mode === 'plan') args.push('--dry-run');
  const notice = 'Executing either plan or render can incur API charges. Offline preview makes no API calls. Upstream cost confirmation occurs AFTER research/script generation and is an estimate, not a spending cap.';
  const plan = { channel: id, language: profile.language, experimental: profile.experimental,
    mode: values.run ? values.mode : 'offline-preview', cwd: root, args, notice };
  if (!values.run) {
    console.log(JSON.stringify(plan, null, 2));
    process.exit(0);
  }
  console.error(notice);
  if (profile.experimental) console.error('Experimental channel: pronunciation, age suitability and character consistency require human review before publication.');
  const envPath = resolve(root, '.env');
  if (existsSync(envPath)) process.loadEnvFile(envPath);
  if (!process.env.GOOGLE_API_KEY?.trim()) throw new Error('Missing GOOGLE_API_KEY. Set it locally in .env or the environment; never commit it.');
  if (values.video === 'kling' && !process.env.FAL_API_KEY?.trim()) throw new Error('Missing FAL_API_KEY for Kling.');
  const tsx = resolve(root, 'node_modules/tsx/dist/cli.mjs');
  if (!existsSync(tsx)) throw new Error('Dependencies missing. Run pnpm install --frozen-lockfile first.');
  const result = spawnSync(process.execPath, [tsx, 'src/index.ts', ...args], {
    cwd: root, env: process.env, stdio: 'inherit', shell: false,
  });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
