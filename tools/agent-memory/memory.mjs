import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

const [mode, ...words] = process.argv.slice(2);
const query = words.join(' ').trim();
if (!['search', 'open'].includes(mode) || !query) {
  console.error('Use: node tools/agent-memory/memory.mjs search <non-empty query> | open <entity name>');
  process.exit(1);
}

const memoryPath = process.env.MEMORY_FILE_PATH
  ? resolve(process.env.MEMORY_FILE_PATH)
  : fileURLToPath(new URL('../../docs/content-factory/memory/project.jsonl', import.meta.url));

// The memory server is file-backed; no model, embedding service or credentials.
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL('node_modules/@modelcontextprotocol/server-memory/dist/index.js', import.meta.url))],
  env: {
    PATH: process.env.PATH ?? '',
    MEMORY_FILE_PATH: memoryPath,
  },
  stderr: 'pipe',
});
const client = new Client({ name: 'openreels-project-memory', version: '1.0.0' });
try {
  // Upstream skips bad records; fail explicitly rather than silently lose facts.
  const lines = (await readFile(memoryPath, 'utf8')).split('\n');
  for (const [index, line] of lines.entries()) {
    if (!line.trim()) continue;
    let record;
    try { record = JSON.parse(line); } catch { throw new Error(`Invalid memory record at line ${index + 1}`); }
    const validEntity = record?.type === 'entity' && typeof record.name === 'string'
      && typeof record.entityType === 'string' && Array.isArray(record.observations)
      && record.observations.every(value => typeof value === 'string');
    const validRelation = record?.type === 'relation' && typeof record.from === 'string'
      && typeof record.to === 'string' && typeof record.relationType === 'string';
    if (!validEntity && !validRelation) throw new Error(`Invalid memory record at line ${index + 1}`);
  }
  await client.connect(transport);
  const result = await client.callTool({
    name: mode === 'search' ? 'search_nodes' : 'open_nodes',
    arguments: mode === 'search' ? { query } : { names: [query] },
  });
  if (result.isError) throw new Error('Memory retrieval failed; inspect the source records.');
  const graph = JSON.parse(result.content.find(item => item.type === 'text').text);
  // Budget complete facts rather than dumping the graph or cutting JSON midway.
  const answer = { entities: [], relations: [], omittedEntities: 0, budgetBytes: 6000 };
  for (const entity of graph.entities) {
    const candidate = { ...answer, entities: [...answer.entities, entity], omittedEntities: graph.entities.length };
    if (Buffer.byteLength(JSON.stringify(candidate)) <= 6000) answer.entities.push(entity);
  }
  answer.omittedEntities = graph.entities.length - answer.entities.length;
  const names = new Set(answer.entities.map(entity => entity.name));
  for (const relation of graph.relations) {
    if (!names.has(relation.from) || !names.has(relation.to)) continue;
    const candidate = { ...answer, relations: [...answer.relations, relation] };
    if (Buffer.byteLength(JSON.stringify(candidate)) <= 6000) answer.relations.push(relation);
  }
  console.log(JSON.stringify(answer));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
