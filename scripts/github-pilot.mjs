import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const mode = process.env.PILOT_MODE || 'check';
try {
  if (!['check', 'plan', 'render'].includes(mode)) throw new Error('Invalid pilot mode.');
  if (mode !== 'check' && process.env.APPROVE_API_CHARGES !== 'I_APPROVE_API_CHARGES') {
    throw new Error('Paid modes require I_APPROVE_API_CHARGES. Estimates and workflow timeouts are not spending caps.');
  }
  if (!process.env.GOOGLE_API_KEY?.trim()) throw new Error('GOOGLE_API_KEY repository secret is missing.');
  console.log('GOOGLE_API_KEY is configured; its value is never displayed. This does not verify API access or billing.');
  const preview = spawnSync(process.execPath, ['scripts/channel.mjs', 'ai-money-india',
    process.env.PILOT_TOPIC || 'Turn messy meeting notes into a clear action list',
    '--mode', mode === 'plan' ? 'plan' : 'render'], { cwd: root, encoding: 'utf8', shell: false });
  if (preview.status !== 0) throw new Error(preview.stderr || 'Pilot preview failed.');
  const plan = JSON.parse(preview.stdout);
  if (mode === 'check') {
    console.log(preview.stdout);
    process.exit(0);
  }
  console.log('API charges approved for this manual run. Generating English content for review; no publishing.');
  const result = spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'src/index.ts',
    ...plan.args, '--yes'], { cwd: root, stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
