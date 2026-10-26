# Entire-video channel watermark

27 October 2026. User requested the Midnight Stories Originals doorway/moon logo throughout edited Shorts and Reels.

`scripts/brand-video.py` applies a hash-checked transparent PNG from `assets/branding/watermark.json` to a separate MP4. JSON embeds the exact150x150 PNG losslessly in Base64 so the text-only GitHub interface can retain it. At720x1280 the overlay canvas is72px at x24,y280,65% opacity: below template titles in the left gutter. Transparent margins mean the visible symbol is smaller. No added narration, captions, music or model calls. AAC is copied unchanged. Refuses overwrite, non9:16 sources and nonAAC audio; validates dimensions, frame count/rate, audio hash and strict full decode. Output is re-encoded video; source remains unchanged.

`scripts/free-pilot.mjs` now calls this exporter after rendering, records `pilot-branded.mp4` as uploadFile, and preserves `pilot.mp4`. The recorded uploadFile is for future publishing integration; nothing uploads automatically. The current reaction-animatic recipe is not changed; apply this postprocessor explicitly if using another renderer.

```bash
python3 scripts/brand-video.py --input path/to/pilot.mp4 --output path/to/pilot-branded.mp4
```

Actual episode01 output:63fbb87296b8df91621e4e3fc5668ea081903d3be041e575053b6937a493bdc9,1392 frames, source9b438dff1eece70ea902c04921d6bdca61c90815288cc587bfb2ea6f2a3053c7. Full decode/frame-count/rate and identical AAC stream checks passed. Six actual output samples0,300,600,900,1200,1391 inspected: symbol present below titles and away from captions; proximity to some artwork borders is visible but no observed text obstruction. No full listening, phone-platform preview or audience-quality proof. Node syntax and Python compile checks passed. Full pipeline with fresh Kokoro/Remotion generation was not rerun. No paid providers, public uploads, new schedule or baseline changes.

Placement is template-specific and needs clearance review for character closeups or future layouts. Do not blindly apply it to unrelated footage. Use original master exports; avoid competing platform/app watermarks. No blanket guarantee of Instagram recommendation eligibility is made.

Policy references checked27 October: YouTube channel branding https://support.google.com/youtube/answer/10456525 ; YouTube AI disclosure https://support.google.com/youtube/answer/14328491 ; Meta AI disclosure https://about.fb.com/news/2024/02/labeling-ai-generated-images-on-facebook-instagram-and-threads/ . YouTube expressly supports channel watermark branding. AI disclosure and content eligibility require review per upload, especially realistic synthetic imagery/audio; a channel bio alone does not substitute for upload disclosure. Branding checks are not a complete rights, monetization or platform policy assessment.

Still pending for daily operation: fresh-story/asset generation, chosen n8n host, account OAuth connections, Drive folder/name/date archival, publish-state tracking/retries without duplicates, required disclosure settings, platform playback checks and end-to-end publishing test. No n8n runner exists in this checkpoint.
