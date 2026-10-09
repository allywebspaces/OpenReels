# OpenReels project guidance

All generated content must be English. Preserve the shared English-only policy and blocking language review before asset generation, including replay runs.

## Installed development skills

- Read `.agents/skills/remotion-best-practices/SKILL.md` for compositions, captions, animation, audio/video handling, preview and rendering. Load only the linked guide needed for the task.
- Read `.agents/skills/vercel-react-best-practices/SKILL.md` for React UI work, async data loading, bundle size and rendering performance. Apply React/Vite guidance to the web app; Next.js-only rules do not apply.
- Check the installed package versions before using APIs from these skills. The Remotion guide describes 4.0.534; this project includes packages pinned to 4.0.441. Do not upgrade dependencies implicitly.
- Keep the existing Google/fal providers unless a task calls for changing them. Skill examples using other paid providers do not authorize purchases or generation.

Source repository and pinned commit metadata accompany each skill in SOURCE.json. These are project-local development instructions, not runtime dependencies or new generation capabilities.
