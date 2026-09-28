# RAGfly — Integration Quickstart

Full walkthrough from scratch: sign up → API key → `/v1` session → what the key
can do → MCP → first semantic query.

> **MCP OAuth is the recommended setup for supported clients.** Step 5 shows the Codex desktop UI and CLI; a bearer API key remains available for clients without MCP OAuth and for direct REST/API use.

> **Two credentials.** Your *web session* (a JWT from `POST /auth/login`) belongs
> to a person, and here it is used only to mint the API key: `POST /auth/api-key`
> requires a signed-in person and answers `403` to an API key. The *API key* is
> what your agent uses. It operates **only the public API `/v1`** (MCP, the SDKs
> and the CLI go through it) with its owner's RBAC: the key's role, filtered by
> the owner's access level, decides which actions it can run, and the owner's
> group, entity and area decide which data it sees. Any route outside `/v1`
> answers `403` to a key.

---

## Prerequisites

- Python 3.11+ and `pip install httpx` (this walkthrough uses curl + Python), **or** Node 18+ for the TypeScript path
- RAGfly account (see step 1)

> Prefer an official SDK? `pip install ragfly` ([SDK.md](SDK.md)) or `npm i @ragfly/sdk` ([SDK-TS.md](SDK-TS.md)) — both wrap `/v1` into `client.ask()` / `client.search()`.

---

## Step 1 — Sign up

```bash
curl -X POST https://api.ragfly.ai/auth/registro \
  -H "Content-Type: application/json" -H "Accept-Language: en" \
  -d '{"email": "you@company.com", "nombre": "Your Name", "empresa": "Your Company"}'
```

Expected response (the same whether or not the email already had an account):
```json
{
  "mensaje": "We received your sign-up. If the email had no account, we sent you an invitation to confirm it; if you already have an account, sign in or reset your password.",
  "ya_confirmado": false,
  "email": "you@company.com"
}
```

Confirm the link received by email. Then continue with step 2.

---

## Step 2 — Sign in and mint the API key

```bash
# 2a. Sign in (a person's web session, expires in 1 h)
source .env   # loads RAGFLY_API_URL, RAGFLY_EMAIL, RAGFLY_PASSWORD

JWT=$(curl -s -X POST $RAGFLY_API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$RAGFLY_EMAIL\", \"password\": \"$RAGFLY_PASSWORD\"}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

echo "JWT obtained"

# 2b. Mint the API key with that session (persists until revoked)
curl -X POST $RAGFLY_API_URL/auth/api-key \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "quickstart-eval", "rol_solicitado": "DOCS-USUARIO-FINAL"}'
```

`/auth/*` is the web app's sign-in surface, so its field names are Spanish. The
response:
```json
{
  "api_key": "rf_...",
  "prefijo": "rf_1a2b3c4d5e6f7",
  "nombre": "quickstart-eval",
  "codigo_usuario": "you@company.com",
  "codigo_rol": "DOCS-USUARIO-FINAL",
  "codigo_area": null,
  "codigo_grupo": "<your group>",
  "codigo_estacion": null,
  "creada_en": "2026-09-18T12:00:00"
}
```

Save `api_key` in `.env` as `RAGFLY_API_KEY`. **Shown only once.** Keep
`prefijo`: it is what you revoke the key by. `rol_solicitado` must be a role you
already hold. A key never gets more than its owner has.

```bash
echo 'RAGFLY_API_KEY=rf_...' >> .env
source .env
```

You can also mint and revoke keys from the web app:
[`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys).

---

## Step 3 — Verify the session and discover what the key can do

### 3a. Session

```bash
curl $RAGFLY_API_URL/v1/session \
  -H "Authorization: Bearer $RAGFLY_API_KEY"
```

Expected result:
```json
{
  "authenticated": true,
  "user": {"code": "you@company.com", "name": "Your Name"},
  "active_group": "<your group>",
  "active_entity": "<your entity>",
  "profile": "USER",
  "roles": ["DOCS-USUARIO-FINAL"],
  "locale": "en"
}
```

If `active_group` has a value, the API key works. `roles` is the role the key
carries.

### 3b. What can this key do?

```bash
curl $RAGFLY_API_URL/v1/operations \
  -H "Authorization: Bearer $RAGFLY_API_KEY"
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

The list is already filtered by the key's RBAC: an operation that is not listed
does not exist for this key. `kind` is `read`, `write` or `write_confirm`. Read
one operation's input and output schema with `GET /v1/operations/{code}`, and run
it with `POST /v1/operations/{code}:execute`. A `write_confirm` operation does
nothing until you repeat the call with `"confirm": true`. Details:
[REST.md § Discover what a key can do](REST.md#discover-what-a-key-can-do--v1operations).

---

## Step 4 — Tell RAGfly who you are

Before the first load. Four texts —a `description` and a `system_prompt`, at group and at entity
level— are what situate RAGfly inside your organization. The system prompt is injected into **every
skill with organization scope**, which is the whole ingestion pipeline and not only chat: a tenant
that leaves them empty ingests and answers worse than one that filled them in.

This step needs a key whose role can manage the organization profile, normally a
group administrator's. A `DOCS-USUARIO-FINAL` key gets `403` on
`GET /v1/organization` and on the draft: ask your administrator, or go on to
step 5.

```bash
# What is still missing?
curl $RAGFLY_API_URL/v1/organization \
  -H "Authorization: Bearer $RAGFLY_API_KEY"
# → { "group": {...}, "entity": {...}, "missing": ["group.description", ...] }
```

Your agent can do this for you. Give it the text of your own "about us" page —RAGfly does not fetch
URLs, you bring the text— and let it propose:

```bash
curl -X POST $RAGFLY_API_URL/v1/organization/draft \
  -H "Authorization: Bearer $RAGFLY_API_KEY" -H "Content-Type: application/json" \
  -d '{"source_text":"We are a structural engineering consultancy..."}'
```

Review it and write it. `description` is prose for humans; `system_prompt` is the instruction the
model follows when answering about your documents — tone, vocabulary, units, what not to invent.

```bash
curl -X PUT $RAGFLY_API_URL/v1/organization \
  -H "Authorization: Bearer $RAGFLY_API_KEY" -H "Content-Type: application/json" \
  -d '{"group_description":"...","group_system_prompt":"..."}'
```

Re-read `/v1/organization`: `missing` should now be empty.

---

## Step 5 — Configure MCP

RAGfly exposes its remote Streamable HTTP MCP server at
`https://api.ragfly.ai/mcp-http`. OAuth-capable clients sign in to RAGfly and
authorize a least-privilege credential in the browser; you do not paste a key
into the MCP client. Clients without MCP OAuth can still connect with a bearer
API key. Both routes use the same MCP tools, `/v1` contract and RBAC.

### Codex desktop app — no terminal needed

1. Open **Settings → Complementos → MCP → Agregar → Conectar con un MCP personalizado**.
2. Enter a name such as `RAGfly`, choose **HTTP secuenciable** (Streamable HTTP),
   and enter `https://api.ragfly.ai/mcp-http`.
3. Continue, sign in to RAGfly in the browser, and authorize the role and area
   shown on the consent screen.

The client stores the credential for this connection. Review or revoke it from
[`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys); its origin appears as
`OAUTH`.

### Codex CLI

The CLI configures the remote endpoint and starts OAuth in the browser:

```bash
codex mcp add ragfly --url https://api.ragfly.ai/mcp-http
codex mcp login ragfly
codex mcp list
```

### Manual bearer API key

Use this option when the client does not support MCP OAuth or when an
automation must read the credential from its own secret store. Create a
least-privilege key at [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys),
then use the client-specific bearer-header setup in [MCP.md](MCP.md).

### Codex

```bash
codex mcp add ragfly \
  --url https://api.ragfly.ai/mcp-http \
  --bearer-token-env-var RAGFLY_API_KEY
```

Verify:

```bash
codex mcp list
# ragfly   https://api.ragfly.ai/mcp-http
```

Then ask Codex to call `session` to confirm the connection, and `list_operations`
to see what the key can do.

### Claude Code / Cursor / Cline

Add to `~/.mcp.json` or `.mcp.json` in the project:

```json
{
  "mcpServers": {
    "ragfly": {
      "url": "https://api.ragfly.ai/mcp/sse",
      "headers": {
        "Authorization": "Bearer <RAGFLY_API_KEY>"
      }
    }
  }
}
```

Restart the client. Verify:

```
mcp__ragfly__session()
```

Expected result: the same JSON as `GET /v1/session`.

---

## Step 6 — First semantic query

### From the terminal

```bash
curl -X POST $RAGFLY_API_URL/v1/documents/search \
  -H "Authorization: Bearer $RAGFLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "active contracts in the organization", "limit": 5}'
```

Expected result: `documents`, at most `limit` of them. Each document carries
`code`, `name`, `summary`, `location`, `url`, `fs`, the scores `rrf_score`,
`max_similarity` and `rerank_score`, and its most relevant `chunks`; each chunk
carries `text`, `page` and `extra` (`chunk_number`, `similarity`). The full shape
is in [REST.md § Search example](REST.md#search-example).

If `documents` is empty, there are probably no documents in `VECTORIZED` status
yet (see step 7).

### From Python

```python
import os, httpx

BASE    = os.environ["RAGFLY_API_URL"]
HEADERS = {"Authorization": f"Bearer {os.environ['RAGFLY_API_KEY']}"}

# Verify session
me = httpx.get(f"{BASE}/v1/session", headers=HEADERS)
me.raise_for_status()
print("Group:", me.json()["active_group"])

# First search
r = httpx.post(
    f"{BASE}/v1/documents/search",
    headers=HEADERS,
    json={"query": "active contracts in the organization", "limit": 5},
    timeout=60,
)
r.raise_for_status()
for doc in r.json()["documents"]:
    print(f"  [{doc['code']}] {doc['name']}  max_similarity={doc['max_similarity']}")
    for chunk in doc["chunks"][:1]:
        print(f"      page {chunk['page'] or '-'}: {chunk['text'][:100]}")
```

---

## Step 7 — List available documents

```bash
# Documents with embeddings (ready for search)
curl "$RAGFLY_API_URL/v1/documents?status=VECTORIZED&limit=20" \
  -H "Authorization: Bearer $RAGFLY_API_KEY"
```

If the corpus is empty, upload documents from `app.ragfly.ai` and wait for the
pipeline to process them (final status: `VECTORIZED`). Statuses along the way:
`LOADED` → `METADATA` → `SCANNED` → `CHUNKED` → `VECTORIZED`, plus
`NOT_SCANNABLE` and `REVIEW`.

Check progress with the processing queue:

```bash
curl "$RAGFLY_API_URL/v1/queue?limit=10" \
  -H "Authorization: Bearer $RAGFLY_API_KEY"
```

The queue needs access to the processing pipeline. A `DOCS-USUARIO-FINAL` key
of a standard user gets `403`; follow progress instead with
`GET /v1/documents?status=SCANNED` (or any other status) and read `total`.

---

## Step 8 — Open a document on disk (optional)

If your agent runs on the same machine where the documents live and needs to open
the actual file (not just search it), every document from `GET /v1/documents`,
`GET /v1/documents/{document_code}` and `POST /v1/documents/search` (and the
`list_documents` / `get_document` MCP tools) carries an `fs` block:

```json
"fs": {
  "path": "/MyDocs/contracts/2024.pdf",
  "origin": "WEB",
  "is_absolute": false,
  "is_public_url": false,
  "is_cloud_only": false,
  "file_name": "2024.pdf",
  "how_to_open": "Web-upload relative path: open $RAGFLY_ROOT + `path`."
}
```

- `is_cloud_only: true` (Google Drive or Dropbox) → never open `path`; the original
  stays with the provider. Read `how_to_open`.
- `is_absolute: true` (loaded via RAGfly Desktop) → open `path` directly.
- `origin: "WEB"` (web upload) → set `RAGFLY_ROOT` to the **parent folder**
  of the folder you selected when uploading, then open `$RAGFLY_ROOT + path`.
  Example: you uploaded `/Users/ana/Dropbox/MyDocs` →
  `RAGFLY_ROOT=/Users/ana/Dropbox`, so `/MyDocs/contracts/2024.pdf` resolves to
  `/Users/ana/Dropbox/MyDocs/contracts/2024.pdf`.

RAGfly never reads `RAGFLY_ROOT` nor stores your absolute disk root — configure
it once per machine (shell profile, agent context file, or MCP client config).
Step-by-step walkthrough:
[MCP.md § Setting up `RAGFLY_ROOT`](MCP.md#setting-up-ragfly_root--once-per-machine-in-3-steps).

---

## Full test script

```python
#!/usr/bin/env python3
"""Test RAGfly /v1 — requires RAGFLY_API_URL and RAGFLY_API_KEY in the environment."""

import os, sys, httpx

BASE    = os.environ.get("RAGFLY_API_URL", "https://api.ragfly.ai")
API_KEY = os.environ.get("RAGFLY_API_KEY", "")
HEADERS = {"Authorization": f"Bearer {API_KEY}"}

if not API_KEY:
    print("ERROR: define RAGFLY_API_KEY in .env")
    sys.exit(1)

_results: list[tuple[str, bool, str]] = []

def ok(label: str, condition: bool, detail: str = "") -> bool:
    estado = "✓" if condition else "✗"
    print(f"  {estado} {label}" + (f" — {detail}" if detail else ""))
    _results.append((label, condition, detail))
    return condition


# ── 1. Session ────────────────────────────────────────────────────────────────
print("1. Verify session")
r = httpx.get(f"{BASE}/v1/session", headers=HEADERS, timeout=60)
ok("HTTP 200", r.status_code == 200, str(r.status_code))
if r.status_code == 200:
    ctx = r.json()
    ok("active_group present", bool(ctx.get("active_group")), ctx.get("active_group") or "")
    ok("roles present", bool(ctx.get("roles")), ", ".join(ctx.get("roles") or []))

# ── 2. What the key can do ────────────────────────────────────────────────────
print("\n2. Operations available to this key")
r = httpx.get(f"{BASE}/v1/operations", headers=HEADERS, timeout=60)
ok("HTTP 200", r.status_code == 200, str(r.status_code))
if r.status_code == 200:
    ok("operations listed", "operations" in r.json(), f"{r.json().get('total')} operations")

# ── 3. List documents ─────────────────────────────────────────────────────────
print("\n3. Vectorized documents")
r = httpx.get(
    f"{BASE}/v1/documents",
    headers=HEADERS,
    params={"status": "VECTORIZED", "limit": 5},
    timeout=60,
)
ok("HTTP 200", r.status_code == 200, str(r.status_code))
if r.status_code == 200:
    page = r.json()
    ok("Paginated response", "total" in page, f"total={page.get('total')}")
    ok("At least 1 document", len(page.get("documents", [])) > 0, f"{len(page.get('documents', []))} docs")
    for doc in page.get("documents", [])[:3]:
        print(f"     [{doc.get('code')}] {doc.get('name')}")

# ── 4. Semantic search ────────────────────────────────────────────────────────
print("\n4. Semantic search")
QUERIES = [
    "contracts in the organization",
    "financial reports",
    "human resources documents",
]
for q in QUERIES:
    r = httpx.post(
        f"{BASE}/v1/documents/search",
        headers=HEADERS,
        json={"query": q, "limit": 3},
        timeout=60,
    )
    documents = r.json().get("documents", []) if r.status_code == 200 else []
    ok(f"'{q[:40]}'", r.status_code == 200 and len(documents) <= 3, f"{len(documents)} documents")

# ── 5. Empty query must return 400 ───────────────────────────────────────────
print("\n5. Input validation")
r = httpx.post(
    f"{BASE}/v1/documents/search",
    headers=HEADERS,
    json={"query": "", "limit": 3},
    timeout=60,
)
ok("Empty query → 400", r.status_code == 400, str(r.status_code))

# ── 6. Invalid key must return 401 ───────────────────────────────────────────
print("\n6. Security — invalid key")
r = httpx.get(f"{BASE}/v1/session", headers={"Authorization": "Bearer rf_INVALID"}, timeout=60)
ok("Invalid key → 401", r.status_code == 401, str(r.status_code))

# ── Final result ──────────────────────────────────────────────────────────────
failures = [l for l in _results if not l[1]]
print(f"\n── Tests completed: {len(_results) - len(failures)}/{len(_results)} OK ──")
if failures:
    print("Failed:")
    for label, _, detail in failures:
        print(f"  ✗ {label}" + (f" — {detail}" if detail else ""))
    sys.exit(1)
```

**Expected result:** all lines with `✓`. If any shows `✗`, see the troubleshooting section.

---

## Reproducible tests — expected results

These tests are independent of the corpus (work with any document set):

| Test | Input | Expected result |
|---|---|---|
| Valid session | `GET /v1/session` with a valid API key | HTTP 200, `active_group` present |
| Invalid key | `GET /v1/session` with a wrong key | HTTP 401, `code: UNAUTHORIZED` |
| Capabilities | `GET /v1/operations` | HTTP 200, `{operations: [...], total}` |
| Paginated list | `GET /v1/documents` | HTTP 200, object with `documents`, `total`, `page`, `limit` |
| Search with query | `POST /v1/documents/search` with non-empty `query` | HTTP 200, `documents` (may be empty if no docs) |
| Empty search | `POST /v1/documents/search` with `query: ""` | HTTP 400, `code: INVALID_REQUEST` |
| `limit` parameter | `POST /v1/documents/search` with `limit: 3` | At most 3 documents |

---

## Secure secrets handling

```bash
# .gitignore — always add
echo ".env" >> .gitignore

# Verify .env is not tracked
git check-ignore -v .env
```

In CI/CD: use the provider's environment variables (GitHub Secrets, GitLab CI Variables, etc.)  
**Never** include `RAGFLY_API_KEY` in source code, logs, or issues.

To revoke a compromised key, use a person's session (`$JWT` from step 2a) — an
API key cannot revoke keys:

```bash
curl -X DELETE $RAGFLY_API_URL/auth/api-key/<prefijo> \
  -H "Authorization: Bearer $JWT"
```

---

## Differences between clients

| Aspect | Codex | Claude Code / Cursor |
|---|---|---|
| Setup | OAuth from the desktop UI or `codex mcp add` + `codex mcp login` | OAuth where supported; otherwise client-specific MCP config |
| Calls | MCP tools (`mcp__ragfly__*`) | MCP tools (`mcp__ragfly__*`) |
| Authentication | Browser OAuth or `--bearer-token-env-var RAGFLY_API_KEY` | Browser OAuth or bearer header |
| Discovery | MCP protocol automatic | MCP protocol automatic |

---

## Troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `401` `UNAUTHORIZED` | Invalid or revoked API key | Mint a new one at `app.ragfly.ai/api-keys` or with `POST /auth/api-key` (a person's session) |
| `403` "An API key can only operate through the public /v1 API" | The call went to a route outside `/v1`, for example an old `/auth/me` or `/documentos/...` snippet | Use the `/v1` equivalent: `GET /v1/session`, `GET /v1/documents`, `POST /v1/documents/search` |
| `403` `FORBIDDEN` on a `/v1` route | The key's role does not reach that action or that data | Check `GET /v1/operations`; ask your administrator for a role that includes it |
| `403` on `POST /auth/api-key` | Called with an API key | Mint keys with a person's session (JWT) or from the web app |
| `400` `INVALID_REQUEST` on search | Empty `query` | Send a non-empty `query` |
| Empty `documents` on search | No vectorized documents visible to the key | Upload docs from `app.ragfly.ai` and wait for the pipeline |
| `RAGFLY_API_KEY` not defined | `.env` not loaded | `source .env` |
| `422` `VALIDATION_ERROR` | Malformed body — for example `q` instead of `query`, or `limit` outside 1–100 | Send `{"query": "...", "limit": 5}` |
