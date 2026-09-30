# RAGfly — Public REST API v1

`/v1` is the stable English HTTP face of RAGfly for agents, developers and
automation platforms. It wraps the authenticated internal REST routes at the
edge. Internal routes remain Spanish for Web/Desktop and are not part of this
public contract: an API key that calls one gets `403`.

**Base URL:** `https://api.ragfly.ai`  
**OpenAPI:** [https://api.ragfly.ai/openapi.json](https://api.ragfly.ai/openapi.json)  
**Swagger:** [https://api.ragfly.ai/docs](https://api.ragfly.ai/docs)

This page is the short reference. The exhaustive one —every route with its
request and response schema— is the OpenAPI document above.

There is no `/v2`. A future incompatible contract would be introduced explicitly
as a new version; `/v1` is the current public contract.

## Authentication

Every `/v1` route requires:

```http
Authorization: Bearer <JWT-or-rf_API_key>
```

- **API key** (`rf_...`): what integrations use. Create and revoke it in the
  [RAGfly web app](https://app.ragfly.ai/api-keys). It operates only `/v1` (MCP,
  the SDKs and the CLI go through it), with its owner's RBAC — the key's role,
  filtered by the owner's access level, decides which actions; the owner's group,
  entity and area decide which data.
- **JWT**: an optional person's web session. A person can use it with `/v1`, but
  key management belongs in the web app. The web application's `/auth/*` routes
  are not part of the public integration contract.

The public contract ignores `Accept-Language`: field names, catalog codes, enum
values, published schemas/defaults, validation details and standard success or
error messages are always English. This applies to nested JSON too. User
document content and other tenant-authored text keep their original language.
The session's `locale`, when present, is a language preference tag; it does not
localize the API protocol.

## Entity focus

An API key has either a fixed entity or a flexible entity focus. A fixed key
cannot change its entity. A flexible key may select an authorized entity or
release focus by sending `{"entity_code":null}` to
`POST /v1/session/active-entity`. The request must include `entity_code`;
`null` is the explicit release value. RAGfly stores the resulting focus for
that key, so it remains after the client process is reconstructed. The key
cannot select an entity outside its owner's authorized scope.

## Routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/v1/session` | Authenticated identity and active context |
| `POST` | `/v1/session/active-entity` | Set `{"entity_code":"000057"}` or release with `{"entity_code":null}` |
| `GET` | `/v1/operations` | Operations this key can run (RBAC-filtered) |
| `GET` | `/v1/operations/{code}` | One operation with its `input_schema` and `output_schema` |
| `POST` | `/v1/operations/{code}:execute` | Run an operation: `{"input": {...}, "confirm": false}` |
| `GET` | `/v1/documents` | Paginated corpus documents (`status`, `limit`, `page`) |
| `GET` | `/v1/documents/{document_code}` | Document detail |
| `GET` | `/v1/documents/{document_code}/edges` | Document graph edges (`neighbor_limit`) |
| `POST` | `/v1/documents/search` | Hybrid search: vector + lexical, fused with RRF |
| `GET` | `/v1/spaces` | List workspaces |
| `GET` | `/v1/spaces/{space_id}` | Workspace and its documents (`document_limit`) |
| `POST` | `/v1/spaces/{space_id}/refresh` | Re-materialize a workspace |
| `POST` | `/v1/spaces/{space_id}/promote` | Promote an AREA to a SPACE |
| `POST` | `/v1/spaces/compose` | Set operation over two workspaces |
| `POST` | `/v1/spaces/{space_id}/read` | Read a workspace (`count`, `manifest`, `chunks`, `text`) |
| `GET` | `/v1/queue` | Processing queue (`process`, `status`, `limit`) |
| `GET` | `/v1/runs` | Skill run history |
| `GET` | `/v1/catalog` | RBAC-filtered functions and skills (`type`) |
| `GET` | `/v1/functions/{function_code}` | Function detail: documentation and behaviours |
| `GET` | `/v1/skills` | Skills available to you (the same list as `/v1/catalog`) |
| `GET` | `/v1/skills/{skill_code}` | Skill detail. Prompt and model come only if your role administers skills |
| `POST` | `/v1/skills/{skill_code}/run` | Queue a skill (`space_id` or `document_code`) |
| `POST` | `/v1/ask` | Complete RAG answer |
| `GET` | `/v1/agent/context` | Layered prompt, identity, tools and limits |
| `POST` | `/v1/agent/tools/{public_name}` | Run one tool listed by `/v1/agent/context` |
| `GET` | `/v1/organization` | This tenant's profile: description and system prompt |
| `PUT` | `/v1/organization` | Write the profile (group and/or entity) |
| `POST` | `/v1/organization/draft` | Propose the four profile texts. Does not save |
| `GET` | `/v1/usage` | Plan quotas against what is already consumed |
| `GET` | `/v1/conversations` | Conversation history (`function_code`, `limit`) |
| `DELETE` | `/v1/conversations/{conversation_id}` | Delete a conversation and its messages |
| `GET` | `/v1/processes` | Process instances: support, requests, workspace jobs |
| `GET` | `/v1/processes/{process_code}` | One process in full |
| `PATCH` | `/v1/processes/{process_code}` | Update status, priority, title, description, comments, assignee, dates or cost |

Every route applies the key's RBAC. A route the key's role does not reach answers
`403 FORBIDDEN`; a document outside its group, entity or area answers `404`, the
same as one that does not exist.

## Discover what a key can do — `/v1/operations`

`/v1/operations` is how an integration asks what its key can do. It publishes the
operations behind the screens of the RAGfly app, filtered by the key's RBAC with
the same rule the web app applies: an operation that is not listed does not
exist for this key.

```bash
curl https://api.ragfly.ai/v1/operations -H "Authorization: Bearer $RAGFLY_API_KEY"
```

```json
{
  "operations": [
    {"code": "documents.get", "kind": "read", "confirm_required": false, "functions": ["DOCUMENTS"]},
    {"code": "spaces.delete", "kind": "write_confirm", "confirm_required": true, "functions": ["WORKSPACES"]}
  ],
  "total": 18
}
```

`kind` is `read`, `write` or `write_confirm`. `functions` names the screens of
the web app that use the operation. [OPERATIONS.md](OPERATIONS.md) lists every
operation that exists, with the profile it needs, the same calls on MCP, CLI and
both SDKs, and what is not published and why.

The detail adds the schemas. `input_schema` is one flat JSON object with the
path, query and body fields together:

```bash
curl https://api.ragfly.ai/v1/operations/documents.get -H "Authorization: Bearer $RAGFLY_API_KEY"
```

```json
{
  "code": "documents.get",
  "kind": "read",
  "confirm_required": false,
  "functions": ["DOCUMENTS"],
  "input_schema": {
    "type": "object",
    "properties": {"document_code": {"type": "string"}},
    "additionalProperties": false,
    "required": ["document_code"]
  },
  "output_schema": {"properties": {"document_code": {"type": "string"}, "...": {}}}
}
```

Run it with `POST /v1/operations/{code}:execute`:

```bash
curl -X POST "https://api.ragfly.ai/v1/operations/documents.get:execute" \
  -H "Authorization: Bearer $RAGFLY_API_KEY" -H "Content-Type: application/json" \
  -d '{"input": {"document_code": "32282"}, "confirm": false}'
# → {"code": "documents.get", "kind": "read", "executed": true, "result": {...}}
```

A `write_confirm` operation (deletes, reverts, resets) does nothing unless
`confirm` is `true`. Without it the answer is a preview, and nothing runs:

```json
{
  "code": "documents.revert",
  "kind": "write_confirm",
  "executed": false,
  "confirm_required": true,
  "preview": {"input": {"document_code": "...", "source_statuses": ["..."], "target_status": "..."}}
}
```

Show the preview to the person and repeat the call with `"confirm": true` only
after they agree. `write` and `write_confirm` runs are audited.

| Answer | Meaning |
|---|---|
| `404 NOT_FOUND` | The code does not exist or is not visible to this key. The two cases are not told apart |
| `422 VALIDATION_ERROR` with `details.unknown_field_count` | The `input` carries fields the schema does not declare; their names are not echoed |
| `422 VALIDATION_ERROR` with `details.missing_fields` | A required field is missing |
| `403 FORBIDDEN` | The key's RBAC does not reach the concrete route |

Field names, catalog codes, enum values, defaults, validation details and
messages written by the API in `input`, schemas, errors and `result` are
English. Catalog codes use the English alias
stored for their catalog row; for example, document status is `VECTORIZED`.
`document_statuses.list` is the source for the current allowed values. The API
never returns the internal database code. Tenant-authored names, descriptions,
prompts and document content keep the language in which they were written; they
are content, not protocol messages.

## Set up your organization first

Two texts per level —group and entity— decide how well RAGfly serves you: `description` is prose
about who you are, and `system_prompt` is the instruction the model follows when answering about
**your** documents. The system prompt is injected into every skill with organization scope, which
is the whole ingestion pipeline and not only chat, so a tenant that leaves them empty ingests and
answers worse than one that filled them in. Do it before your first load.

These routes need a key whose role can manage the organization profile, normally
a group administrator's; a key without profile-management access gets `403` on the read and
on the draft.

```bash
# What is missing?
curl https://api.ragfly.ai/v1/organization -H "Authorization: Bearer $RAGFLY_API_KEY"
# → { "group": {...}, "entity": {...}, "missing": ["group.description", ...] }

# Propose from a source text you bring (your "about us" page, for instance).
# RAGfly does not fetch URLs: read the page yourself and pass the text.
curl -X POST https://api.ragfly.ai/v1/organization/draft \
  -H "Authorization: Bearer $RAGFLY_API_KEY" -H "Content-Type: application/json" \
  -d '{"source_text":"We are a structural engineering consultancy..."}'

# Review, then write. Only the fields you send are written.
curl -X PUT https://api.ragfly.ai/v1/organization \
  -H "Authorization: Bearer $RAGFLY_API_KEY" -H "Content-Type: application/json" \
  -d '{"group_description":"...","group_system_prompt":"..."}'
```

## Know what you have left

```bash
curl https://api.ragfly.ai/v1/usage -H "Authorization: Bearer $RAGFLY_API_KEY"
```

```json
{
  "plan_code": "Growth", "period_start": "2026-09-05", "period_end": "2026-10-05",
  "quotas": [
    { "feature": "ACTIVE_CORPUS", "unit": "pages", "included": 5000, "used": 1508,
      "on_limit": "BLOCK", "by_entity": [{ "entity_code": "000024", "used": 1508 }] }
  ]
}
```

`included: null` means unlimited. Check it before a large ingestion or a batch of retrievals.

## Search example

```bash
curl https://api.ragfly.ai/v1/documents/search \
  -H 'Authorization: Bearer rf_xxxxxxxxxx' \
  -H 'Content-Type: application/json' \
  -d '{"query":"active maintenance contracts","limit":5,"min_similarity":0.35}'
```

Body: `query` (required, non-empty), `limit` (1–100, default 10: the maximum
number of **documents**), `min_similarity` (0–1, default 0) and `entity_code`
(optional, one of your own entities).

The search is hybrid (semantic + keyword). With `min_similarity` above 0, a document
is returned only if its best chunk reaches that similarity; keyword-only matches carry
no similarity and are dropped. `url` opens the document in the RAGfly web app (the user
needs a session there); for a public web source it is the source's own URL.

Response fields are English:

```json
{
  "documents": [{
    "code": "32434",
    "name": "Maintenance contract 2024.pdf",
    "summary": "Maintenance contract between ...",
    "location": "/Contracts/2024/Maintenance contract 2024.pdf",
    "url": "https://app.ragfly.ai/documents?codigo=32434&pagina=21",
    "rrf_score": 0.0325,
    "max_similarity": 0.5497,
    "rerank_score": null,
    "chunks": [
      {"text": "...", "page": 21, "extra": {"chunk_number": 26, "similarity": 0.5497}},
      {"text": "...", "page": 22, "extra": {"chunk_number": 28, "similarity": 0.544}}
    ],
    "fs": {"home_var": "RAGFLY_HOME_442681", "relative_path": "Contracts/2024/Maintenance contract 2024.pdf", "path": "/Contracts/2024/Maintenance contract 2024.pdf", "origin": "WEB", "is_absolute": false, "is_public_url": false, "is_cloud_only": false}
  }],
  "total_documents": 1,
  "total_chunks": 2,
  "duration_ms": 2875
}
```

- Each document carries its most relevant `chunks`. `page` is `null` when the
  source has no pages.
- The chunk's own score is `extra.similarity`. Per document: `rrf_score` (the
  hybrid rank), `max_similarity` (its best vector match; `null` when none of its
  chunks has a vector score) and `rerank_score`.
- This route is simple retrieval: it does not rerank, so `rerank_score` comes
  back `null`.
- `location` and `fs` (abridged above) say where the original lives, by design;
  see [File locations](#file-locations-fs).
- Each call counts against the `RETRIEVALS` quota (`GET /v1/usage`).

## Ask example

```bash
curl https://api.ragfly.ai/v1/ask \
  -H 'Authorization: Bearer rf_xxxxxxxxxx' \
  -H 'Content-Type: application/json' \
  -d '{"question":"What is the renewal date?","function_code":"CHAT-USER"}'
```

```json
{"answer":"The renewal date is 30 June.","conversation_id":512,"message_id":514,"user_message_id":513}
```

`answer` and `conversation_id` are the stable fields of this response. Pass
`conversation_id` to continue the same thread. The endpoint answers once the whole
answer is ready, as JSON; it does not stream, and neither do the SDKs.

## Agent context and agent tools

`GET /v1/agent/context` returns what an agent needs to reason like the RAGfly
chat for this identity: the layered `system_prompt` with its hashes, `identity`,
`limits` and `tools`, the list of tools that `POST /v1/agent/tools/{public_name}`
runs.

Agent tools have stable English public names. Names backed by catalog entries
derive from the catalog's English aliases (`codigo_habilidad_en` or
`codigo_funcion_en`); fixed tools use explicit English names. The context only
lists tools allowed for the authenticated identity and selected profile, so
read its `tools` and `input_schema` at run time. Pass `public_name` unchanged to
`POST /v1/agent/tools/{public_name}`; internal chat tool names are not part of
the public contract. For stable REST operations, use the `/v1` routes above
and `/v1/operations`.

## Function detail

`/v1/catalog` enumerates what the caller can reach; `/v1/functions/{function_code}`
returns one of them in full, so an agent can learn what a RAGfly screen actually
does before deciding whether it needs it.

```bash
curl https://api.ragfly.ai/v1/functions/PROCESS_PIPELINE \
  -H 'Authorization: Bearer rf_xxxxxxxxxx'
```

```json
{
  "code": "PROCESS_PIPELINE",
  "name": "Alimentación Documentos",
  "alias": "Alimentación",
  "description": "Long-form description of what the function does end to end.",
  "summary": "One line written for an agent.",
  "url": "/process-pipeline",
  "documentation": "# Alimentación Documentos\n\n## Descripción\n…",
  "behaviors": [
    {
      "class": "STOP",
      "section": "Paso 2 — Detener el pipeline en curso",
      "text": "Al pulsar el botón de detener durante una ejecución, el pipeline se interrumpe…"
    }
  ],
  "operations": [
    {"code": "documents.count_by_status", "kind": "read"},
    {"code": "ingestion_runs.cancel", "kind": "write_confirm"}
  ]
}
```

`documentation` is the compiled Markdown of the function — the same text the
in-product help shows. `behaviors` is that documentation in structured form: one
entry per documented behaviour of the screen, each carrying a `class`.

| `class` | What it describes |
|---|---|
| `NAVIGATION` | What loads on entry, or where the screen takes you |
| `INTERACTION` | A gesture the user performs, and its effect |
| `BACKGROUND` | What keeps happening without anyone acting |
| `STOP` | How work in progress is interrupted |
| `RECOVERY` | How an interrupted state is picked up again |

Behaviours are **descriptions, not operations**. They tell an agent what a
gesture does; they are not a way to perform it. `operations` names the
operations the screen uses; whether this key can run one is what
`GET /v1/operations` answers. To act on the corpus, use the routes above.

Field names, `class` values and error codes are English like the rest of `/v1`.
The descriptive `name`, `description`, `section` and `text` are product content
and come back in the language they were authored in — today Spanish — the same
way document content keeps its own language.

A `404` means the function is outside the caller's catalog. It is the same RBAC
that filters `/v1/catalog`: the contract is uniform, the visible surface is not.

## Errors

All public errors use one English envelope. `request_id` is echoed when supplied:

```json
{
  "code": "NOT_FOUND",
  "message": "The requested resource was not found.",
  "details": {},
  "request_id": "req-123"
}
```

Known codes include `INVALID_REQUEST`, `UNAUTHORIZED`, `QUOTA_EXCEEDED` (the plan
quota for the operation is used up), `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`,
`CONFLICT`, `RATE_LIMITED` and `INTERNAL_ERROR`.
A catalog value without an English public mapping fails closed with
`PUBLIC_CODE_MAPPING_MISSING`; it is never emitted as an internal Spanish code.

## File locations (`fs`)

Document responses can include these filesystem hints:

```json
{
  "home_var": "RAGFLY_HOME_442681",
  "relative_path": "MyDocuments/contract.pdf",
  "path": "/MyDocuments/contract.pdf",
  "origin": "WEB",
  "is_absolute": false,
  "is_public_url": false,
  "is_cloud_only": false
}
```

Resolve in this order: if `is_cloud_only` is true, the original remains with
its provider and the logical path is not local; if `is_public_url` is true or
`origin` is `PUBLIC`, open the URL directly; if `is_absolute` is true, open
`path` directly; otherwise read the environment variable named by `home_var`
and join its value with `relative_path`. The `home_var` name is per-root, so
documents may refer to different variables.

If `home_var` is `null`, empty, or unset, there is no local root available for
that document. Do not guess a root or construct a path from `path`. For
cloud-only documents, `source_id` and `source_url` may be present; provider
access requires the integrator's own credentials.

See [MCP.md: Opening a document on disk](MCP.md#opening-a-document-on-disk-fs-block)
for examples with multiple roots and cloud-provider details.

## What `/v1` does not return

The full text of a document and internal machinery. An agent gets a document's
summary, its relevant chunks and its location (`location` and `fs`, by design);
never the complete extracted text, and never the functions, skills, processes
and routes the system uses to operate itself.

## Internal REST

Routes such as `/documentos`, `/espacios-trabajo` and `/interfaz` are internal
implementation routes for Web/Desktop. Do not build external integrations on
them; use `/v1`. An API key on an internal route gets `403` with "An API key can
only operate through the public /v1 API".

`/v1` is not just a translation of those routes. The catalog it publishes
(`/v1/catalog`, `/v1/skills`, `/v1/functions/{code}`, `/v1/operations`) lists
only what is meant for integrators: capabilities the system uses to operate
itself are withheld, and calling one by name returns `404` rather than running
it. The internal routes have no such boundary, so an integration built on them
would depend on machinery that is not part of the public contract and can change
without a version bump.
