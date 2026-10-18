#!/usr/bin/env python3
"""Render a labeled comparison of the two existing reviewed episode01 videos.

This does not render a new story, regenerate narration or call any provider.
"""
import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = [
    ('Approved original', 'examples/micro-drama/episode-01-question-revision/pilot.mp4',
     '9b438dff1eece70ea902c04921d6bdca61c90815288cc587bfb2ea6f2a3053c7'),
    ('Existing visual alternative', 'examples/micro-drama/episode-01-visual-experiment/pilot.mp4',
     '44b16bea81cf5eecb3e2686a2e2e94d30e45e0e584c3b6c4b40b6c239fb8c40b'),
]


def run(command, binary=False):
    result = subprocess.run(command, capture_output=True, text=not binary, timeout=180)
    if result.returncode:
        raise ValueError(f'{command[0]} failed: {result.stderr[-1500:]}')
    return result.stdout


def digest(path):
    with path.open('rb') as source:
        return hashlib.file_digest(source, 'sha256').hexdigest()


def aac_hash(path):
    return hashlib.sha256(run(['ffmpeg','-v','error','-nostdin','-i',str(path),
                              '-map','0:a:0','-c:a','copy','-f','adts','-'], binary=True)).hexdigest()


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out',type=Path,default=ROOT/'output/visual-comparison')
    parser.add_argument('--check',action='store_true')
    args=parser.parse_args()
    temp=None
    try:
        sources=[]
        for label,relative,expected in SOURCES:
            path=ROOT/relative
            actual=digest(path)
            if actual!=expected:
                raise ValueError(f'Unexpected source hash: {relative}. Refusing an unreviewed input.')
            sources.append({'label':label,'path':relative,'sha256':actual,'aacAdtsSha256':aac_hash(path)})
        if sources[0]['aacAdtsSha256']!=sources[1]['aacAdtsSha256']:
            raise ValueError('Source audio differs. This comparison requires identical encoded narration.')
        if args.check:
            print(json.dumps({'checked':True,'sources':sources,'apiCalls':0}));return
        output=args.out.resolve()
        if output.exists():
            raise ValueError('Output exists. Choose a new folder.')
        output.parent.mkdir(parents=True,exist_ok=True)
        temp=Path(tempfile.mkdtemp(prefix='.comparison-',dir=output.parent))
        video=temp/'comparison.mp4'
        filters=("[0:v]pad=iw:ih+64:0:64:color=0x14283e,drawtext=text='Approved original':fontcolor=white:fontsize=28:x=(w-tw)/2:y=17[l];"
                 "[1:v]pad=iw:ih+64:0:64:color=0x14283e,drawtext=text='Existing visual alternative':fontcolor=white:fontsize=28:x=(w-tw)/2:y=17[r];"
                 "[l][r]hstack=inputs=2:shortest=1[v]")
        run(['ffmpeg','-v','error','-nostdin','-i',str(ROOT/SOURCES[0][1]),'-i',str(ROOT/SOURCES[1][1]),
             '-filter_complex',filters,'-map','[v]','-map','0:a:0','-c:v','libx264','-preset','fast',
             '-crf','20','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',str(video)])
        output_audio=aac_hash(video)
        if output_audio!=sources[0]['aacAdtsSha256']:
            raise ValueError('Comparison audio hash changed')
        run(['ffmpeg','-v','error','-xerror','-nostdin','-i',str(video),'-f','null','-'])
        frames=[]
        for timestamp in [0,4.033333,17.333333,19.233333,44.266667,45.5]:
            name=f'comparison-{timestamp:.3f}.jpg'
            run(['ffmpeg','-v','error','-nostdin','-ss',str(timestamp),'-i',str(video),'-frames:v','1','-q:v','2',str(temp/name)])
            frames.append({'time':timestamp,'file':name,'sha256':digest(temp/name)})
        probe=json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(video)]))
        manifest={'schemaVersion':1,'kind':'comparison_of_existing_videos_not_a_new_pilot','language':'English',
                  'sources':sources,'generatorSha256':digest(Path(__file__)),'outputSha256':digest(video),
                  'outputAacAdtsSha256':output_audio,'encodedAudioIdentical':True,'fullDecode':True,
                  'probe':probe,'samples':frames,'completeWatch':False,'listeningAssessed':False,
                  'limits':['Comparison presents existing visual changes. It does not establish audience preference.',
                            'Side-by-side scaling on a phone reduces apparent text size. Original videos remain available.',
                            'Same encoded audio does not prove emotional delivery or phone audibility.']}
        (temp/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
        (temp/'README.txt').write_text('Left: approved original. Right: existing visual alternative.\n'
                                     'The encoded narration is identical. Compare visual attention, clue legibility and the final question.\n'
                                     'These are existing videos shown together, not a newly generated story or an audience-quality verdict.\n'
                                     'Listen/watch quality is unassessed by the build. Original media are unchanged.\n',encoding='utf-8')
        temp.rename(output);temp=None
        print(json.dumps({'output':str(output),'sha256':manifest['outputSha256'],'audioIdentical':True}))
    except (ValueError,OSError,subprocess.TimeoutExpired) as error:
        parser.exit(1,f'Comparison failed: {error}\n')
    finally:
        if temp:shutil.rmtree(temp)


if __name__=='__main__':main()
