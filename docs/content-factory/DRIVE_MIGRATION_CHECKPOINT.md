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

## Pending
Live Hostinger workflow has NOT been updated in this turn. The local Chrome extension tool is unavailable; no signed-in session has been reused or independently verified. Live workflow may still reference deleted source IDs. Do not run it as an operational backup/publishing pipeline. It remains a manual setup diagnostic with no publisher or daily schedule.
Google Drive connector access is not n8n Google OAuth. Connect n8n to allywebspaces@gmail.com through its credential manager; any new grant must be completed through the actual authorization screen. No credentials belong in chat or Git.
Next: restore connected Chrome access, inspect current live workflow before editing, apply the configured export without creating duplicates, save/execute manually and inspect output. Existing source templates retain private-ID placeholders; preserved baseline unchanged.
