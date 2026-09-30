# RAGfly — Integration Kit

RAGfly is a RAG service. This kit shows how to connect an agent or an
application to it through the public REST API `/v1` or MCP.

**API:** `https://api.ragfly.ai` — public contract: `/v1` (REST) and MCP  
**Interactive docs:** `https://api.ragfly.ai/docs`  
**Sign up:** `https://app.ragfly.ai`

---

## Quick start

1. Create an account at [app.ragfly.ai](https://app.ragfly.ai) if you do not have one.
2. Create an API key in [API Keys](https://app.ragfly.ai/api-keys) and copy it
   when the app shows it. The key inherits its owner's role and data access.
3. Set the public API URL and key, then make the first calls:

```bash
export RAGFLY_API_URL="https://api.ragfly.ai"
export RAGFLY_API_KEY="rf_..."

curl "$RAGFLY_API_URL/v1/session" \
  -H "Authorization: Bearer $RAGFLY_API_KEY"
curl "$RAGFLY_API_URL/v1/operations" \
  -H "Authorization: Bearer $RAGFLY_API_KEY"
```

The web app manages account sessions and API keys. Those web-only routes are
outside the integration contract; integrations use `/v1` or MCP. Their fields,
catalog codes, enums, published schemas, validation details and API-authored
messages are English. Catalog codes use their same-row English alias; tenant
content keeps its original language.

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

The integration uses one credential:

| Credential | Who uses it | What it can call |
|---|---|---|
| **API key** — `rf_...`, 3-month default validity, revocable | Your agent or integration | Only the public API `/v1`, plus MCP, the SDKs and the CLI, which go through it |

- **Create and revoke keys in the web app.** Use
  [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys). An API key cannot
  manage other keys, secrets or payments.
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
