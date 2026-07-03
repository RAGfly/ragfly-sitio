# RAGfly Python SDK

> The Python SDK is the fastest way to connect a Python agent or script to RAGfly. It wraps the REST API and SSE stream protocol into three simple methods.
>
> Using TypeScript/JavaScript instead? See [SDK-TS.md](SDK-TS.md) (`npm install @ragfly/sdk`) — same surface.

---

## Installation

```bash
pip install ragfly
```

Requires Python 3.10+. Single dependency: `httpx`.

- **PyPI**: [pypi.org/project/ragfly](https://pypi.org/project/ragfly/)
- **GitHub**: [github.com/RAGfly/ragfly-python](https://github.com/RAGfly/ragfly-python)

---

## Quick start

```python
from ragfly import RAGfly

client = RAGfly(api_key="slm_live_...")

# End-to-end RAG: retrieves documents and generates a response
resp = client.ask("What are the Q1 sales figures?")
print(resp.answer)

# Token-by-token streaming (same as OpenAI)
for chunk in client.ask("Summarize the active contracts", stream=True):
    print(chunk.delta, end="", flush=True)

# Semantic retrieval only, without going through the LLM
results = client.search("maintenance contracts", limit=5)
for doc in results.documents:
    print(doc.nombre, f"rrf_score={doc.rrf_score:.3f}")
    for chunk in doc.chunks[:2]:
        print(f"  \"{chunk.texto[:100]}…\"")
```

---

## Method reference

### `client.ask(question, *, stream=False, conversation_id=None)`

Natural language question over the corpus. Internally: creates a temporary conversation → sends the message → consumes the SSE stream → returns the response.

| Parameter | Type | Description |
|-----------|------|-------------|
| `question` | `str` | The natural language question |
| `stream` | `bool` | `True` → returns `Iterator[AskChunk]`; `False` (default) → `AskResponse` |
| `conversation_id` | `int \| None` | Reuse an existing conversation to maintain history |

**Without streaming:**

```python
resp = client.ask("What does the Acme contract say?")
print(resp.answer)          # str — full response
print(resp.conversation_id) # int — id of the created conversation
```

**With streaming:**

```python
for chunk in client.ask("What does the Acme contract say?", stream=True):
    print(chunk.delta, end="")  # str — text fragment
```

**Maintain history in a conversation:**

```python
resp1 = client.ask("Who signed the contract?")
resp2 = client.ask("And when does it expire?", conversation_id=resp1.conversation_id)
```

---

### `client.search(query, *, limit=10, min_similitud=0.0, codigo_entidad=None, id_espacio=None)`

Hybrid semantic search (vector + lexical + Cohere rerank) without LLM generation. Returns the most relevant chunks from the corpus with their scores.

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `str` | Search text |
| `limit` | `int` | Maximum documents to return (default 10) |
| `min_similitud` | `float` | Minimum similarity threshold 0–1 (default 0.0) |
| `codigo_entidad` | `str \| None` | Filter by specific entity |
| `id_espacio` | `int \| None` | Search only within a Workspace |

```python
results = client.search("maintenance contracts", limit=5)

print(f"{results.total_documentos} documents, {results.total_chunks} chunks")
print(f"Time: {results.duracion_ms:.0f}ms")

for doc in results.documents:
    print(f"· {doc.nombre} (rrf={doc.rrf_score:.3f})")
    for chunk in doc.chunks:
        print(f"  similitud={chunk.similitud:.3f}: {chunk.texto[:80]}…")
```

---

### `client.list_documents(*, page=1, page_size=20, estado=None)`

Paginated list of the active group's corpus.

```python
page = client.list_documents(page=1, page_size=50)
# → dict with keys: items, total, page, limit
```

**Opening a document on disk.** Each document returned by `list_documents`
(and by the document-detail response) carries an `fs` field describing where the
file lives, so an agent running **on the same machine as the documents** can
open it. The `fs` field of the response holds: `ruta_archivo`,
`ruta_es_absoluta`, `carpeta_relativa`, `nombre_archivo`, and `como_abrir` (a
plain-language instruction). The single rule:

1. `ruta_es_absoluta` is `True` (loaded via RAGfly Desktop) → open `ruta_archivo`
   directly.
2. `ruta_es_absoluta` is `False` (web upload via browser) → open
   `$RAGFLY_ROOT + ruta_archivo`, where `RAGFLY_ROOT` is the **parent folder**
   of the root folder the user picked when uploading. Example: the user
   uploaded `/Users/ana/Dropbox/MisDocumentos` → set
   `RAGFLY_ROOT=/Users/ana/Dropbox`, and `/MisDocumentos/letras/cancion.txt`
   resolves to `/Users/ana/Dropbox/MisDocumentos/letras/cancion.txt`.

```python
import os
from pathlib import Path

for doc in client.list_documents(page=1, page_size=50)["items"]:
    fs = doc["fs"]
    if fs["ruta_es_absoluta"]:
        path = Path(fs["ruta_archivo"])
    else:
        path = Path(os.environ["RAGFLY_ROOT"]) / fs["ruta_archivo"].lstrip("/")
    if path.exists():
        text = path.read_text()
```

Set `RAGFLY_ROOT` once per machine — e.g.
`export RAGFLY_ROOT="/Users/ana/Dropbox"` in your `~/.zshrc`; the cloud never
reads it nor stores your absolute root. Always check `exists()` before reading.
Step-by-step walkthrough:
[MCP.md § Setting up `RAGFLY_ROOT`](MCP.md#setting-up-ragfly_root--once-per-machine-in-3-steps).

---

## Data models

| Class | Key fields |
|-------|-------------|
| `AskResponse` | `answer: str`, `conversation_id: int`, `message_id: int \| None` |
| `AskChunk` | `delta: str` |
| `SearchResult` | `query`, `total_documentos`, `total_chunks`, `duracion_ms`, `documents: list[Document]` |
| `Document` | `codigo`, `nombre`, `resumen`, `url`, `rrf_score`, `similitud_max`, `chunks: list[Chunk]` |
| `Chunk` | `texto`, `similitud`, `score_rerank`, `pagina` |

---

## Authentication

The SDK accepts **API Keys** (format `slm_live_...`) generated from [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) or via the `POST /auth/api-key` endpoint.

```python
import os
client = RAGfly(api_key=os.environ["RAGFLY_API_KEY"])
```

The Key inherits the group, entity, and role of the user who issued it. See [INTEGRATION.md](INTEGRATION.md) § Credentials for role and PERFIL details.

---

## Context manager

```python
with RAGfly(api_key="slm_live_...") as client:
    resp = client.ask("How many active contracts are there?")
    print(resp.answer)
# → client.close() is called automatically
```
