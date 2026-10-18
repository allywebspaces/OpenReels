"""Behavior tests for the offline actual-video review workflow."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('video_review.py')


class VideoReviewTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.video = self.root / 'input.mp4'
        subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i',
                        'color=c=blue:s=160x240:r=10:d=2', '-f', 'lavfi', '-i',
                        'sine=frequency=440:sample_rate=16000:duration=2',
                        '-c:v', 'libx264', '-c:a', 'aac', '-shortest', str(self.video)], check=True)

    def tearDown(self):
        self.tmp.cleanup()

    def run_review(self, *args):
        return subprocess.run([sys.executable, str(SCRIPT), '--video', str(self.video),
                               '--out', str(self.root / 'review'), *args], capture_output=True, text=True)

    def test_real_mp4_produces_decoded_hashed_evidence_and_local_player(self):
        result = self.run_review()
        self.assertEqual(result.returncode, 0, result.stderr)
        out = self.root / 'review'
        data = json.loads((out / 'manifest.json').read_text())
        self.assertEqual(data['video']['sha256'], __import__('hashlib').sha256(self.video.read_bytes()).hexdigest())
        self.assertTrue(data['checks']['fullDecode'])
        self.assertFalse(data['review']['listened'])
        self.assertEqual(data['transcript']['status'], 'not_available')
        self.assertGreater(len(data['audio']['windows']), 0)
        self.assertTrue(all((out / x['file']).is_file() for x in data['frames']))
        self.assertIn('exportReview', (out / 'index.html').read_text())
        self.assertIn('audio.wav', (out / 'index.html').read_text())

    def test_scene_cues_become_absolute_intended_text_not_recognized_speech(self):
        props = self.root / 'props.json'
        props.write_text(json.dumps({'scenes':[
            {'durationInFrames':10,'cues':[{'startFrame':0,'endFrame':8,'text':'First.'}]},
            {'durationInFrames':10,'cues':[{'startFrame':2,'endFrame':8,'text':'Second.'}]}]}))
        result = self.run_review('--props',str(props),'--fps','10')
        self.assertEqual(result.returncode, 0, result.stderr)
        data = json.loads((self.root/'review'/'manifest.json').read_text())
        self.assertEqual(data['intendedCues'][1]['start'],1.2)
        self.assertEqual(data['intendedCues'][1]['evidenceType'],'intended_script_not_asr')

    def test_actual_whisper_transcript_requires_explicit_english_language(self):
        transcript = self.root/'transcript.json'
        transcript.write_text(json.dumps({'language':'fr','segments':[{'start':0,'end':1,'text':'Bonjour.'}]}))
        result = self.run_review('--transcript',str(transcript))
        self.assertNotEqual(result.returncode,0)
        self.assertIn('English',result.stderr)
        self.assertFalse((self.root/'review').exists())

    def test_english_transcript_is_separate_and_html_injection_is_escaped(self):
        transcript=self.root/'transcript.json'
        transcript.write_text(json.dumps({'language':'en','segments':[{'start':0,'end':1,'text':'</script><script>alert(1)</script>'}]}))
        result=self.run_review('--transcript',str(transcript))
        self.assertEqual(result.returncode,0,result.stderr)
        out=self.root/'review'
        data=json.loads((out/'manifest.json').read_text())
        self.assertEqual(data['transcript']['status'],'imported_asr_not_manually_verified')
        self.assertNotIn('</script><script>alert', (out/'index.html').read_text())

    def test_invalid_transcript_time_is_rejected_before_output(self):
        transcript=self.root/'transcript.json'
        transcript.write_text(json.dumps({'language':'en','segments':[{'start':0,'end':900,'text':'Too late.'}]}))
        result=self.run_review('--transcript',str(transcript))
        self.assertNotEqual(result.returncode,0)
        self.assertFalse((self.root/'review').exists())

    def test_existing_output_is_never_overwritten(self):
        out=self.root/'review';out.mkdir();(out/'keep.txt').write_text('Keep me')
        result=self.run_review()
        self.assertNotEqual(result.returncode,0)
        self.assertEqual((out/'keep.txt').read_text(),'Keep me')

    def test_audio_tail_beyond_video_does_not_request_nonexistent_frames(self):
        self.video.unlink()
        subprocess.run(['ffmpeg','-v','error','-f','lavfi','-i','color=c=red:s=160x240:r=10:d=1',
                        '-f','lavfi','-i','sine=frequency=440:sample_rate=16000:duration=1.2',
                        '-c:v','libx264','-c:a','aac',str(self.video)],check=True)
        result=self.run_review()
        self.assertEqual(result.returncode,0,result.stderr)

    def test_html_embedded_transcript_round_trips_special_characters(self):
        transcript=self.root/'transcript.json'
        text='A < B & C > D </script>'
        transcript.write_text(json.dumps({'language':'en','segments':[{'start':0,'end':1,'text':text}]}))
        result=self.run_review('--transcript',str(transcript))
        self.assertEqual(result.returncode,0,result.stderr)
        html=(self.root/'review'/'index.html').read_text()
        payload=html.split('<script id="manifest" type="application/json">')[1].split('</script>')[0]
        self.assertEqual(json.loads(payload)['transcript']['segments'][0]['text'],text)

    def test_silent_video_is_reviewable_without_claiming_audio_evidence(self):
        self.video.unlink()
        subprocess.run(['ffmpeg','-v','error','-f','lavfi','-i','color=c=blue:s=160x240:r=10:d=1',
                        '-c:v','libx264',str(self.video)],check=True)
        result=self.run_review()
        self.assertEqual(result.returncode,0,result.stderr)
        out=self.root/'review'
        self.assertEqual(json.loads((out/'manifest.json').read_text())['audio']['status'],'no_audio_stream')
        self.assertFalse((out/'audio.wav').exists())

    def test_invalid_mp4_does_not_produce_a_clean_evidence_pack(self):
        self.video.write_bytes(b'not a video')
        result=self.run_review()
        self.assertNotEqual(result.returncode,0)
        self.assertFalse((self.root/'review').exists())


if __name__ == '__main__':
    unittest.main()
