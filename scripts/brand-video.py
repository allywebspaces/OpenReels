#!/usr/bin/env python3
"""Apply the channel watermark to a separate portrait MP4 export, offline."""
import argparse
import base64
import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def run(args):
    return subprocess.run(args, check=True, capture_output=True, timeout=300).stdout


def probe(path):
    return json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-of', 'json', str(path)]))


def audio_hash(path):
    return hashlib.sha256(run(['ffmpeg', '-v', 'error', '-nostdin', '-i', str(path),
                              '-map', '0:a:0', '-c', 'copy', '-f', 'adts', '-'])).hexdigest()


def export(source, target):
    source, target = Path(source).resolve(), Path(target).resolve()
    if source == target or target.exists():
        raise ValueError('Use a new output path; originals are never overwritten.')
    info = probe(source)
    v = next(s for s in info['streams'] if s['codec_type'] == 'video')
    if v['width'] * 16 != v['height'] * 9 or v.get('sample_aspect_ratio', '1:1') not in ('1:1', 'N/A'):
        raise ValueError('This reviewed placement supports square-pixel 9:16 portrait only.')
    a = next(s for s in info['streams'] if s['codec_type'] == 'audio')
    if a['codec_name'] != 'aac':
        raise ValueError('AAC input is required for verified audio stream copying.')
    asset = json.loads((ROOT / 'assets/branding/watermark.json').read_text())
    png = base64.b64decode(asset['pngBase64'], validate=True)
    if hashlib.sha256(png).hexdigest() != asset['sha256']:
        raise ValueError('Watermark asset checksum mismatch.')
    w, h = v['width'], v['height']
    size, x, y = round(w * .10), round(w / 30), round(h * .21875)
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='.brand-', dir=target.parent) as temp:
        temp = Path(temp)
        (temp / 'logo.png').write_bytes(png)
        result = temp / 'branded.mp4'
        filters = (f'[1:v]scale={size}:{size},format=rgba,colorchannelmixer=aa=0.65[wm];'
                   f'[0:v][wm]overlay=x={x}:y={y}:eof_action=repeat:repeatlast=1:format=auto,format=yuv420p[v]')
        run(['ffmpeg', '-v', 'error', '-nostdin', '-noautorotate', '-i', str(source),
             '-i', str(temp / 'logo.png'), '-filter_complex_threads', '1', '-filter_complex', filters,
             '-map', '[v]', '-map', '0:a:0', '-map_metadata', '0', '-c:v', 'libx264',
             '-preset', 'fast', '-crf', '19', '-fps_mode', 'passthrough', '-c:a', 'copy',
             '-movflags', '+faststart', str(result)])
        run(['ffmpeg', '-v', 'error', '-xerror', '-nostdin', '-i', str(result), '-f', 'null', '-'])
        after = next(s for s in probe(result)['streams'] if s['codec_type'] == 'video')
        for key in ('width', 'height', 'nb_frames', 'avg_frame_rate'):
            if v.get(key) != after.get(key):
                raise ValueError('Output video differs in ' + key)
        before_audio, after_audio = audio_hash(source), audio_hash(result)
        if before_audio != after_audio:
            raise ValueError('Audio stream changed.')
        evidence = {'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                    'outputSha256': hashlib.sha256(result.read_bytes()).hexdigest(),
                    'assetSha256': asset['sha256'], 'placement': {'x': x, 'y': y, 'size': size, 'opacity': .65},
                    'entireVideo': True, 'audioStreamIdentical': True, 'aacAdtsSha256': after_audio,
                    'fullDecode': True, 'frames': after.get('nb_frames'),
                    'limits': ['Placement reviewed for existing prop-led episode01 template; future shots need visual clearance review.',
                               'Encoding checks do not prove platform UI clearance, listening or audience quality.']}
        result.rename(target)
    return evidence


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    report = args.output.with_suffix('.branding.json')
    if report.exists():
        parser.error('Branding report already exists; use a new output path.')
    try:
        evidence = export(args.input, args.output)
        report.write_text(json.dumps(evidence, indent=2) + '\n')
        print(json.dumps(evidence))
    except (ValueError, OSError, StopIteration, subprocess.SubprocessError) as error:
        parser.exit(1, 'Branding failed: ' + str(error) + '\n')


if __name__ == '__main__':
    main()
