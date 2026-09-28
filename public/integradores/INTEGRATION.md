# RAGfly — Integration Guide

> RAGfly exposes its vector corpus and AI capabilities to external systems through six interfaces. It also feeds that corpus from local files, Google Drive and Dropbox without storing the original files in RAGfly Cloud. This guide covers both sides; each extension details one path in depth.

---

## What you can do from outside

- **Discover what a credential can do** before using it: `GET /v1/operations`
  lists the operations its RBAC allows.
- **Ask in natural language** over your group's documents (RAG with RBAC-filtered context).
- **Search semantically** without going through an LLM (chunks + relevance scores).
- **Operate on Workspaces**: list, compose, read their contents.
- **Execute LLM Skills** over documents or workspaces (summarize, extract, analyze).
- **Monitor the ingestion pipeline** (states, queue, executions).
- **Feed documents** from a local folder, Google Drive or Dropbox in the Web
  app, or from the local filesystem with RAGfly Desktop, and trigger
  vectorization. The stable public REST `/v1` contract does not currently
  expose a file-upload route.
- **Open original files on disk** when they came from a filesystem available to
  the agent. This does not apply to cloud-only Google Drive or Dropbox files;
  their original bytes remain in the provider.

Every RAGfly request respects the multi-tenant model: its RAGfly credential is
anchored to a user, a group and a role, so other groups' data is invisible by
design. Connector configuration belongs to the group, while each provider
authorization belongs to the Google or Dropbox user who grants it.

---

## Feeding the corpus

The source changes how RAGfly obtains the original file, but not the downstream
pipeline: every supported source produces document metadata and extracted text,
then follows the same analysis, chunking and vectorization stages.

| Source | Where users connect it | Administrator setup | Original file access |
|---|---|---|---|
| **Local folder — Web** | **Documents → Feed documents → Files** | None | The browser provides a relative path. A local agent can open it only when the same filesystem is available and `RAGFLY_ROOT` is configured. |
| **Local folder — RAGfly Desktop** | RAGfly Desktop | Install and sign in to the Desktop app | The document can carry an absolute local path that an agent on that machine can open directly. |
| **Google Drive** | **Documents → Feed documents → Google Drive** | OAuth Client ID + API Key; the Google Drive source must be enabled for the group | Cloud-only originals stay in Drive and are not exposed as local files. See [GOOGLE_DRIVE.md](GOOGLE_DRIVE.md). |
| **Dropbox** | **Documents → Feed documents → Dropbox** | Dropbox App key; the Dropbox source must be enabled for the group | Cloud-only originals stay in Dropbox and are not exposed as local files. See [DROPBOX.md](DROPBOX.md). |

For Web ingestion — local folders, Google Drive and Dropbox — extraction runs
in the browser. For cloud connectors, file bytes travel from the provider to
browser memory; only encrypted extracted text is uploaded to RAGfly. RAGfly
Cloud never stores the original file.

### Opening an original file from an agent

Indexed content is available through RAGfly regardless of source. Access to the
original binary is a separate capability:

- **Desktop path**: open the absolute path directly.
- **Web local-folder path**: configure `RAGFLY_ROOT` as the parent of the folder
  you fed, then resolve `RAGFLY_ROOT + fs.path`. See
  [MCP.md § Setting up `RAGFLY_ROOT`](MCP.md#setting-up-ragfly_root--once-per-machine-in-3-steps).
- **Google Drive or Dropbox**: do not use `RAGFLY_ROOT`; RAGfly indexed the
  content but did not copy the original into the local filesystem or RAGfly
  Cloud.
- **Public URL**: open the URL directly when a document explicitly provides one.

---

## The six interfaces

| Interface | When to use | Extension |
|---|---|---|
| **Python SDK** | Python code — `pip install ragfly`. Simplest: `client.ask("...")` | [SDK.md](SDK.md) |
| **TypeScript SDK** | TypeScript/JavaScript code (Node, browser, edge) — `npm install @ragfly/sdk`. Same surface as Python. | [SDK-TS.md](SDK-TS.md) |
| **MCP** | LLM agents (Claude Code, Cursor, Cline, etc.) — the agent discovers and calls RAGfly tools directly | [MCP.md](MCP.md) |
| **CLI** | Scripts, automations, CI/CD pipelines, terminal diagnostics | [CLI.md](CLI.md) |
| **REST `/v1`** | Any language / platform (n8n, Make, Zapier, custom apps) | [REST.md](REST.md) |
| **Web** | End users search, operate and feed documents from Files, Google Drive or Dropbox at [`app.ragfly.ai`](https://app.ragfly.ai) | [GOOGLE_DRIVE.md](GOOGLE_DRIVE.md) · [DROPBOX.md](DROPBOX.md) |

The first five share the same RAGfly authentication contract, the same public contract `/v1` and the same RBAC; what changes is the transport protocol. Both SDKs and the CLI call `/v1`, and the MCP tools return the same English shapes. Google and Dropbox authorization is separate: it grants the Web app read-only access to a user's source account and is used only during ingestion.

---

## Credentials

RAGfly integrations and ingestion connectors use different credentials for
different purposes:

| Credential class | Purpose | Examples | Where it lives |
|---|---|---|---|
| **RAGfly credential** | Authenticate an external system and enforce RAGfly RBAC | API Key (`rf_`), JWT | Integration secret store or interactive session |
| **Connector app credential** | Identify the customer's provider application | Google OAuth Client ID + restricted API Key; Dropbox App key | RAGfly Group Parameters, configured by a group administrator |
| **User provider token** | Authorize read-only access to one user's Drive or Dropbox | Google access token; Dropbox PKCE token | Browser session only; never stored as a RAGfly API Key |

The sections below describe RAGfly credentials. Connector setup is documented
in [GOOGLE_DRIVE.md](GOOGLE_DRIVE.md) and [DROPBOX.md](DROPBOX.md).

### OAuth for MCP clients

For an MCP client with browser-based authorization, connect it to the RAGfly
Streamable HTTP endpoint and sign in to RAGfly when prompted. The consent screen
lets the person choose the role and area within their own permissions. RAGfly
creates the same `rf_` API key used by other integrations and delivers it
directly to the MCP client; the person does not copy or paste the secret.

The key is scoped to its owner, group, entity, role and area, and the server
enforces those limits on every call. It appears in
[`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) with origin `OAUTH`,
where it can be revoked. OAuth changes credential delivery, not what the key
can access. See [MCP.md](MCP.md) for client-specific setup.

**Delegating this to an AI agent?** See
[MCP.md § Delegating this setup to an AI agent](MCP.md#delegating-this-setup-to-an-ai-agent) —
it tells the agent exactly which single step needs a human, and nothing more.

### API Key (manual and programmatic integrations)

Long-lived, no expiry, revocable. Format: `rf_xxxxxxxx…`

**Who creates it**: a person. Any signed-in user can create **their own** API Key, from [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) or with `POST /auth/api-key` and their web session (JWT). That route answers `403` to an API key: a key cannot mint, list or revoke keys. Only a **group administrator** (a user with `ADMINISTRADOR` access) can create a Key **for another user** — e.g. for a `PERFIL`/bot without email — by passing `codigo_usuario_destino`.

A Key never grants more than its owner already has: the administrator governs each user's privilege envelope (**area, entity, role**), and a self-issued Key is capped to that envelope. Role, area and entity are validated server-side against what the target user actually holds — there is no privilege escalation:

```bash
# With an active JWT:
curl -X POST https://api.ragfly.ai/auth/api-key \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "my-integration", "rol_solicitado": "DOCS-USUARIO-FINAL"}'
# → {"api_key": "rf_...", ...}   # shown only once — store in a secrets manager
```

**How to use it** — in SDK, MCP, CLI and REST `/v1` integrations:

```
Authorization: Bearer rf_xxxxxxxxxx
```

An API key operates **only the public API `/v1`** (MCP, the SDKs and the CLI go
through it). On any other route it gets `403` with "An API key can only operate
through the public /v1 API": the internal routes belong to the web app.

### JWT (a person's web session)

Expires in 1 hour. It is the credential of a signed-in person: the web app, and
minting or revoking API keys. It also works on `/v1`, which is handy for testing.

```bash
curl -X POST https://api.ragfly.ai/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@company.com", "password": "..."}'
# → {"access_token": "eyJ...", "token_type": "bearer", "expires_in": 3600, "mfa_required": false, ...}
```

### Credential identity

Each API Key acts **on behalf of a user** in the group. RAGfly has two user types:

| Type | Description |
|---|---|
| `MAIL` | Real person with email. Can issue their own API Key. |
| `PERFIL` | Functional handle ("bot-finance", "night-agent") without email, created by the admin. The admin issues the Key on behalf of the PERFIL. |

PERFIL users let the admin deliver credentials to integrations without exposing personal accounts.

---

## Roles and what a key can do

A key acts with its owner's RBAC, resolved on the server from the key:

- The **role**, filtered by the owner's access level, decides which actions it
  can run. `rol_solicitado` must be a role the owner already holds in the group;
  the key carries only that one. The same role can therefore reach more for an
  administrator than for a standard user.
- The owner's **group, entity and area** decide which data it sees. They are
  never taken from the request body or the URL.

Roles are configured per group by its administrator. `GET /v1/session` shows the
roles a key carries (`roles`), and `GET /v1/operations` lists what it can
actually do. Principle of least privilege: if your integration only reads, use
`DOCS-USUARIO-FINAL`.

---

## Verify the connection

```bash
curl https://api.ragfly.ai/v1/session \
  -H "Authorization: Bearer rf_xxxxxxxxxx"
```

Expected response:

```json
{
  "authenticated": true,
  "user": {"code": "bot-finance", "name": "Finance bot"},
  "active_group": "COMPANY",
  "active_entity": "COMPANY",
  "profile": "USER",
  "roles": ["DOCS-USUARIO-FINAL"],
  "locale": "en"
}
```

Then ask the key what it can do: `GET /v1/operations`
([REST.md § Discover what a key can do](REST.md#discover-what-a-key-can-do--v1operations)).

---

## Security

- API Keys are stored hashed in the database — RAGfly cannot reveal the original value.
- Each key records its last use, for auditing.
- Revoke immediately if a leak is suspected: panel [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) or `DELETE /auth/api-key/{prefix}`.
- One Key per integration: if one is revoked, the others keep working.
- Do not include Keys in source code — use environment variables or secrets managers (1Password, Vault, AWS Secrets Manager, etc.).

---

## API Reference

Full interactive Swagger: **[https://api.ragfly.ai/docs](https://api.ragfly.ai/docs)**
