# Actual-video review integration

18 October 2026 UTC / 19 October India. New user direction: investigate why the completed videos do not feel right and incorporate the useful parts of six supplied Video QA sources. This resumes a bounded review-tool milestone; the completed three-pilot acceptance record remains valid. The schedule remains paused. No new video, voice, baseline, paid-provider setting or social publication changes.

## Chosen design and implementation

The missing capability is inspection of the finished MP4 with time-linked evidence, rather than another critic of the intended script. Three alternatives were considered:

1. Install all supplied applications: duplicates transcript chat, introduces hosted providers and unlicensed source reuse, and does not establish visual/emotional critique.
2. Deploy a GPU Video RAG stack: adds models, infrastructure and uncertain hardware needs before establishing what is wrong with these short clips.
3. **Implement an original local evidence viewer using existing FFmpeg and Python.** Adopt the sources' useful separation of ingestion, retrieval and questioning while keeping the inspected media and human judgment explicit. This is the selected first integration.

The user's continuing technical/editorial autonomy and AGENTS.md authorize reversible implementation and commits without a new routine approval. This document records the concrete design and its limits. No external repository code was copied, installed or executed. The supplied projects are references, not six running integrations.

### What runs now

`scripts/video_review.py` reads an existing local MP4, makes a byte-identical copy, performs a strict full decode, extracts actual video samples and mono audio, measures PCM peak/RMS in quarter-second windows and emits `manifest.json` plus `index.html`. Input/output limits: 100 MiB, 300 seconds, at most 240 frame samples. Existing output folders are never overwritten. Failures remove the incomplete temporary pack. FFmpeg network protocols are restricted to local file/pipe inputs.

The interactive HTML page provides video and audio playback, timestamp seeking, separate source-labeled intended cues and imported ASR, keyword retrieval, human diagnostic questions, timestamped observations and proposed changes, and JSON note export tied to the video SHA256. No backend, account, vector service, hosted model, API key, network upload or inference is used. Notes must be downloaded before closing/reloading the page.

Frame sampling uses a 2-second grid plus positions just before/at/after intended cue and scene boundaries when props are supplied. AAC duration can exceed picture duration; sampling is capped at the final picture frame rather than the container tail. Timestamp labels describe requested seek positions rounded to decoded frames. They are not a claim of every-frame review or verified visual reveal timing.

No Whisper runtime/model is installed here. The tool can import an existing Whisper-format JSON whose `language` explicitly declares English and whose timed segments fit the video. It does not transcribe, prove the declared language, word-align captions or judge prosody. Intended script text never becomes an ASR transcript. Free renderer English/source guards remain unchanged. Review fields and interface text are English; imported/human text still requires English review.

RMS/peak are measurements of downmixed PCM, not LUFS, clipping proof, perceived loudness, intelligibility or acting quality. Human full-watch and phone-check fields are declarations in exported notes, not automatically inferred completion.

## Disposition of every supplied source

Exact inspected commits and licenses: [SOURCES.json](../../tools/video-review/SOURCES.json). The first three trees contain no license file and repository metadata reports no license. Do not assume public source can be copied into this fork.

| Supplied source | What inspection established | Useful contribution | Runtime disposition |
|---|---|---|---|
| AtaUllahB/Python-Video-Audio-QA-System | Streamlit UI, local Whisper base transcript, shared text files. The inspected model module uses Vertex AI service-account credentials and a fixed project/endpoint, beyond the README's simple Gemini-key setup. | Local media ingestion, explicit transcript provenance and an interactive review surface. | Original implementation of those general ideas. No upstream code, Vertex endpoint or requirements installer used. Whisper inference remains unavailable. |
| venkatavinayvijjapu/Video-analysis-and-QA-using-LLM | Inspected `Code/mainpro.py` downloads YouTube audio, sends it to AssemblyAI and asks an LLM over transcript text. Windows paths, placeholder credentials and an undefined query variable appear. No inspected frame-understanding path supports the broad README claim. | Separate signal evidence from transcript questions and prevent unsupported visual claims. | No execution or copied code. AssemblyAI/OpenAI calls are excluded. |
| vilsonrodrigues/youtube-retrieval-qa | `YoutubeLoader` retrieves transcript documents. LangChain/OpenAI, FAISS and Gradio underpin transcript retrieval/chat. | Search only a small relevant piece and keep the original timestamp/source. | Original local keyword search over known text. No semantic embeddings, YouTube download, FAISS or OpenAI inference. |
| GitHub `video-rag` topic | A mutable discovery page, observed with 22 public repositories. Different stacks/models/licenses appear. | Frame indexing and timestamped evidence. | Sampled actual frames plus a manifest. The topic is not an installable package and does not license its linked projects. |
| Video-Question-Answering_Resources | Apache-2.0 licensed curated research list, not a working quality evaluator. | Distinguish temporal, descriptive and causal questions. | Reference retained. No linked models/datasets imported. The list license does not cover every linked resource. |
| doc-doc/NExT-QA | MIT research code with a legacy Python 3.6/PyTorch 1.6/CUDA 10.2 environment and separate downloaded features/models/datasets. | Ask what happened, when it happened and why an action followed. | Original human prompts. No benchmark run, model training, dataset download or causal-reasoning claim. Dataset/media rights require separate inspection. |

## Run locally or on a VPS

Needs Python 3.11+ and compatible FFmpeg/FFprobe installed. The current implementation requires no pip packages or GPU. Browser playback needs a browser supporting H.264/AAC. Mac and Linux VPS installation/OS compatibility remain conditional; this run was on the available Linux execution host, not the user's Mac or VPS. Initial installation of system tools may require connectivity. No remote service is necessary after the tools and media are present.

From the experiment branch checkout:

```bash
python3 scripts/video_review.py \
  --video examples/micro-drama/episode-02-folded-notes/pilot.mp4 \
  --props examples/micro-drama/episode-02-folded-notes/render-props.json \
  --out output/video-review/folded-notes
```

Open `output/video-review/folded-notes/index.html` in a browser. Keep the complete generated folder together. Do not open the template under `scripts/` directly. If a browser blocks local media, use a loopback-only local server from the generated folder: `python3 -m http.server 8765 --bind 127.0.0.1`. Visit `http://127.0.0.1:8765`. This is not an internet deployment. On a VPS use an SSH tunnel rather than exposing the folder publicly.

The same command works for episode03 with its `render-props.json`. For approved episode01, the archived `pilot.json` contains intended cues and can be passed as `--props`; alternatively omit props for grid sampling alone. Always use a new output directory.

Optional transcript import (does not invoke Whisper):

```bash
python3 scripts/video_review.py --video /path/to/clip.mp4 \
  --transcript /path/to/existing-whisper-result.json \
  --out output/video-review/with-existing-transcript
```

Expected transcript shape: `{"language":"en","model":"record the actual model if known","segments":[{"start":0,"end":1,"text":"Actual recognized words."}]}`. Preserve the original recognizer output. An invented example is not evidence of audio recognition.

## Verification and remaining work

See [VIDEO_QA_VALIDATION.md](VIDEO_QA_VALIDATION.md) for actual exercised packs, hashes, diagnostics and review limits. Tests check software behavior and do not prove compelling video quality. Baseline/candidate media are preserved. No new channels, voice models or automated improvement loop were enabled.

The next practical step is a complete watch with sound using this viewer: record three specific timestamps with an observation and one proposed change each. Use those observations to choose a single controlled alternative. A stronger visual model or locally practical Whisper can be evaluated later if evidence shows the missing capability is needed; no paid fallback is enabled.
