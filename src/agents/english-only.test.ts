import { describe, expect, it } from 'vitest';
import type { LLMProvider } from '../schema/providers.js';
import type { DirectorScore } from '../schema/director-score.js';
import { enforceEnglishOnly } from './english-only.js';
const score = (line: string): DirectorScore => ({ emotional_arc: 'curiosity', archetype: 'infographic', music_mood: 'warm_acoustic', scenes: [{ visual_type: 'text_card', visual_prompt: 'A simple lesson', motion: 'static', script_line: line, transition: null }] });
function reviewer(data: unknown): LLMProvider {
  return { id: 'gemini', generate: async () => ({ data, usage: { inputTokens: 10, outputTokens: 5 } }) } as LLMProvider;
}
describe('English-only release gate', () => {
  it('accepts positively reviewed English and returns billable usage', async () => {
    expect(await enforceEnglishOnly(reviewer({ englishOnly: true, reason: 'English throughout' }), score('Learn one useful idea today.'))).toEqual({ inputTokens: 10, outputTokens: 5 });
  });
  it('rejects non-Latin narration before making a reviewer call', async () => {
    const unavailable = { id: 'gemini', generate: async () => { throw new Error('must not call'); } } as unknown as LLMProvider;
    await expect(enforceEnglishOnly(unavailable, score('आज आपण शिकूया'))).rejects.toThrow('English-only guardrail');
  });
  it('rejects non-English text using the Latin alphabet', async () => {
    await expect(enforceEnglishOnly(reviewer({ englishOnly: false, reason: 'French narration' }), score('Bonjour, voici notre histoire.'))).rejects.toThrow('French narration');
  });
  it('fails closed on malformed review results', async () => {
    await expect(enforceEnglishOnly(reviewer({ score: 8 }), score('A useful lesson.'))).rejects.toThrow();
  });
  it('fails closed when the language reviewer is unavailable', async () => {
    const unavailable = { id: 'gemini', generate: async () => { throw new Error('review unavailable'); } } as unknown as LLMProvider;
    await expect(enforceEnglishOnly(unavailable, score('A useful lesson.'))).rejects.toThrow('review unavailable');
  });
  it('checks text cards as well as narration', async () => {
    const plan = score('A useful lesson.');
    plan.scenes[0]!.visual_prompt = 'नमस्कार';
    await expect(enforceEnglishOnly(reviewer({ englishOnly: true, reason: '' }), plan)).rejects.toThrow('English-only guardrail');
  });
});
