# Episode01: original versus existing visual alternative

19 October 2026 India. User directed continuation after the actual-video QA integration. This milestone renders a comparison of two existing videos, not a new story, voice or creative alternative. It prevents repeating the already completed visual experiment.

## Actual outcome

`scripts/compare-reviewed-pilots.py` checks the pinned hashes of the approved MP4 and the existing candidate, checks that their encoded AAC streams are identical, and renders them side by side with English labels. Original video pixels are presented under a 64px label band. Output: H.264/AAC, 1440×1344, 30fps, 46.464 seconds. The original AAC is copied, not re-encoded. Both source MP4 hashes remain unchanged.

- Comparison SHA256: `21a5bc364ed8dadf764987fd8e65f39e2c864b1e917d301f5380d4f30d869b58`.
- Shared source/output encoded AAC (ADTS) SHA256: `1ef27a4437db92cae385763b67bb56fbf266c5f6d6fa1f8231eacaaed8a4493e`.
- Strict full decode completed successfully. Six actual comparison-MP4 samples were extracted and visually inspected.
- Manifest: `examples/video-qa/visual-comparison/manifest.json`. Source inputs remain in their original `examples/micro-drama/` folders.

The newly rendered comparison is delivered separately as `OpenReels_Visual_Comparison.mp4`. It is a review aid and has not replaced the approved pilot. Side-by-side playback on a small phone reduces apparent text size; judge readability using the individual originals too.

## Six sampled visual findings

| Requested time | Actual sampled comparison | Implication |
|---|---|---|
| 0s | Original has a large two-line title, location line and repeated footer. Candidate has a smaller title, larger phone and reduced footer decoration. | The candidate gives the dramatic object more space. No claim of a stronger audible hook. |
| 4.033s | Both show the warning and matching lower script caption; candidate phone/message is larger. | The warning is easier to locate at this sample. A single sample cannot prove absence before the cue. Prior boundary review remains the evidence for reveal ordering. |
| 17.333s | Candidate shows a larger hallway image with an outline around the crooked picture. | A visual aid directs attention to the spoken clue. No new voice or sound effect was added. |
| 19.233s | Candidate shows a larger hallway image and an outline around the slipper. | The intended clue occupies more visible area. Motion behavior between samples has not been fully inspected. |
| 44.267s | Original shows the closing question twice plus a lock-status overlay. Candidate shows one closing question and no redundant lock-status overlay. | Candidate reduces competing text at the decision beat. |
| 45.5s | The same ending difference persists: two questions in original, one in candidate. | This confirms the sampled layout improvement, not audience preference or comprehension. |

The candidate is the preferred **visual basis for a future test** because these samples reduce duplication and improve clue visibility. It remains user-unapproved. The deeper concern remains unresolved: both versions communicate mainly through props and narration, with no depicted human reaction. A short character-reaction visual audition with the same narration would test that format hypothesis more directly than installing additional transcript-chat applications. Such an audition is proposed, not implemented or rendered in this milestone.

No full playback/listening, emotional delivery assessment, ASR/OCR, retention measurement or monetization claim is made. Audio-stream equality is a preservation check, not a listening review.

## Browser validation: actual blocker

The prior host-only Playwright probe lacked a browser executable. This continuation tried the supported connected desktop-browser plugin, then the cloud-browser fallback. Both could not reach the loopback-only execution-host HTTP server and returned `ERR_CONNECTION_REFUSED`. This is a file/network reachability limitation between execution environments, not evidence that the viewer JavaScript failed, and not a sign-in or bot-detection issue.

No port was exposed publicly, security protections bypassed, account created or external hosting purchased. The temporary local server was stopped after the test. Local viewer playback, search, note export and phone layout therefore remain unverified. The standalone MP4 comparison provides an independently decodable review artifact without requiring the HTML viewer.

## Reproduce

Python 3.11+, FFmpeg/FFprobe with libx264 and drawtext support. No Node dependency, provider, GPU or API key is required. Different fonts/FFmpeg builds may alter comparison labels or encoded bytes; input hashes and encoded-audio preservation must still match.

```bash
python3 scripts/compare-reviewed-pilots.py --check
python3 scripts/compare-reviewed-pilots.py --out output/visual-comparison-new
```

An existing output folder is refused. No input media are edited. The executed check/render/decode/hash/sample workflow is the validation for this standalone comparison recipe; unchanged application tests were not rerun for this artifact-only milestone. Previously recorded 439 Vitest +35 Node checks remain historical evidence, not a new run. Scheduled continuation remains paused and the preserved baseline remains untouched.
