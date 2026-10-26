# Project memory — read this first

27 October checkpoint: entire-video watermark export implemented via scripts/brand-video.py and wired after free-pilot rendering; separate pilot-branded.mp4 keeps original. Full episode01 export decoded,1392 frames/AAC preserved,six actual frames inspected. See WATERMARK_EXPORT.md. n8n/account/Drive publishing integration remains pending; schedule paused.

Goal: establish original English micro-drama shorts first; user selected this focus on 14 October 2026.

Continuation checkpoint (19 October India): the user-approved 12.83-second character-reaction format test is implemented, rendered, fully decoded and sampled at14 actual encoded frames. Same narration PCM excerpt; encoded control/candidate AAC identical, re-encoded from original. Caption cut-boundary defect fixed with frame-based drawtext and regression coverage. Host ImageGen artwork plus camera moves, not acted footage. See REACTION_ANIMATIC_REVIEW.md. Original media/baseline intact; no paid project provider call or publication, schedule stays paused. Next: subjective viewing before expansion; listening remains unverified.

Latest user direction (19 October 2026 India): diagnose the completed videos using six supplied Video QA references. An original local evidence viewer is implemented and exercised on all three unchanged MP4s. See VIDEO_QA_INTEGRATION.md and VIDEO_QA_VALIDATION.md. No upstream apps installed/copied, ASR/AI-QA run or complete listening performed. Browser smoke testing is blocked by absent Chromium. The next step is a browser watch with sound and timestamped issues. Original three-pilot acceptance remains met and scheduled continuation remains paused. This new instruction authorizes the bounded review-tool milestone, not paid inference or publication.

| Entity | Retrieve when |
|---|---|
| OpenReels | Repository, branch and delegation scope |
| EnglishOnly | Script, captions or asset policy |
| FreeFirst | Rendering, provider or spending decisions |
| ApprovedVoice | Speech and review media |
| PilotEvidence | Prior renders and verification limits |
| Episode02 | Folded Notes archive, hashes and output-review limits |
| Episode03 | Waiting Room archive, hashes and output-review limits |
| NextMilestone | Current task and immediate next action |
| MicroDramaFocus | First-channel choice, format and episode |

Current checkpoint (16 October 2026): three original English pilots rendered/decoded and sampled visually; target ready_for_review. Episode03 The Waiting Room: sourced07fe39, run38845440707,18 actual-MP4 frame samples; MP4/exact WAVs/props/review archived under examples/micro-drama/episode-03-waiting-room/.474 software tests and TypeScript passed. See PRIVATE_PILOT_REVIEW.md for all three videos and acceptance. No new listening/final ASR/user approval/retention claim; prop-only art limits explicit. Approved episode01/candidate and baseline preserved. Stop feature expansion and pause continuation; if confirmation pending, finish only that checkpoint. Do not create more content automatically. Optional Qwen/word alignment remain deferred; no paid inference/social posting.

Retrieve a small slice:

```bash
npm ci --prefix tools/agent-memory --ignore-scripts
node tools/agent-memory/memory.mjs open ApprovedVoice
node tools/agent-memory/memory.mjs search deadline
```

Facts live in `project.jsonl`, a Git-backed knowledge graph. Every observation needs a date and source. Live source files and user corrections override stale memory. No match means unknown, not permission to guess. The wrapper caps each response at 6,000 UTF-8 bytes and reports omitted entities; refine the query if any are omitted. This is an output-size budget, not an exact tokenizer count or measured savings.

Memory is useful only when read and maintained. It cannot enlarge the model context window, guarantee recall or eliminate hallucinations. This project store is not global ChatGPT memory and is not a backup of all user conversations.
