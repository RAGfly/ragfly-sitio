# RAGfly — MCP Interface

Connect any MCP-compatible LLM agent (Claude Code, Cursor, Cline, etc.) to your RAGfly group's documents and capabilities. The agent discovers tools automatically — no integration code required.

> **Opening original files from disk?** Searching, asking and citing need zero
> extra config. Only if your agent must open the **original file** on disk
> (web-uploaded documents) you set one variable, `RAGFLY_ROOT`, once per machine.
> Clear walkthrough with an example:
> [§ Setting up `RAGFLY_ROOT`](#setting-up-ragfly_root--once-per-machine-in-3-steps).

---

## Prerequisite

An **API Key** for your group. See [INTEGRATION.md § Credentials](INTEGRATION.md).

---

## Quick setup (remote mode — recommended)

No installation required. Add to your MCP client:

### Claude Code — `.mcp.json` (project) or `~/.mcp.json` (global)

**SSE** (compatible with all clients):
```json
{
  "mcpServers": {
    "ragfly": {
      "url": "https://api.ragfly.ai/mcp/sse",
      "headers": {
        "Authorization": "Bearer slm_live_xxxxxxxxxx"
      }
    }
  }
}
```

**streamable_http** (more efficient, better with HTTP/2 and proxies):
```json
{
  "mcpServers": {
    "ragfly": {
      "url": "https://api.ragfly.ai/mcp-http/",
      "headers": {
        "Authorization": "Bearer slm_live_xxxxxxxxxx"
      }
    }
  }
}
```

Restart your client. Tools appear with the prefix `mcp__ragfly__`.

### Cursor / Cline / other MCP clients

Register the SSE URL and the `Authorization` header. Consult your client's documentation for the exact format — the protocol is standard MCP.

---

## Available tools

| Tool | Description | Parameters |
|---|---|---|
| `estado_sesion` | Verifies the connection and returns the user context | — |
| `listar_documentos` | Lists group documents with filters | `estado`, `limite`, `pagina` |
| `ver_documento` | Full detail of a document | `codigo_documento` |
| `listar_espacios` | Lists the group's Workspaces | `limite` |
| `ver_espacio` | Workspace detail: criteria + documents + queue | `id_espacio`, `limite_docs` |
| `componer_espacios` | Set algebra (COMPOSE) of two Workspaces → a new Workspace handle | `operacion`, `id_espacio_a`, `id_espacio_b`, `nombre?`, `tipo_espacio?` |
| `leer_espacio` | Materialize a Workspace (READ) at a chosen resolution, paginated | `id_espacio`, `resolucion?`, `consulta?`, `limite?` |
| `refrescar_espacio` | Re-applies the Workspace's natural-language criteria and re-materializes its set (picks up newly qualifying documents) | `id_espacio` |
| `promover_espacio` | Promotes a temporary Workspace (AREA) to permanent (ESPACIO) | `id_espacio` |
| `ver_cola` | Current state of the processing pipeline | `proceso`, `estado`, `limite` |
| `ver_ejecuciones` | Skill execution history | `limite` |
| `catalogo` | User capabilities: available functions + LLM skills (RBAC-filtered) | `tipo?` (`FUNCIONES`\|`HABILIDADES`\|`TODO`) |
| `listar_habilidades` | Catalog of available LLM skills | — |
| `ver_habilidad` | Skill detail: prompt, model, output type | `codigo_habilidad` |
| `ejecutar_habilidad` | Queues execution over a workspace or document | `codigo_habilidad`, `id_espacio?`, `codigo_documento?` |
| `buscar_chunks` | Direct semantic search over the corpus | `consulta`, `limite?`, `min_similitud?`, `codigo_entidad?` |
| `preguntar` | Natural language question with full RAG (non-streaming) | `mensaje`, `codigo_funcion?`, `id_conversacion?`, `titulo?` |

**Always call `estado_sesion` first** to confirm the connection is valid.

### Document `estado` values

`CARGADO` · `METADATA` · `ESCANEADO` · `CHUNKEADO` · `VECTORIZADO` · `NO_ESCANEABLE` · `REVISAR`

### Opening a document on disk (`fs` block)

`listar_documentos` and `ver_documento` return an `fs` block so an agent that
runs **on the same machine where the documents live** can open the file on disk.
The `como_abrir` field tells the agent exactly what to do — read it and follow it.

The same `fs` block is attached **per document** when you retrieve *many* at once:
`leer_espacio(id_espacio, resolucion="manifiesto")` and the `espacio://{id}`
resource enumerate the documents of a Working Space (the set that indexes them),
and every item in the manifest carries its own `fs`. Retrieving one document or a
whole set follows the identical rule below — absolute paths open as-is, relative
paths get `$RAGFLY_ROOT` prepended. (Only the `manifiesto` resolution lists files;
`chunks`/`texto` return fragments, not file locations.)

```json
"fs": {
  "ruta_archivo": "/Users/you/Dropbox/RUFINO/CONCIERTOS/afiche.pdf",
  "ruta_es_absoluta": true,
  "carpeta_relativa": "RUFINO/CONCIERTOS",
  "nombre_archivo": "afiche.pdf",
  "como_abrir": "Abrir `ruta_archivo` directo (ya es absoluta)."
}
```

**Why two cases exist** — it depends on how the documents were loaded:

| Loaded via | `ruta_archivo` | `ruta_es_absoluta` | Agent action |
|---|---|---|---|
| **RAGfly Desktop** | real OS path (`/Users/...`, `C:\...`) | `true` | open it directly |
| **Web upload** (browser) | logical path `/​<root_folder>/sub/file` | `false` | prepend `$RAGFLY_ROOT` |

The browser's File System Access API never exposes the real disk path, so a
web-uploaded document is stored relative to the folder the user picked, with that
folder's name as the first segment (`/MisDocumentos/letras/cancion.txt`).

**The single rule the agent follows:**

1. `ruta_es_absoluta: true` → open `ruta_archivo` as-is. Done. (Desktop case — no
   config needed.)
2. `ruta_es_absoluta: false` → open `$RAGFLY_ROOT + ruta_archivo`. That's the
   web-upload case — set up `RAGFLY_ROOT` once, as follows.

#### Setting up `RAGFLY_ROOT` — once per machine, in 3 steps

`RAGFLY_ROOT` is a variable **you** define on the machine where the agent runs.
RAGfly never reads it and never stores it — it only tells *your agent* how to
turn the relative path RAGfly returns into a real path on *your* disk.

**Step 1 — find the value.** It is the **parent folder** of the folder you
selected when you uploaded your documents to RAGfly. Concrete example — Ana
uploaded the folder `MisDocumentos` from the web app:

```
/Users/ana/Dropbox            ← RAGFLY_ROOT = the PARENT of what she uploaded
└── MisDocumentos             ← the folder Ana picked in the web upload
    └── letras
        └── cancion.txt       ← RAGfly returns "/MisDocumentos/letras/cancion.txt"
```

So on Ana's machine:

```
RAGFLY_ROOT=/Users/ana/Dropbox
```

and the composition works out to:

```
RAGFLY_ROOT      +  ruta_archivo                      =  real path on disk
/Users/ana/Dropbox  /MisDocumentos/letras/cancion.txt    /Users/ana/Dropbox/MisDocumentos/letras/cancion.txt
```

**Step 2 — put it where your agent can read it.** Anywhere the agent can see the
value works; pick what matches your setup:

| Where your agent lives | Where to set it |
|---|---|
| Terminal, scripts, SDKs, CLI | Shell profile: `echo 'export RAGFLY_ROOT="/Users/ana/Dropbox"' >> ~/.zshrc` (macOS) or `~/.bashrc` (Linux) · Windows: `setx RAGFLY_ROOT "C:\Users\ana\Dropbox"` |
| Coding agent that reads a context file (Claude Code, Codex, Cursor…) | One line in your project's `CLAUDE.md` / `AGENTS.md`: ``RAGFLY_ROOT=/Users/ana/Dropbox`` |
| MCP client whose config supports env vars | The `env` block of the RAGfly entry in your MCP config |

**Step 3 — verify.** Take any document whose `fs` block says
`ruta_es_absoluta: false` and check the composed path exists:

```bash
ls "$RAGFLY_ROOT/MisDocumentos/letras/cancion.txt"   # should list the file
```

**When you DON'T need `RAGFLY_ROOT`:**

- Documents loaded via **RAGfly Desktop** — their paths are already absolute.
- Agents that only **search, ask and cite** — the indexed content is served from
  the cloud; `RAGFLY_ROOT` is only for opening the *original file* on disk.
- Agents running on a machine that doesn't have the files at all.

**Why it works this way:** the browser never exposes your real disk path, so
RAGfly stores only the relative path and never learns your disk layout
(privacy). And because the root stays out of the cloud, the same document
resolves on any machine — each one just sets its own `RAGFLY_ROOT`
(portability).

> Always `exists()`-check the resolved path before reading: Dropbox/cloud-synced
> folders or a different machine may not have the file present.

#### What to put in the client manual

- **Clients who load with RAGfly Desktop:** nothing. The agent opens files
  directly (`ruta_es_absoluta: true`). No `RAGFLY_ROOT`, no instructions.
- **Clients who upload via the browser:** one line — *"Set `RAGFLY_ROOT` to the
  parent folder of the folder you selected when uploading your documents (e.g.
  you uploaded `/Users/ana/Dropbox/MisDocumentos` → `RAGFLY_ROOT=/Users/ana/Dropbox`)."*
  That's the only special instruction the manual needs.

### Queue `estado` values

A document's queue lifecycle: `PENDIENTE` → `EN_PROCESO` → `COMPLETADO` / `ERROR`.

> You may occasionally see `WAITING`, a transient internal state used while an orchestrated step waits for its dependencies. Treat it like `EN_PROCESO` (in progress).

---

## Example flow (agent)

```
# 1. Verify connection
estado_sesion()
→ {"usuario": "bot-finance", "grupo": "COMPANY", "rol": "DOC-ADMIN"}

# 2. Ask over documents
preguntar(mensaje="What are the penalty clauses in the 2024 contracts?")
→ RAG response with chunk citations

# 3. List vectorized documents
listar_documentos(estado="VECTORIZADO", limite=10)

# 4. Execute a skill over a workspace
ejecutar_habilidad(codigo_habilidad="RESUMIR_DOCUMENTO", id_espacio=42)

# 5. Monitor progress
ver_cola(estado="EN_PROCESO")
```

---

## Permissions

Each tool operates in the context of the API Key's user — same RBAC as the web interface. An agent with role `DOCS-USUARIO-FINAL` can read but cannot execute skills.

---

## Troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `HTTP 401` before handshake | Invalid or revoked API Key | Check the key at [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) |
| Tools don't appear | Client not restarted | Restart the MCP client |
| `HTTP 403` on a tool | Role lacks permission for that operation | Ask the admin for a role with more permissions |

---

## Codex

Codex supports MCP via `codex mcp add`. Use the streamable_http endpoint:

```bash
codex mcp add ragfly \
  --url https://api.ragfly.ai/mcp-http/ \
  --bearer-token-env-var RAGFLY_API_KEY
```

See `QUICKSTART.md` for the full walkthrough with setup, test script, and case table.

### Practical differences

| Feature | Codex | Claude Code / Cursor |
|---|---|---|
| Setup | `codex mcp add` with `--bearer-token-env-var` | `.mcp.json` with URL + header |
| Tools | `mcp__ragfly__estado_sesion()` etc. | `mcp__ragfly__estado_sesion()` etc. |
| Authentication | `--bearer-token-env-var RAGFLY_API_KEY` | Declared in `.mcp.json` |
| Discovery | MCP protocol automatic | MCP protocol automatic |
