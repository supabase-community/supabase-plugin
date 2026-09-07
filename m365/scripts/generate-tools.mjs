#!/usr/bin/env node
/**
 * Regenerate m365/tools/supabase-tools.json from the live Supabase MCP server's tools/list.
 *
 * Usage (env var only — never pass the PAT on argv, it would land in shell history):
 *   SUPABASE_MCP_TOKEN=<supabase-pat> node ./m365/scripts/generate-tools.mjs \
 *     > /tmp/tools.json && mv /tmp/tools.json ./m365/tools/supabase-tools.json
 *
 * Write to a temp file and move it (as the workflow does) so a failed run can never
 * truncate the checked-in file. On a schedule this runs via the `sync-m365-tools`
 * workflow, which sets SUPABASE_MCP_TOKEN from secrets.SUPABASE_ACCESS_TOKEN.
 */
import { strict as assert } from 'node:assert'

const MCP_URL = process.env.MCP_URL ?? 'https://mcp.supabase.com/mcp'
const token = process.env.SUPABASE_MCP_TOKEN

assert(token, 'missing MCP token: set SUPABASE_MCP_TOKEN')

const baseHeaders = {
  'content-type': 'application/json',
  accept: 'application/json, text/event-stream',
  authorization: `Bearer ${token}`,
}

// Step 1: initialize. Capture the session id and send notifications/initialized so a
// stateful Streamable-HTTP server accepts the subsequent tools/list request.
const initialize = await fetch(MCP_URL, {
  method: 'POST',
  headers: baseHeaders,
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'supabase-m365-generator', version: '0.1.0' },
    },
  }),
})
if (!initialize.ok) {
  throw new Error(`initialize failed: HTTP ${initialize.status} ${await initialize.text()}`)
}
await initialize.text()

const sessionId = initialize.headers.get('mcp-session-id')
const sessionHeaders = sessionId
  ? { ...baseHeaders, 'mcp-session-id': sessionId }
  : baseHeaders

// Send the initialized notification (fire-and-forget; a stateful server needs it).
await fetch(MCP_URL, {
  method: 'POST',
  headers: sessionHeaders,
  body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
}).catch(() => {})

// Step 2: tools/list. Read the response as both SSE and plain JSON.
const tools = await fetch(MCP_URL, {
  method: 'POST',
  headers: sessionHeaders,
  body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }),
})

const raw = await tools.text()
if (!tools.ok) {
  throw new Error(`tools/list failed: HTTP ${tools.status} ${raw}`)
}

const contentType = tools.headers.get('content-type') ?? ''
let result
if (/text\/event-stream/i.test(contentType)) {
  const messages = raw
    .split('\n')
    .filter((l) => l.startsWith('data: '))
    .map((l) => JSON.parse(l.slice(6)))
  result = messages.find((m) => m.id === 2 && m.result)?.result
} else {
  const parsed = JSON.parse(raw)
  result = parsed.result
}

assert(result, 'tools/list returned no result')

const normalized = result.tools.map((t) => {
  if (!t.inputSchema || typeof t.inputSchema !== 'object') {
    // Never substitute an empty schema: an unpinned/missing inputSchema would
    // silently ship a parameterless tool contract (rejected in review).
    throw new Error(`tool '${t.name}' is missing inputSchema`)
  }
  // search_docs' live description embeds the full runtime GraphQL SDL
  // (loaded from the content API). Keep only the stable first sentence so a
  // regeneration reproduces the committed file instead of diffing every night.
  let description = t.description
  if (t.name === 'search_docs' && description) {
    description = description.split('\n')[0].trim()
  }
  return {
    name: t.name,
    description,
    ...(t.annotations ? { annotations: t.annotations } : {}),
    inputSchema: t.inputSchema,
  }
})

process.stdout.write(`${JSON.stringify(normalized, null, 2)}\n`)
