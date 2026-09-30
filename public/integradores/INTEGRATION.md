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
| **Local folder — Web** | **Documents → Feed documents → Files** | None | The browser provides a relative path. A local agent resolves it with the per-document environment variable named by `fs.home_var` and `fs.relative_path`, when that root is available. |
| **Local folder — RAGfly Desktop** | RAGfly Desktop | Install and sign in to the Desktop app | The document can carry an absolute local path that an agent on that machine can open directly. |
| **Google Drive** | **Documents → Feed documents → Google Drive** | OAuth Client ID + API Key; the Google Drive source must be enabled for the group | Cloud-only originals stay in Drive and are not exposed as local files. See [GOOGLE_DRIVE.md](GOOGLE_DRIVE.md). |
| **Dropbox** | **Documents → Feed documents → Dropbox** | Dropbox App key; the Dropbox source must be enabled for the group | Cloud-only originals stay in Dropbox and are not exposed as local files. See [DROPBOX.md](DROPBOX.md). |

For Web ingestion — local folders, Google Drive and Dropbox — extraction runs
in the browser. For cloud connectors, file bytes travel from the provider to
browser memory; only encrypted extracted text is uploaded to RAGfly. RAGfly
Cloud never stores the original file.

### Opening an original file from an agent

Indexed content is available through RAGfly regardless of source. Resolve the
`fs` object in this order: cloud-only documents stay with their provider;
public URLs open directly; absolute Desktop paths open directly; otherwise read
the environment variable named by `fs.home_var` and join it with
`fs.relative_path`. Each root has its own variable. If `home_var` is `null` or
unset, there is no local path to resolve. See
[MCP.md: Opening a document on disk](MCP.md#opening-a-document-on-disk-fs-block).

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

MCP tools and manifest operations are related but distinct catalogs: `tools/list`
shows the tools provided by the MCP adapter, while `GET /v1/operations` shows
the screen operations available to that credential after RBAC filtering. Their
counts and names need not match; use each catalog for its own interface.

Create and revoke manual API keys in the RAGfly web app's **API Keys** page.
Integrations use the resulting key with `/v1` or MCP; account and credential
management are not part of the integration API. MCP OAuth can issue the same
kind of key through the browser consent flow.

A key's entity scope is either **fixed** or **flexible**: a fixed key cannot
change entity, while a flexible key can select an authorized entity or release
its focus with `entity_code: null`. RAGfly stores that focus on the server, so it
persists when a client is reconstructed with the same key. The key remains
bounded by its owner's group, role and area. An administrator can create a
separate bot identity in the web app when needed.


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

### Language and identifiers at the integration boundary

REST `/v1`, MCP (including its OAuth protocol endpoints), and machine-readable
CLI and SDK responses use a fixed English protocol: tool and field names,
catalog identifiers, enum values, published schemas and defaults, validation
details, and messages written by RAGfly do not change with a person's locale or
`Accept-Language`. A catalog identifier comes from the English alias stored on
that same catalog row; RAGfly does not translate an internal code or return it
as a fallback. If the alias is missing, the response fails safely. Internal
role identifiers are not returned;
`profile` shows the English access level and `/v1/operations` lists available
actions. Customer-authored names, descriptions, prompts and document content
keep their original language. See [REST.md](REST.md) for the public contract.

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

### API key (manual integrations)

Create, inspect, renew and revoke keys in the web app's **API Keys** page.
The key is shown once; store it in a secrets manager. Its default validity is
three months. The page lets a person choose a validity period and an authorized
role or bot identity. A key cannot create, list or revoke keys.

A key never grants more access than its owner has. RAGfly checks role, area and
entity server-side. A fixed-entity key cannot change entity; a flexible key can
change or release focus only within the owner's authorized entities.

**How to use it** — in SDK, MCP, CLI and REST `/v1` integrations:

```
Authorization: Bearer rf_xxxxxxxxxx
```

An API key operates **only the public API `/v1`** (MCP, the SDKs and the CLI go
through it). On any other route it gets `403` with "An API key can only operate
through the public /v1 API": the internal routes belong to the web app.

### Human web session

A human session belongs to the web app and key-management flow. Do not give a
person's password or session token to an integration; configure the integration
with its API key or complete the MCP OAuth flow in the browser.

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

- The role, filtered by the owner's access level, decides which actions it can
  run. Choose an authorized role in the web app. `GET /v1/operations` is the
  source of truth for the actions available to a key.
- The owner's **group, entity and area** decide which data it sees. They are
  never taken from the request body or the URL.

Roles are configured per group by its administrator. `GET /v1/session` shows
the authenticated identity, active context and English access-level label; it
does not return internal role identifiers. `GET /v1/operations` lists the
actions that identity can actually perform. Principle of least privilege:
choose a role with only the access the integration needs.

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
  "locale": "en"
}
```

Then ask the key what it can do: `GET /v1/operations`
([REST.md § Discover what a key can do](REST.md#discover-what-a-key-can-do--v1operations)).

---

## Security

- API Keys are stored hashed in the database — RAGfly cannot reveal the original value.
- Each key records its last use, for auditing.
- Revoke immediately if a leak is suspected in the web app's
  [API Keys](https://app.ragfly.ai/api-keys) page.
- One Key per integration: if one is revoked, the others keep working.
- Do not include Keys in source code — use environment variables or secrets managers (1Password, Vault, AWS Secrets Manager, etc.).

---

## API Reference

Full interactive Swagger: **[https://api.ragfly.ai/docs](https://api.ragfly.ai/docs)**
