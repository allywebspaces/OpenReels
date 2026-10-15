# OpenReels — five-channel starter

This is an adaptation of OpenReels. Current focus: a fixed, reviewed English micro-drama prototype; channel creation is on hold. Read [ARCHITECTURE_HANDOVER.md](ARCHITECTURE_HANDOVER.md) first for audited scope and corrections. The preserved baseline is build/five-channel-starter; ongoing experiments belong on experiment/video-quality. Channel names are provisional and no social accounts are registered by this project.

For an agent resuming the build, read [memory/INDEX.md](memory/INDEX.md) and [AGENT_WORKFLOW.md](AGENT_WORKFLOW.md) first. The current default is the free preset described in [FREE_PILOT.md](FREE_PILOT.md); the provider setup below is only for explicitly authorized paid modes.

## Setup
Requires Node.js 22+, pnpm and ffprobe. Docker is optional for CLI use; Docker Compose is required for the supplied Redis/API/worker web stack. The build environment used Node 24 and pnpm 11. The workspace build policy now supports pnpm 11 while preserving upstream's allowed native packages.

```bash
pnpm install --frozen-lockfile
# CPU-only setup if optional ONNX GPU downloads fail:
# ONNXRUNTIME_NODE_INSTALL=skip ONNXRUNTIME_NODE_INSTALL_CUDA=skip pnpm install --frozen-lockfile
cp .env.example .env
```
Add GOOGLE_API_KEY to your local .env. For Kling, also add FAL_API_KEY (fal.ai API billing). Do not paste keys into chat or commit .env. A consumer Google/Kling subscription is not proof of API credits/access. The launcher checks presence, not validity, of keys.

## Free offline preview
```bash
node scripts/channel.mjs --list
node scripts/channel.mjs ai-money-india "Turn messy meeting notes into a clear action list"
```
This prints the exact argument array and does not call an AI service.

## Execute research and script only — may incur charges
```bash
node scripts/channel.mjs ai-money-india "Turn messy meeting notes into a clear action list" --mode plan --run
```
Upstream --dry-run still calls the research/director/critic models. It is not a free offline test. Research and script work happens before the upstream asset-cost confirmation prompt.

## Generate a pilot — may incur charges
```bash
node scripts/channel.mjs ai-money-india "Turn messy meeting notes into a clear action list" --run
```
Default: Google LLM, Gemini images/TTS, bundled music, no generated video. Still images/LLM/TTS can cost money. Stock requires optional Pexels/Pixabay keys. Upstream can fall back to paid image generation. Cost confirmation is an estimate, not a hard cap.

Optional Veo or Kling:
```bash
node scripts/channel.mjs micro-drama "A sealed letter arrives twenty years late" --video veo --run
node scripts/channel.mjs micro-drama "A sealed letter arrives twenty years late" --video kling --platform instagram --run
```
Platform selects render configuration only: this does not upload to Instagram or YouTube. Outputs are under output/<channel>/<platform>/.

## Channels
| ID | Brief | Readiness |
|---|---|---|
| ai-money-india | Practical AI workflows; no income promises | English pilot candidate |
| silver-life-india | Digital literacy for seniors | English, source and accessibility review needed |
| kids-universe | Original English educational stories | Experimental: child-audience handling and character consistency need validation |
| india-explained | Researched evergreen explainers | English, source review needed |
| micro-drama | Original narrated mysteries | Experimental: character consistency and scene quality need validation |

Briefs guide the model; they do not enforce timing, facts or consistency. All narration, dialogue, captions, titles, descriptions and on-screen text must be English. No bilingual or transliterated non-English dialogue. No publication should occur before actual output review.

## Review checklist
- Verify claims against original sources and inspect all visual assets/licences.
- Watch the complete MP4: hook, pacing, captions, pronunciation, audio and continuity.
- Confirm portrait dimensions, measured duration and no black frames/cut-off text.
- Check required synthetic-media and child-audience platform settings before upload.
- Record actual cost and results; no guaranteed revenue or monetization eligibility.

## Verification
```bash
node --test scripts/channel.test.mjs
pnpm test
pnpm typecheck
pnpm build
pnpm --dir web build
```
The upstream critic grades the plan. It does not replace finished-video inspection.

## GitHub handoff
The build is on branch `build/five-channel-starter` in https://github.com/allywebspaces/OpenReels.
```bash
git clone --branch build/five-channel-starter https://github.com/allywebspaces/OpenReels.git
cd OpenReels
```
The upstream project is tsensei/OpenReels. Submit project changes to the allywebspaces fork.

## Enforced English-only policy
- All five profiles require English. Kids Universe replaces the previous Marathi concept.
- Every LLM agent receives the English-only project policy, including generation and revision.
- The shared pipeline checks the final score before audio/visual generation for both new jobs and replayed scores. It rejects non-Latin text and asks the model to check English semantics, including French or transliterated dialogue.
- Rejection, uncertainty, malformed responses or reviewer failure stop the pipeline. This review adds an LLM call and can incur charges even for replay or planning. Its token usage is included in full-run actual-cost accounting; upstream estimates may not include this extra call.
- This gate checks planned text, not generated pixels/audio. AI reviewers can err, and images/video can contain incidental writing or speech. Human review of the finished MP4 is still required before publication.

## Run from desktop or phone using GitHub Actions
Save `GOOGLE_API_KEY` under Settings → Secrets and variables → Actions → New repository secret.
Open Actions → English pilot → Run workflow. The workflow checks out a verified build commit.
- Start with `mode: check`, leaving charge acknowledgement blank. It verifies secret presence and the offline launcher without API calls. It cannot validate key permissions, quota or billing.
- For script only, select `plan`; for a portrait MP4 with still images and English narration, select `render`. Both can incur API charges. Type `I_APPROVE_API_CHARGES` into the acknowledgement field to authorize that run. This explicitly enables the CLI's noninteractive confirmation.
- The first pilot is AI Money India, using Google, bundled music, no generated Veo/Kling clips and no social publishing.
- Download outputs from the run's Artifacts section, retained for seven days. Inspect the full MP4 and actual cost report.
The 30-minute timeout is an execution limit, not a spending cap. Updating the build requires updating the checkout SHA in the workflow.

## Free alternative (no generation API charges)
Use **FREE English pilot**, described in [FREE_PILOT.md](FREE_PILOT.md). It renders a fixed reviewed English script using local Kokoro and template graphics. It requires no GOOGLE_API_KEY and cannot fall back to a paid provider. The earlier **English pilot** workflow remains the explicitly paid option; it is not the free workflow.
