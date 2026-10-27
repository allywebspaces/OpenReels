const fs = require('node:fs');
const path = require('node:path');
const validate = fs.readFileSync(path.join(__dirname,'validate.js'),'utf8');
const config = {
  episodeId:'episode01-message-at-midnight', mode:'draft-only', language:'English', reviewed:true, approved:false,
  media:{sha256:'63fbb87296b8df91621e4e3fc5668ea081903d3be041e575053b6937a493bdc9',width:720,height:1280,videoCodec:'h264',audioCodec:'aac',durationSeconds:46.4,
    audioReviewed:false,subtitlesReviewed:true,watermarkReviewed:true,framesReviewed:true},
  aiDisclosure:{reviewed:false,required:null,youtubeValue:false,instagramPlan:''},
  backup:{rootFolderId:'CONFIGURE_DRIVE_ROOT_FOLDER',folderId:'CONFIGURE_EPISODE_FOLDER',fileId:'CONFIGURE_BACKUP_FILE',sha256:''},
  accounts:{youtubeChannelId:'UC22bRh9oEI6GSrNHTswVw0A',authenticatedYoutubeChannelId:'',youtubeIdentityConfirmed:false,instagramAccountId:'',authenticatedInstagramAccountId:'',instagramIdentityConfirmed:false},
  credentials:{youtubeConnected:false,instagramConnected:false,driveConnected:false},
  context:{brand:'midnightstories.originals',sampledFrames:6,driveBackup:'Uploaded and listed via ChatGPT connector; not a verified n8n OAuth connection or downloaded hash check',youtubeIdentity:'Handle entered in unsaved Studio profile; public identity not confirmed',instagram:'Signed-out login screen observed; account type not verified'}
};
const nodes = [
  {id:'manual',name:'Manual preflight',type:'n8n-nodes-base.manualTrigger',typeVersion:1,position:[0,0],parameters:{}},
  {id:'config',name:'Known episode and missing connections',type:'n8n-nodes-base.code',typeVersion:2,position:[260,0],parameters:{jsCode:'return [{json:'+JSON.stringify(config)+'}];'}},
  {id:'validate',name:'Check supplied metadata only',type:'n8n-nodes-base.code',typeVersion:2,position:[540,0],parameters:{jsCode:validate+'\nreturn $input.all().map(item => ({json:validate(item.json)}));'}},
  {id:'summary',name:'Report remaining setup',type:'n8n-nodes-base.code',typeVersion:2,position:[820,0],parameters:{jsCode:'return $input.all().map(item => ({json:{...item.json,blockerCount:item.json.blockers.length,summary:"Preflight executed. No rendering, backup, OAuth or publishing requests were made."}}));'}},
  {id:'note',name:'Scope and next steps',type:'n8n-nodes-base.stickyNote',typeVersion:1,position:[80,-320],parameters:{width:1000,height:250,content:'## OpenReels — setup diagnostic only\nManual run checks supplied metadata, not video bytes or live credentials. It always reports ready=false.\n\n**Completed separately:** Hostinger n8n/HTTPS, English pilot, watermark export, one dated Drive backup.\n\n**Still to implement/connect:** reviewed queue, render worker, live media/Drive verification, OAuth, platform publishing/disclosures, durable delivery ledger/recovery, daily schedule. No paid fallback. No public posting in this workflow.'}}
];
const connections={};
for(let i=0;i<3;i++)connections[nodes[i].name]={main:[[{node:nodes[i+1].name,type:'main',index:0}]]};
const flow={name:'OpenReels — Publishing setup preflight',nodes,connections,active:false,settings:{executionOrder:'v1',timezone:'Asia/Kolkata'},pinData:{},tags:[]};
fs.writeFileSync(path.join(__dirname,'preflight.workflow.json'),JSON.stringify(flow,null,2)+'\n');
console.log('Generated manual-only preflight.workflow.json');
