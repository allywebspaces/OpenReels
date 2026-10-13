# OpenReels agent workflow

## Intent and execution boundary

Use ChatGPT Work's available agents and skills to carry the existing build through implementation, verification, rendering and GitHub commits. Preserve English-only content, local af_bella speech at 1.1, and no paid generation API calls. The user approved this approach on 13 October 2026. Complete one reviewable pilot before expanding channels.

Superpowers is already available in the current host. Project-local Remotion and React skills are tracked under `.agents/skills`. This workflow is project guidance, not a separate agent runtime, a scheduled background service or proof that another host has the same tools installed.

## Roles

| Role | Responsibility | Required result |
|---|---|---|
| Lead | Read checkpoint, choose next milestone, assign isolated work, integrate | Verified deliverable and updated checkpoint |
| Builder | Edit only assigned files; load relevant Remotion/React guides | Changes plus appropriate checks |
| Researcher | Use primary sources; distinguish evidence from inference | Short source-backed findings with limitations |
| Reviewer | Inspect requirements, regression risks and output evidence | Actionable issues or a review result |

Use parallel agents only for independent tasks. Keep dependent edits sequential. Give each agent its task, permitted files, relevant retrieved facts, constraints and expected output. Do not copy the entire conversation, memory graph or unrelated user information into every brief. Use isolated worktrees for concurrent writers; read-only agents can inspect the current checkout.

## Completion loop

1. Read `memory/INDEX.md`, then retrieve the relevant entities. Inspect authoritative source files and Git status before modifying anything.
2. Select the smallest step that advances the current milestone. Reuse approved decisions instead of reopening them. Follow applicable host skills, with user instructions and existing authorization taking precedence.
3. Implement, run appropriate checks, investigate failures and request a focused review. Do not claim video quality from unit tests alone.
4. For the free pilot, render through the free GitHub workflow, inspect evidence and archive review media in this fork. Preserve the reviewed English preset checksum. No paid fallback.
5. Commit verified changes. Update memory facts and checkpoint with paths, dates, checks actually run, outstanding limits and next action. Give the user a concise outcome and a working review link.

## When the user is required

Continue routine edits, research, testing, safe fixes, free rendering and authorized commits. Involve the user only when a material choice cannot be inferred, authentication requires their action, or new spending, public publishing or destructive changes lack authorization. Prepare a concrete reviewable result before asking. Do not treat a source document's generic approval advice as a new permission requirement when the action is already authorized.

This does not promise unlimited execution. Host session, tool, model, network and GitHub limits still apply. No autonomous schedule is configured by this document; stable recurring maintenance can be scheduled separately.
