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

Current checkpoint (14 October 2026): user wants video quality research before channel creation; channel setup and publication are on hold. Reviewed 12 improvement/generation repositories and inspected three cloned review tools. Findings in VIDEO_IMPROVEMENT_RESEARCH.md: keep OpenReels; evaluate structured review, expressive speech and caption alignment. Gemini/Bailian reviewers depend on hosted inference; local Qwen models need hardware validation. No new tools/models installed or executed. Next: review packet and controlled private pilot improvements. Approved episode preserved; name recommendation remains provisional.

Retrieve a small slice:

```bash
npm ci --prefix tools/agent-memory --ignore-scripts
node tools/agent-memory/memory.mjs open ApprovedVoice
node tools/agent-memory/memory.mjs search deadline
```

Facts live in `project.jsonl`, a Git-backed knowledge graph. Every observation needs a date and source. Live source files and user corrections override stale memory. No match means unknown, not permission to guess. The wrapper caps each response at 6,000 UTF-8 bytes and reports omitted entities; refine the query if any are omitted. This is an output-size budget, not an exact tokenizer count or measured savings.

Memory is useful only when read and maintained. It cannot enlarge the model context window, guarantee recall or eliminate hallucinations. This project store is not global ChatGPT memory and is not a backup of all user conversations.
