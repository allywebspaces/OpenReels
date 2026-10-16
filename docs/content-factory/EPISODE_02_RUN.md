# Episode 02 — The Folded Notes

16 October 2026. Separate original English emotional-drama pilot; episode 01, its approved audio and the preserved baseline branch remain unchanged.

## Editorial and implementation decisions

The story follows Nina from ignoring her father's lunchbox notes to finding comfort in them after his death, then continuing the ritual for her younger brother. It is original fiction, not a true-story or audience-performance claim. The grief is narrated without graphic imagery. English narration, labels, caption copy and the pride-line artwork were reviewed in source before pinning.

Reuse the existing free fixed-preset route, approved local Kokoro `af_bella` at speed 1.1 and measured speech-clip boundaries. Original procedural lunchbox/drawer/note artwork uses the installed Remotion 4.0.441 contract, no downloaded images, actors, soundtrack, new model or provider API. Decorative headings are small; the scene-four pride line appears at its own speech cue and is not duplicated as a lower caption. These are editorial hypotheses, not measured retention improvements.

Source: `src/free-pilot/emotional-drama/pilot.json` and `Root.tsx`. Policy pins both before the runner imports Kokoro or generates assets. Adding this reviewed preset does not implement arbitrary-topic generation. Existing sentence cues are not word alignment or transcription.

## Reproduce

Use Node 24, pnpm 11, locked dependencies and FFmpeg, as in `.github/workflows/emotional-drama.yml`:

```bash
pnpm install --frozen-lockfile
node scripts/free-pilot.mjs --preset emotional-drama --check
node scripts/free-pilot.mjs --preset emotional-drama
ffmpeg -v error -i output/emotional-drama/pilot.mp4 -f null -
```

Check mode needs neither credentials nor model downloads. Render mode downloads the existing free CPU Kokoro model/browser if absent, and consumes compute/storage; no paid fallback exists. The narrowly scoped workflow runs on this preset/workflow's changes on `experiment/video-quality` or manual dispatch. It uploads assets, props, MP4, stills, report, ffprobe data and hashes for seven days; this is not a durable archive until selected outputs are committed. It checks out the triggering commit rather than old pinned episode-01 source. Do not invoke the inherited paid `github-pilot.mjs` route.

## Verification checkpoint

Four new Node tests were observed failing with the preset absent, then passing with reviewed registration: valid English speech joins, offline check, changed-script rejection and changed-visual rejection before model download. A focused source reviewer caught an early empty-lunchbox reveal; it now remains closed until scene-three cue 2. Two boundary regressions were observed failing before that correction and passing after; a third test checks the pride line appears once at its cue. These are static React/source-timeline checks, not decoded-frame evidence. Checks reuse installed dependencies via temporary links, not a clean install. Existing approved episode-01 MP4 hash was rechecked as `9b438dff1eece70ea902c04921d6bdca61c90815288cc587bfb2ea6f2a3053c7`.

Status: implemented and source-reviewed; render pending. Do not infer audible prosody, actual reveal timing, visual legibility or audience quality from source/tests. The local Remotion interface-address failure already exhausted two attempts; use the demonstrated GitHub rendering environment instead of repeating it. No user listening/creative approval of this new pilot yet.

Fresh pre-render checks: 434 Vitest tests across 50 files plus 31 Node tests = 465 software tests; TypeScript and fixed-preset offline check passed. Provider-failure diagnostics in the suite are expected simulated failures, not paid provider execution. Tests do not establish audience quality.
