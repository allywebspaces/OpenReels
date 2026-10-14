# Video improvement repositories — 14 October 2026

## Decision and user direction

User explicitly wants better videos before creating a channel. Channel creation, handle registration and publication are on hold. English-only and free-first constraints continue. The approved episode is a baseline, not proof of competitive quality or retention. Keep OpenReels/Remotion/Kokoro while evaluating targeted additions; do not switch whole generators merely because another repository promises automation.

## Evidence and limits

Reviewed primary repository documentation for 12 projects. Shallow-cloned three review-oriented candidates and inspected source/prompts/provider calls without executing installers, dependencies or models. This is research and source inspection, not an installation, performance benchmark, security audit or actual model review of our MP4. No hosted inference, paid API request or public upload was made. No repository's reviewer score demonstrates viewer retention or earnings.

## Closest matches to the request

| Repository | What it does | Cost/hardware dependency | Recommendation for us |
|---|---|---|---|
| [dunctk/video-agent-skills](https://github.com/dunctk/video-agent-skills) | Timestamped production critique; scene description and candidate/reference comparison. Source prompts cover pacing, legibility, composition and motion. | Uploads supplied video to Gemini; requires an API key. Free usage/quota not established. | Closest direct suggestion tool. Evaluate later only within an explicitly approved provider/budget; current free-first task does not authorize calls. |
| [poseljacob/agentic-video-editor](https://github.com/poseljacob/agentic-video-editor) | Director, trim refiner, editor and reviewer; versioned retries with actionable feedback. | Gemini/Google ADK plus FFmpeg; starts from raw footage and an advertising brief. | Useful architecture reference for a bounded review/fix loop; full ad pipeline is a mismatch for illustrated fiction. |
| [QwenLM/Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS) | Local speech models; selected 1.7B variants support natural-language style/emotion instructions. | Model downloads and substantial local inference; official examples use CUDA. No confirmed hardware/runtime fit here. | Strong voice candidate for a short English audition. Keep approved Kokoro voice until a comparison is heard. |
| [m-bain/whisperX](https://github.com/m-bain/whisperX) | Transcription and forced alignment for word timestamps; documented CPU mode. | Local Python/PyTorch/model downloads. Exact model licenses must be checked; diarization is unnecessary for our narrator. | Best practical caption-timing candidate. Align the known reviewed script; never replace it silently with ASR guesses. |
| [QwenLM/Qwen3-VL](https://github.com/QwenLM/Qwen3-VL) | Local vision-language model that can reason about sampled video frames and visible text. | Local model weights, memory/compute and frame token budget; not a turnkey reviewer. | Possible free visual critic after hardware validation. Needs our rubric and exact timeline. Do not use visual-only results to judge audible prosody. |

### Source-inspection details

**video-agent-skills**, pinned ece523c10529c503927d313e05ad5c74cced694c: main.go uploads via Files.UploadFromPath and invokes Gemini GenerateContent. Default model is gemini-3-flash-preview at this pin. package.json declares MIT but no standalone license file was found in the inspected tree. postinstall invokes install.js and may install skills/download a binary. No installer was run. Critique is model-generated advice, not a validated objective score.

**agentic-video-editor**, pinned 47248b577046b0563e57e78edad86a3106c6faab: MIT LICENSE present. Reviewer code uses Gemini, expects concrete feedback, and the documented pipeline caps retries. The project says CLI is supported and web UI pre-alpha. Its advertising-specific brief/schema would need adaptation; output must still pass English and no-spending guards. No dependency or runtime test was performed.

**spark-video**, pinned 11589d4336a0f2e04e5ee262a797b3dbe5f87cfd: story-to-storyboard-to-render/review workflow with character/prop continuity; clip rubric checks narrative logic, proportions, physics, style, cast and dialog attribution. Hosted Bailian CLI/model calls are part of the documented route. No standalone license was found in the inspected tree; clarify reuse terms before incorporating its code or skill text. Actor/anatomy criteria mostly do not apply to our illustrated episode. Research reference only; not installed.

Qwen3-TTS model table distinguishes 1.7B CustomVoice/VoiceDesign with instruction control from 0.6B CustomVoice and Base cloning models, which are not marked for that capability. Do not promise expressive control from the smallest model or that a cloned Bella voice will preserve that control. An audition can use an original stock voice; no real-person cloning is needed. Pin the selected model, set English explicitly, and compare delivery, intelligibility, consistency and latency before changing production.

## Other generation and analysis candidates

| Repository | Relevant capability | Fit verdict |
|---|---|---|
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | Topic/script/footage/subtitle/music assembly with local-runtime options such as Ollama. | Worth knowing, but generic montage automation does not solve our dramatic acting/continuity needs. No migration recommended. |
| [RayVentura/ShortGPT](https://github.com/RayVentura/ShortGPT) | Experimental Shorts/TikTok automation, asset sourcing and metadata. | Automation alternative, not a dedicated critique solution. A free notebook claim does not establish free downstream generation. |
| [Wan-Video/Wan2.2](https://github.com/Wan-Video/Wan2.2) | Open video models for generated motion/characters. | Official TI2V-5B example requires at least 24 GB GPU VRAM. Not appropriate to promise on our CPU-based runner; GPU rental would be a separate spending decision. |
| [Breakthrough/PySceneDetect](https://github.com/Breakthrough/PySceneDetect) | Detect cuts, split video and save scene images locally. | Helpful for external reference videos or imported footage. Our own five-scene render already has exact scene/cue metadata, so this adds little now. |
| [modelscope/FunClip](https://github.com/modelscope/FunClip) | Transcript-based clipping and subtitle workflow; optional LLM-assisted selection. | Better for repurposing existing speech-heavy videos than producing original micro-drama or judging question delivery. |
| [VQAssessment/DOVER](https://github.com/VQAssessment/DOVER) | Research model separating technical and aesthetic quality against video datasets. | Supplemental quality signal, not story/dialogue advice. Dataset-relative scores may not transfer well to flat illustrated fiction. Not our first tool. |
| [JohnKeating1997/spark-video](https://github.com/JohnKeating1997/spark-video) | Full AI-film workflow and per-shot review. | Strong conceptual reference; hosted generation and unclear inspected licensing make immediate adoption unsuitable. |

## Recommended quality experiment before channel creation

1. **Review current episode with a scene rubric.** Every finding records timestamp, observed evidence, severity, proposed fix and whether based on pixels, transcript or actual listening. Record “not evaluated” where the reviewer cannot hear the audio. Preserve approved baseline.
2. **Create one controlled visual/pacing alternative.** Test a clearer hook, close-ups of clues and varied framing against existing phone/door/clock scenes. Consider subtle original sound effects and music ducking; current knock visuals are not audible knock effects. These are proposals, not changes already made or proven retention improvements.
3. **Test voice on a short excerpt.** Compare existing Kokoro with an expressive model only if local hardware and model terms fit. Do not silently replace the approved voice or enable a paid fallback. Script, spoken English, pauses and word emphasis need listening review.
4. **Improve captions only where useful.** Evaluate word alignment and short caption chunks without revealing the twist early; word-by-word animation is optional, not automatically superior. Keep original script and sentence cues as the trusted fallback.
5. **Review three private pilots before launch.** Include mystery, emotional drama and a twist story. Use comprehension and voice/visual review, version comparisons and—if the user can recruit willing viewers—small qualitative feedback. Do not invent retention analytics before publication.

The smallest next build is a reusable, provider-independent review packet for the existing episode: scene/cue timeline, selected frames, script, audio samples and prioritized findings. Our existing host-agent reviews plus FFmpeg already provide the free base. Model integrations should be separate experiments with bounded retries and recorded evidence; no channel is required.

## Execution status

Research complete; three candidate source repositories downloaded for inspection only. New models/tools are not installed or tested on the episode. No channel created, name selected, provider key configured or video sent to third-party inference. Channel-name recommendation remains provisional. The existing approved MP4 remains unchanged.

Primary sources are the linked canonical repositories. Relevant detailed references: [Qwen3-TTS model table](https://github.com/QwenLM/Qwen3-TTS#released-models-description-and-download), [WhisperX CPU usage](https://github.com/m-bain/whisperX#usage), [Wan2.2 usage](https://github.com/Wan-Video/Wan2.2), [video-agent-skills package declaration](https://github.com/dunctk/video-agent-skills/blob/ece523c10529c503927d313e05ad5c74cced694c/package.json), [spark-video rubric](https://github.com/JohnKeating1997/spark-video/blob/11589d4336a0f2e04e5ee262a797b3dbe5f87cfd/references/spark-video-clip-review/rubric.md).
