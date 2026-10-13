# Official MCP memory integration

This separate development tool pulls in `@modelcontextprotocol/server-memory@1.0.0` from the official [modelcontextprotocol/servers repository](https://github.com/modelcontextprotocol/servers/tree/main/src/memory). MIT licensed. Dependencies and integrity hashes are pinned in `package-lock.json`; install scripts are disabled. No model or embedding service is used. Video runtime dependencies are unchanged.

```bash
npm ci --prefix tools/agent-memory --ignore-scripts
node tools/agent-memory/memory.mjs search voice
node tools/agent-memory/memory.mjs open NextMilestone
npm test --prefix tools/agent-memory
```

The wrapper connects to the real server via stdio MCP, using an absolute path to `docs/content-factory/memory/project.jsonl`. Reads work in this Work session through the terminal. The store and lockfile are committed to the existing fork, so a clean checkout can restore them; dependency installation alone is not durable storage. Commit memory updates alongside the changes they describe. These are public project facts only.

An explicit `MEMORY_FILE_PATH` overrides the wrapper's default store and is resolved to an absolute path. Use this for isolated test fixtures or another reviewed project store. Store choice must be known when assessing retrieval evidence; a custom store is not automatically backed up by this repository.

For another compatible MCP client, configure `command: node`, `args: [<absolute-checkout>/tools/agent-memory/node_modules/@modelcontextprotocol/server-memory/dist/index.js]` and environment `MEMORY_FILE_PATH: <absolute-checkout>/docs/content-factory/memory/project.jsonl`. The native server exposes mutation tools; only write reviewed public facts. Keep the graph compact and commit changes. Our wrapper intentionally exposes retrieval only; update sourced records in Git through normal project edits.

This is not an installed global ChatGPT connector. ChatGPT Work does not automatically register a local stdio server from a repository; a host supporting stdio MCP needs explicit configuration. No matching Mem0 plugin was returned by the available plugin directory search on 13 October 2026. No account-wide chat history was imported.

## Options considered

- Official MCP memory: file-backed knowledge graph, substring search, no inference calls; chosen for compact project facts. It loads the file and is intended for a small curated graph, not unlimited storage. The native search has no pagination; our wrapper bounds complete fact output to 6,000 bytes and avoids `read_graph`.
- [Mem0](https://github.com/mem0ai/mem0): automatic extraction and semantic retrieval need an LLM, embeddings and a store. Local providers can be configured, but default cloud inference is unsuitable for the current no-paid-API requirement. No vendor token-savings benchmark is assumed to apply to this project.
- [Letta](https://github.com/letta-ai/letta): stateful agent host with memory; larger runtime adoption than this project needs. Current development points to Letta Code, so old server installation recipes should not be assumed current.

Sources checked 13 October 2026: official [memory README](https://github.com/modelcontextprotocol/servers/blob/main/src/memory/README.md), [package metadata](https://github.com/modelcontextprotocol/servers/blob/main/src/memory/package.json), npm registry metadata, [Mem0 configuration](https://docs.mem0.ai/open-source/overview), and [Letta source notice](https://github.com/letta-ai/letta). Memory improves continuity only if facts are maintained and retrieved. It does not remove context-window limits, guarantee accuracy or provide unlimited account-wide memory. Actual token savings are unmeasured.

The wrapper validates JSONL syntax and required entity/relation fields before retrieval. Corrupt or missing stores fail explicitly rather than appearing to contain no matching facts. The tests cover real-server retrieval, unknown facts, empty-query refusal, bounded output and corrupt records.
