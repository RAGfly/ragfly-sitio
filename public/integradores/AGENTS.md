# RAGfly — AGENTS.md

Place this file in the root of the agent's workspace.

## What is RAGfly

Multi-tenant RAG (Retrieval-Augmented Generation) infrastructure accessible via MCP and REST.
It indexes an organization's documents and exposes them to AI agents with full tenant (group)
isolation and area-based access control.

**Base URL:** `$RAGFLY_API_URL`  
**MCP server:** `https://api.ragfly.ai/mcp-http/`  
**OpenAPI docs:** `$RAGFLY_API_URL/docs`

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
mcp__ragfly__estado_sesion()
```
Confirms the connection and returns the active tenant context.

**Main tools:**
- `mcp__ragfly__estado_sesion()` — verify connection
- `mcp__ragfly__buscar_chunks(consulta, limite)` — semantic search
- `mcp__ragfly__listar_documentos(estado, limite)` — list documents
- `mcp__ragfly__preguntar(mensaje)` — full RAG question with citations

If MCP is not available, use the REST endpoints documented below.

## Required environment variables

```
RAGFLY_API_URL=https://api.ragfly.ai
RAGFLY_API_KEY=slm_live_...
```

## Authentication

Include in every request:

```
Authorization: Bearer <RAGFLY_API_KEY>
```

Alternative (short-lived JWT):
```
Authorization: Bearer <JWT obtained from POST /auth/login>
```

## Main endpoints

### Verify session
```
GET /auth/me
```
Returns `grupo_activo`, `entidad_activa`, `rol_principal`, `tipo_acceso`.
Always call first to confirm the API Key is valid.

### List documents
```
GET /documentos/paginado
  ?codigo_estado_doc=VECTORIZADO   # only docs with embeddings (ready for RAG)
  &limit=20
  &page=1
  &q=<text>                        # search by name (optional)
```

### Semantic search (central endpoint)
```
POST /documentos/buscar-semantico
Content-Type: application/json

{
  "q": "<natural language question>",  # required
  "limit": 5,                          # chunks to return
  "min_similitud": 0.0,                # threshold 0–1 (optional)
  "id_espacio": null,                  # filter by Workspace (optional)
  "ids_documento": null                # filter by specific IDs (optional)
}
```

### View a document
```
GET /documentos/{codigo_documento}
```

### List workspaces
```
GET /espacios-trabajo/paginado?limit=10
```

### Pipeline state
```
GET /cola-estados-docs/paginado?limit=10
```

## Python usage pattern

```python
import os, httpx

BASE    = os.environ["RAGFLY_API_URL"]
HEADERS = {"Authorization": f"Bearer {os.environ['RAGFLY_API_KEY']}"}

def me():
    return httpx.get(f"{BASE}/auth/me", headers=HEADERS).raise_for_status().json()

def search(q: str, limit: int = 5) -> list:
    return httpx.post(
        f"{BASE}/documentos/buscar-semantico",
        headers=HEADERS,
        json={"q": q, "limit": limit},
    ).raise_for_status().json().get("resultados", [])

def list_docs(limit: int = 20) -> list:
    return httpx.get(
        f"{BASE}/documentos/paginado",
        headers=HEADERS,
        params={"codigo_estado_doc": "VECTORIZADO", "limit": limit},
    ).raise_for_status().json().get("items", [])
```

## TypeScript usage pattern

```ts
const BASE = process.env.RAGFLY_API_URL!;
const HEADERS = { Authorization: `Bearer ${process.env.RAGFLY_API_KEY}`, "Content-Type": "application/json" };

const me = () =>
  fetch(`${BASE}/auth/me`, { headers: HEADERS }).then((r) => r.json());

const search = (q: string, limit = 5) =>
  fetch(`${BASE}/documentos/buscar-semantico`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ q, limit }),
  })
    .then((r) => r.json())
    .then((d) => d.resultados ?? []);

const listDocs = (limit = 20) =>
  fetch(`${BASE}/documentos/paginado?codigo_estado_doc=VECTORIZADO&limit=${limit}`, { headers: HEADERS })
    .then((r) => r.json())
    .then((d) => d.items ?? []);
```

> Or use the official SDK: `npm i @ragfly/sdk` → `new RAGfly({ apiKey }).search(q)`. See [SDK-TS.md](SDK-TS.md).

## Security invariants

- The API Key operates exclusively on the corpus of the tenant that issued it.
- RBAC (group, entity, area) is resolved from the key — not sent in the body.
- A key can never access data from another group, even with specifically crafted queries.

## Document state reference

`VECTORIZADO` → ready for RAG  
`CHUNKEADO` → processed but no embeddings yet  
`ESCANEADO` → text extracted, pending chunking  
`METADATA` → metadata only  
`CARGADO` → just uploaded  
`NO_ESCANEABLE` → format not processable  
