# Episode 03 — The Waiting Room

16 October 2026. Third distinct original English micro-drama, a lighter workplace twist. This is a separate fixed reviewed preset, not an arbitrary-topic generator. Episodes 01/02 and `build/five-channel-starter` are preserved.

## Bounded design

Leo talks candidly about a company's website to a stranger in a waiting room, learns the stranger is the founder, and discovers the criticism has become an unexpected opportunity. Five illustrated scenes use original bench/bag/toolbox, identity badge, browser and notebook artwork. A neutral title/scene labels avoid spoiling the reveal. Keep the founder identity hidden until scene-three cue 1, and the offer until scene-five cue 2. Show the offer once, without duplicating it as a lower caption. This is an editorial hypothesis, not proof of hook quality, hiring realism or audience response.

Reuse existing Kokoro `af_bella` at 1.1, English sentence clips and measured boundaries. No external artwork, soundtrack, new model, cloned person or paid fallback. Review English script/visual text and pin both script and Root before asset generation. Static React boundary tests supplement the policy/runner guards; actual rendered frame inspection remains required.

## Reproduce

Use Node 24, pnpm 11, FFmpeg and locked dependencies, as in `.github/workflows/twist-drama.yml`:

```bash
pnpm install --frozen-lockfile
node scripts/free-pilot.mjs --preset twist-drama --check
node scripts/free-pilot.mjs --preset twist-drama
ffmpeg -v error -i output/twist-drama/pilot.mp4 -f null -
```

Check mode is offline and precedes model imports. Render mode can download free Kokoro/browser files and consumes compute/storage, not unlimited free resources. Use the demonstrated free GitHub path: two local attempts already hit `os.networkInterfaces` failure. Workflow triggers only this preset/workflow's changes on the experiment branch or manual dispatch; do not rerender unchanged earlier episodes. Artifacts expire after seven days unless archived durably.

## Actual status

Source verification before the successful render: English script SHA256 `6ae65e7c93b224f2f20f516b3c22a174f05e153d80d98eb954c112273a580a4d`; Root SHA256 `c25ba3d11d33687f1e4ab1141454b0a288d1b51de45b3ea39b37b1d09312817b`. Four new Node guard tests were observed failing before registration, then passing; five React source-timeline tests passed after a minimal stub produced intended missing-reveal assertion failures. A focused read-only source reviewer found no blocking issue. Full 439 Vitest tests in 51 files + 35 Node tests = 474 software tests, TypeScript, offline English preset check and diff whitespace check passed. Existing suite's simulated provider failures are expected diagnostics, not live calls. Checks reused installed dependencies via temporary links, not a clean installation.

Rendered and sampled visually: source `d07fe3938b6dbba30aae7e9c40b412d65f9e99a6`, successful [run38845440707](https://github.com/allywebspaces/OpenReels/actions/runs/38845440707), artifact12022333874. ZIP digest verified; source/MP4/five WAV hashes matched; full downloaded MP4 decode passed. Container38.186667s, composition38.1333s, H264/AAC720×1280/30fps. MP4 SHA256 `f378ccd089e30313dd3273bb10bc4add5a0afebc6926221aed46c98ef3511469`. Eighteen actual-MP4 JPEGs opened across lead/reviewer; sampled scene changes clean, founder absent557/present558, offer absent1048/present1049 and fits the page once. [Durable video/audio/props archive and timestamped review](../../examples/micro-drama/episode-03-waiting-room/README.md).

Listening, final ASR, user approval and audience quality remain unverified. Prop-only art, absent character reactions, generic complaint strokes and final-question paraphrase are recorded editorial limits, not hidden defects or audience-quality claims. Three original stories are now available for acceptance audit; stop expanding features when AUTOPILOT criteria are satisfied.
