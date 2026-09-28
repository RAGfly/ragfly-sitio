# RAGfly — AGENTS.md

Place this file in the root of the agent's workspace.

## What is RAGfly

A multi-tenant RAG service. It indexes an organization's documents and serves
them to AI agents through the public REST API `/v1` and MCP, with tenant
isolation (group → entity → area) and role-based access control.

**Base URL:** `$RAGFLY_API_URL` — public contract under `/v1`  
**MCP server:** `https://api.ragfly.ai/mcp-http/`  
**OpenAPI docs:** `$RAGFLY_API_URL/docs`

## Safe order for an agent

1. **Confirm who you are.** `session` (MCP) or `GET /v1/session`: the active
   group and entity, and the roles the key carries.
2. **Discover what you can do.** `list_operations` (MCP) or `GET /v1/operations`
   lists every operation this key's RBAC allows; `get_operation` /
   `GET /v1/operations/{code}` gives its input and output schema. What is not
   listed does not exist for this key.
3. **Ask only for data you are allowed to see.** Use the listed operations and
   the `/v1` routes below. A `403` or a `404` is an answer, not an obstacle: do
   not retry through other routes. Internal routes answer `403` to an API key.
4. **Cite public codes.** Quote the document `code` and `name`, and the chunk's
   `page` and `extra.chunk_number`; point to the original with `location` / `fs`.
   Never invent a code.
5. **Ask before destructive changes.** A `write_confirm` operation returns a
   preview (`executed: false`) until you repeat it with `confirm: true`. Show the
   preview and repeat only after the person agrees.

## MCP (recommended for Codex)

If the MCP server is configured, always use MCP tools instead of direct REST:

```bash
# Configure (once)
codex mcp add ragfly \
  --url https://api.ragfly.ai/mcp-http/ \
  --bearer-token-env-var RAGFLY_API_KEY
```

**Always call first:**
```
mcp__ragfly__session()
```
Confirms the connection and returns the active tenant context.

**Main tools:**
- `mcp__ragfly__session()` — verify connection
- `mcp__ragfly__list_operations()` — what this key can do
- `mcp__ragfly__get_operation(code)` / `mcp__ragfly__run_operation(code, input, confirm)` — schema and run
- `mcp__ragfly__search_documents(query, limit)` — semantic search
- `mcp__ragfly__list_documents(status, limit)` — list documents
- `mcp__ragfly__get_document(document_code)` — one document
- `mcp__ragfly__ask(message)` — full RAG question

If MCP is not available, use the REST routes documented below. The full tool list
is in [MCP.md](MCP.md).

## Required environment variables

```
RAGFLY_API_URL=https://api.ragfly.ai
RAGFLY_API_KEY=rf_...
RAGFLY_ROOT=/Users/you/Dropbox      # only if you open documents on disk — see below
```

`RAGFLY_ROOT` lets you open web-uploaded documents on disk. It's the **parent
folder** of the folder the user selected when uploading — e.g. the user uploaded
`/Users/ana/Dropbox/MisDocumentos` → `RAGFLY_ROOT=/Users/ana/Dropbox`, and the
relative path `/MisDocumentos/letras/cancion.txt` resolves to
`/Users/ana/Dropbox/MisDocumentos/letras/cancion.txt`. RAGfly never reads it —
it lives only on this machine (env var or one line in `CLAUDE.md`/`AGENTS.md`).
Skip it if documents were loaded via RAGfly Desktop (`fs.is_absolute` is `true`)
or Google Drive/Dropbox (`fs.is_cloud_only` is `true`; originals remain with the
provider). Step-by-step walkthrough:
[MCP.md § Setting up `RAGFLY_ROOT`](MCP.md#setting-up-ragfly_root--once-per-machine-in-3-steps).

## Authentication

Include in every request:

```
Authorization: Bearer <RAGFLY_API_KEY>
```

The API key operates only the public API `/v1` (and MCP), with its owner's
RBAC. A person mints it with a web session (`POST /auth/login`, then
`POST /auth/api-key`); an agent never needs that session, and a key cannot mint
other keys.

## Main endpoints

### Verify session
```
GET /v1/session
```
Returns `user`, `active_group`, `active_entity`, `profile` and `roles`.
Always call first to confirm the API key is valid.

### What this key can do
```
GET /v1/operations                    # {operations: [{code, kind, confirm_required, functions}], total}
GET /v1/operations/{code}             # adds input_schema and output_schema
POST /v1/operations/{code}:execute    # {"input": {...}, "confirm": false}
```

### List documents
```
GET /v1/documents
  ?status=VECTORIZED   # only docs with embeddings (ready for RAG)
  &limit=20            # 1–100
  &page=1
```

### Semantic search (central endpoint)
```
POST /v1/documents/search
Content-Type: application/json

{
  "query": "<natural language question>",  # required, non-empty
  "limit": 5,                              # max documents, 1–100 (default 10)
  "min_similarity": 0.0,                   # threshold 0–1 (optional)
  "entity_code": null                      # one of your entities (optional)
}
```
Returns `documents[]` with `code`, `name`, `summary`, `location`, `url`, `fs`,
`rrf_score`, `max_similarity`, `rerank_score` and `chunks[]` (`text`, `page`,
`extra.chunk_number`, `extra.similarity`). To search inside one workspace, use
`POST /v1/spaces/{space_id}/read` with `{"resolution": "chunks", "query": "..."}`.

### View a document
```
GET /v1/documents/{document_code}
```

### Open a document on disk
Documents from `GET /v1/documents`, `GET /v1/documents/{document_code}` and the
search (MCP: `list_documents`, `get_document`, `search_documents`) carry an `fs`
block with `how_to_open` (literal instruction). When `fs.is_cloud_only` is
`true`, never open `fs.path` or prepend `RAGFLY_ROOT`: the original remains in
Drive or Dropbox. Otherwise, if `fs.is_absolute` is `true`, open `fs.path`
directly; if `origin` is `WEB`, open `$RAGFLY_ROOT + fs.path`. Always
`exists()`-check local paths first. Full rules:
[MCP.md § Opening a document on disk](MCP.md).

### List workspaces
```
GET /v1/spaces?limit=10
```

### Pipeline state
```
GET /v1/queue?limit=10
```
Needs access to the processing pipeline; without it, `403` (for example, the
key of a standard user whose role does not include the pipeline).

## Python usage pattern

```python
import os, httpx

BASE    = os.environ["RAGFLY_API_URL"]
HEADERS = {"Authorization": f"Bearer {os.environ['RAGFLY_API_KEY']}"}

def session() -> dict:
    return httpx.get(f"{BASE}/v1/session", headers=HEADERS).raise_for_status().json()

def operations() -> list:
    return httpx.get(f"{BASE}/v1/operations", headers=HEADERS).raise_for_status().json()["operations"]

def search(query: str, limit: int = 5) -> list:
    return httpx.post(
        f"{BASE}/v1/documents/search",
        headers=HEADERS,
        json={"query": query, "limit": limit},
        timeout=60,
    ).raise_for_status().json()["documents"]

def list_docs(limit: int = 20) -> list:
    return httpx.get(
        f"{BASE}/v1/documents",
        headers=HEADERS,
        params={"status": "VECTORIZED", "limit": limit},
    ).raise_for_status().json()["documents"]
```

## TypeScript usage pattern

```ts
const BASE = process.env.RAGFLY_API_URL!;
const HEADERS = { Authorization: `Bearer ${process.env.RAGFLY_API_KEY}`, "Content-Type": "application/json" };

const session = () =>
  fetch(`${BASE}/v1/session`, { headers: HEADERS }).then((r) => r.json());

const operations = () =>
  fetch(`${BASE}/v1/operations`, { headers: HEADERS })
    .then((r) => r.json())
    .then((d) => d.operations ?? []);

const search = (query: string, limit = 5) =>
  fetch(`${BASE}/v1/documents/search`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ query, limit }),
  })
    .then((r) => r.json())
    .then((d) => d.documents ?? []);

const listDocs = (limit = 20) =>
  fetch(`${BASE}/v1/documents?status=VECTORIZED&limit=${limit}`, { headers: HEADERS })
    .then((r) => r.json())
    .then((d) => d.documents ?? []);
```

> Or use the official SDK: `npm i @ragfly/sdk` → `new RAGfly({ apiKey }).search({ query })`. See [SDK-TS.md](SDK-TS.md).

## Security invariants

- The API key operates exclusively on the corpus of the tenant that issued it.
- RBAC (group, entity, area and role) is resolved from the key on the server —
  never sent in the body or the URL.
- A document outside the key's group, entity or area answers `404`, exactly like
  one that does not exist.
- `/v1` never returns the full text of a document: the agent gets the summary,
  the relevant chunks and the location.

## Document status reference

`VECTORIZED` → ready for RAG  
`CHUNKED` → processed but no embeddings yet  
`SCANNED` → text extracted, pending chunking  
`METADATA` → metadata only  
`LOADED` → just uploaded  
`NOT_SCANNABLE` → format not processable  
`REVIEW` → flagged for review
