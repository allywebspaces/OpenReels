# The Waiting Room — episode 03 review copy

Third distinct, newly authored English micro-drama: a lighter workplace twist. Not posted to a social channel or user-approved. This repository's visibility governs access; “review copy” does not mean access-controlled hosting.

Source [d07fe39](https://github.com/allywebspaces/OpenReels/commit/d07fe3938b6dbba30aae7e9c40b412d65f9e99a6); successful free CPU [run 38845440707](https://github.com/allywebspaces/OpenReels/actions/runs/38845440707), 16 October 2026. Artifact12022333874: 10,625,416 bytes, ZIP SHA256 `b62648523a107cc69561484fc44afcd0e6627775ba2dbfee405e9b3f25baaaa8`, independently matched before extraction.

## Output and preservation

[Watch/download pilot.mp4](pilot.mp4). H.264/AAC, 720×1280, 30fps, 1,144 composition frames / 38.1333s; container38.186667s. Size2,703,660 bytes; SHA256 `f378ccd089e30313dd3273bb10bc4add5a0afebc6926221aed46c98ef3511469`.

Full FFmpeg decode passed on runner and after download. Source, MP4 and all five WAV digests matched the runner's SHA256SUMS. Exact WAVs, actual render props, generated report/ffprobe data and 18 JPEGs extracted from the actual MP4 are preserved here. ARCHIVE_SHA256SUMS validates these generated evidence files relative to this folder; original SHA256SUMS retains the runner's source/output paths. Source/visual English allowlist checks preceded model download. No paid provider, external artwork, soundtrack, new speech model or real-person cloning.

Pre-render verification: 439 Vitest tests across51files plus35Node tests =474 software tests, TypeScript and offline preset check passed. A separate source review found no blocking issue. Static React tests gate founder/offer reveals, but cannot establish actual MP4 quality; frame review below is separate evidence.

## Timestamped output review — 16 October 2026

Lead opened10 actual-MP4 JPEGs; focused visual reviewer opened8 more. No observed clipping, overlap or non-English visible text in these samples. Not every frame reviewed, not a real-time full playback assessment.

| Time / frames | Finding |
|---|---|
| 2.0s /60 | Opening caption readable on two lines; bench, bag, boots and toolbox visible. |
| 8.90–8.933s /267,268; 11.667s /350 | Clean first boundary; bag moves off chair at scene-two opening; caption readable. |
| 14.30–14.333s /429,430 | Clean transition to neutral identity badge; founder text absent. |
| 18.567–18.60s /557,558 | Founder label absent before cue, present at cue with the matching English caption. |
| 22.00–22.033s /660,661; 23.833s /715 | Badge-to-browser transition clean; complaint narration caption fits. |
| 29.633–29.667s /889,890; 32.267s /968 | Browser-to-notebook transition clean; note-taking caption readable. |
| 34.933–34.967s /1048,1049 | No offer before cue; “How soon / can you / start?” appears once on right page at cue. |
| 36.667–38.10s /1100,1143 | Offer fits inside page with no clipping/duplicate lower caption; final hold is clean. |

## Explicit limits and editorial issues

No listening or independent final speech transcription. The source narration and all visible copy were English-reviewed and pinned; this does not prove every generated sound was English or naturally delivered. Sentence/phrase clips provide measured cues, not word alignment. FFmpeg volumedetect: mean−26.3dB, peak−5.8dB; not LUFS or proof of comfortable phone-speaker volume.

The illustration is deliberately prop-led, not acted drama: boots/bag symbolize the waiting people rather than showing complete bodies. The notebook cannot convey the founder's or candidate's facial response. Generic strokes show note-taking, not specific website complaints; captions carry that meaning. The final visible question paraphrases the spoken indirect sentence instead of transcribing it verbatim. These unresolved creative/accessibility trade-offs are documented for review, not evidence of production readiness. No audience, retention or earnings test was performed.

## Reproduce

See [EPISODE_03_RUN.md](../../../docs/content-factory/EPISODE_03_RUN.md) for clean setup and the demonstrated free render workflow. Normal generation is fixed to this reviewed script:

```bash
node scripts/free-pilot.mjs --preset twist-drama --check
node scripts/free-pilot.mjs --preset twist-drama
```

From this archive folder, `sha256sum -c ARCHIVE_SHA256SUMS` verifies stored assets/props/media. For a prepared visual replay without another TTS generation, from repository root after archive verification:

```bash
node scripts/free-pilot.mjs --preset twist-drama --check
pnpm exec remotion render src/free-pilot/twist-drama/Root.tsx FreeEnglishPilot output/twist-drama-replay.mp4 --props=examples/micro-drama/episode-03-waiting-room/render-props.json --public-dir=examples/micro-drama/episode-03-waiting-room/assets --concurrency=2
```

Replay recipe is prepared, not separately executed. Browser/encoding changes may change bytes; the archived MP4 is the verified output. Use the demonstrated GitHub environment where local Remotion hits the recorded interface-address failure; do not repeat the same exhausted local attempts. No arbitrary-topic generator or automatic audience-quality judgment is implemented.
