# RAGfly Python SDK

The official Python SDK (`ragfly` 0.3.0) consumes `/v1` exclusively. Its public
methods, parameters, models, routes and error messages are English. The
internal Spanish REST is not exposed by this package.

```bash
pip install ragfly
```

## Quick start

```python
from ragfly import RAGfly

with RAGfly(api_key="slm_live_...") as client:
    answer = client.ask("What is the renewal date?")
    print(answer.answer)

    result = client.search("active maintenance contracts", limit=5)
    for document in result.documents:
        print(document.code, document.name, document.max_similarity)
```

## Public methods

| Method | Public parameters / result |
|---|---|
| `ask(question, conversation_id=None, function_code="CHAT-USER", stream=False)` | `AskResponse(answer, conversation_id, message_id)`; `stream=True` yields one `AskChunk` from the complete `/v1/ask` response |
| `search(query, limit=10, min_similarity=0.0, entity_code=None, space_id=None)` | `SearchResult` with `documents`, `total_documents`, `total_chunks`, `duration_ms` |
| `agent_context(function_profile="user_chat")` | `AgentContext` with `system_prompt`, hashes, identity, tools and limits |
| `run_agent_tool(public_name, arguments, function_profile="user_chat")` | English JSON result from `/v1/agent/tools/{public_name}` |
| `list_documents(page=1, page_size=20, status=None)` | English JSON page from `/v1/documents` |

`estado` is retained only as an input compatibility alias for `status`.
Profiles are `user_chat` and `support_chat`; old Spanish profile names are not
part of the SDK contract.

## Models

```python
Chunk(text, similarity, rerank_score, page, extra)
Document(code, name, summary, url, rrf_score, max_similarity, chunks)
SearchResult(query, total_documents, total_chunks, duration_ms, documents)
AskResponse(answer, conversation_id, message_id)
```

All response dictionaries and dataclass fields use English concepts. User
document text and names retain their source language.

## Errors

Non-2xx responses raise `RAGflyError`. The SDK reads the public envelope:
`code`, `message`, `details`, `request_id`; `message` is always English.

## Authentication

```python
import os
client = RAGfly(api_key=os.environ["RAGFLY_API_KEY"])
```

API keys are created in the web app or with `POST /auth/api-key`. See
[REST.md](REST.md) for the HTTP contract and [MCP.md](MCP.md) for the `fs`
file-location rule.
