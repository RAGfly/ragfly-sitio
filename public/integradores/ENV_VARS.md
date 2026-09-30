# RAGfly — Environment Variables Reference

The single source of truth for every environment variable an integrator sets.
Canonical fixed variables use English, UPPERCASE names with the `RAGFLY_`
prefix. Filesystem root variables are generated per root and identified by
`fs.home_var`; they are not one fixed variable name.

There are **two independent setups**. You use one or the other depending on how
you connect — they do **not** share variables.

- **A · Agent / integration** (REST, MCP, SDK Python/TS, CLI) → connect an agent
  to the RAGfly API.
- **B · RAGfly Desktop** (the local app that scans a folder and uploads files) →
  configured in `~/.ragfly/config.env`.

---

## A · Agent / integration (REST · MCP · SDK · CLI)

| Variable | Canonical | What it is | Default | Where you set it |
|---|---|---|---|---|
| `RAGFLY_API_URL` | ✅ | Backend base URL. | `https://api.ragfly.ai` | `.env`, shell, MCP `env` block |
| `RAGFLY_API_KEY` | ✅ | **The only operational credential.** API key (`rf_…`), sent as `Authorization: Bearer …`. Default validity is 3 months; renewal or revocation needs a human session. | — | `.env`, shell, MCP `env` block |
| Per-root variable named by `fs.home_var` (for example `RAGFLY_HOME_442681`) | Generated | **Optional.** Points to the local root for that document. Read the name from each document's `fs` object and join its value with `fs.relative_path`. | — | Environment of the agent or MCP client |

Create and revoke API keys in the RAGfly web app's **API Keys** page. The
integration receives only `RAGFLY_API_KEY`; never put a person's password or
web-session token in an agent's environment. Web sign-in variables belong only
to the separate Desktop setup below.

Full walkthrough: [QUICKSTART.md](QUICKSTART.md).

### Resolving an original file from `fs`

The document response supplies an `fs` object. Resolve it in this order:

1. If `is_cloud_only` is `true`, do not resolve a local path. The original
   remains with Google Drive or Dropbox; use provider details in `fs` when
   available.
2. If `is_public_url` is `true` (or `origin` is `PUBLIC`), open the public URL
   directly.
3. If `is_absolute` is `true`, open `fs.path` directly on that machine.
4. Otherwise, read the environment variable whose **name** is `fs.home_var` and
   join its value with `fs.relative_path`. Each document can name a different
   root variable.

Example with two roots:

| Document | `fs.home_var` | `fs.relative_path` | Local root variable |
|---|---|---|---|
| A | `RAGFLY_HOME_442681` | `Contracts/2026/a.pdf` | `RAGFLY_HOME_442681=/Users/ana/Dropbox` |
| B | `RAGFLY_HOME_991203` | `Legal/b.pdf` | `RAGFLY_HOME_991203=/Volumes/Archive` |

If `home_var` is `null`, empty, or names an unset variable, there is no local
root available for that document. Do not guess a root or construct a path from
`fs.path`; continue with the indexed content or the public/provider URL if
available. RAGfly does not read or store these machine-local root values.

Searching, asking and citing do not require local path resolution; it is only
needed when an agent must open the original file.

## B · RAGfly Desktop (`~/.ragfly/config.env`)

Configured by `ragfly setup` or by editing `~/.ragfly/config.env` directly.

> **Since v1.18.110 (2026-09-25) the Desktop creates the file itself.** On every
> launch it checks `~/.ragfly/config.env`; if it is missing (fresh DMG/EXE install,
> wiped home) it writes a header-only template (no variables: without `RAGFLY_ENV`
> the Desktop is `prod`), so there is always a file to edit. An existing file is never
> touched. That template alone does not count as "configured" for the CLI:
> `ragfly setup` still runs clean and `ragfly estado` still reports "not configured"
> until a variable other than `RAGFLY_ENV` is set.

| Variable | Canonical | What it is | Default |
|---|---|---|---|
| `RAGFLY_ENV` | ✅ | Environment: `prod` \| `test` \| `corp`. Picks backend + frontend URLs and an isolated local DB per env. End users leave it at `prod`. | `prod` |
| `RAGFLY_EMAIL` | ✅ | Account email for signing in to RAGfly Desktop. | — |
| `RAGFLY_PASSWORD` | ✅ | Account password for signing in to RAGfly Desktop. | — |
| `RAGFLY_CODIGO_GRUPO` | ✅ | Active multi-tenant group code. | — |
| `RAGFLY_CODIGO_ENTIDAD` | ✅ | Active entity code within the group (optional). | — |
| `RAGFLY_DOCUMENTS_ROOT` | ✅ | Local folder holding the documents to upload (all docs must live under it). | — |
| `RAGFLY_DB_PATH` | ✅ | Advanced override: local SQLite path. Setting it breaks per-env isolation — not recommended. | derived from `RAGFLY_ENV` (`~/.ragfly/data.db`) |
| `RAGFLY_DEBUG` | ✅ | Debug mode. | `false` |
| `RAGFLY_CLOUD_URL` | ✅ | Advanced override: backend URL (wins over `RAGFLY_ENV`). Dev only. | derived from `RAGFLY_ENV` |
| `RAGFLY_WEB_URL` | ✅ | Advanced override: frontend URL (wins over `RAGFLY_ENV`). Dev only. | derived from `RAGFLY_ENV` |

> The Desktop does **not** configure its LLM, embedding model or LLM API keys —
> those are governed by the Cloud catalog, per skill/step. Any variable like
> `RAGFLY_LLM_PROVEEDOR`, `RAGFLY_MODELO_EMBEDDINGS`, `RAGFLY_GOOGLE_API_KEY`,
> `RAGFLY_ANTHROPIC_API_KEY` or `RAGFLY_OLLAMA_URL` you may see in old templates is
> **no longer read** and can be removed.

> **`RAGFLY_DOCUMENTS_ROOT` is reset automatically when the active group changes.**
> Switching groups from the Web header wipes the entire local corpus (not just a
> drain — see [ARQ-11 §8](../arquitectura/ARQ-11-RAGFLY-DESKTOP.md#cambio-de-grupo-activo-reset-duro-no-drenaje))
> and clears this variable. Since v1.18.107 (2026-09-24) it does so by **removing
> the line** from `config.env`, not by leaving it as `=` empty — a `.env` file has
> no real NULL, so an absent variable is its closest equivalent, and every reader
> of `directorio_documentos` in the client already treats absence and `""` the
> same way.

---

## Rules

- **Naming:** English, UPPERCASE, `RAGFLY_` prefix. No Spanish names in new variables.
- **Secrets:** always from environment variables — never hardcoded. Add `.env` /
  `config.env` to `.gitignore`. Revoke a compromised API key immediately in
  the web app's **API Keys** page.
- **This file is canonical.** Any change to a variable name or meaning is made
  here first, then replicated to `.env.example`, the per-interface docs and the
  support portal.
