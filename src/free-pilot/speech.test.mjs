import { test } from 'node:test';
import assert from 'node:assert/strict';
import { speechPlan, assembleSpeech } from './speech.mjs';

test('question has a separate clip and measured pause before its cue', () => {
  const result = assembleSpeech([
    {text:'The knocking stopped.',audio:new Float32Array(24000).fill(.1),sampleRate:24000,pauseAfterMs:550},
    {text:'Would you open it?',audio:new Float32Array(43200).fill(.2),sampleRate:24000,pauseAfterMs:0},
  ]);
  assert.equal(result.cues[1].startFrame, 47);
  assert.equal(result.audio.length, 80400);
  assert.equal(result.audio[24000], 0);
  assert.ok(result.audio[37200] > .19);
  assert.equal(result.cues[0].text, 'The knocking stopped.');
});
test('speech plan cannot silently change reviewed caption text', () => {
  assert.throws(() => speechPlan({narration:'Would you open it?',speechParts:[{text:'Open the door.',speed:1,pauseAfterMs:0}]}), /match/);
  assert.equal(speechPlan({narration:'Would you open it?'})[0].speed, 1.1);
});
test('incompatible audio rates cannot corrupt cue timing', () => {
  assert.throws(() => assembleSpeech([
    {text:'One.',audio:new Float32Array(10),sampleRate:24000,pauseAfterMs:0},
    {text:'Two.',audio:new Float32Array(10),sampleRate:48000,pauseAfterMs:0},
  ]), /sample rate/);
});
