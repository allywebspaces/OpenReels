# Manual setup preflight

Run `node build-preflight.cjs` to generate `preflight.workflow.json`. Import into n8n2.44.7, save and execute manually. Run `node --test preflight.test.cjs` for seven deterministic checks.

This workflow only checks supplied metadata and always returns ready=false. It has no rendering, Drive upload, OAuth or publisher nodes. It is a diagnostic milestone, not a production publishing pipeline. The exact privately configured instance was manually executed successfully; its export is backed up privately in Drive. Public source uses CONFIGURE placeholders for private Drive references. Replace the root-folder sentinel consistently in validator/configuration before use. The source generator and tests use matching fixture values; they do not establish that the files/permissions exist.

No API keys, tokens or passwords belong in the workflow JSON. Connect credentials through n8n's credential manager after owner authorization. No schedule is activated by this import. See docs/content-factory/N8N_PREFLIGHT_CHECKPOINT.md for actual scope and remaining blockers.
