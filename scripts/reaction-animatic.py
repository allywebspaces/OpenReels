#!/usr/bin/env python3
"""Assemble one approved 385-frame excerpt with supplied character stills.

Asset generation is external to this recipe. No model, API or installer runs.
"""
import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
import textwrap
import wave
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
VIDEO='examples/micro-drama/episode-01-question-revision/pilot.mp4'
CUES='examples/micro-drama/episode-01-question-revision/cues.json'
PINS={VIDEO:'9b438dff1eece70ea902c04921d6bdca61c90815288cc587bfb2ea6f2a3053c7',
      CUES:'0e424b9d580f6b19bbe3692121f5c76f2446e407e3248237cd167935940c51ee'}
FPS=30
FRAMES=385
SHOTS=[{'panel':0,'frames':209,'meaning':'Read the phone'},
       {'panel':1,'frames':49,'meaning':'React towards the closed door'},
       {'panel':2,'frames':65,'meaning':'Reach towards the lock without turning it'},
       {'panel':0,'frames':62,'meaning':'Return to the phone before the photograph line'}]


def digest(path):
    with path.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()


def run(command,binary=False):
    result=subprocess.run(command,capture_output=True,text=not binary,timeout=180)
    if result.returncode:raise ValueError(f'{command[0]} failed: {result.stderr[-1800:]}')
    return result.stdout


def plan():
    for relative,expected in PINS.items():
        if digest(ROOT/relative)!=expected:raise ValueError('Unreviewed English source: '+relative)
    captions=[c for c in json.loads((ROOT/CUES).read_text()) if c['startFrame']<FRAMES]
    if any(c['endFrame']>FRAMES for c in captions):raise ValueError('Excerpt would truncate a reviewed caption')
    return {'fps':FPS,'endFrameExclusive':FRAMES,'sourcePinsVerified':True,'shots':SHOTS,'captions':captions}


def make_caption_filters(captions,directory):
    filters=[]
    for index,cue in enumerate(captions):
        textfile=directory/f'caption-{index}.txt'
        textfile.write_text('\n'.join(textwrap.wrap(cue['text'],width=34)),encoding='utf-8')
        filters.append(f"drawtext=textfile='{textfile}':font='DejaVu Sans':fontsize=32:fontcolor=white:"
                       f"x=(w-text_w)/2:y=h-78-text_h:line_spacing=8:box=1:boxcolor=black@0.35:boxborderw=12:"
                       f"enable='gte(n,{cue['startFrame']})*lt(n,{cue['endFrame']})'")
    return ','.join(filters)


def aac_hash(path):
    return hashlib.sha256(run(['ffmpeg','-v','error','-nostdin','-i',str(path),'-map','0:a:0',
                              '-c:a','copy','-f','adts','-'],True)).hexdigest()


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--plan',action='store_true')
    parser.add_argument('--artwork',type=Path,help='Three equal portrait panels in one PNG')
    parser.add_argument('--artwork-sha256',help='Manually inspected artwork SHA256')
    parser.add_argument('--out',type=Path,default=ROOT/'output/reaction-animatic')
    args=parser.parse_args();temp=None
    try:
        p=plan()
        if args.plan:print(json.dumps(p));return
        if not args.artwork or digest(args.artwork)!=args.artwork_sha256:
            raise ValueError('Supply the inspected artwork and its exact --artwork-sha256')
        output=args.out.resolve()
        if output.exists():raise ValueError('Output exists. Use a new folder.')
        output.parent.mkdir(parents=True,exist_ok=True)
        temp=Path(tempfile.mkdtemp(prefix='.reaction-',dir=output.parent))
        shutil.copyfile(args.artwork,temp/'artwork.png')
        (temp/'intended-captions.json').write_text(json.dumps(p['captions'],indent=2),encoding='utf-8')
        # Preserve the same decoded source-narration samples for both conditions.
        run(['ffmpeg','-v','error','-nostdin','-i',str(ROOT/VIDEO),'-vn','-af',
             'atrim=end_sample=616000,asetpts=PTS-STARTPTS','-c:a','pcm_s16le',str(temp/'narration-reference.wav')])
        with wave.open(str(temp/'narration-reference.wav'),'rb') as wav:
            if (wav.getframerate(),wav.getnframes())!=(48000,616000):raise ValueError('Unexpected source audio rate or excerpt sample count')
        parts=['[0:v]split=4[i0][i1][i2][i3]']
        for index,shot in enumerate(SHOTS):
            parts.append(f"[i{index}]crop=trunc(iw/3):ih:trunc(iw/3)*{shot['panel']}:0,scale=1080:1920,"
                         f"zoompan=z='1+0.015*on/{shot['frames']}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':"
                         f"d={shot['frames']}:s=720x1280:fps=30,setpts=PTS-STARTPTS[s{index}]")
        parts.append('[s0][s1][s2][s3]concat=n=4:v=1:a=0,settb=1/30,setpts=N,'+make_caption_filters(p['captions'],temp)+'[v]')
        common=['-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k',
                '-t',str(FRAMES/FPS),'-movflags','+faststart']
        run(['ffmpeg','-v','error','-nostdin','-i',str(temp/'artwork.png'),'-i',str(temp/'narration-reference.wav'),
             '-filter_complex',';'.join(parts),'-map','[v]','-map','1:a:0',*common,str(temp/'character-reaction.mp4')])
        run(['ffmpeg','-v','error','-nostdin','-i',str(ROOT/VIDEO),'-i',str(temp/'narration-reference.wav'),
             '-map','0:v:0','-map','1:a:0',*common,str(temp/'prop-reference.mp4')])
        audio_hashes=[aac_hash(temp/name) for name in ['character-reaction.mp4','prop-reference.mp4']]
        if audio_hashes[0]!=audio_hashes[1]:raise ValueError('Comparison AAC streams differ')
        filters=("[0:v]pad=iw:ih+64:0:64:color=0x14283e,drawtext=text='Prop-led original':fontcolor=white:fontsize=26:x=(w-tw)/2:y=18[l];"
                 "[1:v]pad=iw:ih+64:0:64:color=0x14283e,drawtext=text='Character-reaction animatic':fontcolor=white:fontsize=26:x=(w-tw)/2:y=18[r];"
                 "[l][r]hstack=shortest=1[v]")
        run(['ffmpeg','-v','error','-nostdin','-i',str(temp/'prop-reference.mp4'),'-i',str(temp/'character-reaction.mp4'),
             '-filter_complex',filters,'-map','[v]','-map','0:a:0','-c:v','libx264','-preset','fast','-crf','20',
             '-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',str(temp/'comparison.mp4')])
        checks={}
        for name in ['character-reaction.mp4','prop-reference.mp4','comparison.mp4']:
            run(['ffmpeg','-v','error','-xerror','-nostdin','-i',str(temp/name),'-f','null','-'])
            probe=json.loads(run(['ffprobe','-v','error','-select_streams','v:0','-show_entries',
                                  'stream=width,height,nb_frames,avg_frame_rate','-of','json',str(temp/name)]))
            if int(probe['streams'][0]['nb_frames'])!=FRAMES:raise ValueError('Wrong video frame count: '+name)
            checks[name]={'sha256':digest(temp/name),'fullDecode':True,'video':probe['streams'][0],'aacAdtsSha256':aac_hash(temp/name)}
        (temp/'samples').mkdir()
        for frame in [0,120,121,200,208,209,254,257,258,320,322,323,382,384]:
            run(['ffmpeg','-v','error','-nostdin','-i',str(temp/'character-reaction.mp4'),'-vf',f'select=eq(n\\,{frame})',
                 '-frames:v','1','-q:v','2',str(temp/f'samples/frame-{frame:03d}.jpg')])
        manifest={'schemaVersion':1,'kind':'host_imagegen_assisted_still_animatic_not_acted_video',
                  'language':'English','plan':p,'sourcePins':PINS,'artworkSha256':args.artwork_sha256,
                  'generatorSha256':digest(Path(__file__)),'narrationReferenceWavSha256':digest(temp/'narration-reference.wav'),
                  'narrationSampleCount':616000,'narrationSampleRate':48000,'audioReencodedForExcerpt':True,
                  'conditionsShareIdenticalEncodedAudio':True,'checks':checks,
                  'limits':['Photographic stills plus camera moves are not acted footage, lip-sync or generated motion.',
                            'Source narration is unchanged, but excerpt AAC is re-encoded from the shared reference PCM.',
                            'Image assets required the built-in host image tool; no offline arbitrary-script asset generator was added.',
                            'New layout, photography and human depiction change together. This is a visual-format test, not isolated causal proof.',
                            'No complete listening, phone playback or audience testing is inferred.']}
        (temp/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
        temp.rename(output);temp=None
        print(json.dumps({'output':str(output),'checks':checks}))
    except (ValueError,OSError,KeyError,subprocess.TimeoutExpired) as error:
        parser.exit(1,f'Animatic failed: {error}\n')
    finally:
        if temp:shutil.rmtree(temp)

if __name__=='__main__':main()
