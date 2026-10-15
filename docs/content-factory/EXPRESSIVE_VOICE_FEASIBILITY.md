# Expressive English voice — feasibility checkpoint

Assessed 16 October 2026 (India), against OpenReels head `892ebf9b8f15611cdd9c0e93a937026275c822b2`.

## Decision

Keep approved Kokoro unchanged. Defer the Qwen audition in this environment and proceed with the remaining private pilots. This is a resource-risk decision, **not a failed inference benchmark or proof that CPU inference is impossible**. No new model, installer, provider call or audio asset was run. No listening comparison has been performed.

The environment is limited to 8 GiB, currently sharing approximately 2.97 GiB with existing processes. The candidate repository lists 4.52 GB of files, including a 3.83 GB main weight file. File sizes are not runtime-memory requirements: loading, dtype conversion, the speech tokenizer, activations and Python dependencies need additional memory. CPU reduced-precision/quantized inference might fit, but support, peak RAM, latency and audible quality have not been tested here. Installing a large, unverified stack is not on the critical path to two more pilots using the already working voice.

## Measured local evidence

Read-only probes; no inference or package installation:

| Probe | Observed result |
|---|---|
| `python --version` | Python 3.12.14 |
| `os.cpu_count()` | 9 logical CPUs visible |
| `/sys/fs/cgroup/cpu.max` | `800000 100000`: CPU quota equivalent to 8 cores |
| `/sys/fs/cgroup/memory.max` | `8589934592`: 8 GiB hard limit |
| `/sys/fs/cgroup/memory.current` | `3193085952` bytes at sampling; fluctuates |
| `nvidia-smi`, `/dev/nvidia*`, `/dev/dri` | Command absent; no matching exposed devices observed |
| Python `importlib.util.find_spec` | `torch`, `transformers`, `qwen_tts`, `soundfile`, `onnxruntime` all absent |
| `df -h .` | 28 GiB available on 32 GiB overlay; storage alone is not the blocker |

The host physical-RAM estimate (9.73 GiB) is not the usable allocation; the cgroup limit above takes precedence. Missing Python ONNX Runtime does not imply that the existing Node Kokoro runtime is missing.

## Primary-source inspection and license boundary

- [Qwen3-TTS source](https://github.com/QwenLM/Qwen3-TTS/tree/022e286b98fbec7e1e916cb940cdf532cd9f488e), inspected upstream head `022e286b98fbec7e1e916cb940cdf532cd9f488e`; source package declares Apache-2.0. Nothing cloned or executed.
- [Package dependencies](https://github.com/QwenLM/Qwen3-TTS/blob/022e286b98fbec7e1e916cb940cdf532cd9f488e/pyproject.toml): qwen-tts 0.1.1, transformers 4.57.3, accelerate 1.12.0; other dependencies include torchaudio, librosa, soundfile and onnxruntime. These are inspected declarations, not installed versions.
- [Candidate model revision](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice/tree/0c0e3051f131929182e2c023b9537f8b1c68adfe): Apache-2.0 model-card declaration; file listing observed as 4.52 GB total / 3.83 GB main safetensors. No downloaded bytes or weight SHA256 verified. Source and model revisions are distinct.
- Upstream model table marks 1.7B CustomVoice and VoiceDesign for instruction control and lists English. The smaller 0.6B variant is not marked for instruction control; it is not an evidenced drop-in expressive substitute. Official examples use CUDA/bfloat16/FlashAttention; they do not establish that CUDA is mandatory or that our CPU setup will work.

## Deferred audition specification

If suitable existing free resources become available, use the pinned 1.7B CustomVoice revision with a supplied English stock speaker, not a real-person clone. Explicitly set English and review/pin the excerpt before generation. Compare the unchanged approved question, “Would you open it?”, with a controlled direction: genuine uncertainty, clear emphasis on “you,” no shouting. Label the changed speaker as a confound; this is not a pure prosody A/B test. Use an isolated environment and bounded process timeout/memory monitoring; record exact versions, model digests, elapsed time, peak memory, WAV hash, decode result and listening limitations. Do not change production based on synthesis success alone.

## Next execution

Implement one additional original English fixed, reviewed pilot (emotional drama), then render through the proven free GitHub path and inspect actual output. A third twist pilot follows separately. Preserve episode 01 and its visual alternative; extend the allowlist deliberately rather than claiming arbitrary-topic automation. Caption alignment remains optional: existing cues are measured sentence/clip boundaries, not word alignment. Revisit it only when an inspected output demonstrates a readability or synchronization issue.

Verification scope for this checkpoint: local resource probes and source/license inspection only. No new render, audition, listening score, audience-quality measurement or production dependency change.
