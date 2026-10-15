# The Message at Midnight — controlled visual alternative

[Download the candidate video](https://raw.githubusercontent.com/allywebspaces/OpenReels/experiment/video-quality/examples/micro-drama/episode-01-visual-experiment/pilot.mp4) · [Preserved approved version](../episode-01-question-revision/pilot.mp4)

Rendered successfully in [GitHub run 38816182643](https://github.com/allywebspaces/OpenReels/actions/runs/38816182643), source 4b7155c725a7126b46de2cf3d62ac35dce5065b4. This is the same story, narration and timing with reduced opening decoration, larger photo plus cue-bound clue outlines, and the closing question displayed once. All audience-facing content remains English. Midnight Stories is still a provisional series label.

## Verification

- H.264/AAC, 720×1280, 30 fps; composition46.4s, container46.464s. Full decode passed on runner and again after download.
- Original encoded AAC stream copied without re-encoding. Both extracted ADTS streams have SHA256 1ef27a4437db92cae385763b67bb56fbf266c5f6d6fa1f8231eacaaed8a4493e. This proves encoded-audio preservation, not a new naturalness assessment.
- Candidate MP4 SHA256: 44b16bea81cf5eecb3e2686a2e2e94d30e45e0e584c3b6c4b40b6c239fb8c40b.
- Software checks passed:431 Vitest plus27 Node tests (458 total), TypeScript and reviewed-content checks. An independent code reviewer checked the no-provider route, guard ordering and AAC comparison.
- Review agents inspected exported PNGs around warning/clue/question cues. Lead additionally inspected actual MP4 frames121,520,577,1338 and before-cue MP4 frames120,519,576,1327. No observed clipping/overlap, premature warning/highlights/question, or duplicate final question in these samples. The picture/slipper remain in the full hallway context.
- Important evidence discrepancy: some standalone opening PNGs omitted static headings, while the corresponding actual MP4 frames include them correctly. Archived JPEGs are extracted from the MP4 and are the primary inspection evidence. Still exports are not assumed identical to the MP4.

No complete frame-by-frame inspection, new human listening assessment, audience test or retention/earnings measurement. This candidate is technically checked and visually sampled, not user-approved or publicly posted. No paid generation API calls were used. Baseline source and media remain unchanged.

## Evidence

Archived JPEGs are actual MP4 frames:0,120,121,519,520,576,577,1327,1338. The generated report.json intentionally retains its pre-inspection pending status; this README and review.json record the later inspection. Source/render reproduction: node scripts/visual-experiment.mjs --check, then node scripts/visual-experiment.mjs in a prepared environment. The local managed runtime still fails Remotion network-interface enumeration; the GitHub runner is verified.
