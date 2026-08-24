# RAGfly — Integration Guide

> RAGfly exposes its vector corpus and AI capabilities to external systems through six interfaces. It also feeds that corpus from local files, Google Drive and Dropbox without storing the original files in RAGfly Cloud. This guide covers both sides; each extension details one path in depth.

---

## What you can do from outside

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
| **Google Drive** | **Documents → Feed documents → Google Drive** | OAuth Client ID + API Key + connector flag, per group | Cloud-only originals stay in Drive and are not exposed as local files. See [GOOGLE_DRIVE.md](GOOGLE_DRIVE.md). |
| **Dropbox** | **Documents → Feed documents → Dropbox** | Dropbox App key + connector flag, per group | Cloud-only originals stay in Dropbox and are not exposed as local files. See [DROPBOX.md](DROPBOX.md). |

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
| **REST + SSE** | Any language / platform (n8n, Make, Zapier, custom apps) | [REST.md](REST.md) |
| **Web** | End users search, operate and feed documents from Files, Google Drive or Dropbox at [`app.ragfly.ai`](https://app.ragfly.ai) | [GOOGLE_DRIVE.md](GOOGLE_DRIVE.md) · [DROPBOX.md](DROPBOX.md) |

The first five share the same RAGfly authentication contract and the same RBAC; what changes is the transport protocol. Both SDKs wrap the REST API. Google and Dropbox authorization is separate: it grants the Web app read-only access to a user's source account and is used only during ingestion.

---

## Credentials

RAGfly integrations and ingestion connectors use different credentials for
different purposes:

| Credential class | Purpose | Examples | Where it lives |
|---|---|---|---|
| **RAGfly credential** | Authenticate an external system and enforce RAGfly RBAC | API Key, JWT | Integration secret store or interactive session |
| **Connector app credential** | Identify the customer's provider application | Google OAuth Client ID + restricted API Key; Dropbox App key | RAGfly Group Parameters, configured by a group administrator |
| **User provider token** | Authorize read-only access to one user's Drive or Dropbox | Google access token; Dropbox PKCE token | Browser session only; never stored as a RAGfly API Key |

The sections below describe RAGfly credentials. Connector setup is documented
in [GOOGLE_DRIVE.md](GOOGLE_DRIVE.md) and [DROPBOX.md](DROPBOX.md).

### API Key (recommended for integrations)

Long-lived, no expiry, revocable. Format: `slm_live_xxxxxxxx…`

**Who creates it**: any authenticated user can create **their own** API Key, from [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) or via REST. Only a **group administrator** (a user with `ADMINISTRADOR` access) can create a Key **for another user** — e.g. for a `PERFIL`/bot without email — by passing `codigo_usuario_destino`.

A Key never grants more than its owner already has: the administrator governs each user's privilege envelope (**area, entity, role**), and a self-issued Key is capped to that envelope. Role, area and entity are validated server-side against what the target user actually holds — there is no privilege escalation:

```bash
# With an active JWT:
curl -X POST https://api.ragfly.ai/auth/api-key \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "my-integration", "rol_solicitado": "DOC-ADMIN"}'
# → {"api_key": "slm_live_...", ...}   # shown only once — store in a secrets manager
```

**How to use it** — in SDK, MCP, CLI and REST integrations:

```
Authorization: Bearer slm_live_xxxxxxxxxx
```

### JWT (interactive sessions / testing)

Expires in 1 hour. Valid for testing or integrations that already manage refresh.

```bash
curl -X POST https://api.ragfly.ai/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@company.com", "password": "..."}'
# → {"access_token": "eyJ...", "expires_in": 3600}
```

### Credential identity

Each API Key acts **on behalf of a user** in the group. RAGfly has two user types:

| Type | Description |
|---|---|
| `MAIL` | Real person with email. Can issue their own API Key. |
| `PERFIL` | Functional handle ("bot-finance", "night-agent") without email, created by the admin. The admin issues the Key on behalf of the PERFIL. |

PERFIL users let the admin deliver credentials to integrations without exposing personal accounts.

---

## Available roles

| Role | What it can do |
|---|---|
| `DOC-ADMIN` | Documents, workspaces, skills — read and write |
| `DOCS-USUARIO-FINAL` | Read documents and workspaces |
| `PROCESOS_RAGFLY` | Queue and pipeline process management |
| `OPERADOR` | According to the functions assigned to the role in your group |

Whoever creates the Key defines its role, capped at their own access level (the administrator sets each user's role, area and entity). Principle of least privilege: if your integration only reads, use `DOCS-USUARIO-FINAL`.

---

## Verify the connection

```bash
curl https://api.ragfly.ai/auth/me \
  -H "Authorization: Bearer slm_live_xxxxxxxxxx"
```

Expected response:

```json
{
  "codigo_usuario": "bot-finance",
  "rol_principal": "DOC-ADMIN",
  "tipo_acceso": "USUARIO",
  "grupo_activo": "COMPANY",
  "entidad_activa": "COMPANY"
}
```

---

## Security

- API Keys are stored hashed in the database — RAGfly cannot reveal the original value.
- Each Key updates `ultimo_uso` in the database for auditing.
- Revoke immediately if a leak is suspected: panel [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) or `DELETE /auth/api-key/{prefix}`.
- One Key per integration: if one is revoked, the others keep working.
- Do not include Keys in source code — use environment variables or secrets managers (1Password, Vault, AWS Secrets Manager, etc.).

---

## API Reference

Full interactive Swagger: **[https://api.ragfly.ai/docs](https://api.ragfly.ai/docs)**
