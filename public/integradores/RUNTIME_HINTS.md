---
status: live
last_updated: 2026-06-18
audience: external integrators — behavior by agent/runtime type
see_also:
  - MCP.md
  - REST.md
  - SDK.md
---

# RAGfly — Runtime Hints

> The MCP protocol and REST API are agent-agnostic. This document complements the technical reference with behavioral guidance for each runtime type: when to use which tool, how to read responses, and what to avoid.

---

## Short-context agents (Codex, GPT-4o-mini, Haiku, small models)

**Recommended pattern: direct sequence without iteration.**

```
estado_sesion()                         # confirm connection
→ buscar_chunks(consulta="your query", limite=5) # direct semantic search
→ use chunks[].texto in the prompt        # no re-processing needed
```

Or if the corpus is large and a generated response is needed:

```
preguntar(mensaje="your question")      # full RAG in one call
→ use the response directly
```

**Why:** these models benefit from short, complete flows. Calling
`listar_documentos` → `ver_documento` → `buscar_chunks` in sequence wastes context
unnecessarily when `preguntar` already does the full RAG.

**Useful field:** `chunks[].texto` comes pre-processed — no extraction or cleaning needed.
The endpoint returns multiple scores per document (`rrf_score`, `similitud_max`,
`score_rerank`) and per chunk (`similitud`). Use the `min_similitud` parameter to
filter at the source rather than post-processing manually.

---

## Autonomous reasoning agents (Claude, o1/o2, Gemini 2.5 Pro)

**When to use each tool:**

| Situation | Recommended tool |
|---|---|
| Free natural language query | `preguntar` — full RAG with citations |
| You already have a `codigo_documento` | `ver_documento` — detail without search |
| You need raw chunks (for own reranking, score calculation, manual synthesis) | `buscar_chunks` |
| You need cross-document synthesis over a workspace | `ejecutar_habilidad` with a RESUMIR or ANALIZAR skill |
| You want to know what documents are available before asking | `listar_documentos(estado="VECTORIZADO")` |

**Scores:** RAGfly returns multiple scores per result: `rrf_score` (hybrid fusion),
`similitud_max` (best vector similarity for the doc), `score_rerank` (Cohere reranker),
and `similitud` per chunk. A low score on a specific question may indicate the corpus
does not contain the answer — better to respond "no evidence found" than to force
a response with irrelevant chunks. Use the `min_similitud` parameter to filter at source.

**LLM Skills:** RAGfly has skills configurable by the group administrator
(see `listar_habilidades`). Before implementing your own synthesis, check if a skill
already does what you need.

---

## IDE-embedded agents (Cursor, Cline, Continue.dev, Copilot with MCP)

**Citations — not plain text:** RAGfly returns chunks with structured metadata.
Render as references, not inline:

```json
{
  "texto": "The contract establishes a 5% penalty...",
  "nombre_documento": "Supplier_Contract_2024.pdf",
  "tipo_documento": "PDF",
  "similitud": 0.87,
  "score_rerank": 0.94
}
```

Suggested presentation in IDE:
```
> Source: Supplier_Contract_2024.pdf (similitud: 0.87)
> "The contract establishes a 5% penalty..."
```

**`tipo_documento`** indicates the origin format: `PDF`, `DOCX`, `XLSX`, `TXT`, `MD`, etc.
Useful for deciding whether to show an icon or open with a specific viewer.

**Document states:** a document with state other than `VECTORIZADO` will not appear
in semantic searches. If the user asks about a doc and it doesn't appear, check with
`listar_documentos` — it may be in the pipeline (`CHUNKEADO`, `ESCANEADO`) or
with an error (`REVISAR`, `NO_ESCANEABLE`).

---

## REST / n8n / Make / Zapier integrations (no LLM agent)

**Minimum flow:**

```
POST /auth/login  →  JWT
GET  /auth/me     →  verify grupo_activo
POST /documentos/buscar-semantico  →  chunks with scores
```

**Pagination:** `GET /documentos/paginado` returns `{ items, total, page, limit }`.
Iterate with `page=1,2,...` until `items` is empty or `page * limit >= total`.

**SSE Streaming:** `POST /chat/conversaciones/{id}/mensajes/stream` returns
Server-Sent Events. In n8n use the HTTP node with streaming mode; in Make use
the HTTP module → SSE parse. Text fragments arrive as `{"text": "..."}`.
The final event is `{"done": true, "id_mensaje_user": N, "id_mensaje_assistant": N}`.
See full protocol in [REST.md](REST.md) § SSE protocol.

**Stateless conversations:** if your automation doesn't need history,
create a new conversation per request and discard it. Simpler than maintaining
`id_conversacion` across executions.

---

## Python SDK (`pip install ragfly`)

The SDK wraps the REST API. For most cases use it directly:

```python
from ragfly import RAGfly

client = RAGfly(api_key="slm_live_...")
resp = client.ask("What are the penalty clauses?")
print(resp.answer)

# Direct semantic search (without LLM)
results = client.search("contracts 2024", limit=5)
for doc in results.documents:
    print(f"[rrf={doc.rrf_score:.3f}] {doc.nombre}")
    for chunk in doc.chunks[:2]:
        print(f"  similitud={chunk.similitud:.3f}: {chunk.texto[:120]}")
```

See [SDK.md](SDK.md) for the full client reference.

---

## TypeScript SDK (`npm i @ragfly/sdk`)

Same surface as the Python SDK, zero dependencies (native `fetch`). Runs on Node 18+, the browser, Vercel Edge and Cloudflare Workers — ideal for agents built on the JS/TS stack (Next.js, Vercel AI SDK, Workers).

```ts
import { RAGfly } from "@ragfly/sdk";

const client = new RAGfly({ apiKey: process.env.RAGFLY_API_KEY! });
const resp = await client.ask("What are the penalty clauses?");
console.log(resp.answer);

// Direct semantic search (without LLM)
const results = await client.search("contracts 2024", { limit: 5 });
for (const doc of results.documents) {
  console.log(`[rrf=${doc.rrfScore?.toFixed(3)}] ${doc.nombre}`);
}
```

See [SDK-TS.md](SDK-TS.md) for the full client reference.

---

## Summary — choosing a tool or endpoint

| Need | MCP tool | REST endpoint |
|---|---|---|
| Verify connection | `estado_sesion` | `GET /auth/me` |
| Natural language question (RAG) | `preguntar` | `POST /chat/conversaciones/{id}/mensajes/stream` |
| Semantic search (raw chunks) | `buscar_chunks` | `POST /documentos/buscar-semantico` |
| See what documents exist | `listar_documentos` | `GET /documentos/paginado` |
| Document detail | `ver_documento` | `GET /documentos/{codigo}` |
| AI synthesis / analysis | `ejecutar_habilidad` | `POST /habilidades/{codigo}/ejecutar` |
| Pipeline state | `ver_cola` | `GET /cola-estados-docs/paginado` |
