# RAGfly TypeScript/JavaScript SDK

`@ragfly/sdk` 0.3.0 consumes `/v1` exclusively with native `fetch`. It runs on
Node 18+, browsers and edge runtimes. Public method names and models are
English concepts in TypeScript `camelCase`; the HTTP payload remains the
English REST contract in `snake_case`.

```bash
npm install @ragfly/sdk
```

## Quick start

```ts
import { RAGfly } from "@ragfly/sdk";

const client = new RAGfly({ apiKey: "slm_live_..." });
const answer = await client.ask("What is the renewal date?");
console.log(answer.answer);

const result = await client.search("active maintenance contracts", { limit: 5 });
for (const document of result.documents) {
  console.log(document.code, document.name, document.maxSimilarity);
}
```

## Public methods

| Method | Public options / result |
|---|---|
| `ask(question, { conversationId?, functionCode?, stream? })` | `AskResponse`; `stream: true` yields an `AsyncGenerator<AskChunk>` over the complete `/v1/ask` response |
| `askStream(question, conversationId?, functionCode?)` | Explicit streaming-compatible iterator |
| `search(query, { limit?, minSimilarity?, entityCode?, spaceId? })` | `SearchResult` with `documents`, `totalDocuments`, `totalChunks`, `durationMs` |
| `agentContext({ functionProfile? })` | Layered prompt, hashes, identity, tools and limits |
| `runAgentTool(publicName, arguments, { functionProfile? })` | English JSON result |
| `listDocuments({ page?, pageSize?, status? })` | English JSON page |

`minSimilitud`, `codigoEntidad`, `idEspacio`, `estado` and `codigoFuncion` are
input-only compatibility aliases. New code should use the English names.

## Models

```ts
interface Chunk { text; similarity; rerankScore; page; extra }
interface Document { code; name; summary; url; rrfScore; maxSimilarity; chunks }
interface SearchResult { query; totalDocuments; totalChunks; durationMs; documents }
interface AskResponse { answer; conversationId; messageId }
```

## Errors and authentication

Non-2xx responses throw `RAGflyError` with `statusCode`. The message comes from
the public English envelope (`code`, `message`, `details`, `request_id`).

```ts
const client = new RAGfly({ apiKey: process.env.RAGFLY_API_KEY! });
```

See [REST.md](REST.md) for all routes and [MCP.md](MCP.md) for the `fs`
file-location rule.
