# Approved episode: focused improvement review

Reviewed 16 October 2026. Baseline: examples/micro-drama/episode-01-question-revision/pilot.mp4, SHA256 9b438dff1eece70ea902c04921d6bdca61c90815288cc587bfb2ea6f2a3053c7. Keep this version and its approved narration intact.

Evidence inspected this turn: saved scene-1, scene-3 and scene-5 PNGs at full resolution; recorded cues.json; previously audited source and media metadata. These three stills do not prove complete motion behavior or audible delivery. No audio listening or viewer-retention measurement was performed. Proposed changes below are editorial hypotheses to compare, not established audience gains.

| Priority / time | Observation | Proposed controlled fix | Evidence required |
|---|---|---|---|
| 1 / 0–6.97s | Opening still splits attention across series branding, location, large episode title, phone labels, warning, subtitle and footer. The warning is the dramatic object but competes with presentation text. | Reduce decorative headings/footer in the candidate; give the phone message visual priority at its existing 4.033s cue. Preserve spoken words and reveal timing. | Beginning, warning-boundary and end-of-scene frames show readable sender/warning and no early warning. Compare side by side with baseline. |
| 2 / 15.73–24.67s | The crooked picture and blue slipper are visible inside a phone-within-the-frame layout; the spoken clues still require viewers to locate small objects. | Add restrained cue-timed close-ups or highlights: picture at 17.333s, slipper at 19.233s. Keep recognisable hallway context and avoid revealing later plot points. | Frames before/during each cue show the intended clue clearly; no misleading movement or clipping. |
| 3 / 44.267–46.4s | Final still displays “Would you open it?” both as a prominent CTA and a lower caption, alongside a separate lock-status overlay. | Show the question once at its existing cue; keep the necessary warning/door context and remove redundant text. Preserve approved question audio and pause. | Frame immediately before the cue has no question; during cue has exactly one readable question; captions remain accessible. |

Acceptance for this experiment: identical reviewed script and audio source; same story/reveal order; no new paid API or external visual assets; English-only visible text; candidate saved separately; decode/metadata checks plus inspected clue/question boundary frames. Record actual generation and inspection results. Do not mark rendered/reviewed based only on source edits or passing tests.

The current renderer regenerates audio as part of its normal run. To preserve the approved voice exactly, prefer reusing archived render props and extracting/reusing the approved media audio, or another verified existing audio source. Do not imply an identical voice waveform without comparing it. Retain baseline and candidate hashes. Broader voice/model/caption experiments are subsequent work.
