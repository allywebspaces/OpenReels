# Build status — 12 October 2026 (India)

## Implemented
- Upstream: tsensei/OpenReels at edc1c973634a3e179a527d00857b85de7b52a1dd.
- Repository: allywebspaces/OpenReels. Build branch: build/five-channel-starter.
- Five English-only channel briefs plus catalog and offline-by-default launcher.
- Shared English policy for all LLM agents; blocking semantic language review before assets on both generated and replayed scores. Kids Universe replaces the Marathi channel concept.
- Explicit YouTube/Instagram render target and optional Veo/Kling selection.
- Missing-key checks; no shell evaluation of topics; no automatic --yes.
- pnpm 11 dependency-build policy, setup instructions and documented constraints.

## Free pilot completed
- Added fixed, reviewed English preset with checksum enforcement; changed scripts are rejected before asset generation.
- Local Kokoro narration and original Remotion template graphics; no paid SDK calls, API secrets, or paid fallback.
- GitHub run 38178884652 succeeded: https://github.com/allywebspaces/OpenReels/actions/runs/38178884652.
- ffprobe verified H.264 video at 720×1280, AAC audio and 44.48 seconds. Preview inspected for readable English text.
- MP4 and report are in artifact free-english-pilot-38178884652, retained seven days; the MP4 is also handed to the user.
- Free mode currently supports only this preset, with scene captions; arbitrary topics, stock footage and word-level captions remain future work.
- 431 Vitest plus 12 Node tests passed (443 total); TypeScript check passed.

## Verified
- Native install completed using ONNXRUNTIME_NODE_INSTALL=skip and ONNXRUNTIME_NODE_INSTALL_CUDA=skip (optional extra GPU binary downloads unavailable through environment proxy).
- 431 Vitest tests passed across 49 files, including 8 English-policy unit/integration tests.
- 12 Node tests passed: 6 launcher, 3 manual-runner and 3 free-pilot policy tests.
- TypeScript typecheck passed.
- CLI build passed; web UI build passed with existing >500 KB chunk-size warning.
- Unit tests and builds do not prove remote provider or finished-video quality.

## Not completed
- No API-funded generation run or paid-provider quality review. A free preset MP4 is now available; full human audio/video review is pending.
- No Docker/Redis web stack execution; Docker is unavailable in this workspace.
- No real English audio/video quality review or consistent-character verification.
- No social channel creation, upload, scheduling, analytics or monetization integration.

## Next action
Watch the free pilot and review narration, captions and pacing before extending the free workflow. Actions → FREE English pilot reruns the preset without API keys. Code and setup notes are on build/five-channel-starter in https://github.com/allywebspaces/OpenReels. Do not use the older paid English pilot workflow when seeking free generation.
