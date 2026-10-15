# Project memory — read this first

Goal: establish original English micro-drama shorts first; user selected this focus on 14 October 2026.

| Entity | Retrieve when |
|---|---|
| OpenReels | Repository, branch and delegation scope |
| EnglishOnly | Script, captions or asset policy |
| FreeFirst | Rendering, provider or spending decisions |
| ApprovedVoice | Speech and review media |
| PilotEvidence | Prior renders and verification limits |
| NextMilestone | Current task and immediate next action |
| MicroDramaFocus | First-channel choice, format and episode |

Current checkpoint (16 October 2026): architecture audited against source commit 7768748 and live GitHub branches. Read ARCHITECTURE_HANDOVER.md and AUDIT_EVIDENCE.json first. Verified two fixed-preset renderer routes; general paid/web pipeline not demonstrated end to end. Existing critic grades plan JSON, not MP4. Fresh 454 software tests, TypeScript, preset check and existing MP4 decode passed; no fresh render. Experiment has no video/code upgrades yet. Prior experiment local path was absent; GitHub checkpoint survives and audit checkout restored. Memory is explicit curated retrieval, not hallucination prevention. Next: timestamped quality review, then a controlled alternative; no channel setup or paid inference.

Retrieve a small slice:

```bash
npm ci --prefix tools/agent-memory --ignore-scripts
node tools/agent-memory/memory.mjs open ApprovedVoice
node tools/agent-memory/memory.mjs search deadline
```

Facts live in `project.jsonl`, a Git-backed knowledge graph. Every observation needs a date and source. Live source files and user corrections override stale memory. No match means unknown, not permission to guess. The wrapper caps each response at 6,000 UTF-8 bytes and reports omitted entities; refine the query if any are omitted. This is an output-size budget, not an exact tokenizer count or measured savings.

Memory is useful only when read and maintained. It cannot enlarge the model context window, guarantee recall or eliminate hallucinations. This project store is not global ChatGPT memory and is not a backup of all user conversations.
