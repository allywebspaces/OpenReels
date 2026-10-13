# OpenReels project guidance

All generated content must be English. Preserve the shared English-only policy and blocking language review before asset generation, including replay runs.

## Resume and delegate

- Read `docs/content-factory/memory/INDEX.md` first. Retrieve only the entities relevant to the task with `node tools/agent-memory/memory.mjs search <query>` or `open <entity-name>`. Install the separate tool with `npm ci --prefix tools/agent-memory --ignore-scripts` if needed. Do not inject the entire graph or transcript into every agent.
- Follow `docs/content-factory/AGENT_WORKFLOW.md`. Use host-native agents and available Superpowers skills; a clone does not install a plugin into ChatGPT. When delegation is available, pass a small task brief with explicit file ownership, constraints and evidence required, rather than the complete conversation.
- Continue authorized, reversible build work, checks and commits without routine permission questions. Ask only for a missing material decision, user-only authentication, new spending, public publishing or destructive action outside the agreed scope. Do not run the paid workflow under the free-first task.
- Before ending a task, update the compact checkpoint and relevant memory facts with dated sources and actual verification evidence. Remove superseded observations instead of keeping contradictory facts. Never store credentials, personal health/financial details or unrelated conversations in this public repository.

## Installed development skills

- Read `.agents/skills/remotion-best-practices/SKILL.md` for compositions, captions, animation, audio/video handling, preview and rendering. Load only the linked guide needed for the task.
- Read `.agents/skills/vercel-react-best-practices/SKILL.md` for React UI work, async data loading, bundle size and rendering performance. Apply React/Vite guidance to the web app; Next.js-only rules do not apply.
- Check the installed package versions before using APIs from these skills. The Remotion guide describes 4.0.534; this project includes packages pinned to 4.0.441. Do not upgrade dependencies implicitly.
- Keep the existing Google/fal providers unless a task calls for changing them. Skill examples using other paid providers do not authorize purchases or generation.

Source repository and pinned commit metadata accompany each skill in SOURCE.json. These are project-local development instructions, not runtime dependencies or new generation capabilities.
