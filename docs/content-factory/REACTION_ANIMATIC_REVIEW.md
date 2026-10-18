# Character-reaction visual-format audition

19 October 2026 India. User approved the proposed short human-reaction test. This is a separate 385-frame excerpt of episode01, not a replacement for the approved episode or a new complete pilot.

## What changed

The approved first 12.833333 seconds now have three consistent photographic stills of the fictional adult Maya: reading her phone, reacting towards the closed door, and reaching towards—but not touching or turning—the deadbolt. A final cut returns to phone-reading. Gentle camera moves animate the stills. This is **not acted footage, lip-sync or generated character motion**.

Both experimental conditions use the same decoded source narration excerpt, with no new speech generation, speed, pitch, wording, music or knock effect. The excerpt is re-encoded to AAC, so it is not bit-identical to the original episode audio. The control and candidate AAC streams ARE identical to each other. This permits a same-audio comparison of the visual formats.

| Shot | Frame range, end exclusive | Story constraint |
|---|---|---|
| Read phone | 0–209 | No legible phone-screen warning before the reviewed caption cue at121 |
| Reaction to knock | 209–258 | Alarmed glance towards closed door |
| Reach towards lock | 258–323 | Visible air gap, no unlock or open-door action |
| Return to phone | 323–385 | No photograph or later clue. Excerpt stops before the photograph sentence at385 |

English captions use the five original source cues, gated by reviewed source-file hashes. The generated art contains no deliberately generated text. Visible-text checks were manual samples, not OCR or a final ASR language proof.

## Asset and runtime distinction

Built-in host image generation produced the original photographic triptych and one targeted edit to move the reaching hand clear of the lock. The prompt/edit are retained in `examples/video-qa/reaction-animatic/PROMPTS.json`; final art SHA256 is `d0230c4df8ff011e9814287546c913f6710be913670c0f77ef8fc499c54d2d65`.

This image work used the host's built-in image tool, not a project API key or a locally running free image model. No Google/fal/paid-provider fallback was enabled. Do not describe arbitrary image/story generation as an offline or unlimited free capability. Once the supplied artwork and source video are available, the fixed replay recipe uses Python and FFmpeg without inference calls.

The source bundle delivered with the videos retains artwork, full approved source MP4/cues, exact PCM excerpt, encoded control/candidate/comparison, samples and recipe. Binary media are in that durable downloadable bundle, not silently claimed to be committed as raw files in GitHub. Git retains the recipe, prompts, manifest and review/checkpoint. Original episode/baseline files remain unchanged.

## Actual verification

- Candidate: 720×1280 H.264/AAC,30fps,385 video frames. SHA256 `bd282da907061bf6286f54686e2291557e2794adae4b1925fcd36915fd1b15cc`.
- Side-by-side comparison:1440×1344,385 frames. SHA256 `a01720cddbc20e8fd62098c70a0011a47e5792b488209c5eed9f33c60c1e1930`.
- Control/candidate/comparison encoded AAC (ADTS) SHA256: `97bf8ef1ed445b3f29e3891640d507ec2db407de1827595a3e92fae8b92cffaa`.
- Shared source reference contains616000 stereo PCM16 samples at48000Hz. AAC is re-encoded for the excerpt. Container duration can include encoder padding beyond the385-frame picture.
- All three encoded videos passed strict full FFmpeg decode and frame-count/probe checks. Source MP4 and cues matched pinned SHA256 values before rendering. A mismatched artwork pin was tested and rejected before rendering.
- Independent review inspected14 actual final-MP4 samples:0,120,121,200,208,209,254,257,258,320,322,323,382,384. Warning absent0/120,present121,absent200. Starts correct209/258/323; ends clear254/320/382. Door closed, hand clear of lock, no photograph/future clue or caption clipping observed.
- Initial ASS centisecond captions appeared about one frame late at some cuts. Replaced with integer-frame drawtext enables. The final encoded samples resolve this observed defect. A real FFmpeg raw-frame regression test checks caption visibility exactly at start and absence at end.
- Two new Python/FFmpeg tests passed, including the excerpt/reveal-boundary plan. Existing439 Vitest tests/51files, TypeScript `--noEmit` and approved-preset zero-API source check passed using existing dependencies, not a clean install. No live provider tests ran.

The reviewer inspected samples, not all385 frames or a complete audiovisual playback. No independent listening, lip-sync, phone-playback, viewer test or audience-retention assessment is implied. The browser reachability blocker from VISUAL_COMPARISON_REVIEW.md remains unresolved and was not retried identically here.

## Interpretation and next decision

The sample visibly gives the narration a human subject and a reaction, and preserves the delayed warning/closed-door story constraints. It is a useful format audition, not proof that engagement improved. Human depiction, photographic style and layout change together, so this does not isolate character emotion as the sole cause of any preference. The return to the first still is deliberately simple and can feel repetitive.

Watch the short candidate and its same-audio comparison before expanding the full episode. Decide whether Maya's presence makes the warning feel more immediate. If this direction is preferred, the next controlled work is shot continuity and performed/expressive motion or a separate voice audition, subject to free/local feasibility. Do not build more stories, adopt this as approved or publish from software checks alone. Schedule remains paused.

## Fixed replay

Extract the delivered source bundle, then run from its root with Python3.11+ and FFmpeg/FFprobe supporting libx264, drawtext and zoompan:

```bash
python3 scripts/reaction-animatic.py --plan
python3 scripts/reaction-animatic.py \
  --artwork assets/artwork.png \
  --artwork-sha256 d0230c4df8ff011e9814287546c913f6710be913670c0f77ef8fc499c54d2d65 \
  --out output/replayed-reaction-test
```

Different fonts/FFmpeg versions may change output bytes. Source pins,385-frame excerpt and same-audio condition checks must still pass. The replay does not call an image generator or write a new script.
