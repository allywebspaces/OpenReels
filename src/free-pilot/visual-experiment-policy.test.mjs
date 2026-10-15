import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {experimentPaths,verifyVisualExperiment} from './visual-experiment-policy.mjs';
test('visual-only experiment accepts reviewed source and unchanged story/audio source',()=>assert.equal(verifyVisualExperiment().props.scenes.length,5));
for(const [key,label] of [['visual','visual'],['props','props'],['video','audio-source video']]) test(`changed ${label} is blocked before browser or provider work`,()=>{
 const dir=mkdtempSync(join(tmpdir(),'visual-policy-'));
 try {const changed=join(dir,'changed');writeFileSync(changed,Buffer.concat([readFileSync(experimentPaths[key]),Buffer.from('unreviewed')]));assert.throws(()=>verifyVisualExperiment({...experimentPaths,[key]:changed}),new RegExp(`Unreviewed ${label}`));} finally{rmSync(dir,{recursive:true});}
});
