---
status: live
last_updated: 2026-06-18
audience: external integrators — LLM agents
see_also:
  - INTEGRATION.md
  - REST.md
  - RUNTIME_HINTS.md
---

# RAGfly — MCP Interface

Connect any MCP-compatible LLM agent (Claude Code, Cursor, Cline, etc.) to your RAGfly group's documents and capabilities. The agent discovers tools automatically — no integration code required.

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

### Queue `estado` values

`PENDIENTE` · `EJECUTANDO` · `COMPLETADO` · `ERROR`

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
ver_cola(estado="EJECUTANDO")
```

---

## Local stdio mode (alternative)

If you already have the RAGfly client installed and need to operate on the local filesystem:

```bash
pip install ragfly
ragfly login
```

Config in `.claude/settings.json`:
```json
{
  "mcpServers": {
    "ragfly-local": {
      "command": "ragfly-mcp",
      "args": []
    }
  }
}
```

The local mode exposes the same tools but reads the JWT from `~/.ragfly/credentials.json`. Useful when the agent also needs to scan local directories with `ragfly local escanear`.

---

## Permissions

Each tool operates in the context of the API Key's user — same RBAC as the web interface. An agent with role `DOCS-USUARIO-FINAL` can read but cannot execute skills.

---

## Troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `HTTP 401` before handshake | Invalid or revoked API Key | Check the key at [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) |
| Tools don't appear | Client not restarted | Restart the MCP client |
| `estado_sesion` returns error | Expired JWT (local mode) | `ragfly login` |
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
