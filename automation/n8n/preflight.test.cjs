const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'validate.js'), 'utf8');
const validate = vm.runInNewContext(`${source}\nvalidate`);
const hash = '63fbb87296b8df91621e4e3fc5668ea081903d3be041e575053b6937a493bdc9';
const channel = 'UC22bRh9oEI6GSrNHTswVw0A';
function complete() {
  return {episodeId:'episode-001', language:'English', reviewed:true, approved:true,
    mode:'draft-only', media:{sha256:hash,width:1080,height:1920,videoCodec:'h264',audioCodec:'aac',durationSeconds:45,
      audioReviewed:true,subtitlesReviewed:true,watermarkReviewed:true,framesReviewed:true},
    aiDisclosure:{reviewed:true,required:true,youtubeValue:true,instagramPlan:'Apply platform AI disclosure before publishing'},
    backup:{rootFolderId:'CONFIGURE_DRIVE_ROOT_FOLDER',folderId:'CONFIGURE_EPISODE_FOLDER',fileId:'CONFIGURE_BACKUP_FILE',sha256:hash},
    accounts:{youtubeChannelId:channel,authenticatedYoutubeChannelId:channel,instagramAccountId:'123456789',
      authenticatedInstagramAccountId:'123456789',youtubeIdentityConfirmed:true,instagramIdentityConfirmed:true},
    credentials:{youtubeConnected:true,instagramConnected:true,driveConnected:true}};
}
const has = (result, code) => result.blockers.some(b => b.code === code);
// Removing fail-closed defaults would let an empty record appear ready.
test('missing input stays blocked with missing evidence',()=>{
 const r=validate(); assert.equal(r.ready,false); assert.equal(r.metadataReady,false); assert.ok(has(r,'SCRIPT_REVIEW')); assert.ok(has(r,'MEDIA_HASH'));
});
// Removing hash comparison would allow backing up one file and publishing another.
test('backup hash mismatch blocks otherwise complete metadata',()=>{
 const c=complete(); c.backup.sha256='a'.repeat(64); const r=validate(c); assert.equal(r.metadataReady,false); assert.ok(has(r,'BACKUP_HASH_MISMATCH'));
});
// Trusting manually supplied booleans as live verification would falsely authorize publishing.
test('complete supplied metadata never implies live verified readiness',()=>{
 const r=validate(complete()); assert.equal(r.metadataReady,true); assert.equal(r.ready,false); assert.equal(r.publishEnabled,false); assert.ok(has(r,'LIVE_VERIFICATION_UNAVAILABLE')); assert.equal(r.evidenceBasis,'user-supplied metadata; no media, Drive, OAuth or platform requests performed');
});
// Removing authenticated channel comparison could publish to the wrong channel.
test('authenticated channel mismatch blocks',()=>{
 const c=complete(); c.accounts.authenticatedYoutubeChannelId='UC_wrong'; const r=validate(c); assert.equal(r.metadataReady,false); assert.ok(has(r,'YOUTUBE_CHANNEL_MISMATCH'));
});
// Truthy strings must not count as explicit approval.
test('string approval and unsafe mode are rejected',()=>{
 const c=complete(); c.approved='true'; c.mode='public'; const r=validate(c); assert.equal(r.metadataReady,false); assert.ok(has(r,'PUBLICATION_APPROVAL')); assert.ok(has(r,'DRAFT_MODE_REQUIRED'));
});
// Media assertions and AI disclosure decisions are required independently.
test('invalid media and unresolved disclosure are blocked',()=>{
 const c=complete(); c.media.width=1920; c.aiDisclosure.required=null; const r=validate(c); assert.ok(has(r,'MEDIA_FORMAT')); assert.ok(has(r,'AI_DISCLOSURE_DECISION'));
});

test("existing720p portrait profile is accepted",()=>{const c=complete();c.media.width=720;c.media.height=1280;assert.equal(validate(c).metadataReady,true);});
