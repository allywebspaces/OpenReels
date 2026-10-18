#!/usr/bin/env python3
"""Build a local, no-provider evidence pack from an existing short MP4.

Original implementation. No hosted inference, network client or model installer.
The intended script is deliberately kept separate from imported ASR evidence.
"""
import argparse
import array
import hashlib
import json
import math
import shutil
import subprocess
import sys
import tempfile
import wave
from datetime import datetime, timezone
from pathlib import Path


def sha256(path):
    with path.open('rb') as source:
        return hashlib.file_digest(source, 'sha256').hexdigest()


def run(args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=180)
    if result.returncode or ('-xerror' in args and result.stderr.strip()):
        raise ValueError(f'{Path(args[0]).name} failed: {result.stderr[-2500:]}')
    return result.stdout


def finite(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError('Timestamps and durations must be finite numbers')
    return value


def load_transcript(path, duration):
    if path is None:
        return {'status': 'not_available', 'segments': [], 'languageVerified': False}
    data = json.loads(path.read_text(encoding='utf-8'))
    if data.get('language') not in ('en', 'english', 'English'):
        raise ValueError('Transcript must explicitly declare English (language: en). No automatic language proof is implied.')
    segments = []
    previous = -1
    for item in data.get('segments', []):
        start, end = finite(item['start']), finite(item['end'])
        if not 0 <= start < end <= duration + 0.1 or start < previous:
            raise ValueError('Transcript segments must be ordered and within video duration')
        if not isinstance(item.get('text'), str):
            raise ValueError('Transcript segment text must be a string')
        previous = start
        segments.append({'id': f'asr-{len(segments)+1}', 'start': start, 'end': end, 'text': item['text'], 'evidenceType': 'imported_asr'})
    if not segments:
        raise ValueError('Transcript contains no timed segments')
    return {'status': 'imported_asr_not_manually_verified', 'sha256': sha256(path),
            'languageDeclared': 'en', 'languageVerified': False,
            'model': data.get('model', 'not recorded'), 'segments': segments}


def intended_cues(path, fps, duration):
    if path is None:
        return [], []
    cues, scenes, offset = [], [], 0
    for index, scene in enumerate(json.loads(path.read_text(encoding='utf-8'))['scenes']):
        length = finite(scene['durationInFrames'])
        if length <= 0 or int(length) != length:
            raise ValueError('Scene duration must be a positive integer frame count')
        scenes.append({'scene': index + 1, 'start': offset / fps, 'end': (offset + length) / fps})
        for cue in scene.get('cues', []):
            start, end = finite(cue['startFrame']), finite(cue['endFrame'])
            if not 0 <= start < end <= length:
                raise ValueError('Intended cue lies outside its scene')
            if not isinstance(cue.get('text'), str):
                raise ValueError('Intended cue text must be a string')
            cues.append({'id': f'cue-{len(cues)+1}', 'scene': index + 1,
                         'start': (offset + start) / fps, 'end': (offset + end) / fps,
                         'text': cue['text'], 'evidenceType': 'intended_script_not_asr'})
        offset += length
    if offset / fps > duration + 0.15:
        raise ValueError('Intended scene timeline exceeds video duration. Check --fps and props.')
    return cues, scenes


def sample_times(duration, fps, cues, scenes):
    # 2s grid plus a frame before/at/after each intended boundary. No all-frame claim.
    values = {0.0, max(0, duration - 1 / fps)}
    values.update(float(t) for t in range(2, math.ceil(duration), 2) if t < duration)
    boundaries = [x[k] for x in cues + scenes for k in ('start', 'end')]
    for t in boundaries:
        values.update(max(0, min(duration - 1 / fps, t + delta / fps)) for delta in (-1, 0, 1))
    times = sorted({round(t, 6) for t in values})
    if len(times) > 240:
        raise ValueError('More than 240 samples requested. Review a shorter clip or omit intended props.')
    return times


def audio_probe(path):
    with wave.open(str(path), 'rb') as audio:
        rate = audio.getframerate()
        samples = array.array('h', audio.readframes(audio.getnframes()))
    if sys.byteorder != 'little':
        samples.byteswap()
    def db(value):
        return round(20 * math.log10(value), 2) if value else None
    windows = []
    stride = rate // 4
    for start in range(0, len(samples), stride):
        chunk = samples[start:start+stride]
        rms = math.sqrt(sum(v*v for v in chunk) / len(chunk)) / 32768
        peak = max(abs(v) for v in chunk) / 32768
        windows.append({'start': round(start / rate, 3), 'end': round((start+len(chunk)) / rate, 3),
                        'rmsDbfs': db(rms), 'peakDbfs': db(peak), 'belowMinus45Dbfs': rms < 10**(-45/20)})
    return {'status': 'measured_mono_16khz_pcm', 'windows': windows,
            'peakDbfs': db(max(abs(v) for v in samples) / 32768) if samples else None,
            'nearFullScaleSamples': sum(abs(v) >= 32735 for v in samples),
            'limits': 'RMS and peak of downmixed PCM are signal diagnostics, not LUFS, clipping proof, intelligibility or emotional-delivery scores.'}


def build(video, output, props=None, transcript=None, fps=None):
    video, output = video.resolve(), output.resolve()
    if not video.is_file() or video.suffix.lower() != '.mp4':
        raise ValueError('Choose an existing local MP4 file')
    if video.stat().st_size > 100 * 1024 * 1024:
        raise ValueError('This bounded reviewer accepts MP4 files up to 100 MiB')
    if output.exists():
        raise ValueError('Output already exists. Choose a new folder to preserve prior evidence.')
    for binary in ('ffmpeg', 'ffprobe'):
        if not shutil.which(binary):
            raise ValueError(f'{binary} is required on this computer')
    probe = json.loads(run(['ffprobe', '-v', 'error', '-protocol_whitelist', 'file,pipe', '-show_format', '-show_streams', '-of', 'json', str(video)]))
    duration = float(probe['format']['duration'])
    if not math.isfinite(duration) or not 0 < duration <= 300:
        raise ValueError('Choose a clip no longer than 300 seconds')
    stream = next(s for s in probe['streams'] if s['codec_type'] == 'video')
    numerator, denominator = map(float, stream['avg_frame_rate'].split('/'))
    measured_fps = numerator / denominator
    if props and stream.get('r_frame_rate') != stream.get('avg_frame_rate'):
        raise ValueError('Props require a constant-frame-rate source. Review this video without props.')
    fps = finite(fps) if fps is not None else measured_fps
    if not 1 <= fps <= 120:
        raise ValueError('FPS must be between 1 and 120')
    if props and abs(fps - measured_fps) > 0.01:
        raise ValueError('Props FPS differs from the video. Confirm the correct source timeline.')
    transcript_data = load_transcript(transcript, duration)
    cues, scenes = intended_cues(props, fps, duration)
    video_duration = min(duration, float(stream.get('duration', duration)))
    # AAC padding can outlast the picture. Avoid seeking beyond its final PTS.
    last_frame = max(0, (math.ceil(video_duration * measured_fps - 0.001) - 1) / measured_fps - 0.0001)
    times = sorted({min(t, last_frame) for t in sample_times(video_duration, fps, cues, scenes)})
    output.parent.mkdir(parents=True, exist_ok=True)
    temp = Path(tempfile.mkdtemp(prefix='.video-review-', dir=output.parent))
    try:
        # Copy first: all extraction and decoding use the exact preserved bytes.
        shutil.copyfile(video, temp / 'video.mp4')
        source = str(temp / 'video.mp4')
        command = ['ffmpeg', '-v', 'error', '-xerror', '-nostdin', '-protocol_whitelist', 'file,pipe', '-i', source, '-map', '0:v:0', '-map', '0:a:0?', '-f', 'null', '-']
        run(command)
        (temp / 'frames').mkdir()
        frames = []
        for index, timestamp in enumerate(times):
            name = f'frames/{index:03d}.jpg'
            run(['ffmpeg', '-v', 'error', '-nostdin', '-protocol_whitelist', 'file,pipe', '-ss', str(timestamp), '-i', source,
                 '-map', '0:v:0', '-frames:v', '1', '-vf', 'scale=360:-2', '-q:v', '3', str(temp / name)])
            if not (temp / name).is_file():
                raise ValueError(f'No frame extracted at {timestamp:.3f}s')
            frames.append({'id': f'frame-{index}', 'time': timestamp, 'file': name, 'sha256': sha256(temp / name)})
        if any(s['codec_type'] == 'audio' for s in probe['streams']):
            run(['ffmpeg', '-v', 'error', '-nostdin', '-protocol_whitelist', 'file,pipe', '-i', source, '-map', '0:a:0', '-vn', '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', str(temp/'audio.wav')])
            audio = audio_probe(temp / 'audio.wav')
            audio['sha256'] = sha256(temp / 'audio.wav')
        else:
            audio = {'status': 'no_audio_stream', 'windows': []}
        manifest = {'schemaVersion': 1, 'createdAt': datetime.now(timezone.utc).isoformat(),
                    'generatorSha256': sha256(Path(__file__)),
                    'templateSha256': sha256(Path(__file__).with_name('video-review.html')),
                    'video': {'sha256': sha256(temp/'video.mp4'), 'file': 'video.mp4', 'duration': duration,
                              'width': stream['width'], 'height': stream['height'], 'fps': measured_fps,
                              'pictureDuration': video_duration},
                    'tools': {b: run([b, '-version']).splitlines()[0] for b in ('ffmpeg', 'ffprobe')},
                    'checks': {'fullDecode': True, 'decodeOptions': '-v error -xerror; video and optional audio mapped; stderr must be empty'},
                    'audio': audio, 'frames': frames,
                    'intendedCues': cues, 'intendedScenes': scenes, 'transcript': transcript_data,
                    'propsSha256': sha256(props) if props else None,
                    'review': {'listened': False, 'visuallyReviewed': False, 'aiQaRun': False},
                    'limits': ['Sample timestamps are requested seek positions, rounded to a decoded frame; not every-frame inspection.',
                               'Intended cues are source timing, not recognized speech, OCR or proof of a visible reveal.',
                               'Imported ASR can be wrong. English declaration is not independent language verification.',
                               'Keyword search retrieves text. No semantic model, generated answers or creative score runs.',
                               'No new media generation, API call or upload is performed.']}
        (temp/'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')
        template = Path(__file__).with_name('video-review.html').read_text(encoding='utf-8')
        payload = json.dumps(manifest, ensure_ascii=True).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
        (temp/'index.html').write_text(template.replace('__REVIEW_MANIFEST__', payload), encoding='utf-8')
        temp.rename(output)
    except BaseException:
        shutil.rmtree(temp)
        raise
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--video', required=True, type=Path)
    parser.add_argument('--out', required=True, type=Path)
    parser.add_argument('--props', type=Path, help='Archived intended scene cues, not a transcript')
    parser.add_argument('--transcript', type=Path, help='Existing Whisper-format English JSON. Does not invoke Whisper.')
    parser.add_argument('--fps', type=float, help='Optional source timeline FPS. Must match media when using props.')
    args = parser.parse_args()
    try:
        print(build(args.video, args.out, args.props, args.transcript, args.fps) / 'index.html')
    except (ValueError, KeyError, OSError, StopIteration, subprocess.TimeoutExpired, ZeroDivisionError) as error:
        parser.exit(1, f'Review failed: {error}\n')


if __name__ == '__main__':
    main()
