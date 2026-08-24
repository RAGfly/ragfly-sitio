# RAGfly — Public REST API v1

`/v1` is the stable English HTTP face of RAGfly for agents, developers and
automation platforms. It wraps the authenticated internal REST routes at the
edge. Internal routes remain Spanish for Web/Desktop and are not part of this
public contract.

**Base URL:** `https://api.ragfly.ai`  
**OpenAPI:** [https://api.ragfly.ai/openapi.json](https://api.ragfly.ai/openapi.json)  
**Swagger:** [https://api.ragfly.ai/docs](https://api.ragfly.ai/docs)

There is no `/v2`. A future incompatible contract would be introduced explicitly
as a new version; `/v1` is the current public contract.

## Authentication

Every `/v1` route requires:

```http
Authorization: Bearer <JWT-or-slm_live_API_key>
```

The public contract ignores `Accept-Language`: routes, field names, enums,
catalog codes and standard messages are always English. User document content
keeps its original language.

## Routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/v1/session` | Authenticated identity and active context |
| `GET` | `/v1/documents` | Paginated corpus documents (`status`, `limit`, `page`) |
| `GET` | `/v1/documents/{document_code}` | Document detail |
| `GET` | `/v1/documents/{document_code}/edges` | Document graph edges (`neighbor_limit`) |
| `POST` | `/v1/documents/search` | Hybrid semantic search |
| `GET` | `/v1/spaces` | List workspaces |
| `GET` | `/v1/spaces/{space_id}` | Workspace and its documents |
| `POST` | `/v1/spaces/{space_id}/refresh` | Re-materialize a workspace |
| `POST` | `/v1/spaces/{space_id}/promote` | Promote an AREA to a SPACE |
| `POST` | `/v1/spaces/compose` | Set operation over two workspaces |
| `POST` | `/v1/spaces/{space_id}/read` | Read a workspace (`count`, `manifest`, `chunks`, `text`) |
| `GET` | `/v1/queue` | Processing queue (`process`, `status`, `limit`) |
| `GET` | `/v1/runs` | Skill run history |
| `GET` | `/v1/catalog` | RBAC-filtered functions and skills (`type`) |
| `GET` | `/v1/skills` | Skill catalog |
| `GET` | `/v1/skills/{skill_code}` | Skill detail |
| `POST` | `/v1/skills/{skill_code}/run` | Queue a skill (`space_id` or `document_code`) |
| `POST` | `/v1/ask` | Complete RAG answer |
| `GET` | `/v1/agent/context` | Layered prompt, identity, tools and limits |
| `POST` | `/v1/agent/tools/{public_name}` | Run one authorized agent tool |

## Search example

```bash
curl https://api.ragfly.ai/v1/documents/search \
  -H 'Authorization: Bearer slm_live_xxxxxxxxxx' \
  -H 'Content-Type: application/json' \
  -d '{"query":"active maintenance contracts","limit":5,"min_similarity":0.35}'
```

Response fields are English:

```json
{
  "documents": [{
    "code": "DOC-2024-001",
    "name": "Maintenance contract",
    "chunks": [{"text": "...", "similarity": 0.91, "rerank_score": 0.88, "page": 4, "extra": {}}]
  }],
  "total_documents": 1,
  "total_chunks": 1,
  "duration_ms": 42
}
```

## Ask example

```bash
curl https://api.ragfly.ai/v1/ask \
  -H 'Authorization: Bearer slm_live_xxxxxxxxxx' \
  -H 'Content-Type: application/json' \
  -d '{"question":"What is the renewal date?","function_code":"CHAT-USER"}'
```

```json
{"answer":"The renewal date is 30 June.","conversation_id":512,"message_id":513}
```

`stream=true` in SDKs is a compatibility iterator over this complete response;
the public HTTP endpoint is JSON, not the internal Spanish SSE route.

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

Known codes include `INVALID_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`,
`NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`, `RATE_LIMITED` and `INTERNAL_ERROR`.
A catalog value without an English public mapping fails closed with
`PUBLIC_CODE_MAPPING_MISSING`; it is never emitted as an internal Spanish code.

## File locations (`fs`)

Document responses may include an English `fs` block:

```json
{"path":"/MyDocuments/contract.pdf","origin":"WEB","is_absolute":false,"is_public_url":false,"relative_folder":"MyDocuments","file_name":"contract.pdf","how_to_open":"Open $RAGFLY_ROOT + path."}
```

`DESKTOP` paths are absolute and open directly. `WEB` paths are relative and
resolve as `$RAGFLY_ROOT + path`; `PUBLIC` paths are URLs and open directly.
RAGfly never reads or stores `RAGFLY_ROOT`.

## Internal REST

Routes such as `/documentos`, `/espacios-trabajo` and `/interfaz` are internal
implementation routes for Web/Desktop. Do not build external integrations on
them; use `/v1`.
