# RAGfly TypeScript/JavaScript SDK

> The TypeScript SDK is the fastest way to connect a Node, browser, or edge agent to RAGfly. It wraps the REST API and SSE stream protocol into the same surface as the [Python SDK](SDK.md). Zero dependencies — native `fetch`.

---

## Installation

```bash
npm install @ragfly/sdk
```

Runs on **Node 18+**, the **browser**, **Vercel Edge** and **Cloudflare Workers** (anywhere `fetch` exists). No runtime dependencies.

- **npm**: [npmjs.com/package/@ragfly/sdk](https://www.npmjs.com/package/@ragfly/sdk)
- **GitHub**: [github.com/RAGfly/ragfly-typescript](https://github.com/RAGfly/ragfly-typescript)

---

## Quick start

```ts
import { RAGfly } from "@ragfly/sdk";

const client = new RAGfly({ apiKey: "slm_live_..." });

// End-to-end RAG: retrieves documents and generates a response
const resp = await client.ask("What are the Q1 sales figures?");
console.log(resp.answer);

// Token-by-token streaming
for await (const chunk of client.ask("Summarize the active contracts", { stream: true })) {
  process.stdout.write(chunk.delta);
}

// Semantic retrieval only, without going through the LLM
const results = await client.search("maintenance contracts", { limit: 5 });
for (const doc of results.documents) {
  console.log(doc.nombre, `rrfScore=${doc.rrfScore?.toFixed(3)}`);
  for (const chunk of doc.chunks.slice(0, 2)) {
    console.log(`  "${chunk.texto.slice(0, 100)}…"`);
  }
}
```

---

## Method reference

### `client.ask(question, { stream?, conversationId? })`

Natural language question over the corpus. Internally: creates a temporary conversation → sends the message → consumes the SSE stream → returns the response.

| Parameter | Type | Description |
|-----------|------|-------------|
| `question` | `string` | The natural language question |
| `stream` | `boolean` | `true` → returns `AsyncGenerator<AskChunk>`; omitted/`false` → `Promise<AskResponse>` |
| `conversationId` | `number` | Reuse an existing conversation to maintain history |

**Without streaming:**

```ts
const resp = await client.ask("What does the Acme contract say?");
console.log(resp.answer);         // string — full response
console.log(resp.conversationId); // number — id of the created conversation
```

**With streaming:**

```ts
for await (const chunk of client.ask("What does the Acme contract say?", { stream: true })) {
  process.stdout.write(chunk.delta); // string — text fragment
}
// equivalent explicit form: client.askStream("...")
```

**Maintain history in a conversation:**

```ts
const r1 = await client.ask("Who signed the contract?");
const r2 = await client.ask("And when does it expire?", { conversationId: r1.conversationId });
```

---

### `client.search(query, { limit?, minSimilitud?, codigoEntidad?, idEspacio? })`

Hybrid semantic search (vector + lexical + Cohere rerank) without LLM generation. Returns the most relevant chunks from the corpus with their scores.

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `string` | Search text |
| `limit` | `number` | Maximum documents to return (default 10) |
| `minSimilitud` | `number` | Minimum similarity threshold 0–1 (default 0.0) |
| `codigoEntidad` | `string` | Filter by specific entity |
| `idEspacio` | `number` | Search only within a Workspace |

```ts
const results = await client.search("maintenance contracts", { limit: 5 });

console.log(`${results.totalDocumentos} documents, ${results.totalChunks} chunks`);
console.log(`Time: ${results.duracionMs?.toFixed(0)}ms`);

for (const doc of results.documents) {
  console.log(`· ${doc.nombre} (rrf=${doc.rrfScore?.toFixed(3)})`);
  for (const chunk of doc.chunks) {
    console.log(`  similitud=${chunk.similitud?.toFixed(3)}: ${chunk.texto.slice(0, 80)}…`);
  }
}
```

---

### `client.listDocuments({ page?, pageSize?, estado? })`

Paginated list of the active group's corpus.

```ts
const page = await client.listDocuments({ page: 1, pageSize: 50 });
// → object with keys: items, total, page, limit
```

**Opening a document on disk.** Each document returned by `listDocuments` (and
by the document-detail response) carries an `fs` field describing where the file
lives, so an agent running **on the same machine as the documents** can open it.
The `fs` field of the response holds: `ruta_archivo`, `ruta_es_absoluta`,
`carpeta_relativa`, `nombre_archivo`, and `como_abrir` (a plain-language
instruction). The single rule:

1. `ruta_es_absoluta` is `true` (loaded via RAGfly Desktop) → open `ruta_archivo`
   directly.
2. `ruta_es_absoluta` is `false` (web upload via browser) → open
   `$RAGFLY_ROOT + ruta_archivo`, where `RAGFLY_ROOT` is the **parent folder**
   of the root folder the user picked when uploading. Example: the user
   uploaded `/Users/ana/Dropbox/MisDocumentos` → set
   `RAGFLY_ROOT=/Users/ana/Dropbox`, and `/MisDocumentos/letras/cancion.txt`
   resolves to `/Users/ana/Dropbox/MisDocumentos/letras/cancion.txt`.

```ts
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const page = await client.listDocuments({ page: 1, pageSize: 50 });
for (const doc of page.items) {
  const fs = doc.fs;
  const path = fs.ruta_es_absoluta
    ? fs.ruta_archivo
    : join(process.env.RAGFLY_ROOT!, fs.ruta_archivo);
  if (existsSync(path)) {
    const text = readFileSync(path, "utf8");
  }
}
```

> The `fs` field comes straight from the API in `snake_case` (it is not part of
> the mapped `Document` model above).

Set `RAGFLY_ROOT` once per machine — e.g.
`export RAGFLY_ROOT="/Users/ana/Dropbox"` in your `~/.zshrc`; the cloud never
reads it nor stores your absolute root. Always check `existsSync` before
reading. Step-by-step walkthrough:
[MCP.md § Setting up `RAGFLY_ROOT`](MCP.md#setting-up-ragfly_root--once-per-machine-in-3-steps).

---

## Data models

TypeScript exposes the fields in `camelCase`; the backend speaks `snake_case`. The SDK maps between them.

| Interface | Key fields |
|-----------|-------------|
| `AskResponse` | `answer: string`, `conversationId: number`, `messageId?: number` |
| `AskChunk` | `delta: string` |
| `SearchResult` | `query`, `totalDocumentos`, `totalChunks`, `duracionMs`, `documents: Document[]` |
| `Document` | `codigo`, `nombre`, `resumen`, `url`, `rrfScore`, `similitudMax`, `chunks: Chunk[]` |
| `Chunk` | `texto`, `similitud`, `scoreRerank`, `pagina`, `extra` |

> Mapping vs the [Python SDK](SDK.md): `score_rerank`→`scoreRerank`, `rrf_score`→`rrfScore`, `similitud_max`→`similitudMax`, `total_documentos`→`totalDocumentos`, `duracion_ms`→`duracionMs`.

---

## Authentication

The SDK accepts **API Keys** (format `slm_live_...`) generated from [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) or via the `POST /auth/api-key` endpoint.

```ts
const client = new RAGfly({ apiKey: process.env.RAGFLY_API_KEY! });
```

The Key inherits the group, entity, and role of the user who issued it. See [INTEGRATION.md](INTEGRATION.md) § Credentials for role and PROFILE details.

---

## Options & errors

```ts
new RAGfly({
  apiKey: "slm_live_...",
  baseUrl: "https://api.ragfly.ai", // default
  timeoutMs: 60000,                 // default
  fetch: customFetch,               // optional, defaults to globalThis.fetch
});
```

All non-2xx responses throw `RAGflyError` (with `.statusCode`):

```ts
import { RAGflyError } from "@ragfly/sdk";

try {
  await client.ask("…");
} catch (err) {
  if (err instanceof RAGflyError) console.error(err.statusCode, err.message);
}
```
