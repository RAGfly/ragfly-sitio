# RAGfly — REST Interface

Direct API access from any language or platform (Python, Node, n8n, Make, Zapier, curl).

**Base URL**: `https://api.ragfly.ai`  
**Interactive Swagger**: [https://api.ragfly.ai/docs](https://api.ragfly.ai/docs)

---

## Authentication

All routes require the header:

```
Authorization: Bearer <token>
```

`<token>` can be a JWT (1 h, interactive login) or an API Key (`slm_live_…`, long-lived). See [INTEGRATION.md § Credentials](INTEGRATION.md).

---

## Core endpoints

### Authentication

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/login` | JWT with email/password |
| `GET` | `/auth/me` | Authenticated user context |
| `POST` | `/auth/api-key` | Create API Key |
| `GET` | `/auth/api-key` | List user's API Keys |
| `DELETE` | `/auth/api-key/{prefix}` | Revoke API Key |

### Documents

| Method | Route | Description |
|---|---|---|
| `GET` | `/documentos/paginado` | List documents with filters (`codigo_estado_doc`, `limit`, `page`) |
| `GET` | `/documentos/{codigo}` | Document detail |
| `POST` | `/documentos/buscar-semantico` | Semantic search without LLM. Body: `{"q": "...", "limit": 10}` |

#### Opening a document on disk (`fs` block)

`GET /documentos/paginado` and `GET /documentos/{codigo}` each return an `fs`
block so an agent running **on the same machine where the documents live** can
open the file on disk. The `como_abrir` field spells out the action.

```json
"fs": {
  "ruta_archivo": "/MisDocumentos/letras/cancion.txt",
  "ruta_es_absoluta": false,
  "carpeta_relativa": "MisDocumentos/letras",
  "nombre_archivo": "cancion.txt",
  "como_abrir": "Ruta relativa de carga web: abrir $RAGFLY_ROOT + `ruta_archivo`."
}
```

The single rule:

1. `ruta_es_absoluta: true` (loaded via RAGfly Desktop) → open `ruta_archivo`
   as-is.
2. `ruta_es_absoluta: false` (web upload via browser) → open
   `$RAGFLY_ROOT + ruta_archivo`, where `RAGFLY_ROOT` is the **parent folder**
   of the root folder the user picked when uploading. Example: the user
   uploaded `/Users/ana/Dropbox/MisDocumentos` → set
   `RAGFLY_ROOT=/Users/ana/Dropbox`, and `/MisDocumentos/letras/cancion.txt`
   resolves to `/Users/ana/Dropbox/MisDocumentos/letras/cancion.txt`.

`RAGFLY_ROOT` is set once per machine — env var (`~/.zshrc`), your agent's
context file (`CLAUDE.md`/`AGENTS.md`), or your MCP client config; the cloud
never reads it nor stores your absolute root. Always `exists()`-check the
resolved path before reading. Step-by-step walkthrough:
[MCP.md § Setting up `RAGFLY_ROOT`](MCP.md#setting-up-ragfly_root--once-per-machine-in-3-steps).

### Workspaces

| Method | Route | Description |
|---|---|---|
| `GET` | `/espacios-trabajo/paginado` | List workspaces |
| `GET` | `/espacios-trabajo/{id}/documentos/paginado` | Documents in a workspace |

### LLM Skills

| Method | Route | Description |
|---|---|---|
| `GET` | `/habilidades` | Skills catalog |
| `GET` | `/habilidades/{codigo}` | Skill detail |
| `POST` | `/habilidades/{codigo}/ejecutar` | Queue execution. Body: `{"id_espacio": N}` or `{"codigo_documento": "X"}` |

### Pipeline

| Method | Route | Description |
|---|---|---|
| `GET` | `/cola-estados-docs/paginado` | Queue state. Filters: `estado_cola`, `q` (free text), `limit`, `page` |

### Conversational interface (chat + RAG)

| Method | Route | Description |
|---|---|---|
| `POST` | `/chat/conversaciones` | Create conversation. Body: `{"codigo_funcion": "CHAT-USUARIO"}` |
| `GET` | `/chat/conversaciones` | List user conversations |
| `GET` | `/chat/conversaciones/{id}` | Messages in a conversation |
| `POST` | `/chat/conversaciones/{id}/mensajes/stream` | Send message → SSE response. Body: `{"contenido": "..."}` |
| `DELETE` | `/chat/conversaciones/{id}` | Delete conversation |

---

## SSE protocol (chat response)

The `mensajes/stream` endpoint takes `{"contenido": "..."}` and returns
`Content-Type: text/event-stream`:

```
data: {"status": "analizando"}\n\n
data: {"text": "response fragment"}\n\n
data: {"text": "another fragment"}\n\n
data: {"done": true, "id_mensaje_user": 477}\n\n
```

`status` events are progress hints (e.g. `analizando`); `text` events carry the
answer fragments; the final `done` event closes the stream.

Error mid-stream:
```
data: {"error": "error description"}\n\n
```

---

## Examples

### Python — semantic search

```python
import os, httpx

BASE    = "https://api.ragfly.ai"
HEADERS = {"Authorization": f"Bearer {os.environ['RAGFLY_API_KEY']}"}

r = httpx.post(
    f"{BASE}/documentos/buscar-semantico",
    headers=HEADERS,
    json={"q": "active maintenance contracts", "limit": 5},
)
r.raise_for_status()
# `resultados` is a list of DOCUMENTS; each carries its matching `chunks`.
for doc in r.json()["resultados"]:
    print(doc["codigo_documento"], doc["nombre_documento"], doc["similitud_max"])
    for chunk in doc["chunks"]:
        print("   ", chunk["nro_pagina"], chunk["texto"][:200])
```

### curl — list vectorized documents

```bash
curl "https://api.ragfly.ai/documentos/paginado?codigo_estado_doc=VECTORIZADO&limit=10" \
  -H "Authorization: Bearer slm_live_xxxxxxxxxx"
```

### n8n / Make / Zapier

1. **HTTP Request** node
2. URL: `https://api.ragfly.ai/<route>`
3. Authentication: **Header Auth**
4. Header name: `Authorization`
5. Header value: `Bearer slm_live_xxxxxxxxxx` (store in workspace credentials)

---

## Rate limits

| Endpoint | Limit |
|---|---|
| `POST /chat/conversaciones` | 20 / min per API Key |
| `POST /chat/conversaciones/{id}/mensajes/stream` | 30 / min per API Key |

Response when exceeded: `429 Too Many Requests`. Retry after 60 s.
