import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
const clock = vi.hoisted(() => ({frame:0}));
// Replace only the browser/timeline context; render the actual Panel JSX.
vi.mock('remotion', async () => {
  const actual = await vi.importActual<typeof import('remotion')>('remotion');
  return {...actual, useCurrentFrame: () => clock.frame, useVideoConfig: () => ({fps:30}), registerRoot: () => {}, Audio: () => null};
});
import {Panel} from './Root';
const scene = {
  heading:'An empty space', label:'YEARS LATER', items:['I am proud of you.'], narration:'English fixture',
  audio:'scene-3.wav', durationInFrames:200,
  cues:[
    {text:'First day.',startFrame:0,endFrame:39},
    {text:'She reached for a note.',startFrame:40,endFrame:79},
    {text:'There was none.',startFrame:80,endFrame:119},
    {text:'I am proud of you.',startFrame:120,endFrame:159},
  ],
};
describe('emotional-drama source reveal boundaries', () => {
  it('keeps the lunchbox closed immediately before the absence cue', () => {
    clock.frame=79;
    const html=renderToStaticMarkup(React.createElement(Panel, {scene, index:2}));
    expect(html).toContain('data-artwork="closed-lunchbox"');
    expect(html).not.toContain('data-artwork="empty-lunchbox"');
  });
  it('opens the empty lunchbox exactly at the absence cue', () => {
    clock.frame=80;
    const html=renderToStaticMarkup(React.createElement(Panel, {scene, index:2}));
    expect(html).toContain('data-artwork="empty-lunchbox"');
    expect(html).not.toContain('data-artwork="closed-lunchbox"');
  });
  it('reveals the pride line only at its cue without a duplicate caption', () => {
    clock.frame=119;
    expect(renderToStaticMarkup(React.createElement(Panel, {scene, index:3}))).not.toContain('I am proud of you.');
    clock.frame=120;
    const html=renderToStaticMarkup(React.createElement(Panel, {scene, index:3}));
    expect(html.match(/I am proud of you\./g)).toHaveLength(1);
  });
});
