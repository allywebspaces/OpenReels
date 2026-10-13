# Voice and monetization comparison — 12 October 2026

## Decision
Test a slightly livelier free voice: local Kokoro `af_bella`, speed `1.1`. Shorten the narration and open with a recognizable problem: “Your meeting ended. But who is doing what?” Keep the English-only fixture pin, no paid API calls, and no voice cloning. This is an editorial hypothesis, not a proven retention improvement.

## Evidence standard and scope
Compare English AI/productivity education businesses serving working professionals. Three creators below have first-party monetization evidence. They are adjacent benchmarks, mostly built around long-form education; this is not proof that an automated Shorts-only channel will earn the same way.

Research inspected creator websites, video/article listings, media kits and sponsorship storefronts. It did not independently audit their finances, watch/listen to complete videos, or obtain private retention analytics. Accordingly, findings about title promises and business models are grounded; vocal energy, words-per-minute and causal retention comparisons are unmeasured. No vidIQ credits, paid media analysis or paid API generation were used.

## Comparison
| Creator | Concrete reference | Monetization evidence | Transferable lesson for our pilot |
|---|---|---|---|
| Jeff Su | AI library includes “ChatGPT: Get better answers with this 3-sentence prompt” (18 September 2026) and “Mastering the Perfect Prompt Formula” | Creator storefront lists past partnerships including Notion, Grammarly, Dropbox and Google, plus a $27,500 advertised video integration. This is a rate card and creator-reported partnership history, not verified income per video. | Promise one useful outcome and give a reusable prompt. Our pilot should show action, owner and deadline rather than generic AI benefits. |
| Kevin Stratvert | “Your Meetings in Claude & ChatGPT: Granola Connectors”; practical software tutorial library | Official media kit lists past sponsors and $10,000+ advertised short-video packages. Updated August 1, 2026, it reports 4.39m YouTube subscribers. Rates are asking prices; completed deal revenue is private. | Match a specific workplace problem with clear steps and a result. A real before/after task-list demonstration would be the next visual improvement. |
| Ali Abdaal | “How I Make $4 Million Per Year — The CBM Framework”; productivity education | His March 23, 2023 article self-reports about $12,000 monthly YouTube AdSense then, excluding other YouTube-related income. Historical self-report; not today's income or Shorts-only earnings. | Treat useful content as an audience/business entry point. Income may involve products and sponsorships, not just views. We should validate usefulness before multiplying channels. |

## What this comparison does and does not establish
These creators show that AI/productivity education can support businesses, with sponsorship or ad-revenue evidence. Their established audiences, hosts, distribution and product offers differ greatly from our new faceless pilot. Revenue cannot be attributed to their voice alone. Avoid third-party earnings calculators as proof, and do not set our revenue expectations using their prices.

Our original pilot had 111 narrated words and a 44.48-second MP4: approximately 150 words per minute across the whole video, including pauses. That average is not especially slow. The weaknesses were an explanatory opening, long sentences, and limited variation. Increasing speed alone is not a complete solution.

## Changes being tested
- Voice: `af_heart` at 1.0 → `af_bella` at 1.1; these are licensed stock model voices, not copies of any creator.
- Script: shorter clauses, direct questions, clear outcome in the opening, and a practical save-the-prompt ending.
- Timing: recompute each scene from the new audio length; never cut narration to an arbitrary target.
- Visuals: retain the existing templates for a controlled first test. Scene captions remain sentence-level, not word-level transcription.
- English: manually reviewed revised preset; update its checksum. Arbitrary edits still fail closed.

Equal-text calm and energetic opening probes were generated locally (5.65 and 5.83 seconds respectively; voice differences mean the speed setting alone does not determine duration). The revised complete script has 81 words, down from 111. Generate the corresponding opening WAVs alongside the complete revised video for comparison; the wording is held constant so the voice/timing difference is easy to hear. Then render the complete revised pilot. Free local synthesis allows only limited prosody control; it cannot guarantee a human performer's emotional range.

## Acceptance and next test
Listen on a phone speaker and headphones: check intelligibility, no rushed words, comfortable volume and natural pauses. Watch the full new MP4 for readable captions and synchronization. Record the user's preference before standardizing the voice. Once a channel exists, compare matched topics using actual viewed-versus-swiped-away and retention; changing topic, visuals and voice together would prevent clean attribution. Do not publish until the user approves the output.

## Primary sources
- Jeff Su sponsorship storefront: https://www.passionfroot.me/jeffsu — accessed 12 October 2026.
- Jeff Su AI/video article catalog: https://www.jeffsu.org/tag/ai/ — accessed 12 October 2026.
- Kevin Stratvert official media kit: https://kevinstratvert.com/media-kit/ — audience figures labeled updated August 1, 2026.
- Kevin Stratvert tutorial catalog: https://kevinstratvert.com/tag/chatgpt-tutorial/ — accessed 12 October 2026; includes Granola tutorial in indexed prior catalog entries.
- Ali Abdaal revenue article: https://aliabdaal.com/business/how-i-make-27000-in-passive-income-every-week/ — published March 23, 2023.
- Ali Abdaal business video: https://aliabdaal.com/videos/how-i-make-4-million-per-year-the-cbm-framework — business-wide headline, not Shorts-only income.
- Kokoro model and voice samples: https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX and installed kokoro-js 1.2.1 documentation.

## Limits and remaining work
No actual Shorts earnings, same-format performance or causal voice effect has been established for these references. Detailed video/audio analysis and performance validation remain separate work; the current comparison should not be described as an end-to-end watch analysis. Production remains one reviewed preset. Stock footage, arbitrary-topic scripting, publishing and monetization are not yet implemented.

## Rendered outcome and committed deliverables
The revised free pilot completed successfully in GitHub run 38213658270: https://github.com/allywebspaces/OpenReels/actions/runs/38213658270. The composition is approximately 32.87 seconds (container duration may differ slightly), 720×1280 at 30 fps, with H.264 video and AAC audio. The first-scene preview was inspected for English legibility. Paid API calls: zero. Full listening/retention validation remains pending.

The permanent repository archive `examples/free-pilot/energetic-pilot-review.zip` contains the MP4, equal-text calm and energetic opening WAVs, preview, render props and report. Its SHA-256 is `58b45e54e5ba798db0850465ddcb12fe13dc58c678a91e11954002562fed1483`. It is independent of the workflow artifact expiration. Code, reviewed-script checksum and research sources are committed on `build/five-channel-starter`.
