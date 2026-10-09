# Five-channel starter — build plan

Approved direction: use tsensei/OpenReels to initiate the five-channel Shorts/Reels factory. Start by validating one complete Short; avoid rebuilding the rendering engine.

## Scope of this milestone
Adapt existing CLI interfaces with five creative briefs and an offline-by-default launcher. Keep upstream providers, renderer, critic and web UI intact. Use Google LLM/image/TTS initially; bundled music; generated video off unless explicitly selected. All five channels are English-only by explicit user instruction. Kids Universe and Micro Drama remain experimental until age suitability and character consistency checks pass.

## Implementation
1. Clone upstream at edc1c973634a3e179a527d00857b85de7b52a1dd into an isolated checkout and create build/five-channel-starter.
2. Add channels/catalog.json and five Markdown direction briefs (each below upstream's 10 KB limit).
3. Add scripts/channel.mjs: list profiles, validate inputs, print an offline command plan, execute only with --run; pass arguments without shell interpolation. Keep upstream cost confirmation; never inject --yes.
4. Verify profiles, command routing and shell-safe topic handling. Install locked dependencies, run upstream tests, typecheck and builds. Record failures honestly.
5. Commit locally and provide a handoff. Publishing to an owned GitHub repository remains pending until a writable fork exists.

## Acceptance and limits
No network or charges from default launcher invocation. Outputs separated by channel/platform. Explicit --mode plan means upstream research/director execution, which can cost money. No claim of a rendered sample until an actual MP4 is generated and inspected. No scheduler, publishing integration, monetization tracker or automated feedback loop in this milestone.

## Next milestone
Configure Google API access locally, generate one English pilot, measure duration/resolution/audio/captions, and visually review it. Validate English narration and every visible text element before public release. Only then add channel publishing credentials and scheduling.
