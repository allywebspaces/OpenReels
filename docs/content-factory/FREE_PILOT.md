# Free English pilot

## Goal
Produce one portrait English explainer MP4 without paid generation APIs. Keep the existing OpenReels work and validate its local Kokoro + Remotion components. This follows the local voice / captions / composition approach documented by https://github.com/gyoridavid/short-video-maker, without importing that repository or replacing our engine.

## What runs
- Fixed, reviewed English script: turning meeting notes into confirmed actions.
- Kokoro q8 model downloaded from Hugging Face and run locally on CPU, using the English af_bella voice at 1.1 speed (revised after user feedback).
- Original animated template graphics rendered by Remotion at 720×1280, 30 fps.
- Scene captions shown during each scene's actual narration; these are not word-level Whisper captions.
- No LLM, image/video generation API, stock search, credentials, paid fallback, or upload to a social platform.

SHA-256 pins admit only the reviewed English preset and visual source. Changing the script or visual source stops execution until the edited content is reviewed as English and its corresponding pin updated. This does not replace the existing paid pipeline's semantic English review. Arbitrary-topic generation is not implemented in free mode.

## Run in GitHub
Actions → FREE English pilot → Run workflow. No API key or charge acknowledgement is needed. Adding/updating this workflow also runs a fixture render as an integration check. Download the free-english-pilot artifact after success. Files are retained seven days. Standard public-repository runners have free compute; hosted-service policies and storage limits still apply. For ongoing production, use your own machine rather than assuming unlimited hosted capacity.

## Run on a desktop
Requires Node 24 and pnpm 11. Install with `pnpm install --frozen-lockfile`; if optional GPU binaries cannot download, use `ONNXRUNTIME_NODE_INSTALL=skip ONNXRUNTIME_NODE_INSTALL_CUDA=skip pnpm install --frozen-lockfile`.

```bash
node scripts/free-pilot.mjs --check
node --test src/free-pilot/policy.test.mjs
node scripts/free-pilot.mjs
```

The first render downloads the local voice model and Remotion browser. Internet access is required for those downloads. Output: `output/free-pilot/pilot.mp4`, `preview.png`, `pilot.json` and `report.json`. Review the narration, captions, legibility and complete MP4 before posting. CPU work, disk storage and internet are still required, even with no API bill.

## Scope and next step
This pilot validates local narration and rendering. It uses graphics instead of stock footage, so no new account is needed. Broader topics need a free script process, English review, and optional Pexels footage with licensing review. Automatically publishing to YouTube/Instagram is a separate integration. Do not claim earnings or monetization eligibility from this technical pilot.

## Voice revision
See [VOICE_AND_MONETIZATION_RESEARCH.md](VOICE_AND_MONETIZATION_RESEARCH.md) for sources, monetization evidence limits and the controlled voice comparison. The revised narration is manually reviewed English; changing it requires a new review and checksum.

Voice comparison exports now include MP3 versions for broader player compatibility. The original WAV samples use 32-bit float audio and some players may not open them. A compatible revised opening is committed at `examples/free-pilot/energetic-opening.mp3`. Local rendering now also requires ffmpeg on PATH (for example, `brew install ffmpeg` on macOS).

## Visual demonstration
The five scenes show a fictional meeting: Alex sends the draft by Friday, Sam reviews the budget with no stated deadline, and a demo must be booked by Monday with no stated owner. The exact prompt requires English, extraction only from notes, and “Not specified” for gaps. Tables preserve both missing fields; no team confirmation is invented. These are original illustrative graphics, not an actual model response. The renderer exports review-scene-1.png through review-scene-5.png for layout review, alongside the complete MP4.
