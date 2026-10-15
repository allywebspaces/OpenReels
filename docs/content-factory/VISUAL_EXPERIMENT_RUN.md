# Controlled visual alternative — execution record

## Implemented

Separate composition: src/free-pilot/visual-experiment/Root.tsx, id MicroDramaVisualExperiment. Reduced opening decoration and larger warning; larger full-context photo with cue-bound picture/slipper outlines; closing question once in caption area. Baseline files are unchanged.

New renderer scripts/visual-experiment.mjs uses archived props and the approved MP4. It does not call TTS or model/provider services. It renders silent visuals, stream-copies the approved AAC, compares hashes of both extracted ADTS streams, decodes the candidate and records metadata/hashes. No AAC re-encoding is performed. The policy rejects changed Root, props or approved MP4 before browser/download work; reviewed.json pins those files. Check mode makes no model/browser calls.

## Local verification

431 Vitest tests, 22 Node launcher/renderer-policy/speech tests, 5 memory tests and TypeScript passed (458 software tests total). New policy tests reject changed visual, props and audio-source bytes. These are not perceptual quality tests. No new dependencies or provider credentials were needed; existing installed dependencies were reused.

Chrome Headless Shell downloaded and started successfully. Full local rendering failed at Remotion getPortConfig -> os.networkInterfaces with ERR_SYSTEM_ERROR / uv_interface_addresses. An attempted external localhost bundle server still reached the same internal proxy-server path. Two failed attempts were recorded; the unsuccessful custom-server code was removed. No finished local candidate output is claimed.

## Render fallback

.github/workflows/visual-experiment.yml runs only on experiment/video-quality source/workflow changes or manual dispatch. It checks reviewed hashes, types and tests before rendering on Ubuntu. No model/provider secrets are used. The preserved baseline branch and main's pinned free workflow are unchanged. This job is a finite render, not a general autonomous content generator. Actual workflow success, audio identity, decode and frame inspection must be recorded before completion.

## Pending output checks

Inspect exported frames 0,120,121,196; 519,520,560; 576,577,620; 1327,1338. Check no premature warning/highlights/question, no clipping, one final question, full-context photo. Archive candidate MP4/report plus selected evidence and source hashes in examples/micro-drama/episode-01-visual-experiment/. Record sampling limits and no new listening/retention assessment.
