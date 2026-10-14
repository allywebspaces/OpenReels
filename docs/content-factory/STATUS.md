# Build status — 14 October 2026

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

## Voice revision and research completed
- User requested more energetic narration. Reviewed three adjacent education creators using primary monetization sources; distinguish historical self-reports and sponsorship rate cards from audited earnings.
- Revised preset: 81 words, local af_bella voice at 1.1 speed, stronger opening and shorter sentences. Keep the English checksum guard and no paid fallback.
- Run 38213658270 succeeded: https://github.com/allywebspaces/OpenReels/actions/runs/38213658270.
- New composition: approximately 32.87 seconds, 720×1280, H.264/AAC; preview inspected. User approved the energetic opening on 13 October 2026; complete video review remains pending.
- Permanent video/voice comparison package: examples/free-pilot/energetic-pilot-review.zip.
- Sources, methodology, limits and voice comparison: docs/content-factory/VOICE_AND_MONETIZATION_RESEARCH.md.

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
User wants video quality improvements before channel creation. Channel setup and publication are on hold. Research of 12 repositories and inspection of three cloned review candidates is documented in VIDEO_IMPROVEMENT_RESEARCH.md. Recommendation: retain OpenReels and evaluate a structured review packet, caption alignment and a short expressive-voice comparison after hardware validation. No new tool installed, provider call made or MP4 modified. Name remains provisional.

## Agent workflow and project memory — 13 October 2026
- Added lead/builder/researcher/reviewer workflow in AGENT_WORKFLOW.md and resume guidance in AGENTS.md. Superpowers skills are available in this host; this is not a separately hosted or scheduled agent service.
- Installed official @modelcontextprotocol/server-memory 1.0.0 with SDK 1.31.0 in tools/agent-memory, separately from video dependencies, with npm lockfile and install scripts disabled.
- Project-only sourced facts live in memory/project.jsonl, with a compact INDEX.md. The real stdio MCP server is callable through the local retrieval wrapper; no global ChatGPT connector was installed and no account-wide history was imported.
- Wrapper refuses empty search, reports missing matches and caps complete JSON responses at 6,000 bytes. No model/embedding service, API key or paid inference call is used. Unlimited memory, guaranteed recall and measured token savings are not claimed.
- Fresh verification: 5 real-server memory tests, 431 Vitest tests, 12 existing Node tests and TypeScript passed. Existing provider-failure test logs and pnpm configuration warnings remain; no failing tests.

## Visual pilot completed — 13 October 2026
- Free run 38367456660 succeeded from build 031534686e25e453de18ad2cde7dde180d4bf205: https://github.com/allywebspaces/OpenReels/actions/runs/38367456660.
- Added clearly fictional notes, exact English extraction prompt, missing-field table, source verification and final action list. No missing owner/deadline is invented. Narration and approved voice remain unchanged.
- SHA256 pins now protect both script JSON and visual source before model downloads. Unreviewed visual text regression test passed.
- Inspected all five rendered scene stills: English text legible, no clipping/overlap. H264/AAC 720x1280, approximately 33 seconds; complete MP4 decode passed. No claim of complete human listening or retention testing.
- Fresh checks: 431 Vitest tests, 18 Node tests (including policy and memory), TypeScript and offline free check passed. No paid API calls; no social publication.
- Durable MP4, five review PNGs, props and report: examples/free-pilot/visual-demo/. GitHub main now pins this build in the FREE English pilot workflow. The separate upstream main CI/Docker workflows were already failing and are not part of this successful free render.

## First micro-drama — 14 October 2026
- Added separate reviewed micro-drama preset; default local productivity invocation remains available. New CLI: node scripts/free-pilot.mjs --preset micro-drama. Unknown presets fail before model downloads.
- Original five-scene mystery The Message at Midnight, with procedural phone, hallway, matching photo clue and clock-reset payoff. Clearly labelled Original Fiction. No external visual assets or actor generation; Midnight Stories is a provisional series label.
- Successful free run 38473576384 from source 7cb3fe7e63e820bb326f74b81a45e9e3450e9ab8: https://github.com/allywebspaces/OpenReels/actions/runs/38473576384. Approximately 37 seconds, 720x1280 H264/AAC.
- All five scene stills inspected for legibility and clipping; complete MP4 decode passed. Fresh 431 Vitest plus 20 Node tests and TypeScript passed. English script and visual checksum gates verified. Zero paid API calls, no public publication.
- Video, scene PNGs, props and report saved under examples/micro-drama/episode-01/. Original version superseded for approval by the revised episode below. Existing separate upstream main CI/Docker failures do not indicate failure of this successful free render.

## Question and frame review — 14 October 2026
- Agent Reach downloaded at94f06c1969dfc1834001269d79d3ad0972d9dee6. Its web/API-transcription tools do not perform local visual/prosody review; no installer, credentials or transcription executed. Source metadata is in tools/agent-reach/.
- Extracted all 1,106 original video frames; two agents inspected 0.5-second contact sheets, boundaries and selected full-resolution frames, not every frame manually. Found read-ahead captions, premature question/twist reveals, repeated knock pulses and a small photo clue. Complete frame manifest, all-frame thumbnail pack and findings are in examples/micro-drama/episode-01-frame-review/.
- Corrected sentence captions/reveals using measured audio cues, question arrival, three knock pulses, clue size and repeated-warning visual. Same af_bella voice; separate question at 1.0 with 550 ms preceding pause and reviewed primary stress on “you.” No artificial pitch shift or paid API.
- Local narration generation succeeded, but local Chromium startup failed with uv_interface_addresses. Free GitHub run 38528230169 succeeded instead. Revised episode 46.4 seconds, 720x1280 H264/AAC; full decode passed. All five scene stills and question-boundary images inspected.
- Fresh 431 Vitest  + 23 Node tests (454 total), TypeScript and reviewed-preset checks passed. User approved revised delivery and episode on 14 October 2026. Revised media and cue timeline: examples/micro-drama/episode-01-question-revision/.
