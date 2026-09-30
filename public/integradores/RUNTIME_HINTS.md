# RAGfly — Runtime Hints

> The MCP protocol and the REST API `/v1` are agent-agnostic. This document complements the technical reference with behavioral guidance for each runtime type: when to use which tool, how to read responses, and what to avoid.

---

## Safe order (every runtime)

1. **Discover capabilities.** `list_operations` (MCP) or `GET /v1/operations`
   lists what this key's RBAC allows; `get_operation` / `GET /v1/operations/{code}`
   adds the input and output schema. Not listed means it does not exist for this
   key.
2. **Request only permitted data.** Stay inside the listed operations and the
   `/v1` routes. Treat `403` and `404` as final answers; do not try other routes.
   An API key on an internal route gets `403`.
3. **Cite public codes.** Quote the document `code` and `name`, and the chunk's
   `page` and `extra.chunk_number`. Point to the original with `location` / `fs`.

A `write_confirm` operation answers with a preview (`executed: false`) until you
repeat it with `confirm: true`. Show the preview to the person first.

---

## Short-context agents (Codex, GPT-4o-mini, Haiku, small models)

**Recommended pattern: direct sequence without iteration.**

```
session()                                        # confirm connection
→ search_documents(query="your query", limit=5)  # direct semantic search
→ use documents[].chunks[].text in the prompt    # no re-processing needed
```

Or if the corpus is large and a generated response is needed:

```
ask(message="your question")      # full RAG in one call
→ use the answer directly
```

**Why:** these models benefit from short, complete flows. Calling
`list_documents` → `get_document` → `search_documents` in sequence wastes context
unnecessarily when `ask` already does the full RAG.

**Useful field:** `chunks[].text` comes pre-processed — no extraction or cleaning
needed. The search returns scores per document (`rrf_score`, `max_similarity`,
`rerank_score`) and per chunk (`extra.similarity`). Use the `min_similarity`
parameter to filter at the source rather than post-processing manually. With a
threshold above 0, keyword-only matches (no similarity) are left out.

---

## Autonomous reasoning agents (Claude, o1/o2, Gemini 2.5 Pro)

**When to use each tool:**

| Situation | Recommended tool |
|---|---|
| You don't know yet what this key can do | `list_operations`, then `get_operation(code)` |
| Free natural language query | `ask` — full RAG answer |
| You already have a document `code` | `get_document` — detail without search |
| You need raw chunks (for own reranking, score calculation, manual synthesis) | `search_documents` |
| You need cross-document synthesis over a workspace | `run_skill` with a summarize or analyze skill |
| You want to know what documents are available before asking | `list_documents(status="VECTORIZED")` |
| You want to act like the RAGfly chat, with its prompt and limits | `get_agent_context`, then `run_agent_tool` |

**Scores:** each document carries `rrf_score` (the hybrid rank: vector + lexical,
fused with RRF) and `max_similarity` (its best vector match); each chunk carries
`extra.similarity`. `search_documents` is simple retrieval without reranking, so
`rerank_score` comes back `null` there. A low score on a specific question may
indicate the corpus does not contain the answer — better to respond "no evidence
found" than to force a response with irrelevant chunks. Use the `min_similarity`
parameter to filter at source.

**LLM skills:** RAGfly has skills configured per group (see `list_skills` or
`catalog`). Before implementing your own synthesis, check whether a skill already
does what you need.

**Agent context:** `get_agent_context` / `GET /v1/agent/context` returns the
chat's layered prompt, identity, limits and allowed tools, and `run_agent_tool` /
`POST /v1/agent/tools/{public_name}` runs one of them. Tool names are stable
English public identifiers; catalog-backed names derive from the English
`*_en` aliases. The available list and argument schemas vary by identity and
profile, so read them from the context at run time. Send the returned
`public_name` unchanged; internal chat names are not accepted as public names.

---

## IDE-embedded agents (Cursor, Cline, Continue.dev, Copilot with MCP)

**Citations — not plain text:** RAGfly returns chunks with structured metadata.
Render them as references, not inline. One document from `search_documents`:

```json
{
  "code": "32434",
  "name": "Supplier_Contract_2024.pdf",
  "location": "/Contracts/Supplier_Contract_2024.pdf",
  "max_similarity": 0.87,
  "chunks": [
    {"text": "The contract establishes a 5% penalty...", "page": 4, "extra": {"chunk_number": 12, "similarity": 0.87}}
  ]
}
```

Suggested presentation in IDE:
```
> Source: Supplier_Contract_2024.pdf (32434), page 4 — similarity 0.87
> "The contract establishes a 5% penalty..."
```

**File format:** `GET /v1/documents/{document_code}` (MCP `get_document`)
returns `file_format` (`pdf`, `docx`, `xlsx`, …) and `document_type_name`. Useful
for deciding whether to show an icon or open with a specific viewer.

**Document statuses:** a document in any status other than `VECTORIZED` will not
appear in semantic searches. If the user asks about a doc and it doesn't appear,
check with `list_documents` — it may be in the pipeline (`LOADED`, `SCANNED`,
`CHUNKED`) or stopped (`REVIEW`, `NOT_SCANNABLE`).

---

## REST / n8n / Make / Zapier integrations (no LLM agent)

**Minimum flow:**

```
(once, a person)  Create an API key in app.ragfly.ai/api-keys → store RAGFLY_API_KEY
GET  /v1/session            →  verify active_group
GET  /v1/operations         →  what this key can do
POST /v1/documents/search   →  documents with chunks and scores
```

**Pagination:** `GET /v1/documents` returns `{ documents, total, page, limit }`.
Iterate with `page=1,2,...` until `documents` is empty or `page * limit >= total`.

**Answers:** `POST /v1/ask` returns the complete answer as JSON
(`{"answer": ..., "conversation_id": ...}`). There is no public streaming route:
in n8n or Make use a normal HTTP node and read `answer`.

**Stateless conversations:** if your automation doesn't need history, omit
`conversation_id` and each request opens a new conversation. Pass the
`conversation_id` you got back to continue a thread.

---

## Python SDK (`pip install ragfly`)

The SDK wraps the REST API `/v1`. For most cases use it directly:

```python
from ragfly import RAGfly

client = RAGfly(api_key="rf_...")
resp = client.ask("What are the penalty clauses?")
print(resp.answer)

# Direct semantic search (without LLM)
results = client.search("contracts 2024", limit=5)
for doc in results.documents:
    print(f"[rrf={doc.rrf_score:.3f}] {doc.name} ({doc.code})")
    for chunk in doc.chunks[:2]:
        print(f"  similarity={chunk.extra.get('similarity')}: {chunk.text[:120]}")
```

See [SDK.md](SDK.md) for the full client reference.

---

## TypeScript SDK (`npm i @ragfly/sdk`)

Same surface as the Python SDK, zero dependencies (native `fetch`). Runs on Node 18+, the browser, Vercel Edge and Cloudflare Workers — ideal for agents built on the JS/TS stack (Next.js, Vercel AI SDK, Workers).

```ts
import { RAGfly } from "@ragfly/sdk";

const client = new RAGfly({ apiKey: process.env.RAGFLY_API_KEY! });
const resp = await client.ask({ question: "What are the penalty clauses?" });
console.log(resp.answer);

// Direct semantic search (without LLM)
const results = await client.search({ query: "contracts 2024", limit: 5 });
for (const doc of results.documents) {
  console.log(`[rrf=${doc.rrfScore?.toFixed(3)}] ${doc.name} (${doc.code})`);
}
```

See [SDK-TS.md](SDK-TS.md) for the full client reference.

---

## Summary — choosing a tool or endpoint

| Need | MCP tool | REST endpoint |
|---|---|---|
| Verify connection | `session` | `GET /v1/session` |
| What this key can do | `list_operations` / `get_operation` | `GET /v1/operations` / `GET /v1/operations/{code}` |
| Run an operation | `run_operation` | `POST /v1/operations/{code}:execute` |
| Natural language question (RAG) | `ask` | `POST /v1/ask` |
| Semantic search (raw chunks) | `search_documents` | `POST /v1/documents/search` |
| See what documents exist | `list_documents` | `GET /v1/documents` |
| Document detail | `get_document` | `GET /v1/documents/{document_code}` |
| AI synthesis / analysis | `run_skill` | `POST /v1/skills/{skill_code}/run` |
| Pipeline state | `queue` | `GET /v1/queue` |
