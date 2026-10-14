# Video-quality experiment copy

Created 15 October 2026 at the user's request to preserve current work and experiment on a copy.

- Preserved branch: `build/five-channel-starter`.
- Exact starting checkpoint: `7d7224b67db3694dcd4b7f3708eff36c13621abf`.
- Working copy branch: `experiment/video-quality`.
- Separate local working directory: `/workspace/scratch/c946dce218e8/openreels-video-quality`.
- Original working directory: `/workspace/scratch/c946dce218e8/openreels`.

A Git branch plus a separate worktree provides an independent checkout with full tracked source, history, examples and research. It is not a separate repository or independent disaster-recovery backup. Commits on this branch do not change the preserved build branch. Continue future video experiments here; do not merge or change the baseline workflow pin implicitly. Credentials, ignored output and installed dependencies are not tracked project artifacts.

## Baseline verification

At the starting checkpoint, the new checkout passed 431 Vitest tests across 49 files, 23 Node tests, TypeScript and `node scripts/free-pilot.mjs --preset micro-drama --check` (English, zero API calls). No new render was made. Offline package installation lacked cached metadata; dependency directories were copied from the existing checkout. pnpm exec attempted automatic setup, which was stopped; checks ran successfully via the installed Node entry points. This verifies the current copied runtime, not a fresh reproducible dependency install. The memory MCP dependencies were copied separately. No model provider call was made.

## Pending ideas, in recommended order

1. Reusable timestamped quality review: exact script/cue timeline, selected frames, separate audio samples, prioritized evidence-backed findings. No invented listening judgment or retention score.
2. One controlled visual/pacing alternative: stronger opening, clue close-ups, varied framing and optional subtle original sound effects; compare with preserved approved video.
3. Expressive voice audition: hardware/model-term check, then a short Qwen3-TTS comparison if feasible; keep approved Kokoro default until reviewed.
4. Caption-alignment experiment: evaluate WhisperX on reviewed English script and shorter caption chunks, without early spoilers or silently replacing trusted text.
5. Three private pilot reviews before launch: mystery, emotional drama and twist story. Review comprehension, consistency and delivery; channel creation remains on hold.

Hosted Gemini critique tools, local Qwen visual review and GPU video generation remain optional evaluations, not installed production features. No new paid inference is authorized. Channel naming/registration/publication is deferred. No experiment implementation has begun; only the copy, setup verification and this handoff record are new.
