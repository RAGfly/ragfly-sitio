---
status: live
last_updated: 2026-06-18
audience: external integrators — scripts and terminal
see_also:
  - INTEGRATION.md
  - REST.md
---

# RAGfly — CLI Interface

The `ragfly` binary lets you operate RAGfly from the terminal or scripts without writing HTTP directly.

---

## Installation

```bash
pip install ragfly-cli
ragfly version
# RAGfly Cliente v1.17.2
```

> **Three different packages — don't confuse them:**
> - `pip install ragfly-cli` → the **`ragfly` binary** for terminal/CI (this doc). Lightweight.
> - `pip install ragfly` → the **Python SDK** (`import ragfly`), for embedding RAGfly in your code.
> - **RAGfly Desktop** (DMG/exe) → bundles the local file worker for `ragfly local scan/sync/daemon`.

---

## Authentication

### Interactive login (JWT, 1 hour)

```bash
ragfly login
# Email: user@company.com
# Password: ••••••••
# ✓ Session started — group: COMPANY, entity: COMPANY
```

### API Key (automations, no expiry)

```bash
export RAGFLY_TOKEN=slm_live_xxxxxxxxxx   # the CLI picks it up automatically
```

Create one from the CLI:

```bash
ragfly cloud api-key crear --nombre "pipeline-ci" --rol DOC-ADMIN
# ✓ API Key creada — guardala AHORA (no se vuelve a mostrar):
#   slm_live_a1b2c3...
ragfly cloud api-key listar              # prefijos, rol, último uso, estado
ragfly cloud api-key revocar slm_live_a1b2c3   # por prefijo
```

You can also create it from the web app (**API Keys** screen) or the REST API
(`POST /auth/api-key`). The key authenticates as `Authorization: Bearer
slm_live_…` against every REST endpoint, and the CLI consumes it via
`RAGFLY_TOKEN` on any `ragfly cloud …` command (verified).

---

## Binary structure

```
ragfly
├── login / logout / version
└── cloud       ← operations against the remote API (api.ragfly.ai)
    ├── me
    ├── grupo       listar | cambiar | limpiar
    ├── api-key     crear | listar | revocar
    ├── documento   listar | ver
    ├── espacio     listar | ver
    ├── cola        ver | ejecuciones
    ├── habilidad   listar | ver | ejecutar
    ├── catalogo
    ├── buscar
    └── chat        preguntar
```

> `ragfly local <cmd>` (filesystem scan/sync/daemon) ships with **RAGfly Desktop**,
> not with `ragfly-cli`. Install the desktop app to use those.

---

## Main cloud commands

### Verify context

```bash
ragfly cloud me
# User:           bot-finance
# Primary role:   DOC-ADMIN
# Active group:   COMPANY
# Active entity:  COMPANY
```

### Documents

```bash
# List with filters
ragfly cloud documento listar --estado VECTORIZADO --limite 20

# Document detail
ragfly cloud documento ver DOC-2024-001
# Includes state, location, size, extracted features, etc.
```

### Workspaces

```bash
ragfly cloud espacio listar

ragfly cloud espacio ver 42
# Detail: workspace criteria + first documents + queue state
```

### LLM Skills

```bash
# View catalog
ragfly cloud habilidad listar

# Skill detail
ragfly cloud habilidad ver RESUMIR_DOCUMENTO

# Execute over a workspace (queues and returns execution id)
ragfly cloud habilidad ejecutar RESUMIR_DOCUMENTO --espacio 42

# Execute and wait for result
ragfly cloud habilidad ejecutar RESUMIR_DOCUMENTO --documento DOC-2024-001 --esperar
```

### Pipeline queue

```bash
# View current state
ragfly cloud cola ver --estado EJECUTANDO

# Follow in real time (like tail -f)
ragfly cloud cola ver -f

# Execution history
ragfly cloud cola ejecuciones --limite 10
```

### Chat (conversational interface)

```bash
# New thread
ragfly cloud chat preguntar "Summarize the 2024 lease contracts"

# Continue existing thread
ragfly cloud chat preguntar --conversacion 512 "Which ones have a price adjustment clause?"
```

---

## Global flags

| Flag | Effect |
|---|---|
| `-o tabla` | Human-readable output (default) |
| `-o json` | Structured JSON — for scripts and pipes |
| `-o csv` | For tabular analysis |
| `-o id` | Only the resource id/code — useful in pipes |
| `-v` | Shows method + URL + status for each request |
| `--limite N` | Number of results |
| `--pagina N` | Pagination |

---

## For scripts and CI/CD

```bash
#!/bin/bash
export RAGFLY_TOKEN=slm_live_xxxxxxxxxx

# List unchunked documents and process them
ragfly cloud documento listar --estado CHUNKEADO -o json \
  | jq -r '.[].codigo_documento' \
  | while read codigo; do
      ragfly cloud habilidad ejecutar RESUMIR_DOCUMENTO --documento "$codigo" --esperar
    done
```

---

## Local operations (`ragfly local`) — ships with RAGfly Desktop

Scanning the local filesystem and syncing it to the cloud needs the local file
worker (text extraction, watcher), which is **not** part of `ragfly-cli`. Install
**RAGfly Desktop** (DMG/exe) to get these:

```bash
ragfly local escanear /path/to/my/documents
ragfly local sync
ragfly local daemon   # watches for changes and syncs automatically
```
