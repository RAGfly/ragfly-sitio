# RAGfly — Environment Variables Reference

The single source of truth for every environment variable an integrator sets.
Naming convention (fixed): **English, UPPERCASE, `RAGFLY_` prefix.** If a doc
elsewhere uses a different name, this table wins.

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
| `RAGFLY_API_KEY` | ✅ | **The only operational credential.** API key (`rf_…`), sent as `Authorization: Bearer …`. No expiry until revoked. | — | `.env`, shell, MCP `env` block |
| `RAGFLY_EMAIL` | ✅ | **Bootstrap only.** Your account email — used once to log in and mint the API key. | — | `.env` (can be deleted after) |
| `RAGFLY_PASSWORD` | ✅ | **Bootstrap only.** Your account password — used once with `RAGFLY_EMAIL`. | — | `.env` (can be deleted after) |
| `RAGFLY_ROOT` | ✅ | **Optional.** Lets your agent open the *original file on disk* for web-uploaded documents. Parent folder of what you uploaded. RAGfly never reads nor stores it. | — | shell (`~/.zshrc`), `CLAUDE.md`/`AGENTS.md`, MCP `env` block |

### How the API key is minted (why EMAIL/PASSWORD are "bootstrap only")

1. `POST /auth/login` with `RAGFLY_EMAIL` + `RAGFLY_PASSWORD` → returns a **JWT** (short-lived).
2. `POST /auth/api-key` with that JWT → returns **`RAGFLY_API_KEY`** (`rf_…`, shown once).
3. From then on, **every call uses `RAGFLY_API_KEY`**. Email/password are no longer needed.

Full walkthrough: [QUICKSTART.md](QUICKSTART.md).

### `RAGFLY_ROOT` — when you actually need it

RAGfly returns each document with fields that describe how its original can be accessed:

- `path` — the stored location.
- `is_absolute` — whether `path` is an OS path. **RAGfly determines it at upload time; the agent does not decide it.**
- `is_cloud_only` — whether the original remains in a cloud connector and must
  not be resolved locally.

The single rule the agent follows:

- `is_cloud_only: true` (fed by **Google Drive** or **Dropbox**) → do not use
  `path` or `RAGFLY_ROOT`; the original stays with the provider.
- `is_absolute: true` (uploaded via **RAGfly Desktop**) → open `path` directly. **No `RAGFLY_ROOT` needed.**
- `origin: WEB` and `is_cloud_only: false` (uploaded from a **web local folder**) → open `RAGFLY_ROOT + path`.

The browser never exposes your real disk path, so web-uploaded files carry only a
*relative* path. `RAGFLY_ROOT` is the parent folder of what you uploaded (e.g. you
uploaded `/Users/ana/Dropbox/MisDocumentos` → `RAGFLY_ROOT=/Users/ana/Dropbox`).
Because it never leaves your machine, the same document resolves anywhere — each
machine sets its own `RAGFLY_ROOT`. You do **not** need it just to search, ask or
cite (that content is served from the cloud) — only to open the original file.

Step-by-step: [MCP.md § Setting up `RAGFLY_ROOT`](MCP.md#setting-up-ragfly_root--once-per-machine-in-3-steps).

---

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
| `RAGFLY_EMAIL` | ✅ | Account email for login. | — |
| `RAGFLY_PASSWORD` | ✅ | Account password for login. | — |
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
  `config.env` to `.gitignore`. Revoke a compromised key immediately
  (`DELETE /auth/api-key/{prefix}`).
- **This file is canonical.** Any change to a variable name or meaning is made
  here first, then replicated to `.env.example`, the per-interface docs and the
  support portal.
