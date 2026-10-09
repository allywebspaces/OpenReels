import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { runPipeline } from './orchestrator.js';
import type { PipelineOptions } from './utils.js';
import type { DirectorScore } from '../schema/director-score.js';
const makeScore = (line: string): DirectorScore => ({
  emotional_arc: 'curiosity', archetype: 'infographic', music_mood: 'warm_acoustic',
  scenes: ['text_card', 'ai_image', 'stock_video'].map((type) => ({
    visual_type: type as 'text_card' | 'ai_image' | 'stock_video', visual_prompt: 'A simple lesson',
    script_line: line, motion: 'static', transition: null,
  })),
});
describe('English guard in the real pipeline', () => {
  it('blocks replayed French before TTS, images or a published score', async () => {
    const outputDir = mkdtempSync(join(tmpdir(), 'english-gate-'));
    let outputRun = '';
    let assetsStarted = false;
    const generateAsset = async () => { assetsStarted = true; throw new Error('Unexpected asset generation'); };
    try {
      const opts = { topic: 'language guard test', outputDir, replayScore: makeScore('Bonjour, voici notre histoire.'),
        llm: { id: 'gemini', generate: async () => ({ data: { englishOnly: false, reason: 'French narration' }, usage: { inputTokens: 1, outputTokens: 1 } }) },
        tts: { generate: generateAsset }, imageGen: { generate: generateAsset },
      } as unknown as PipelineOptions;
      await expect(runPipeline(opts, { onRunDir: (dir) => { outputRun = dir; } })).rejects.toThrow('English-only guardrail');
      expect(assetsStarted).toBe(false);
      expect(existsSync(join(outputRun, 'score.json'))).toBe(false);
    } finally { rmSync(outputDir, { recursive: true, force: true }); }
  });
  it('allows positively reviewed English replay through a planning run', async () => {
    const outputDir = mkdtempSync(join(tmpdir(), 'english-plan-'));
    try {
      const opts = { topic: 'English plan', outputDir, replayScore: makeScore('Learn one useful idea today.'), dryRun: true,
        llm: { id: 'gemini', generate: async () => ({ data: { englishOnly: true, reason: 'English' }, usage: { inputTokens: 1, outputTokens: 1 } }) },
      } as unknown as PipelineOptions;
      const result = await runPipeline(opts);
      expect(result.videoPath).toBe(null);
      expect(existsSync(result.scorePath)).toBe(true);
    } finally { rmSync(outputDir, { recursive: true, force: true }); }
  });
});
