# Drive migration and reference checkpoint — 27 October 2026

## Completed
User requested recreation under allywebspaces@gmail.com followed by deletion from alistairdocuments@gmail.com. Both Drive connections were verified. Created a new OpenReels/date/episode folder hierarchy as the project account. Recreated six files: branded MP4, script, caption cues, watermark, branding evidence, and setup workflow export. Read back destination ownership and parents. Downloaded all six source/copy pairs and compared complete bytes before deleting six original files. Original folders remain empty of files; the connector rejects folder URLs for deletion.

Video: 3,267,822 bytes, SHA-256 63fbb87296b8df91621e4e3fc5668ea081903d3be041e575053b6937a493bdc9.
The private migration manifest in the new root records old/new IDs, byte counts and per-file hashes. Do not reuse earlier Drive links. Private IDs remain in that manifest, rather than public source.

## Saved workflow updated
Reconfigured the privately saved workflow export with the new root/episode/video IDs, including the validator's configured root literal. Recorded the independently verified backup hash and an explicit connector-evidence context. Credentials remain false and workflow inactive.
SHA-256 of the updated 8,970-byte export: d5793a0588bc4dd046116a9fcc3f771b79c728f4a8d50ddf8301541323bd866d.
Read back the updated file from Drive and compared complete bytes with the checked local file.

Executed the three Code nodes sequentially in a local Node VM. Checked new Drive references resolve the reference/hash metadata blockers; ready=false, publishEnabled=false, metadataReady=false, nine blockers remain. Checked connection graph, node count, manual/summary/note nodes unchanged. This verifies saved configuration consistency only; not n8n execution, current OAuth, media quality or publishing.

The original export was byte-identical at migration time; its later deliberate reference update changes its hash. The manifest records this distinction.

## Live n8n update — 28 October 2026 (India)

Connected Chrome was available. Inspected the existing Hostinger preflight before editing; it still contained deleted-source references and an empty backup hash. Updated the existing configuration and validator Code nodes from the private Drive export whose SHA-256 independently matched d5793a0588bc4dd046116a9fcc3f771b79c728f4a8d50ddf8301541323bd866d. No duplicate workflow was created. Manual trigger, summary, note and connections retained.

Manual n8n execution succeeded. Output inspected: blockerCount=9, ready=false, publishEnabled=false, metadataReady=false. BACKUP_REFERENCE, BACKUP_HASH and BACKUP_HASH_MISMATCH absent. Reloaded the page and confirmed the migrated root remained in saved configuration. This is metadata consistency evidence, not live Drive/media verification.

## Pending

n8n credential manager lists no saved credentials. Opened Google Drive OAuth2 setup: required Client ID and Client Secret are blank; Save disabled. No credential saved and no OAuth grant completed. Account for eventual Google authorization is allywebspaces@gmail.com. Enter client configuration directly in n8n; never chat or Git. Callback is the instance's /rest/oauth2-credential/callback endpoint.

Publishing remains disabled; no publisher or daily schedule added. Workflow remains a manual setup diagnostic. Next: configure Google OAuth client securely in n8n, authorize the project account through the actual Google screen, then implement and verify live Drive access separately.
