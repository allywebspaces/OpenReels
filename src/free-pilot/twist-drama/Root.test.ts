import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';
const clock = vi.hoisted(() => ({frame: 0}));
// Keep real scene JSX and Remotion utilities; replace only timeline/browser context.
vi.mock('remotion', async () => {
  const actual = await vi.importActual<typeof import('remotion')>('remotion');
  return {...actual, useCurrentFrame: () => clock.frame, useVideoConfig: () => ({fps: 30}), registerRoot: () => {}, Audio: () => null};
});
import {Panel} from './Root';
const scene = {
  heading: 'The next room', label: 'THE INTERVIEW', items: ['How soon can you start?'],
  narration: 'English fixture', audio: 'scene-3.wav', durationInFrames: 200,
  cues: [
    {text: 'The man stood too.', startFrame: 0, endFrame: 39},
    {text: 'Leo realised the stranger was the founder.', startFrame: 40, endFrame: 99},
    {text: 'Then he asked Leo how soon he could start.', startFrame: 100, endFrame: 160},
  ],
};
const render = (index: number, frame: number) => {
  clock.frame = frame;
  return renderToStaticMarkup(React.createElement(Panel, {scene, index}));
};
describe('twist-drama source reveal boundaries', () => {
  it('does not show the founder badge before its measured cue', () => {
    expect(render(2, 39)).not.toContain('data-artwork="founder-badge"');
    expect(render(2, 39)).not.toContain('FOUNDER');
  });
  it('shows the founder badge exactly at its measured cue', () => {
    const html = render(2, 40);
    expect(html).toContain('data-artwork="founder-badge"');
    expect(html.match(/FOUNDER/g)).toHaveLength(1);
  });
  it('does not leak the offer in the open notebook before the final cue', () => {
    const html = render(4, 99);
    expect(html).toContain('data-artwork="open-notebook"');
    expect(html).not.toContain('How soon can you start?');
    expect(html).not.toContain('data-artwork="job-offer"');
  });
  it('shows the offer once at the final cue without duplicating it as a caption', () => {
    const html = render(4, 100);
    expect(html).toContain('data-artwork="job-offer"');
    expect(html.match(/How soon can you start\?/g)).toHaveLength(1);
    expect(html).not.toContain('Then he asked Leo how soon he could start.');
  });
  it('never shows either reveal in earlier scenes', () => {
    for (const index of [0, 1, 3]) {
      const html = render(index, 150);
      expect(html).not.toContain('data-artwork="founder-badge"');
      expect(html).not.toContain('data-artwork="job-offer"');
    }
  });
});
