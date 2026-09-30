# RAGfly TypeScript/JavaScript SDK

`@ragfly/sdk` 0.3.0 is the official TypeScript/JavaScript SDK of RAGfly
(RAG service). It speaks only the English REST `/v1` contract: each method calls
one `/v1` route, and three generic methods run any operation of the RAGfly app
that your key can run. It mirrors the [Python SDK](SDK.md) method for method,
and both run the same parity cases. Response fields, public catalog codes, enum
values, published schemas/defaults, validation details, and API-authored error
messages use English; tenant-authored content keeps its original language.
Catalog identifiers use their stored English aliases, and unmapped internal
identifiers are never returned.

Source: [github.com/RAGfly/ragfly-typescript](https://github.com/RAGfly/ragfly-typescript).

## Install

```bash
npm install @ragfly/sdk
```

No runtime dependencies: the SDK uses the native `fetch`, so it runs on Node 18+,
browsers, Vercel Edge and Cloudflare Workers. The package is ESM only (`import`,
not `require`).

It exports `RAGfly`, `RAGflyError`, `CLIENT_HEADER` and `VERSION` (`"0.3.0"`),
plus the types `RAGflyOptions`, `SearchResult`, `Document`, `Chunk`,
`AskResponse`, `AgentContext`, `AgentLayer`, `AgentTool`, `FunctionProfile`,
`OperationKind`, `OperationSummary`, `OperationDetail`, `OperationResult` and
`Json`.

## Quick start

```ts
import { RAGfly } from "@ragfly/sdk";

const client = new RAGfly({ apiKey: process.env.RAGFLY_API_KEY! });

// Retrieve and generate
const reply = await client.ask({ question: "What is the renewal date?" });
console.log(reply.answer);

// Retrieval only
const result = await client.search({ query: "active maintenance contracts", limit: 5 });
for (const document of result.documents) {
  console.log(document.code, document.name, document.maxSimilarity);
  for (const chunk of document.chunks) {
    console.log("  p.", chunk.page, chunk.extra.similarity, chunk.text.slice(0, 80));
  }
}
```

Every method takes one options object with camelCase keys. The SDK sends the
snake_case names of the REST contract: `minSimilarity` goes out as
`min_similarity`.

### Client options

```ts
new RAGfly({ apiKey, baseUrl?, timeoutMs?, fetch? })
```

| Option | Default | Meaning |
|---|---|---|
| `apiKey` | required | RAGfly API key (`rf_...`). Without it the constructor throws `RAGflyError("apiKey is required")` |
| `baseUrl` | `"https://api.ragfly.ai"` | API root. Trailing `/` characters are dropped |
| `timeoutMs` | `60000` | Per-request timeout in milliseconds |
| `fetch` | `globalThis.fetch` | A `fetch` implementation, for tests or runtimes without a global one |

Every request carries `Authorization: Bearer <apiKey>`,
`Content-Type: application/json` and `X-RAGfly-Client: sdk-typescript` (the last
one is exported as `CLIENT_HEADER`). There is no connection to close.

`ask()` resolves only when the whole answer is ready. If your answers take
longer than `timeoutMs`, raise it.

## Public methods

Every method returns a `Promise`. Methods written with `= {}` can be called
without an argument, and options you leave out are sent with the default shown
or not sent at all. `search`, `ask` and `agentContext` resolve to the camelCase
[models](#models) below, and the operation methods to the operation types. Every
other method resolves to the `/v1` JSON as it arrives (`Json`), with English
snake_case keys. The server checks the bounds noted under each table and answers
`422 VALIDATION_ERROR` outside them.

### Session and documents

| Method | Defaults | Route | Resolves to |
|---|---|---|---|
| `session()` | — | `GET /v1/session` | `Json`: `authenticated`, `user` (`code`, `name`), `active_group`, `active_entity`, `profile`, `locale`; role identifiers are not exposed |
| `setActiveEntity(entityCode)` | — | `POST /v1/session/active-entity` | Set an authorized entity; pass `null` to release the focus |
| `listDocuments({ status?, limit?, page? } = {})` | `limit: 20`, `page: 1` | `GET /v1/documents` | `Json`: `documents` (each with its `fs` block), `total`, `page`, `limit` |
| `getDocument({ documentCode })` | — | `GET /v1/documents/{document_code}` | `Json`: the document, with its `fs` block |
| `documentEdges({ documentCode, neighborLimit? })` | `neighborLimit: 50` | `GET /v1/documents/{document_code}/edges` | `Json`: `document`, `type_path`, `location_path`, `features`, `neighbors_two_hops` |

`status` takes an English document status such as `VECTORIZED` (the list is in
[MCP.md](MCP.md#document-status-values)). Bounds: `limit` 1–100, `page` 1 or
more, `neighborLimit` 1–500.

Entity focus is stored with the API key on the server. A flexible key keeps its
selected entity when you create another `RAGfly` client with the same key; pass
`null` to `setActiveEntity()` to release that focus. A fixed-entity key cannot
change or release its entity. Only an authenticated human session can issue API
keys; the SDK uses its key for `/v1` calls and does not mint keys.

### Search

| Method | Defaults | Route | Resolves to |
|---|---|---|---|
| `search({ query, limit?, minSimilarity?, entityCode? })` | `limit: 10`, `minSimilarity: 0` | `POST /v1/documents/search` | [`SearchResult`](#models) |

- Hybrid search: vector and keyword results fused by rank into `rrfScore`. It is
  simple retrieval without reranking, so `rerankScore` comes back `null`.
- `query` cannot be empty (`400 INVALID_REQUEST`). `limit` (1–100) is the
  maximum number of documents. `minSimilarity` goes from 0 to 1. `entityCode`
  searches one of your own entities.
- With `minSimilarity` above 0, a document comes back only if its best chunk
  reaches that similarity. Keyword-only matches carry no similarity, so they are
  dropped.
- A chunk's similarity is `chunk.extra.similarity`; `extra` also carries
  `chunk_number`. Per document, `maxSimilarity` is its best chunk similarity,
  `null` when no chunk has one.
- `url` opens the document in the RAGfly web app, where the user needs a
  session. For a public web source it is the source's own URL.
- `location` and `fs` say where the original file lives. See
  [REST.md § File locations](REST.md#file-locations-fs).

### Workspaces

| Method | Defaults | Route | Resolves to |
|---|---|---|---|
| `listSpaces({ limit? } = {})` | `limit: 20` | `GET /v1/spaces` | `Json`: `spaces`, `total` |
| `getSpace({ spaceId, documentLimit? })` | `documentLimit: 20` | `GET /v1/spaces/{space_id}` | `Json`: `space`, `documents`, `total_documents` |
| `refreshSpace({ spaceId })` | — | `POST /v1/spaces/{space_id}/refresh` | `Json`: the space |
| `promoteSpace({ spaceId })` | — | `POST /v1/spaces/{space_id}/promote` | `Json`: the space |
| `composeSpaces({ operation, spaceIdA, spaceIdB, name?, spaceType? })` | `name: ""`, `spaceType: "AREA"` | `POST /v1/spaces/compose` | `Json`: the new space |
| `readSpace({ spaceId, resolution?, query?, limit? })` | `resolution: "manifest"`, `query: ""`, `limit: 50` | `POST /v1/spaces/{space_id}/read` | `Json`: `resolution`, `total`, `items` |

`refreshSpace` re-materializes a workspace and `promoteSpace` turns an `AREA`
into a `SPACE`. In `composeSpaces`, `operation` is `union`, `intersection`,
`difference` or `symmetric_difference`, and `spaceType` is `AREA` or `SPACE`.
In `readSpace`, `resolution` is `count`, `manifest`, `chunks` or `text`, and
`chunks` needs a `query`. Other values answer `400 INVALID_REQUEST`. Bounds:
`limit` 1–200 in `listSpaces`, `documentLimit` 1–200, `limit` 1–500 in
`readSpace`.

### Queue and runs

| Method | Defaults | Route | Resolves to |
|---|---|---|---|
| `queue({ process?, status?, limit? } = {})` | `limit: 20` | `GET /v1/queue` | `Json`: `items`, `total` |
| `listRuns({ limit? } = {})` | `limit: 10` | `GET /v1/runs` | `Json`: `runs` |

`process` is a process type code. `status` is `PENDING`, `IN_PROGRESS`,
`COMPLETED`, `ERROR` or `WAITING`. Bounds: `limit` 1–200 in `queue` and 1–100 in
`listRuns`.

### Catalog and skills

| Method | Defaults | Route | Resolves to |
|---|---|---|---|
| `catalog({ type? } = {})` | `type: "ALL"` | `GET /v1/catalog` | `Json`: `functions`, `skills`, `total_functions`, `total_skills` |
| `getFunction({ functionCode })` | — | `GET /v1/functions/{function_code}` | `Json`: `code`, `name`, `alias`, `description`, `summary`, `url`, `documentation`, `behaviors`, `operations` |
| `listSkills()` | — | `GET /v1/skills` | `Json`: `skills` |
| `getSkill({ skillCode })` | — | `GET /v1/skills/{skill_code}` | `Json`: the skill |
| `runSkill({ skillCode, spaceId?, documentCode? })` | — | `POST /v1/skills/{skill_code}/run` | `Json`: the queued run |

`type` is `ALL`, `FUNCTIONS` or `SKILLS`; any other value is read as `ALL`.
`listSkills()` returns the same list as the `skills` of `catalog()`.
`getSkill()` includes the prompt and the model only when the key's role
administers skills. `runSkill()` needs `spaceId` or `documentCode`
(`400 INVALID_REQUEST` when neither is given).

### Ask and agent

| Method | Defaults | Route | Resolves to |
|---|---|---|---|
| `ask({ question, conversationId?, functionCode? })` | `functionCode: "CHAT-USER"` | `POST /v1/ask` | [`AskResponse`](#models) |
| `agentContext({ functionProfile? } = {})` | `functionProfile: "user_chat"` | `GET /v1/agent/context` | [`AgentContext`](#models) |
| `runAgentTool({ publicName, arguments, functionProfile? })` | `functionProfile: "user_chat"` | `POST /v1/agent/tools/{public_name}` | `unknown`: the tool's JSON result |

- `ask()` retrieves, generates and returns the complete answer. There is no
  streaming. To continue a conversation, pass the `conversationId` you got back.
  `functionCode` is the interface function, which sets the conversation's LLM
  model; it is used when the call opens a new conversation.
- `functionProfile` is a `FunctionProfile`: `"user_chat"` or `"support_chat"`.
- `runAgentTool()` runs one of the tools that `agentContext()` lists. Tool names
  are stable English public identifiers; catalog-backed names derive from the
  catalog's `*_en` aliases. The available tools and argument schemas vary by
  identity and profile, so read them from `agentContext()` at run time and pass
  `publicName` unchanged
  ([REST.md § Agent context](REST.md#agent-context-and-agent-tools)).

### Organization

| Method | Defaults | Route | Resolves to |
|---|---|---|---|
| `getOrganization({ entityCode? } = {})` | — | `GET /v1/organization` | `Json`: `group`, `entity`, `missing` |
| `updateOrganization({ groupDescription?, groupSystemPrompt?, entityDescription?, entitySystemPrompt?, entityCode? })` | — | `PUT /v1/organization` | `Json`: `group`, `entity`, `missing`, `applied` |
| `draftOrganization({ sourceText?, entityCode? } = {})` | `sourceText: ""` | `POST /v1/organization/draft` | `Json`: `generated`, `group`, `entity`, `notice` |

`updateOrganization()` needs an options object and writes only the fields you
pass. `draftOrganization()` proposes the texts from your `sourceText` and saves
nothing. Why these texts matter:
[REST.md § Set up your organization first](REST.md#set-up-your-organization-first).

### Usage, conversations and processes

| Method | Defaults | Route | Resolves to |
|---|---|---|---|
| `getUsage()` | — | `GET /v1/usage` | `Json`: the plan (`plan_code`, `period_start`, `period_end`, …) and `quotas` |
| `listConversations({ functionCode?, limit? } = {})` | `limit: 50` | `GET /v1/conversations` | `Json`: `conversations`, `total` |
| `deleteConversation({ conversationId })` | — | `DELETE /v1/conversations/{conversation_id}` | `unknown`: `deleted`, `conversation_id` |
| `listProcesses({ status?, processType?, category?, mine?, onlyOpen?, limit?, page? } = {})` | `limit: 20`, `page: 1` | `GET /v1/processes` | `Json`: `processes`, `total`, `page`, `limit` |
| `getProcess({ processCode })` | — | `GET /v1/processes/{process_code}` | `Json`: the process |
| `updateProcess({ processCode, status?, priority?, name?, description?, comments?, assignedTo?, dueAt?, finishedAt?, cost? })` | — | `PATCH /v1/processes/{process_code}` | `Json`: the updated process |

`mine: true` keeps the processes created by or assigned to the caller.
`updateProcess()` writes only the fields you pass; with none, the API answers
`400 INVALID_REQUEST`. Bounds: `limit` 1–200 in both lists, `page` 1 or more.

### Operations executor

| Method | Defaults | Route | Resolves to |
|---|---|---|---|
| `listOperations()` | — | `GET /v1/operations` | `{ operations: OperationSummary[]; total: number }` |
| `getOperation({ code })` | — | `GET /v1/operations/{code}` | `OperationDetail` |
| `runOperation({ code, input?, confirm? })` | `input: {}`, `confirm: false` | `POST /v1/operations/{code}:execute` | `OperationResult` |

These three run the operations behind the screens of the RAGfly app, with the
same permissions and audit as the web app. Use them for anything that has no
named route above. `kind` is `read`, `write` or `write_confirm`. A
`write_confirm` operation runs only with `confirm: true`. Without it nothing
runs, and the result carries `executed: false`, `confirm_required: true` and a
`preview` of the input.

```ts
const { operations } = await client.listOperations();                        // what this key can run
const detail = await client.getOperation({ code: "document_types.update" }); // input_schema / output_schema

await client.runOperation({ code: "document_types.update", input: { code: "TDOC_...", name: "Invoices" } });

const preview = await client.runOperation({ code: "document_types.delete", input: { code: "TDOC_..." } });
// preview.executed === false: nothing ran
await client.runOperation({ code: "document_types.delete", input: { code: "TDOC_..." }, confirm: true });
```

Input fields, validation details and catalog values inside `input` and `result`:
[REST.md § Discover what a key can do](REST.md#discover-what-a-key-can-do--v1operations).

## Models

```ts
type Json = Record<string, unknown>;

interface Chunk {
  text: string;
  page?: number | null;
  extra: Json;
}

interface Document {
  code: string | null;
  name: string | null;
  summary?: string | null;
  location?: string | null;
  url?: string | null;
  rrfScore?: number | null;
  maxSimilarity?: number | null;
  rerankScore?: number | null;
  fs?: Json | null;
  chunks: Chunk[];
}

interface SearchResult {
  query: string;
  totalDocuments: number;
  totalChunks: number;
  durationMs?: number | null;
  documents: Document[];
}

interface AskResponse {
  answer: string;
  conversationId: number | null;
  extra: Json;
}

interface AgentLayer {
  code: string;
  name: string;
  sha256: string;
}

interface AgentTool {
  operation: string;
  publicName: string;
  inputSchema: Json;
  readOnly: boolean;
}

type FunctionProfile = "user_chat" | "support_chat";

interface AgentContext {
  functionProfile: FunctionProfile;
  systemPrompt: string;
  systemPromptHash: string;
  layers: AgentLayer[];
  identity: Json;
  tools: AgentTool[];
  limits: Record<string, number>;
}

type OperationKind = "read" | "write" | "write_confirm";

interface OperationSummary {
  code: string;
  kind: OperationKind;
  confirm_required: boolean;
  functions: string[];
}

interface OperationDetail extends OperationSummary {
  input_schema: Json;
  output_schema: Json | null;
}

interface OperationResult {
  code: string;
  kind: OperationKind;
  executed: boolean;
  confirm_required?: boolean;
  preview?: Json;
  result?: unknown;
}
```

| Field | What it carries |
|---|---|
| `Chunk.page` | Page number, `null` when the source has no pages |
| `Chunk.extra` | `similarity` (this chunk's score) and `chunk_number`, as the API sends them |
| `Document.rrfScore` | The document's hybrid rank |
| `Document.maxSimilarity` | Best chunk similarity, `null` when no chunk has one |
| `Document.rerankScore` | `null` in search results, because search does not rerank |
| `Document.url` | Opens the document in the RAGfly web app (session needed); for a public web source, the source URL |
| `Document.fs` | How to open the original file, in `fs.how_to_open` (snake_case, as the API sends it) |
| `SearchResult.query` | The query you passed, set by the client |
| `AskResponse.extra` | The other fields of the `/v1/ask` response: `message_id` and `user_message_id` |
| `AgentContext.identity` | `user_alias`, `group`, `entity`, `area`, `profile`; role identifiers are not exposed |
| `AgentContext.limits` | `max_iterations`, `max_retrieval_calls`, `timeout_seconds` |

The SDK maps search, ask and agent-context fields to camelCase. The nested JSON
it passes through (`extra`, `fs`, `identity`, `limits`) and the operation types
keep the API's snake_case keys. It drops the `schema_version` field of
`/v1/agent/context`.

## Errors

Any response with HTTP status 400 or higher throws `RAGflyError`:

```ts
import { RAGflyError } from "@ragfly/sdk";

try {
  await client.getDocument({ documentCode: "DOES-NOT-EXIST" });
} catch (err) {
  if (err instanceof RAGflyError) {
    console.error(err.statusCode, err.code, err.message, err.details);
    // 404 NOT_FOUND The requested resource was not found. {}
  }
}
```

`RAGflyError` extends `Error`, and its `name` is `"RAGflyError"`.

| Property | Where it comes from |
|---|---|
| `message` | The envelope's `message`. The documented `/v1` contract always supplies the fixed English envelope; if a custom endpoint or intermediary violates it, the SDK may fall back to its response text |
| `statusCode` | The HTTP status; `undefined` when there was no response |
| `code` | The envelope's public `code`, `undefined` when the body has none |
| `details` | The envelope's `details`, `{}` when absent |

`/v1` answers every error with the public envelope
`{ code, message, details, request_id }`. The SDK reads `code`, `message` and
`details`; it does not keep `request_id`. The server fills `request_id` by
echoing the request's `X-Request-Id` header, and the SDK does not send one.

| HTTP status | `code` |
|---|---|
| 400 | `INVALID_REQUEST` |
| 401 | `UNAUTHORIZED` |
| 402 | `QUOTA_EXCEEDED`: the plan quota for the operation is used up |
| 403 | `FORBIDDEN` |
| 404 | `NOT_FOUND` |
| 409 | `CONFLICT` |
| 422 | `VALIDATION_ERROR` |
| 429 | `RATE_LIMITED` |
| 500, and any status not listed | `INTERNAL_ERROR` |

- `message` is a fixed English sentence per code, not the specific cause, and
  `details` is usually `{}`. The operations executor fills `details` on `422`
  with `missing_fields`, `unknown_field_count` or the mapped `fields`; unknown
  request keys are never echoed.
- A response the API cannot represent without leaking internals fails closed
  with HTTP 500 and the code `PUBLIC_CODE_MAPPING_MISSING` or
  `PUBLIC_FIELD_MAPPING_MISSING`.
- A document or process outside your scope answers `404`, the same as one that
  does not exist.
- `RAGflyError` without `statusCode`: the constructor without `apiKey`
  (`"apiKey is required"`) or with no `fetch` available, and a request that
  passes `timeoutMs` (`"Timeout after <timeoutMs>ms"`). Other network failures
  are not wrapped: they reach you as `fetch` throws them.

## Authentication

```ts
import { RAGfly } from "@ragfly/sdk";

const client = new RAGfly({ apiKey: process.env.RAGFLY_API_KEY! });
console.log(await client.session()); // identity and active tenant context
```

- The key travels as `Authorization: Bearer <apiKey>` on every request.
- An API key only works on `/v1` routes: any other route answers `403` to it.
  Every method of this SDK calls a `/v1` route.
- A signed-in person creates and revokes API keys in the RAGfly web app (API
  Keys). An API key cannot create or revoke keys.
- The key acts with its owner's permissions: a route its role does not reach
  answers `403 FORBIDDEN`. More in [REST.md § Authentication](REST.md#authentication).
- In browser code the key is visible to anyone who loads the page. Keep
  long-lived keys on a server.

## See also

- [REST.md](REST.md): the HTTP contract behind every method.
- [SDK.md](SDK.md): the Python SDK, with the same surface.
- [MCP.md](MCP.md): the same capabilities as MCP tools, and the `fs` rules.
