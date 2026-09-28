# RAGfly — Integration Kit

RAGfly is a RAG service. This kit shows how to connect an agent or an
application to it through the public REST API `/v1` or MCP.

**API:** `https://api.ragfly.ai` — public contract: `/v1` (REST) and MCP  
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
  -H "Content-Type: application/json" -H "Accept-Language: en" \
  -d "{\"email\": \"$RAGFLY_EMAIL\", \"nombre\": \"Your Name\", \"empresa\": \"Your Company\"}"
# → confirm the link sent to your email

# 3. Sign in as a person (web session, expires in 1 h)
JWT=$(curl -s -X POST $RAGFLY_API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$RAGFLY_EMAIL\", \"password\": \"$RAGFLY_PASSWORD\"}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# 4. Mint an API key with that session (persists until revoked)
curl -X POST $RAGFLY_API_URL/auth/api-key \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "my-agent", "rol_solicitado": "DOCS-USUARIO-FINAL"}'
# → save api_key in .env as RAGFLY_API_KEY (shown only once)

# 5. First call with the key
source .env
curl $RAGFLY_API_URL/v1/session -H "Authorization: Bearer $RAGFLY_API_KEY"

# 6. What can this key do?
curl $RAGFLY_API_URL/v1/operations -H "Authorization: Bearer $RAGFLY_API_KEY"
```

Steps 2–4 use `/auth/*`, the web app's sign-in surface (its field names, such as
`nombre` and `rol_solicitado`, are Spanish). You only need it to get a key.
Everything your integration does afterwards goes through `/v1`, which is English.

---

## Kit documents

| File | For whom |
|---|---|
| **`INTEGRATION.md`** | Start here — interfaces, corpus feeding, credentials and security |
| **`QUICKSTART.md`** | Codex and code agents — full walkthrough with runnable script |
| **`AGENTS.md`** | Drop this in the root of your Codex workspace |
| **`MCP.md`** | Claude Code, Cursor, Cline — MCP setup |
| **`REST.md`** | Backends, pipelines, n8n/Make — the `/v1` reference |
| **`OPERATIONS.md`** | Every operation of the application through `/v1/operations`, on the five surfaces, and what is not published and why |
| **`CLI.md`** | Terminal and scripts |
| **`SDK.md`** | Python SDK |
| **`SDK-TS.md`** | TypeScript/JavaScript SDK |
| **`RUNTIME_HINTS.md`** | Hints by agent/runtime type (Codex, Claude, IDEs, REST) |
| **`ENV_VARS.md`** | **Every environment variable — canonical names, defaults, legacy aliases** |
| **`GOOGLE_DRIVE.md`** | Workspace administrators — feed documents directly from Google Drive |
| **`DROPBOX.md`** | Workspace administrators — feed documents directly from Dropbox |
| **`EVALUATION_TEMPLATE.md`** | Template for reporting findings |
| **`.env.example`** | Environment variables template |

---

## Where to start

**Codex** → `QUICKSTART.md` (MCP via `codex mcp add`)<br>
**Claude Code / Cursor / Cline** → `MCP.md`, then `QUICKSTART.md` step 5<br>
**REST / backend** → `REST.md`<br>
**CLI** → `CLI.md`<br>
**Python** → `SDK.md` (`pip install ragfly`)<br>
**TypeScript / Node / edge** → `SDK-TS.md` (`npm i @ragfly/sdk`)<br>
**Feed from Google Drive** → `GOOGLE_DRIVE.md`<br>
**Feed from Dropbox** → `DROPBOX.md`

---

## Authentication — summary

Two credentials, two jobs:

| Credential | Who uses it | What it can call |
|---|---|---|
| **Web session** — JWT from `POST /auth/login`, expires in 1 h | A person | The web app, and minting or revoking API keys (`/auth/api-key`) |
| **API key** — `rf_...`, no expiry, revocable | Your agent or integration | Only the public API `/v1`, plus MCP, the SDKs and the CLI, which go through it |

Both travel the same way: `Authorization: Bearer <token>`.

- **Minting a key needs a person.** `POST /auth/api-key` requires a signed-in
  person's JWT. Called with an API key it answers `403`: an API key cannot
  manage API keys, secrets or payments. Revoke with `DELETE /auth/api-key/{prefix}`,
  also with a JWT, or from [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys).
- **A key operates `/v1` only.** On any other route it answers `403` with
  "An API key can only operate through the public /v1 API". The internal routes
  belong to the web app and are not part of the contract.
- **A key carries its owner's RBAC.** The key's **role**, filtered by its
  owner's access level, decides which actions it can run; the owner's **group,
  entity and area** decide which data it sees. The server resolves all of it from
  the key. It is never read from the request body or the URL.
- **Ask the key what it can do.** `GET /v1/operations` lists the operations its
  RBAC allows. See [REST.md § Discover what a key can do](REST.md#discover-what-a-key-can-do--v1operations).

---

## Secrets

- Always load RAGfly API Keys from environment variables — never hardcode them.
- Add `.env` to `.gitignore`.
- Revoke immediately if a key is compromised.
- RAGfly API Keys authenticate integrations. Google and Dropbox connector
  credentials authorize document sources and follow the separate storage and
  browser-session rules in `INTEGRATION.md`.
