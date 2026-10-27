# n8n preflight and Drive backup checkpoint

27 October: initial manual-only n8n metadata preflight imported and executed successfully on Hostinger2.44.7. Seven local Node tests passed. Dated Drive backup uploaded/listed via connected Drive, not n8n. Google Drive OAuth client configuration missing in n8n; Instagram signed out; YouTube handle/name edits observed unsaved. No public posting or daily schedule active. See N8N_PREFLIGHT_CHECKPOINT.md. 

## Actual work

Created a five-node workflow: manual trigger, known-episode metadata, metadata consistency checks, setup report, explanatory sticky note. Executed in the real n8n editor; observed success and final output ready=false,publishEnabled=false,metadataReady=false,11 blockers. No media bytes, Drive API or OAuth/platform calls occur in that workflow. The source tests distinguish metadata consistency from actual evidence. Wrong channels, backup mismatches, missing review/disclosure and unsafe mode are rejected. Existing720p9:16 profile accepted. This is a setup diagnostic, not the completed production workflow or95% completion.

Drive backup created privately under OpenReels/2026-10-27/The_Message_at_Midnight. Uploaded and listed branded MP4,script,cues,watermark,evidence; setup workflow JSON backed up in date folder. Remote video size3267822bytes matches local. Local SHA25663fbb87296b8df91621e4e3fc5668ea081903d3be041e575053b6937a493bdc9. Remote hash/download not verified. The backup via ChatGPT connector is independent of n8n credentials; no credentials exported or transferred.

## Remaining

n8n has no credentials. Google Drive OAuth modal requires Client ID and Client Secret plus Google Drive API enabled. Callback shown at live HTTPS instance under /rest/oauth2-credential/callback. No secret entered or empty credential saved. User must securely complete new credentials/permissions as required. Instagram login screen reports failed sign-in; no retries/password-reset attempted. YouTube Studio still shows old published identity with proposed Midnight Stories/handle entered in editor; no Publish clicked. Preserve unsaved edits.

Still unimplemented: fresh-story/assets generation, render worker, reviewed queue, live verification, automated Drive archive, durable duplicate ledger/partial-failure recovery, publishing/disclosure operations and daily schedule. No paid-provider call or social post. Public source templates must not contain private Drive or credential IDs; live configured export retained privately in Drive.
