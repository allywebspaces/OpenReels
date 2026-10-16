# The Folded Notes — episode 02 review copy

Original English emotional-drama pilot, created for pre-launch review. Not posted to a social channel or user-approved. Files in this GitHub repository are accessible according to the repository's visibility; “review copy” is not a promise of access-controlled hosting.

Source commit: [b549d2d](https://github.com/allywebspaces/OpenReels/commit/b549d2df72625bceca6884a19d29497ccc04f9d8). Successful free CPU render: [run 38829602666](https://github.com/allywebspaces/OpenReels/actions/runs/38829602666). Render finished 16 October 2026; downloaded artifact 12016627237, 10,009,030 bytes, ZIP SHA256 `4793868d921015e7aac1182abd395b6aa7249f8872508cd6e45ab1c928af6f9a`, independently matched before extraction.

## Verified output

- [Watch/download pilot.mp4](pilot.mp4): H.264/AAC, 720×1280, 30 fps; 1,202 composition frames / 40.0667 seconds, 40.128-second container. Size 2,853,508 bytes; SHA256 `7661beeefc86aae807ad1811a6e5564d6cb3e29f04e05b132aea7f0379ea626e`.
- Full FFmpeg decode passed on the runner and after download. Runner source, MP4 and five WAV hashes were independently rechecked. Local approved episode-01 and visual-alternative media hashes remain unchanged; preserved branch still points to `7d7224b67db3694dcd4b7f3708eff36c13621abf`.
- `render-props.json` preserves actual scene/clip cues; `assets/` preserves the five exact generated WAVs, avoiding future voice-model drift for visual replay. `render-report.json`, `ffprobe.json` and the original runner `SHA256SUMS` are retained as generated evidence. `ARCHIVE_SHA256SUMS` validates these files and all 21 MP4-extracted review JPEGs relative to this folder.
- Before rendering: 434 Vitest tests in 50 files + 31 Node tests = 465 software tests and TypeScript passed. Source review caught and corrected an early empty-box reveal; static timeline regressions cover it. Tests are not audience-quality evidence.

## Timestamped visual review — 16 October 2026

The lead opened 10 actual-MP4 JPEGs; a focused visual reviewer opened 11 further JPEGs. No observed clipping, overlap or non-English text in these samples. All images in `frames/` were extracted from the downloaded MP4, not standalone composition exports.

| Time / frames | Inspection result |
|---|---|
| 2.00s / 60 | Lunchbox and folded note are clear; opening caption readable on two lines. |
| 4.367–4.40s / 131, 132 | Clean first scene boundary; prior caption clears, drawer scene begins with English caption. |
| 9.033s / 271; 13.40–13.433s / 402, 403 | Folded-note drawer and subsequent years-later boundary readable, no text overlap. |
| 18.367–18.40s / 551, 552 | Closed lunchbox before “There was none”; empty interior appears exactly at the measured cue. |
| 19.967s / 599; 22.533–22.567s / 676, 677 | Death narration caption readable, then clean evening scene change. |
| 25.267–25.30s / 758, 759 | Folded notes first; unfolded paper with drawing appears at cue. Lower half remains blank. |
| 29.767–29.80s / 893, 894 | Pride line absent before cue, then “I am proud of you.” appears once, readable and unclipped on the paper. |
| 31.80–31.833s / 954, 955 | Pride line persists through evening ending, then does not leak into morning scene. |
| 37.667–37.70s / 1130, 1131 | No note before cue; folded note appears with the final sentence. |
| 39.767–40.033s / 1193, 1201 | Caption-free ending hold on lunchbox and note; no stray text. |

## Limits and editorial risks

This is sampled visual inspection, not every-frame playback or audio listening. English narration was reviewed in source and pinned before synthesis; final speech has not been independently transcribed or listened to. Clip boundaries are measured, but do not establish natural emphasis or word-level caption alignment. Stock Kokoro delivery may lack emotional acting. An FFmpeg volume probe measured mean −26.4 dB and peak −5.5 dB; these are not LUFS measurements or proof of phone-speaker audibility. Review on phone/headphones before publication. No audience testing, retention or earnings evidence exists.

The object-led illustrated format is intentionally modest, not live-action drama. The lead chose not to add an engagement question that would dilute the ending. This is an editorial decision, not evidence that the hook/pacing will succeed with viewers. No paid provider, soundtrack or real-person voice clone was used.

## Reproduce / visual replay

See [the run recipe](../../../docs/content-factory/EPISODE_02_RUN.md) for clean setup and normal fixed-preset regeneration. After locked dependency setup and FFmpeg, verify the archive from this folder:

```bash
sha256sum -c ARCHIVE_SHA256SUMS
```

For a visual replay without another TTS generation, from repository root first run the source gate, then use the saved props and audio:

```bash
node scripts/free-pilot.mjs --preset emotional-drama --check
pnpm exec remotion render src/free-pilot/emotional-drama/Root.tsx FreeEnglishPilot output/emotional-drama-replay.mp4 --props=examples/micro-drama/episode-02-folded-notes/render-props.json --public-dir=examples/micro-drama/episode-02-folded-notes/assets --concurrency=2
```

The replay command is prepared, not separately executed here. Use the demonstrated GitHub environment if local Remotion fails on `os.networkInterfaces`; two prior local attempts already exhausted that failure. Encoding/browser changes can change MP4 bytes. The archived MP4 is the verified output. No arbitrary-topic automation is claimed.
