# Frame and question-delivery review — 14 October 2026

## Scope and evidence
Original video: examples/micro-drama/episode-01/pilot.mp4 (SHA256 9a8ed89714a065c6af855bcdc9ae65e020016b06f0a00e0563abb07d7f1952e7). FFmpeg extracted all 1,106 video frames at 30fps. frames.csv records each frame, timestamp and scene; original-frame-thumbnails.zip contains a 180x320 thumbnail of every frame. Contact sheets sample every half second and both sides of each cut. Review agents inspected those samples plus full-resolution scene/critical frames and source; they did not manually inspect every frame or listen to audio.

## Agent findings
| Time / frame | Finding | Correction |
|---|---|---|
| 6.27s / 188 | Full scene captions reveal the coming photograph immediately | Sentence captions follow measured audio-clip cues |
| 12.90s / 387 | Full captions reveal the final “already inside” inference too early | Hold each sentence until its speech clip starts |
| 12.90–20.00s / 387–600 | Hallway photo clue is small and letterboxed | Enlarged photo, cropped while retaining frame and slipper |
| 6.27–12.87s / 188–386 | Continuous knock rings produce more than three pulses | Three pulses confined to the “Three knocks” cue |
| 20.03s / 601 | Heading/message reveal the twist before its spoken beat | Gate both to the second spoken cue |
| 22.03s / 661 | Clock reverses at a fixed two-second offset without flicker | Short flicker starts at the clock sentence cue |
| 28.13s / 844 | Closing question appears at the very start of the final scene | Question appears only at its separate speech cue |
| Final scene | Returning warning is narrated but not shown | Add the warning overlay at that sentence cue |

## Vocal-delivery investigation
The original question is generated with the entire final paragraph at speed 1.1. The installed Kokoro JS text API exposes voice and speed, not an acting-direction or SSML-emphasis control. Separate same-speed, slower and punctuation probes were generated locally. Approximate autocorrelation pitch measurements are saved in audio-probes.json; they are not word-aligned, can contain octave errors, and cannot judge human naturalness. A rising pitch alone is not proof of a convincing question.

The revised delivery keeps af_bella, separates the closing question, slows it to 1.0, adds 550 ms before it, and uses the supported generate_from_ids path with reviewed English phonemes and primary stress on “you.” The sentence cue starts at the measured clip boundary. No artificial pitch-shift effect or paid API is used. Its naturalness remains a human listening judgment; automated tests do not establish that judgment. The original-question.mp3 reference is the final 3 seconds of the original ending, so it can include preceding narration rather than an isolated equal-context take.

## Agent Reach
Panniantong/Agent-Reach was cloned at 94f06c1969dfc1834001269d79d3ad0972d9dee6. It supplies internet access and optional API transcription, not local frame vision or prosody review. No broad installer, account/cookie access or transcription was executed. Host-native review agents and local FFmpeg provided this review. Reproducible source details: tools/agent-reach/SOURCE.json.

## Verification status
Source checks passed: 431 Vitest tests, 23 Node tests and TypeScript. All revised sentence clips generated locally; a local browser startup error (uv_interface_addresses) prevented local rendering. A free GitHub render was started for the finished-video review. The rendered result and follow-up timings will be recorded below after verification.

## Revised render verification
Free GitHub run 38528230169 succeeded from 558c0263911e9f578adf2c21a3a29a02d90d4555. The revised composition is 46.4 seconds; sentence separation and pauses lengthened it from 36.87 seconds. This slightly exceeds the 35–45-second creative target; it is a review take, not a claimed optimal retention length.

The final question starts at absolute frame 1328  / 44.267s; first four scenes total 1038 frames and its scene-local start is 290. Its preceding sentence ends at local 274, leaving the rounded 16-frame visual gap from the specified 550 ms audio pause. Frame 1327 contains no question; frame 1338 shows the question and its caption. The complete sentence-cue timeline is in ../episode-01-question-revision/cues.json. Five end-of-scene stills and these question-boundary frames were inspected; the enlarged clue and current-caption-only display are legible, with no observed overlaps. Full revised MP4 decode passed.

Independent implementation reviewer approved sampled cue timing, 24kHz float32 WAV output and no-paid-API path. Perceptual word weighting and naturalness are intentionally not claimed as automatically verified. Listen to the revised question sample for that judgment.
