---
status: live
last_updated: 2026-06-18
audience: external integrators
see_also:
  - SDK.md
  - MCP.md
  - CLI.md
  - REST.md
---

# RAGfly — Integration Guide

> RAGfly exposes its vector corpus and AI capabilities to external systems through six interfaces. This guide covers the essentials for connecting; each extension details one interface in depth.

---

## What you can do from outside

- **Ask in natural language** over your group's documents (RAG with RBAC-filtered context).
- **Search semantically** without going through an LLM (chunks + relevance scores).
- **Operate on Workspaces**: list, compose, read their contents.
- **Execute LLM Skills** over documents or workspaces (summarize, extract, analyze).
- **Monitor the ingestion pipeline** (states, queue, executions).
- **Upload documents** and trigger vectorization (via REST or local client).

Everything respects RAGfly's multi-tenant model: each credential is anchored to a user, a group, and a role — other groups' data is invisible by design.

---

## The six interfaces

| Interface | When to use | Extension |
|---|---|---|
| **Python SDK** | Python code — `pip install ragfly`. Simplest: `client.ask("...")` | [SDK.md](SDK.md) |
| **TypeScript SDK** | TypeScript/JavaScript code (Node, browser, edge) — `npm install @ragfly/sdk`. Same surface as Python. | [SDK-TS.md](SDK-TS.md) |
| **MCP** | LLM agents (Claude Code, Cursor, Cline, etc.) — the agent discovers and calls RAGfly tools directly | [MCP.md](MCP.md) |
| **CLI** | Scripts, automations, CI/CD pipelines, terminal diagnostics | [CLI.md](CLI.md) |
| **REST + SSE** | Any language / platform (n8n, Make, Zapier, custom apps) | [REST.md](REST.md) |
| **Web** | End users use [`app.ragfly.ai`](https://app.ragfly.ai) directly — no integration needed | — |

The first five share the same authentication contract and the same RBAC; what changes is the transport protocol. Both SDKs wrap the REST API.

---

## Credentials

### API Key (recommended for integrations)

Long-lived, no expiry, revocable. Format: `slm_live_xxxxxxxx…`

**Who creates it**: only the group administrator (role `SEG-GRUPO`) from [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) — or via REST:

```bash
# With an active JWT:
curl -X POST https://api.ragfly.ai/auth/api-key \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "my-integration", "rol_solicitado": "DOC-ADMIN"}'
# → {"api_key": "slm_live_...", ...}   # shown only once — store in a secrets manager
```

**How to use it** — in all interfaces:

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
| `PROFILE` | Functional handle ("bot-finance", "night-agent") without email, created by the admin. The admin issues the Key on behalf of the PROFILE. |

PROFILEs let the admin deliver credentials to integrations without exposing personal accounts.

---

## Available roles

| Role | What it can do |
|---|---|
| `DOC-ADMIN` | Documents, workspaces, skills — read and write |
| `DOCS-USUARIO-FINAL` | Read documents and workspaces |
| `PROCESOS_RAGFLY` | Queue and pipeline process management |
| `OPERADOR` | According to the functions assigned to the role in your group |

The administrator defines the role when creating the API Key. Principle of least privilege: if your integration only reads, use `DOCS-USUARIO-FINAL`.

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
