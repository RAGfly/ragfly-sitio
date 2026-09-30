# RAGfly Python SDK

`ragfly` 0.3.0 is the official Python SDK of RAGfly (RAG service). It speaks only
the English REST `/v1` contract: each method calls one `/v1` route, and three
generic methods run any operation of the RAGfly app that your key can run.
Methods, parameters, response fields, public catalog codes, enum values,
published schemas/defaults, validation details, and API-authored error messages
use English. Catalog identifiers use their stored English aliases; unmapped
internal identifiers are never returned. Document content and other
tenant-authored text keep their original language.

Source: [github.com/RAGfly/ragfly-python](https://github.com/RAGfly/ragfly-python).

## Install

```bash
pip install ragfly
```

Python 3.10 or later. The only dependency is `httpx` (0.27 or later).

The package exports `RAGfly`, `RAGflyError`, `SearchResult`, `AskResponse`,
`Document`, `Chunk`, `AgentContext` and `AgentLayer`. `ragfly.__version__` is
`"0.3.0"`.

## Quick start

```python
from ragfly import RAGfly

with RAGfly(api_key="rf_...") as client:
    # Retrieve and generate
    reply = client.ask("What is the renewal date?")
    print(reply.answer)

    # Retrieval only
    result = client.search("active maintenance contracts", limit=5)
    for document in result.documents:
        print(document.code, document.name, document.max_similarity)
        for chunk in document.chunks:
            print("  p.", chunk.page, chunk.extra.get("similarity"), chunk.text[:80])
```

### Client options

```python
RAGfly(api_key, base_url="https://api.ragfly.ai", timeout=60.0, *, transport=None)
```

| Parameter | Default | Meaning |
|---|---|---|
| `api_key` | required | RAGfly API key (`rf_...`) |
| `base_url` | `"https://api.ragfly.ai"` | API root. A trailing `/` is dropped |
| `timeout` | `60.0` | Seconds for read, write and pool waits. The connect timeout is fixed at 10 s |
| `transport` | `None` | Optional `httpx.BaseTransport`, for example `httpx.MockTransport` in tests |

Every request carries `Authorization: Bearer <api_key>` and
`X-RAGfly-Client: sdk-python`. The client keeps one `httpx.Client` open: use it
in a `with` block or call `close()`.

`ask()` returns only when the whole answer is ready. If your answers take longer
than `timeout`, raise it.

## Public methods

Each method calls exactly one `/v1` route. Parameters after `*` are
keyword-only, and parameters left as `None` are not sent. `search`, `ask` and
`agent_context` return the [models](#models) below. Every other method returns
the `/v1` JSON as it arrives, with English snake_case keys. The server checks the
bounds noted under each table and answers `422 VALIDATION_ERROR` outside them.

### Session and documents

| Method | Route | Returns |
|---|---|---|
| `session()` | `GET /v1/session` | `dict`: `authenticated`, `user` (`code`, `name`), `active_group`, `active_entity`, `profile`, `locale`; role identifiers are not exposed |
| `set_active_entity(entity_code)` | `POST /v1/session/active-entity` | Set an authorized entity; pass `None` to release the focus |
| `list_documents(*, status=None, limit=20, page=1)` | `GET /v1/documents` | `dict`: `documents` (each with its `fs` block), `total`, `page`, `limit` |
| `get_document(document_code)` | `GET /v1/documents/{document_code}` | `dict`: the document, with its `fs` block |
| `document_edges(document_code, *, neighbor_limit=50)` | `GET /v1/documents/{document_code}/edges` | `dict`: `document`, `type_path`, `location_path`, `features`, `neighbors_two_hops` |

`status` takes an English document status such as `VECTORIZED` (the list is in
[MCP.md](MCP.md#document-status-values)). Bounds: `limit` 1–100, `page` 1 or
more, `neighbor_limit` 1–500.

Entity focus is stored with the API key on the server. A flexible key keeps its
selected entity when you create another `RAGfly` client with the same key; pass
`None` to `set_active_entity()` to release that focus. A fixed-entity key cannot
change or release its entity. Only an authenticated human session can issue API
keys; the SDK uses its key for `/v1` calls and does not mint keys.

### Search

| Method | Route | Returns |
|---|---|---|
| `search(query, *, limit=10, min_similarity=0.0, entity_code=None)` | `POST /v1/documents/search` | [`SearchResult`](#models) |

- Hybrid search: vector and keyword results fused by rank into `rrf_score`. It
  is simple retrieval without reranking, so `rerank_score` comes back `None`.
- `query` cannot be empty (`400 INVALID_REQUEST`). `limit` (1–100) is the
  maximum number of documents. `min_similarity` goes from 0 to 1.
  `entity_code` searches one of your own entities.
- With `min_similarity` above 0, a document comes back only if its best chunk
  reaches that similarity. Keyword-only matches carry no similarity, so they are
  dropped.
- A chunk's similarity is `chunk.extra["similarity"]`; `extra` also carries
  `chunk_number`. Per document, `max_similarity` is its best chunk similarity,
  `None` when no chunk has one.
- `url` opens the document in the RAGfly web app, where the user needs a
  session. For a public web source it is the source's own URL.
- `location` and `fs` say where the original file lives. See
  [REST.md § File locations](REST.md#file-locations-fs).

### Workspaces

| Method | Route | Returns |
|---|---|---|
| `list_spaces(*, limit=20)` | `GET /v1/spaces` | `dict`: `spaces`, `total` |
| `get_space(space_id, *, document_limit=20)` | `GET /v1/spaces/{space_id}` | `dict`: `space`, `documents`, `total_documents` |
| `refresh_space(space_id)` | `POST /v1/spaces/{space_id}/refresh` | `dict`: the space |
| `promote_space(space_id)` | `POST /v1/spaces/{space_id}/promote` | `dict`: the space |
| `compose_spaces(operation, space_id_a, space_id_b, *, name="", space_type="AREA")` | `POST /v1/spaces/compose` | `dict`: the new space |
| `read_space(space_id, *, resolution="manifest", query="", limit=50)` | `POST /v1/spaces/{space_id}/read` | `dict`: `resolution`, `total`, `items` |

`refresh_space` re-materializes a workspace and `promote_space` turns an `AREA`
into a `SPACE`. In `compose_spaces`, `operation` is `union`, `intersection`,
`difference` or `symmetric_difference`, and `space_type` is `AREA` or `SPACE`.
In `read_space`, `resolution` is `count`, `manifest`, `chunks` or `text`, and
`chunks` needs a `query`. Other values answer `400 INVALID_REQUEST`. Bounds:
`limit` 1–200 in `list_spaces`, `document_limit` 1–200, `limit` 1–500 in
`read_space`.

### Queue and runs

| Method | Route | Returns |
|---|---|---|
| `queue(*, process=None, status=None, limit=20)` | `GET /v1/queue` | `dict`: `items`, `total` |
| `list_runs(*, limit=10)` | `GET /v1/runs` | `dict`: `runs` |

`process` is a process type code. `status` is `PENDING`, `IN_PROGRESS`,
`COMPLETED`, `ERROR` or `WAITING`. Bounds: `limit` 1–200 in `queue` and 1–100 in
`list_runs`.

### Catalog and skills

| Method | Route | Returns |
|---|---|---|
| `catalog(*, type="ALL")` | `GET /v1/catalog` | `dict`: `functions`, `skills`, `total_functions`, `total_skills` |
| `get_function(function_code)` | `GET /v1/functions/{function_code}` | `dict`: `code`, `name`, `alias`, `description`, `summary`, `url`, `documentation`, `behaviors`, `operations` |
| `list_skills()` | `GET /v1/skills` | `dict`: `skills` |
| `get_skill(skill_code)` | `GET /v1/skills/{skill_code}` | `dict`: the skill |
| `run_skill(skill_code, *, space_id=None, document_code=None)` | `POST /v1/skills/{skill_code}/run` | `dict`: the queued run |

`type` is `ALL`, `FUNCTIONS` or `SKILLS`; any other value is read as `ALL`.
`list_skills()` returns the same list as `catalog()["skills"]`. `get_skill()`
includes the prompt and the model only when the key's role administers skills.
`run_skill()` needs `space_id` or `document_code` (`400 INVALID_REQUEST` when
neither is given).

### Ask and agent

| Method | Route | Returns |
|---|---|---|
| `ask(question, *, conversation_id=None, function_code="CHAT-USER")` | `POST /v1/ask` | [`AskResponse`](#models) |
| `agent_context(*, function_profile="user_chat")` | `GET /v1/agent/context` | [`AgentContext`](#models) |
| `run_agent_tool(public_name, arguments, *, function_profile="user_chat")` | `POST /v1/agent/tools/{public_name}` | The tool's JSON result |

- `ask()` retrieves, generates and returns the complete answer. There is no
  streaming. To continue a conversation, pass the `conversation_id` you got
  back. `function_code` is the interface function, which sets the
  conversation's LLM model; it is used when the call opens a new conversation.
- `function_profile` is `user_chat` or `support_chat`.
- `run_agent_tool()` runs one of the tools that `agent_context()` lists.
  `arguments` must be a `dict`. Tool names are stable English public
  identifiers; catalog-backed names derive from the catalog's `*_en` aliases.
  The available tools and their argument schemas vary by identity and profile,
  so read them from `agent_context()` at run time and pass `public_name`
  unchanged ([REST.md § Agent context](REST.md#agent-context-and-agent-tools)).

### Organization

| Method | Route | Returns |
|---|---|---|
| `get_organization(*, entity_code=None)` | `GET /v1/organization` | `dict`: `group`, `entity`, `missing` |
| `update_organization(*, group_description=None, group_system_prompt=None, entity_description=None, entity_system_prompt=None, entity_code=None)` | `PUT /v1/organization` | `dict`: `group`, `entity`, `missing`, `applied` |
| `draft_organization(*, source_text="", entity_code=None)` | `POST /v1/organization/draft` | `dict`: `generated`, `group`, `entity`, `notice` |

`update_organization()` writes only the fields you pass. `draft_organization()`
proposes the texts from your `source_text` and saves nothing. Why these texts
matter: [REST.md § Set up your organization first](REST.md#set-up-your-organization-first).

### Usage, conversations and processes

| Method | Route | Returns |
|---|---|---|
| `get_usage()` | `GET /v1/usage` | `dict`: the plan (`plan_code`, `period_start`, `period_end`, …) and `quotas` |
| `list_conversations(*, function_code=None, limit=50)` | `GET /v1/conversations` | `dict`: `conversations`, `total` |
| `delete_conversation(conversation_id)` | `DELETE /v1/conversations/{conversation_id}` | `dict`: `deleted`, `conversation_id` |
| `list_processes(*, status=None, process_type=None, category=None, mine=None, only_open=None, limit=20, page=1)` | `GET /v1/processes` | `dict`: `processes`, `total`, `page`, `limit` |
| `get_process(process_code)` | `GET /v1/processes/{process_code}` | `dict`: the process |
| `update_process(process_code, *, status=None, priority=None, name=None, description=None, comments=None, assigned_to=None, due_at=None, finished_at=None, cost=None)` | `PATCH /v1/processes/{process_code}` | `dict`: the updated process |

`mine=True` keeps the processes created by or assigned to the caller.
`update_process()` writes only the fields you pass; with none, the API answers
`400 INVALID_REQUEST`. Bounds: `limit` 1–200 in both lists, `page` 1 or more.

### Operations executor

| Method | Route | Returns |
|---|---|---|
| `list_operations()` | `GET /v1/operations` | `dict`: `operations` (each with `code`, `kind`, `confirm_required`, `functions`), `total` |
| `get_operation(code)` | `GET /v1/operations/{code}` | `dict`: the same fields plus `input_schema` and `output_schema` |
| `run_operation(code, input=None, *, confirm=False)` | `POST /v1/operations/{code}:execute` | `dict`: `code`, `kind`, `executed`, `result` |

These three run the operations behind the screens of the RAGfly app, with the
same permissions and audit as the web app. Use them for anything that has no
named route above. `kind` is `read`,
`write` or `write_confirm`. A `write_confirm` operation runs only with
`confirm=True`. Without it nothing runs, and the answer carries
`"executed": False`, `"confirm_required": True` and a `"preview"` of the input.

```python
ops = client.list_operations()["operations"]            # what this key can run
detail = client.get_operation("document_types.update")  # input_schema / output_schema

client.run_operation("document_types.update", {"code": "TDOC_...", "name": "Invoices"})

preview = client.run_operation("document_types.delete", {"code": "TDOC_..."})
assert preview["executed"] is False                     # nothing ran
client.run_operation("document_types.delete", {"code": "TDOC_..."}, confirm=True)
```

Input fields, validation details and catalog values inside `input` and `result`:
[REST.md § Discover what a key can do](REST.md#discover-what-a-key-can-do--v1operations).

### Lifecycle

| Method | Effect |
|---|---|
| `close()` | Closes the HTTP client |
| `with RAGfly(...) as client:` | Returns the client, and calls `close()` on exit |

## Models

All models are dataclasses exported by `ragfly`:

```python
@dataclass
class Chunk:
    text: str
    page: Optional[int] = None
    extra: dict = field(default_factory=dict)

@dataclass
class Document:
    code: Optional[str]
    name: Optional[str]
    summary: Optional[str] = None
    location: Optional[str] = None
    url: Optional[str] = None
    rrf_score: Optional[float] = None
    max_similarity: Optional[float] = None
    rerank_score: Optional[float] = None
    fs: Optional[dict] = None
    chunks: list[Chunk] = field(default_factory=list)

@dataclass
class SearchResult:
    query: str
    total_documents: int
    total_chunks: int
    duration_ms: Optional[float]
    documents: list[Document]

@dataclass
class AskResponse:
    answer: str
    conversation_id: Optional[int]
    extra: dict = field(default_factory=dict)

@dataclass
class AgentLayer:
    code: str
    name: str
    sha256: str

@dataclass
class AgentContext:
    function_profile: str
    system_prompt: str
    system_prompt_hash: str
    layers: list[AgentLayer] = field(default_factory=list)
    identity: dict = field(default_factory=dict)
    tools: list[dict] = field(default_factory=list)
    limits: dict = field(default_factory=dict)
```

| Field | What it carries |
|---|---|
| `Chunk.page` | Page number, `None` when the source has no pages |
| `Chunk.extra` | `similarity` (this chunk's score) and `chunk_number` |
| `Document.rrf_score` | The document's hybrid rank |
| `Document.max_similarity` | Best chunk similarity, `None` when no chunk has one |
| `Document.rerank_score` | `None` in search results, because search does not rerank |
| `Document.url` | Opens the document in the RAGfly web app (session needed); for a public web source, the source URL |
| `Document.fs` | How to open the original file, in `fs["how_to_open"]` |
| `SearchResult.query` | The query you passed, set by the client |
| `AskResponse.extra` | The other fields of the `/v1/ask` response: `message_id` and `user_message_id` |
| `AgentContext.identity` | `user_alias`, `group`, `entity`, `area`, `profile`; role identifiers are not exposed |
| `AgentContext.tools` | Tool contracts as the API sends them: `operation`, `public_name`, `input_schema`, `read_only` |
| `AgentContext.limits` | `max_iterations`, `max_retrieval_calls`, `timeout_seconds` |

The SDK drops the `schema_version` field of `/v1/agent/context`.

## Errors

Any response with HTTP status 400 or higher raises `RAGflyError`:

```python
from ragfly import RAGfly, RAGflyError

try:
    client.get_document("DOES-NOT-EXIST")
except RAGflyError as err:
    print(err.status_code, err.code, str(err), err.details)
    # 404 NOT_FOUND The requested resource was not found. {}
```

| Attribute | Where it comes from |
|---|---|
| `str(err)` | The envelope's `message`. The documented `/v1` contract always supplies the fixed English envelope; if a custom endpoint or intermediary violates it, the SDK may fall back to its response text |
| `status_code` | The HTTP status |
| `code` | The envelope's public `code`, `None` when the body has none |
| `details` | The envelope's `details`, `{}` when absent |

`/v1` answers every error with the public envelope
`{"code", "message", "details", "request_id"}`. The SDK reads `code`, `message`
and `details`; it does not keep `request_id`. The server fills `request_id` by
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
- Not wrapped in `RAGflyError`: network failures and timeouts raise `httpx`
  exceptions (`httpx.TimeoutException`, `httpx.ConnectError`, …), and
  `run_agent_tool()` raises `TypeError` when `arguments` is not a `dict`.

## Authentication

```python
import os
from ragfly import RAGfly

client = RAGfly(api_key=os.environ["RAGFLY_API_KEY"])
print(client.session())  # identity and active tenant context
```

- The key travels as `Authorization: Bearer <api_key>` on every request.
- An API key only works on `/v1` routes: any other route answers `403` to it.
  Every method of this SDK calls a `/v1` route.
- A signed-in person creates and revokes API keys in the RAGfly web app (API
  Keys). An API key cannot create or revoke keys.
- The key acts with its owner's permissions: a route its role does not reach
  answers `403 FORBIDDEN`. More in [REST.md § Authentication](REST.md#authentication).

## See also

- [REST.md](REST.md): the HTTP contract behind every method.
- [SDK-TS.md](SDK-TS.md): the TypeScript SDK, with the same surface.
- [MCP.md](MCP.md): the same capabilities as MCP tools, and the `fs` rules.
