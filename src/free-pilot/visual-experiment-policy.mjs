import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {loadReviewedPreset} from './policy.mjs';
const root = new URL('../../', import.meta.url);
export const experimentPaths = {
  manifest: new URL('./visual-experiment/reviewed.json', import.meta.url),
  visual: new URL('./visual-experiment/Root.tsx', import.meta.url),
  props: new URL('examples/micro-drama/episode-01-question-revision/pilot.json', root),
  video: new URL('examples/micro-drama/episode-01-question-revision/pilot.mp4', root),
};
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function verifyVisualExperiment(paths = experimentPaths) {
  const baseline = loadReviewedPreset('micro-drama');
  const manifest = JSON.parse(readFileSync(paths.manifest, 'utf8'));
  if (manifest.language !== 'English') throw new Error('Only reviewed English visual experiments are allowed.');
  const visual = readFileSync(paths.visual);
  const propsBytes = readFileSync(paths.props);
  const video = readFileSync(paths.video);
  for (const [label, bytes, expected] of [['visual',visual,manifest.visualSha256],['props',propsBytes,manifest.propsSha256],['audio-source video',video,manifest.baselineVideoSha256]]) {
    if (sha256(bytes) !== expected) throw new Error(`Unreviewed ${label}; review and pin before rendering.`);
  }
  const props = JSON.parse(propsBytes);
  if (props.scenes.length !== baseline.scenes.length || props.scenes.some((s,i) => s.narration !== baseline.scenes[i].narration)) throw new Error('Experiment must preserve the reviewed story.');
  return {manifest, props};
}
