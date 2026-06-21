# RAGfly — Integration Quickstart

Full walkthrough from scratch: sign up → API Key → MCP → first semantic query.

> **Codex supports MCP** via `codex mcp add`. Step 4 covers both paths: MCP (recommended) and direct REST.

---

## Prerequisites

- Python 3.11+ and `pip install httpx` (this walkthrough uses curl + Python), **or** Node 18+ for the TypeScript path
- RAGfly account (see step 1)

> Prefer an official SDK? `pip install ragfly` ([SDK.md](SDK.md)) or `npm i @ragfly/sdk` ([SDK-TS.md](SDK-TS.md)) — both wrap the steps below into `client.ask()` / `client.search()`.

---

## Step 1 — Sign up

```bash
curl -X POST https://api.ragfly.ai/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"email": "you@company.com", "nombre": "Your Name", "empresa": "Your Company"}'
```

Expected response:
```json
{"mensaje": "Invitación enviada. Revisa tu correo para confirmar tu cuenta."}
```

Confirm the link received by email. Then continue with step 2.

---

## Step 2 — Get JWT and create API Key

```bash
# 2a. Login
source .env   # loads RAGFLY_API_URL, RAGFLY_EMAIL, RAGFLY_PASSWORD

JWT=$(curl -s -X POST $RAGFLY_API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$RAGFLY_EMAIL\", \"password\": \"$RAGFLY_PASSWORD\"}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

echo "JWT obtained"

# 2b. Create API Key (persists until revoked)
curl -X POST $RAGFLY_API_URL/auth/api-key \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "quickstart-eval", "rol_solicitado": "DOCS-USUARIO-FINAL"}'
```

Response:
```json
{
  "api_key": "slm_live_...",
  "nombre": "quickstart-eval",
  "rol": "DOCS-USUARIO-FINAL"
}
```

Save `api_key` in `.env` as `RAGFLY_API_KEY`. **Shown only once.**

```bash
echo 'RAGFLY_API_KEY=slm_live_...' >> .env
source .env
```

---

## Step 3 — Verify session

```bash
curl $RAGFLY_API_URL/auth/me \
  -H "Authorization: Bearer $RAGFLY_API_KEY"
```

Expected result:
```json
{
  "grupo_activo": "<your group>",
  "tipo_acceso": "USUARIO",
  "rol_principal": "DOCS-USUARIO-FINAL"
}
```

If you see `grupo_activo` with a value, the API Key is working correctly.

---

## Step 4 — Configure MCP

RAGfly exposes an MCP server at `https://api.ragfly.ai/mcp-http/`. All MCP clients
(Codex, Claude Code, Cursor, Cline) connect with URL + Bearer credential.

### Codex

```bash
codex mcp add ragfly \
  --url https://api.ragfly.ai/mcp-http/ \
  --bearer-token-env-var RAGFLY_API_KEY
```

Verify:

```bash
codex mcp list
# ragfly   https://api.ragfly.ai/mcp-http/
```

Then ask Codex to call `estado_sesion` to confirm the connection.

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
mcp__ragfly__estado_sesion()
```

Expected result: same JSON as `GET /auth/me`.

---

## Step 5 — First semantic query

### From the terminal

```bash
curl -X POST $RAGFLY_API_URL/documentos/buscar-semantico \
  -H "Authorization: Bearer $RAGFLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"q": "active contracts in the organization", "limit": 5}'
```

Expected result: list of document chunks with `nombre_documento`, `tipo_documento`, and `similitud_max` score.

If it returns an empty list, there are probably no documents in `VECTORIZADO` state yet (see step 6).

### From Python

```python
import os, httpx

BASE    = os.environ["RAGFLY_API_URL"]
HEADERS = {"Authorization": f"Bearer {os.environ['RAGFLY_API_KEY']}"}

# Verify session
me = httpx.get(f"{BASE}/auth/me", headers=HEADERS)
me.raise_for_status()
print("Group:", me.json()["grupo_activo"])

# First search
r = httpx.post(
    f"{BASE}/documentos/buscar-semantico",
    headers=HEADERS,
    json={"q": "active contracts in the organization", "limit": 5},
)
r.raise_for_status()
for doc in r.json().get("resultados", []):
    print(f"  [{doc.get('tipo_documento', '?')}] {doc.get('nombre_documento', '?')}")
```

---

## Step 6 — List available documents

```bash
# Documents with embeddings (ready for search)
curl "$RAGFLY_API_URL/documentos/paginado?codigo_estado_doc=VECTORIZADO&limit=20" \
  -H "Authorization: Bearer $RAGFLY_API_KEY"
```

If the corpus is empty, upload documents from `app.ragfly.ai` and wait for the pipeline
to process them (final state: `VECTORIZADO`). Check progress with:

```bash
curl "$RAGFLY_API_URL/cola-estados-docs/paginado?limit=10" \
  -H "Authorization: Bearer $RAGFLY_API_KEY"
```

---

## Full test script

```python
#!/usr/bin/env python3
"""Test RAGfly — requires RAGFLY_API_URL and RAGFLY_API_KEY in the environment."""

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
r = httpx.get(f"{BASE}/auth/me", headers=HEADERS)
ok("HTTP 200", r.status_code == 200, str(r.status_code))
if r.status_code == 200:
    ctx = r.json()
    ok("grupo_activo present", bool(ctx.get("grupo_activo")), ctx.get("grupo_activo", ""))
    ok("rol_principal present", bool(ctx.get("rol_principal")), ctx.get("rol_principal", ""))

# ── 2. List documents ─────────────────────────────────────────────────────────
print("\n2. Vectorized documents")
r = httpx.get(
    f"{BASE}/documentos/paginado",
    headers=HEADERS,
    params={"codigo_estado_doc": "VECTORIZADO", "limit": 5},
)
ok("HTTP 200", r.status_code == 200)
if r.status_code == 200:
    items = r.json().get("items", [])
    ok("Paginated response", "total" in r.json())
    ok("At least 1 document", len(items) > 0, f"{len(items)} docs")
    for doc in items[:3]:
        print(f"     [{doc.get('tipo_documento','?')}] {doc.get('nombre_documento','?')}")

# ── 3. Semantic search ────────────────────────────────────────────────────────
print("\n3. Semantic search")
QUERIES = [
    "contracts in the organization",
    "financial reports",
    "human resources documents",
]
for q in QUERIES:
    r = httpx.post(
        f"{BASE}/documentos/buscar-semantico",
        headers=HEADERS,
        json={"q": q, "limit": 3},
    )
    resultados = r.json().get("resultados", []) if r.status_code == 200 else []
    ok(f"'{q[:40]}'", r.status_code == 200, f"{len(resultados)} results")

# ── 4. Empty query must return 400 ───────────────────────────────────────────
print("\n4. Input validation")
r = httpx.post(
    f"{BASE}/documentos/buscar-semantico",
    headers=HEADERS,
    json={"q": "", "limit": 3},
)
ok("Empty query → 400", r.status_code == 400, str(r.status_code))

# ── 5. Invalid token must return 401 ─────────────────────────────────────────
print("\n5. Security — invalid token")
r = httpx.get(f"{BASE}/auth/me", headers={"Authorization": "Bearer slm_live_INVALID"})
ok("Invalid token → 401", r.status_code == 401, str(r.status_code))

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
| Valid session | `GET /auth/me` with correct API Key | HTTP 200, `grupo_activo` present |
| Invalid session | `GET /auth/me` with wrong key | HTTP 401 |
| Paginated list | `GET /documentos/paginado` | HTTP 200, object with `items`, `total`, `page`, `limit` |
| Search with query | `POST /buscar-semantico` with non-empty `q` | HTTP 200, list (may be empty if no docs) |
| Empty search | `POST /buscar-semantico` with `q: ""` | HTTP 400 |
| `limit` parameter | `POST /buscar-semantico` with `limit: 3` | Maximum 3 results |

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

To revoke a compromised key:

```bash
curl -X DELETE $RAGFLY_API_URL/auth/api-key/<prefix> \
  -H "Authorization: Bearer $JWT"
```

---

## Differences between clients

| Aspect | Codex | Claude Code / Cursor |
|---|---|---|
| Setup | `codex mcp add` with `--bearer-token-env-var` | `.mcp.json` with URL + header |
| Calls | MCP tools (`mcp__ragfly__*`) | MCP tools (`mcp__ragfly__*`) |
| Authentication | `--bearer-token-env-var RAGFLY_API_KEY` | Declared in `.mcp.json` |
| Discovery | MCP protocol automatic | MCP protocol automatic |

---

## Troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `401 Unauthorized` | Invalid or revoked API Key | Regenerate at `app.ragfly.ai` or with `POST /auth/api-key` |
| `400` on buscar-semantico | Empty `q` field | Ensure the query is not empty |
| Empty list on search | No vectorized documents | Upload docs from `app.ragfly.ai` and wait for pipeline |
| `RAGFLY_API_KEY` not defined | `.env` not loaded | `source .env` |
| `422 Unprocessable Entity` | Malformed body | Verify `q` is a string and `limit` is an integer |
