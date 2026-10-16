# Project memory — read this first

Goal: establish original English micro-drama shorts first; user selected this focus on 14 October 2026.

| Entity | Retrieve when |
|---|---|
| OpenReels | Repository, branch and delegation scope |
| EnglishOnly | Script, captions or asset policy |
| FreeFirst | Rendering, provider or spending decisions |
| ApprovedVoice | Speech and review media |
| PilotEvidence | Prior renders and verification limits |
| Episode02 | Folded Notes archive, hashes and output-review limits |
| NextMilestone | Current task and immediate next action |
| MicroDramaFocus | First-channel choice, format and episode |

Current checkpoint (16 October 2026): second original pilot The Folded Notes rendered in free run38829602666 from b549d2d, decoded, hashes matched and 21 actual-MP4 frame samples inspected. Durable MP4/WAV/props/review: examples/micro-drama/episode-02-folded-notes/.465 software tests and TypeScript passed pre-render. No listening/final ASR/user approval/retention claim. Controlled episode-01 alternative and approved AAC unchanged. Qwen audition remains deferred after resource assessment. Next: third original English private twist pilot; do not rerender unchanged episodes. Preserve baseline. See PROJECT_STATE.json. No paid inference/social posting.

Retrieve a small slice:

```bash
npm ci --prefix tools/agent-memory --ignore-scripts
node tools/agent-memory/memory.mjs open ApprovedVoice
node tools/agent-memory/memory.mjs search deadline
```

Facts live in `project.jsonl`, a Git-backed knowledge graph. Every observation needs a date and source. Live source files and user corrections override stale memory. No match means unknown, not permission to guess. The wrapper caps each response at 6,000 UTF-8 bytes and reports omitted entities; refine the query if any are omitted. This is an output-size budget, not an exact tokenizer count or measured savings.

Memory is useful only when read and maintained. It cannot enlarge the model context window, guarantee recall or eliminate hallucinations. This project store is not global ChatGPT memory and is not a backup of all user conversations.
