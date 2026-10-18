"""Check the controlled excerpt's narration and reveal boundaries."""
import json
import subprocess
import sys
import unittest
import runpy
import tempfile
from pathlib import Path

class ReactionPlanTest(unittest.TestCase):
    def test_plan_ends_before_photograph_and_preserves_warning_timing(self):
        script=Path(__file__).with_name('reaction-animatic.py')
        result=subprocess.run([sys.executable,str(script),'--plan'],capture_output=True,text=True)
        self.assertEqual(result.returncode,0,result.stderr)
        plan=json.loads(result.stdout)
        self.assertEqual(plan['endFrameExclusive'],385)
        self.assertEqual(sum(s['frames'] for s in plan['shots']),385)
        self.assertEqual(len(plan['captions']),5)
        self.assertFalse(any('photograph' in c['text'] for c in plan['captions']))
        warning=next(c for c in plan['captions'] if "Don't open" in c['text'])
        self.assertEqual(warning['startFrame'],121)
        self.assertTrue(plan['sourcePinsVerified'])

    def test_caption_is_visible_on_exact_start_frame_and_absent_on_end_frame(self):
        module=runpy.run_path(str(Path(__file__).with_name('reaction-animatic.py')))
        self.assertIn('make_caption_filters',module)
        with tempfile.TemporaryDirectory() as directory:
            filters=module['make_caption_filters']([{'text':'Test caption','startFrame':3,'endFrame':5}],Path(directory))
            result=subprocess.run(['ffmpeg','-v','error','-f','lavfi','-i','color=c=blue:s=720x1280:r=30:d=0.2',
                                   '-vf',filters,'-frames:v','6','-pix_fmt','rgb24','-f','rawvideo','-'],capture_output=True)
            self.assertEqual(result.returncode,0,result.stderr.decode())
            size=720*1280*3
            frames=[result.stdout[i*size:(i+1)*size]for i in range(6)]
            self.assertEqual(frames[0],frames[2])
            self.assertNotEqual(frames[2],frames[3])
            self.assertEqual(frames[3],frames[4])
            self.assertEqual(frames[2],frames[5])

if __name__=='__main__':unittest.main()
