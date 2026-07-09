# RAGfly — Integration Kit

**API:** `https://api.ragfly.ai`  
**Interactive docs:** `https://api.ragfly.ai/docs`  
**Sign up:** `https://app.ragfly.ai`

---

## Quick start

```bash
# 1. Environment variables
cp .env.example .env
# Edit .env with your email and password

source .env

# 2. Register (if you don't have an account yet)
curl -X POST $RAGFLY_API_URL/auth/registro \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$RAGFLY_EMAIL\", \"nombre\": \"Your Name\", \"empresa\": \"Your Company\"}"
# → confirm the link sent to your email

# 3. Get a JWT
JWT=$(curl -s -X POST $RAGFLY_API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$RAGFLY_EMAIL\", \"password\": \"$RAGFLY_PASSWORD\"}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# 4. Create an API Key (persists until revoked)
curl -X POST $RAGFLY_API_URL/auth/api-key \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "my-agent", "rol_solicitado": "DOCS-USUARIO-FINAL"}'
# → save api_key in .env as RAGFLY_API_KEY

# 5. First call
source .env
curl $RAGFLY_API_URL/auth/me -H "Authorization: Bearer $RAGFLY_API_KEY"
```

---

## Kit documents

| File | For whom |
|---|---|
| **`QUICKSTART.md`** | Codex and code agents — full walkthrough with runnable script |
| **`AGENTS.md`** | Drop this in the root of your Codex workspace |
| **`MCP.md`** | Claude Code, Cursor, Cline — MCP setup |
| **`REST.md`** | Backends, pipelines, n8n/Make |
| **`CLI.md`** | Terminal and scripts |
| **`SDK.md`** | Python SDK |
| **`SDK-TS.md`** | TypeScript/JavaScript SDK |
| **`RUNTIME_HINTS.md`** | Hints by agent/runtime type (Codex, Claude, IDEs, REST) |
| **`ENV_VARS.md`** | **Every environment variable — canonical names, defaults, legacy aliases** |
| **`EVALUATION_TEMPLATE.md`** | Template for reporting findings |
| **`.env.example`** | Environment variables template |

---

## Where to start

**Codex** → `QUICKSTART.md` (MCP via `codex mcp add`)  
**Claude Code / Cursor / Cline** → `MCP.md`, then `QUICKSTART.md` section 4  
**REST / backend** → `REST.md`  
**CLI** → `CLI.md`  
**Python** → `SDK.md` (`pip install ragfly`)  
**TypeScript / Node / edge** → `SDK-TS.md` (`npm i @ragfly/sdk`)

---

## Authentication — summary

| Method | Header | When |
|---|---|---|
| JWT | `Authorization: Bearer <token>` | Interactive sessions, expires in 1 h |
| API Key | `Authorization: Bearer slm_live_...` | Agents and automations, no expiry |

Generate an API Key: `POST /auth/api-key` (requires JWT).  
Revoke: `DELETE /auth/api-key/{prefix}`.

---

## Secrets

- Always load from environment variables — never hardcode.
- Add `.env` to `.gitignore`.
- Revoke immediately if a key is compromised.
