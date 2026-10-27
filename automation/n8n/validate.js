function validate(input) {
  const c = input && typeof input === 'object' ? input : {};
  const m = c.media || {}, b = c.backup || {}, a = c.accounts || {}, d = c.aiDisclosure || {}, k = c.credentials || {};
  const blockers = [];
  const requireCheck = (ok, code, message) => { if (!ok) blockers.push({code, message}); };
  const text = v => typeof v === 'string' && v.trim().length > 0;
  const hash = v => typeof v === 'string' && /^[a-f0-9]{64}$/i.test(v);
  const expectedChannel = 'UC22bRh9oEI6GSrNHTswVw0A';
  requireCheck(text(c.episodeId), 'EPISODE_ID', 'Supply a stable unique episode ID; no duplicate ledger is queried here.');
  requireCheck(c.language === 'English' && c.reviewed === true, 'SCRIPT_REVIEW', 'Supply explicit human review of the English script.');
  requireCheck(c.approved === true, 'PUBLICATION_APPROVAL', 'Publication approval has not been supplied.');
  requireCheck((c.mode || 'draft-only') === 'draft-only', 'DRAFT_MODE_REQUIRED', 'This workflow accepts draft-only mode.');
  requireCheck(hash(m.sha256), 'MEDIA_HASH', 'Supply the SHA-256 of the actual final watermarked MP4.');
  requireCheck(Number.isInteger(m.width) && Number.isInteger(m.height) && m.width >= 720 && m.width * 16 === m.height * 9 && m.videoCodec === 'h264' && m.audioCodec === 'aac' && Number.isFinite(m.durationSeconds) && m.durationSeconds > 0 && m.durationSeconds <= 60, 'MEDIA_FORMAT', 'Supply inspected 9:16 portrait H.264/AAC (at least720px wide) media, 0–60 seconds (this pilot profile).');
  requireCheck(m.audioReviewed === true && m.subtitlesReviewed === true && m.watermarkReviewed === true && m.framesReviewed === true, 'MEDIA_REVIEW', 'Audio, subtitles, final watermark and frames need explicit review assertions.');
  requireCheck(d.reviewed === true, 'AI_DISCLOSURE_REVIEW', 'Review realistic synthetic-content disclosure requirements.');
  requireCheck(typeof d.required === 'boolean', 'AI_DISCLOSURE_DECISION', 'Record whether AI disclosure is required.');
  requireCheck(d.required !== true || (d.youtubeValue === true && text(d.instagramPlan)), 'AI_DISCLOSURE_PLAN', 'Required disclosure needs a YouTube setting and an Instagram disclosure plan.');
  requireCheck(b.rootFolderId === 'CONFIGURE_DRIVE_ROOT_FOLDER' && text(b.folderId) && text(b.fileId), 'BACKUP_REFERENCE', 'Supply the backup file ID in the configured Drive folder.');
  requireCheck(hash(b.sha256), 'BACKUP_HASH', 'Supply the backup SHA-256; this workflow does not read Drive.');
  requireCheck(hash(m.sha256) && hash(b.sha256) && m.sha256.toLowerCase() === b.sha256.toLowerCase(), 'BACKUP_HASH_MISMATCH', 'Final export and backup SHA-256 values must match.');
  requireCheck(a.youtubeChannelId === expectedChannel && a.authenticatedYoutubeChannelId === expectedChannel, 'YOUTUBE_CHANNEL_MISMATCH', 'Target and OAuth identity must both match the observed YouTube channel ID.');
  requireCheck(a.youtubeIdentityConfirmed === true, 'YOUTUBE_IDENTITY_REVIEW', 'Confirm channel identity; the proposed editor handle is not proof of a published identity.');
  requireCheck(text(a.instagramAccountId) && a.instagramAccountId === a.authenticatedInstagramAccountId && a.instagramIdentityConfirmed === true, 'INSTAGRAM_IDENTITY', 'Supply matching target/OAuth Instagram account IDs and identity review.');
  requireCheck(k.youtubeConnected === true && k.instagramConnected === true && k.driveConnected === true, 'CREDENTIAL_ASSERTIONS', 'YouTube, Instagram and Drive credential connection assertions are missing.');
  const metadataReady = blockers.length === 0;
  blockers.push({code:'LIVE_VERIFICATION_UNAVAILABLE',message:'No media bytes, Drive hashes, OAuth identities, token validity, publication eligibility, disclosures, or duplicate ledger have been verified by this manual workflow. Connect actual verifiers before a publishing workflow can establish readiness.'});
  return {episodeId:c.episodeId || null,project:'OpenReels',proposedBrand:'midnightstories.originals',mode:'draft-only',ready:false,publishEnabled:false,metadataReady,
    evidenceBasis:'user-supplied metadata; no media, Drive, OAuth or platform requests performed',
    checkType:'local metadata consistency only',blockers,
    nextAction:metadataReady ? 'Metadata is internally consistent. Implement and run live evidence checks; publication remains disabled.' : 'Resolve the listed metadata blockers, then run actual evidence checks; publication remains disabled.'};
}
