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

Current checkpoint (16 October 2026): controlled visual alternative archived with matching approved AAC, full decode and sampled MP4 review (run38816182643; 458 software tests previously passed). No new user approval/listening/retention claim. Expressive-voice feasibility assessed: 8 GiB cgroup limit, no exposed GPU observed, Python Qwen stack absent; audition deferred for resource risk, not benchmarked or proven impossible. See EXPRESSIVE_VOICE_FEASIBILITY.md. Next: second original English private pilot using existing Kokoro/free GitHub rendering; then third. Preserve approved episode/candidate and baseline. No paid inference/public posting.

Retrieve a small slice:

```bash
npm ci --prefix tools/agent-memory --ignore-scripts
node tools/agent-memory/memory.mjs open ApprovedVoice
node tools/agent-memory/memory.mjs search deadline
```

Facts live in `project.jsonl`, a Git-backed knowledge graph. Every observation needs a date and source. Live source files and user corrections override stale memory. No match means unknown, not permission to guess. The wrapper caps each response at 6,000 UTF-8 bytes and reports omitted entities; refine the query if any are omitted. This is an output-size budget, not an exact tokenizer count or measured savings.

Memory is useful only when read and maintained. It cannot enlarge the model context window, guarantee recall or eliminate hallucinations. This project store is not global ChatGPT memory and is not a backup of all user conversations.
