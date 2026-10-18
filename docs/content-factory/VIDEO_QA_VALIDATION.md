# Video review validation checkpoint

18 October 2026 UTC / 19 October India. Repository source before this milestone: `575f3d9eaf91402ef36adf309845fd03ca90bd3a`. The original media and preserved branch have not been changed. No video render or speech generation occurred in this milestone.

## Actual execution

Generated three packs from the archived original MP4s, including intended props. Each contains a byte-identical MP4 copy, a strict FFmpeg full-decode result, extracted mono audio, actual thumbnail files with hashes, generator/template hashes, a manifest and an interactive review page. The generated media is available in the downloadable review bundle; the manifests are retained under `examples/video-qa/`. These are evidence packs, not three new pilots.

| Episode | MP4 SHA256 | Requested frame samples | Container duration |
|---|---|---:|---:|
| The Message at Midnight | `9b438dff1eece70ea902c04921d6bdca61c90815288cc587bfb2ea6f2a3053c7` | 136 | 46.464s |
| The Folded Notes | `7661beeefc86aae807ad1811a6e5564d6cb3e29f04e05b132aea7f0379ea626e` | 109 | 40.128s |
| The Waiting Room | `f378ccd089e30313dd3273bb10bc4add5a0afebc6926221aed46c98ef3511469` | 95 | 38.186667s |

The pack generation extracted **340 samples**. This is not 340 inspected frames. This turn visually inspected one contact sheet containing **nine** earlier grid/cue samples: 0/24/46s for episode01, 0/20/40s for episode02, and 0/18.633/38s for episode03. Those preliminary pack samples came from the same SHA-matched videos. No complete viewing, listening, OCR, transcription, audience test or automatic creative evaluator ran. All final-pack manifests retain listening/visual-review/AI-QA completion as false.

## Initial visual hypotheses, not a completed creative verdict

| Sample | Observation from actual image | Controlled change worth evaluating |
|---|---|---|
| Episode01, 46s | The ending question appears prominently and again in the lower caption, with other overlays still present. | Compare the existing visual-only alternative, which was intended to reduce this duplication. Keep the approved narration. Do not label the old baseline duplication a newly discovered renderer regression. |
| Episode02, 20s | A caption about the father's death sits below an empty illustrated lunchbox. No human reaction is depicted. | Test whether a visible character reaction or a more expressive visual beat carries emotion better than props alone. Listening is required before judging the voice. |
| Episode03, 18.633s and 38s | The reveal is represented by a founder badge and the ending by a notebook with a question, rather than people interacting. | Evaluate whether character interaction is needed for this story. The known ending paraphrase remains an editorial choice, not a proven transcription error. |

The common concern is a format hypothesis: narrated illustrations may feel different from acted micro-drama. The samples establish what is visible, not why the user dislikes it or whether changing it increases retention. A full watch with sound should resolve voice, pause and motivation questions before regenerating anything.

## Software checks actually performed

- New Python/FFmpeg suite: **10 tests passed**. Uses real synthetic MP4s, not provider mocks. Covers successful evidence generation, absolute intended cues, explicit English transcript declaration, invalid timing, safe exact JSON embedding, no overwrite, audio-tail sampling, silent media and invalid media. Initial tests failed before implementation; audio-tail regression failed against the first implementation and passed after the root-cause fix.
- Existing project suite: **439 Vitest tests across 51 files passed** using the already installed dependency tree through temporary symlinks. Expected mock-provider warning/error logs were emitted by existing tests. No live provider call was made.
- Existing Node suites: **35 tests passed** (23 workflow/policy/speech/memory tests plus 12 visual/emotional/twist preset tests). The first memory-suite attempt failed because its separately installed dependency was not linked into this isolated checkout. Linking the existing memory dependency tree resolved that setup failure. No package upgrade/install was performed.
- TypeScript `--noEmit`: passed. Approved free-preset `--check`: passed with zero API calls. No renderer source, language allowlist pin or generated voice was modified.
- Focused independent code review identified decode-error handling and missing-audio UI handling; both were addressed. Full decode uses `-xerror` and rejects error-level stderr. Silent-video controls/downloads are hidden and explicitly marked unavailable.
- A browser smoke-test probe was prepared for local playback metadata, search, seeking, note export and a 390px viewport. **It did not run:** the available Playwright module has no installed Chromium/headless-shell executable. No browser binary was downloaded. Therefore layout, actual browser playback, seeking, download behavior and phone responsiveness remain unverified. Unit tests are not a substitute for these checks.

The tests are software checks, not a total quality score. Do not combine their count with the extracted-frame count as if they measured audience quality.

## Source and inference boundaries

All six user-supplied entries were inspected and dispositioned in VIDEO_QA_INTEGRATION.md and `tools/video-review/SOURCES.json`. No upstream application was installed or copied. The first three repository trees have no detected LICENSE; research references and general ideas are retained separately. No Whisper model, Gemini/Vertex/OpenAI/AssemblyAI key, vector database, research dataset or CUDA environment was used.

No new scheduled task was created or enabled. Next action is a complete local browser watch with sound and timestamped observations. The current host cannot perform that browser/listening validation. Further model/provider integration is deferred until its need, licensing, local feasibility and cost authorization are established.
