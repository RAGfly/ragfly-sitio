# RAGfly — AGENTS.md

Place this file in the root of the agent's workspace.

## What is RAGfly

A multi-tenant RAG service. It indexes an organization's documents and serves
them to AI agents through the public REST API `/v1` and MCP, with tenant
isolation (group → entity → area) and role-based access control.

## Language and public codes

REST `/v1`, MCP (including OAuth protocol responses), and machine-readable CLI
and SDK responses use a fixed English protocol regardless of locale. This
includes schemas/defaults, enums, validation details, and every message written
by RAGfly. Catalog codes come from the English alias on the same catalog row;
never translate an internal code or return it as a fallback. If the alias is
missing, fail with a safe English error. Tenant-authored content keeps its
original language.

**Base URL:** `$RAGFLY_API_URL` — public contract under `/v1`  
**MCP server:** `https://api.ragfly.ai/mcp-http/`  
**OpenAPI docs:** `$RAGFLY_API_URL/docs`

## Safe order for an agent

1. **Confirm who you are.** `session` (MCP) or `GET /v1/session`: the active
   group and entity, and the English access-level label.
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

```dotenv
RAGFLY_API_URL=https://api.ragfly.ai
RAGFLY_API_KEY=rf_...
```

When opening a local original, inspect that document's `fs.home_var` and
`fs.relative_path`. The value of `home_var` is the name of a per-root
environment variable (for example `RAGFLY_HOME_442681`); configure that name
on the machine running the agent and join its value with `relative_path`.
Different documents can use different roots. If `home_var` is `null`, empty,
or unset, no local root is available.

Resolve `fs` in this order: cloud-only means the source stays with Google
Drive/Dropbox; public URL opens directly; absolute Desktop path opens directly;
otherwise use the variable named by `home_var` with `relative_path`. Do not
invent or fall back to a global root. Full rules:
[MCP.md: Opening a document on disk](MCP.md#opening-a-document-on-disk-fs-block).

## Authentication

Include in every request:

```
Authorization: Bearer <RAGFLY_API_KEY>
```

The API key operates only the public API `/v1` and MCP, with its owner's RBAC.
A person creates it in the RAGfly web app's **API Keys** page; the integration
never needs a person's password or web session. A key cannot create or revoke
other keys. Use `GET /v1/operations` to discover the actions the key can run.

## Main endpoints

### Verify session
```
GET /v1/session
```
Returns the user and active tenant context plus an English `profile` access
level. Role identifiers are not exposed; use `/v1/operations` to discover
allowed actions. Always call first to confirm the API key is valid.

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

Follow the `fs` resolution order above. Use `fs.home_var` plus
`fs.relative_path` for a local relative path, and check that the resolved file
exists. If `home_var` is null or unset, rely on indexed content or an available
public/provider URL; do not guess a filesystem root. See
[MCP.md: Opening a document on disk](MCP.md#opening-a-document-on-disk-fs-block).

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
