# RAGfly — MCP Interface

Connect any MCP-compatible agent to your RAGfly group's documents and capabilities. RAGfly uses the same MCP endpoint and OAuth authorization flow across clients; setup instructions differ only where each client exposes its own MCP settings. A bearer API key remains available for clients and scripts that need manual credentials.

> **Opening original files from disk?** Searching, asking and citing need no
> extra setup. To resolve a local original, use the per-document `fs.home_var`
> and `fs.relative_path` fields. The root variable can differ for each document;
> `home_var: null` means there is no local root to resolve. See
> [Opening a document on disk](#opening-a-document-on-disk-fs-block).

## Prerequisite

For the recommended OAuth setup, sign in to RAGfly during the client authorization flow; you do not need to copy an API key into the MCP client. For clients that do not support MCP OAuth, use an API key for your group. See [INTEGRATION.md § Credentials](INTEGRATION.md).

Create and revoke manual API keys in the RAGfly web app's **API Keys** page. A
**fixed-entity**
key cannot change its entity through MCP. A **flexible** key can select an
authorized entity with `set_active_entity` or release focus by passing `null`;
RAGfly stores that focus on the server, so a new client using the same key sees
it. MCP `tools/list` discovers MCP tools; `list_operations` reports the separate
manifest operations allowed to the key.

MCP uses the same fixed English protocol as REST `/v1`: tool names, argument
and result fields, public catalog codes, fixed enums, and API-authored messages
and errors are English. OAuth discovery and protocol errors are English too;
the browser consent screen is a human flow and may use the person's locale.
Catalog values use their stored English aliases; if an alias is missing, the
adapter returns a safe English error instead of the internal value or exception
text. Document and tenant-authored content keeps its original language.

---

## ChatGPT web — private TEST pilot

RAGfly's dedicated ChatGPT MCP endpoint currently runs in TEST. It exposes only
`session` and `search_documents`; the server rejects other tools. A production
ChatGPT connection is not available yet. Do not configure the general
`/mcp-http/` endpoint in ChatGPT: that endpoint also offers write-capable tools.

The private pilot requires an eligible ChatGPT account, OAuth consent and a
synthetic TEST document approved for the trial. The pilot operator verifies
**Scan Tools** shows exactly the two read tools, checks a cited result and
revocation, and only then prepares production availability and a public setup
guide. Ask your RAGfly contact to join the pilot rather than entering a
production endpoint that has not been released.

When the pilot is available, a question sent through ChatGPT reaches RAGfly and
matching excerpts, document names and citations return to the ChatGPT
conversation. RAGfly may send the query and candidate excerpts to the configured
reranking provider. Revoking OAuth stops future requests but cannot remove text
already returned to ChatGPT. Review your workspace's data controls and the
provider terms before connecting sensitive documents.

---

## Connect from an MCP client with OAuth

Use this path when your client supports the MCP authorization flow. RAGfly's remote
Streamable HTTP endpoint is:

```text
https://api.ragfly.ai/mcp-http
```

The client discovers OAuth metadata, opens the RAGfly sign-in and consent page,
then stores the credential for later MCP calls. RAGfly records a revocable API
key with origin `OAUTH` and the role, area and entity you selected; review or
revoke it at [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys). When a
client sends an OAuth `resource`, it receives an opaque bearer token bound to
that MCP endpoint. The client does not need to inspect or transform it. OAuth
does not change the tools or RBAC available at the selected endpoint. The
credential follows its configured validity; RAGfly reports `expires_in` when
it has an expiration. OAuth refresh tokens are not currently issued, so the
client may need a new sign-in after expiration.

| Client | Add the server | Sign in |
|---|---|---|
| **Codex desktop app** | Settings → **Complementos** → **MCP** → **Agregar** → **Conectar con un MCP personalizado**. Enter a name, choose **HTTP secuenciable** (Streamable HTTP), and use the URL above. Labels may appear in English depending on the app language. | Continue and finish the browser sign-in and consent at RAGfly. |
| **Codex CLI** | `codex mcp add ragfly --url https://api.ragfly.ai/mcp-http` | `codex mcp login ragfly`; complete the browser flow. Check with `codex mcp list`. |
| **Claude.ai / Claude Desktop** | Settings → Connectors → Add custom connector; enter a name and the URL above. | Select **Connect** and finish the RAGfly browser flow. |
| **Claude Code** | `claude mcp add --transport http ragfly https://api.ragfly.ai/mcp-http` | Run `/mcp` and follow the sign-in prompt. |
| **Gemini CLI** | `gemini mcp add --transport http ragfly https://api.ragfly.ai/mcp-http` | Run `/mcp auth ragfly` and follow the browser flow. |
| **VS Code with GitHub Copilot** | Add an HTTP server to `.vscode/mcp.json` (example below), or use **MCP: Add Server** from the Command Palette. | Start the server and complete its OAuth prompt. This MCP path does not require an OpenAPI document. |
| **Cursor** | Add an HTTP server to `mcp.json` with the pre-registered client id shown below. | Start the server and complete the RAGfly browser flow. |

VS Code workspace example:

```json
{
  "servers": {
    "ragfly": {
      "type": "http",
      "url": "https://api.ragfly.ai/mcp-http"
    }
  }
}
```

Cursor example:

```json
{
  "mcpServers": {
    "ragfly": {
      "url": "https://api.ragfly.ai/mcp-http",
      "auth": { "CLIENT_ID": "ragfly-cursor" }
    }
  }
}
```

GitHub Copilot in VS Code and Microsoft 365 Copilot are separate integration
surfaces. VS Code connects directly to MCP. Copilot Studio can also add an MCP
server as an agent tool where that feature is available in the tenant and agent
harness; check its authentication flow in that environment. The separate
Microsoft 365 API-plugin route packages REST operations with an OpenAPI
description and a plugin manifest. OpenAPI is required for that API-plugin
route, not for connecting to MCP from VS Code or a Copilot Studio MCP tool. See
Microsoft's [MCP tool setup](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/tools-add-mcp-server)
and [API-plugin setup](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/build-api-plugins-existing-api).

### OAuth and API key setup are two options

OAuth is the easiest route for clients with a browser-based MCP login. Use the
existing [API-key setup](#quick-setup-manual-api-key) when a client
does not implement MCP OAuth, or when an automated process needs a secret from
its own secret store. Do not put a personal API key in a shared project config.

---

## Delegating this setup to an AI agent

Handing this page to an AI coding assistant (Claude, Codex, Cursor…) instead of
doing it by hand? Here is exactly where it needs you — nothing more.

**OAuth-capable client (the table above):** the agent can add the server to its
config by itself. The only manual part is the sign-in itself — the client opens
a browser and only you can complete that login and consent. The agent never
sees your password or the resulting key.

**Manual API key** (a client without OAuth, or an unattended process — a
scheduled job, a personal agent running headless): minting a key needs a live
human action in the web app, so the agent cannot do this one step. It should say
so plainly rather than ask for your password.
Your part:

1. Sign in at [app.ragfly.ai/api-keys](https://app.ragfly.ai/api-keys).
2. **New key.** Pick a role that grants only the actions it needs. For a bot
   identity instead of your own account, ask an administrator to create a
   `PERFIL` user for it first — that's the owner field in the same form.
3. Copy the `rf_…` value shown (once) and hand it to the agent.

Everything else from here — client config, role/area choice,
`session()`/`list_operations()` verification, troubleshooting — the agent can
do on its own.

---

## Quick setup (manual API key)

No installation required. Add to your MCP client:

### Claude Code — `.mcp.json` in your project

Export `RAGFLY_API_KEY` in the environment that starts Claude Code. Keep the
key out of `.mcp.json` and version control. Claude Code expands variables in
HTTP headers:

```json
{
  "mcpServers": {
    "ragfly": {
      "type": "http",
      "url": "https://api.ragfly.ai/mcp-http",
      "headers": {
        "Authorization": "Bearer ${RAGFLY_API_KEY}"
      }
    }
  }
}
```

For a user-wide installation, use `claude mcp add -s user` instead of placing
the file in a home directory. Restart Claude Code and check `claude mcp list`;
an unset key may leave the server configured but unable to authenticate.
Tools appear with the prefix `mcp__ragfly__`.

The Streamable HTTP endpoint is stateless: every request carries its own
`Authorization` header and the server keeps no session, so a server redeploy does not
drop your connection. It speaks MCP `2026-07-28` (one self-contained request, no
`initialize` handshake) and the earlier handshake revisions (`2025-11-25` and older);
the client picks.

### Cursor / Cline / other MCP clients

For an OAuth-capable HTTP client, use the Streamable HTTP URL above and follow
its authorization prompt. For an API-key setup, register the SSE URL and the
`Authorization` header as shown below; consult the client's documentation for
the exact config format.

---

## Available tools

| Tool | Description | Parameters |
|---|---|---|
| `session` | Verifies the connection and returns the user context | — |
| `set_active_entity` | Sets an authorized entity for a flexible key or releases focus with null; fixed keys cannot change entity | `entity_code` (string or null) |
| `list_operations` | What this key can do: every operation its RBAC allows, with `kind` and `confirm_required` | — |
| `get_operation` | One operation with its `input_schema` and `output_schema` | `code` |
| `run_operation` | Runs one operation. A `write_confirm` one only runs with `confirm=true`; otherwise it returns a preview | `code`, `input?`, `confirm?` |
| `list_documents` | Lists group documents with filters | `status`, `limit`, `page` |
| `get_document` | Full detail of a document | `document_code` |
| `document_edges` | Corpus-graph edges of a document: neighbors and documents at 2 hops | `document_code`, `neighbor_limit?` |
| `list_spaces` | Lists the group's Workspaces | `limit` |
| `get_space` | Workspace detail: criteria + documents + queue | `space_id`, `doc_limit` |
| `compose_spaces` | Set algebra (COMPOSE) of two Workspaces → a new Workspace handle | `operation`, `space_id_a`, `space_id_b`, `name?`, `space_type?` |
| `read_space` | Materialize a Workspace (READ) at a chosen resolution, paginated | `space_id`, `resolution?`, `query?`, `limit?` |
| `refresh_space` | Re-applies the Workspace's natural-language criteria and re-materializes its set (picks up newly qualifying documents) | `space_id` |
| `promote_space` | Promotes a temporary Workspace (AREA) to permanent (SPACE) | `space_id` |
| `wiki_index` | Index of the compiled-knowledge pages visible from the active area. **Not available to integrator keys today (403)** | `area_code?` |
| `wiki_page` | One compiled-knowledge page. **Not available to integrator keys today (403)** | `document_code` |
| `compile_space` | Compiles a Workspace (background job). The leaf skill must be one your access can run; the default public code is `COMPILE_PAGE` | `space_id`, `leaf_skill_code?` |
| `queue` | Current state of the processing pipeline | `process`, `status`, `limit` |
| `list_runs` | Skill run history | `limit` |
| `catalog` | User capabilities: available functions + LLM skills (RBAC-filtered) | `type?` (`FUNCTIONS`\|`SKILLS`\|`ALL`) |
| `list_skills` | LLM skills available to you (the same list as `catalog`) | — |
| `get_skill` | Skill detail: type and output; prompt and model only if your role administers skills | `skill_code` |
| `run_skill` | Queues a run over a workspace or document | `skill_code`, `space_id?`, `document_code?` |
| `search_documents` | Direct semantic search over the corpus | `query`, `limit?`, `min_similarity?`, `entity_code?` |
| `ask` | Natural language question with full RAG (non-streaming) | `message`, `function_code?`, `conversation_id?`, `title?` |
| `get_agent_context` | Authenticated layered prompt, identity, allowed tools and limits for Agentic Retrieval. Tool names are stable English identifiers; the available list and schemas depend on identity/profile | `function_profile?` (`user_chat`\|`support_chat`) |
| `run_agent_tool` | Runs one tool from the current authenticated AgentContext | `public_name`, `arguments_json?`, `function_profile?` |
| `get_organization` | Reads this tenant's profile and what is still missing | — |
| `update_organization` | Writes the profile. Needs an administrator of the group | `group_description?`, `group_system_prompt?`, `entity_description?`, `entity_system_prompt?` |
| `draft_organization` | Proposes the four profile texts from a source text. Does **not** save | `source_text` |
| `get_usage` | Plan quotas against what is already consumed | — |
| `list_conversations` | Conversation history; its ids feed `ask` | `function_code?`, `limit?` |
| `delete_conversation` | Deletes a conversation and its messages. Not reversible | `conversation_id` |
| `list_processes` | Process instances: support, requests, workspace jobs | `status?`, `process_type?`, `category?`, `mine?`, `only_open?`, `limit?`, `page?` |
| `get_process` | One process in full, with description and comments | `process_code` |
| `update_process` | Updates the fields the "My Processes" screen lets a person edit | `process_code`, `status?`, `priority?`, `name?`, `description?`, `comments?`, `assigned_to?`, `due_at?`, `finished_at?` |

### Setting up your organization — do this first

Four texts decide how well RAGfly serves you: a `description` and a `system_prompt`, at group and
at entity level. The system prompt is injected into **every skill with organization scope** — the
whole ingestion pipeline, not only chat — so a tenant that leaves them empty ingests and answers
worse than one that filled them in. Before the first load:

1. `get_organization` → if `missing` is not empty, there is work to do.
2. Read the customer's own website (**you** fetch it; RAGfly does not fetch URLs) and pass the text
   to `draft_organization`.
3. Review the draft — `description` is prose for humans, `system_prompt` is an instruction for the
   model — and send it with `update_organization`.

And before a large ingestion, `get_usage` says how much of each quota is left.

### Tool names

Only the English names in the table exist. Retired tool aliases are not part of
the public contract: calling one returns `Unknown tool`. The minimum compatible clients are
Python SDK `0.3.0`, TypeScript SDK `0.3.0` and CLI `2.0.0`.

**Always call `session` first** to confirm the connection is valid, then
`list_operations` to see what this key can do. Use `get_operation` for an
operation's schema and `run_operation` to run it; a `write_confirm` operation
returns a preview (`executed: false`) until you repeat the call with
`confirm=true` after the person agrees.

For **Retrieval**, call `search_documents` and let your agent reason over the
returned evidence. For **Agentic Retrieval**, call `get_agent_context`, use its
`system_prompt` and limits, and invoke only tools declared in `tools` through
`run_agent_tool`. Tool names are stable English public identifiers; names
backed by catalog entries derive from their `*_en` aliases. The available list
and argument schemas vary by identity/profile, so read them from the context at
run time and pass the returned `public_name` unchanged. Never cache or persist
the prompt or credentials; campaign artifacts should retain only
`system_prompt_hash` and the per-layer hashes.

### Document `status` values

`LOADED` · `METADATA` · `SCANNED` · `CHUNKED` · `VECTORIZED` · `NOT_SCANNABLE` · `REVIEW`

### Opening a document on disk (`fs` block)

Document and search results may include an `fs` object. Do not infer how to
open the source from `origin` or the shape of `path` alone. Follow this order:

1. `is_cloud_only: true`: the original remains in Google Drive or Dropbox.
   Never resolve the logical `path` locally. Use provider fields such as
   `source_id` or `source_url` when present and only with your own provider
   credentials.
2. `is_public_url: true` or `origin: "PUBLIC"`: open the public URL directly.
3. `is_absolute: true`: open `path` directly on the machine where it exists.
4. Otherwise, when `home_var` names an environment variable, read that
   variable and join its value with `relative_path`. The variable is generated
   per root, so a corpus with multiple roots can return different names.

Example: two documents can resolve against separate local roots:

```json
{
  "documents": [
    {"fs": {"home_var": "RAGFLY_HOME_442681", "relative_path": "Contracts/2026/a.pdf"}},
    {"fs": {"home_var": "RAGFLY_HOME_991203", "relative_path": "Legal/b.pdf"}}
  ]
}
```

Set each named variable on the machine running the agent:

```bash
export RAGFLY_HOME_442681="/Users/ana/Dropbox"
export RAGFLY_HOME_991203="/Volumes/Archive"
```

If `home_var` is `null`, empty, or its named variable is unset, there is no
local root for that document. Do not fall back to a global root or guess from
`path`. The document's indexed content remains available through RAGfly; use a
public URL or provider access when the `fs` object supplies one.

A local path example:

```json
{
  "fs": {
    "home_var": "RAGFLY_HOME_442681",
    "relative_path": "MyDocuments/lyrics/song.txt",
    "path": "/MyDocuments/lyrics/song.txt",
    "origin": "WEB",
    "is_absolute": false,
    "is_public_url": false,
    "is_cloud_only": false
  }
}
```

For this result, read `RAGFLY_HOME_442681` and append
`MyDocuments/lyrics/song.txt`. Check that the resolved path exists before
opening it. Keep this variable local to the agent's environment; RAGfly does
not read or store its value. See [ENV_VARS.md](ENV_VARS.md).

### Queue `status` values

A document's queue lifecycle: `PENDING` → `IN_PROGRESS` → `COMPLETED` / `ERROR`.

> You may occasionally see `WAITING`, a transient internal state used while an orchestrated step waits for its dependencies. Treat it like `IN_PROGRESS`.

---

## Example flow (agent)

```
# 1. Verify connection
session()
→ {"authenticated": true, "user": {"code": "bot-finance", "name": "Finance bot"},
   "active_group": "COMPANY", "active_entity": "COMPANY", "profile": "USER", ...}

# 2. What can this key do?
list_operations()
→ {"operations": [{"code": "documents.get", "kind": "read", ...}, ...], "total": 18}

# 3. Ask over documents
ask(message="What are the penalty clauses in the 2024 contracts?")
→ {"answer": "...", "conversation_id": 512, "message_id": 514, "user_message_id": 513}

# 4. List vectorized documents
list_documents(status="VECTORIZED", limit=10)

# 5. Run a skill over a workspace
run_skill(skill_code="SUMMARIZE_DOCUMENT", space_id=42)

# 6. Monitor progress
queue(status="IN_PROGRESS")
```

---

## Permissions

Each tool operates in the context of the API key's user — same RBAC as the web interface. `list_operations` and `catalog` show what the key can reach; a tool outside that reach fails with a `403` in the tool error. Role identifiers are not returned by the public interface; use the available operations to understand the key's access.

---

## Troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `HTTP 401` before handshake | Invalid or revoked API Key | Check the key at [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) |
| Tools don't appear | Client not restarted | Restart the MCP client |
| `HTTP 403` on a tool | Role lacks permission for that operation | Check `list_operations`; ask the admin for a role with more permissions |
| `Unknown tool: …` | The requested name is not in the current public tool list | Use the names in the table above |
| `HTTP 404` on a request of an open session | Only on the legacy SSE URL (`/mcp/sse`): its session lives in the server process and is lost on a redeploy | Reconnect, or switch to the Streamable HTTP URL, which keeps no session |

---

## Codex

Codex supports both OAuth and bearer API-key authentication for remote MCP.
In the desktop app, use **Settings → Complementos → MCP → Agregar → Conectar
con un MCP personalizado**, select **HTTP secuenciable**, and enter
`https://api.ragfly.ai/mcp-http`. The browser sign-in creates and stores the
RAGfly credential for this MCP connection.

The CLI can configure and authorize the same remote endpoint:

```bash
codex mcp add ragfly --url https://api.ragfly.ai/mcp-http
codex mcp login ragfly
codex mcp list
```

For legacy API-key authentication, use:

```bash
codex mcp add ragfly \
  --url https://api.ragfly.ai/mcp-http \
  --bearer-token-env-var RAGFLY_API_KEY
```

See [QUICKSTART.md](QUICKSTART.md) for the full walkthrough and direct REST alternative.

### Practical differences

| Feature | Codex | Claude Code / Cursor |
|---|---|---|
| Setup | OAuth in the desktop app or `codex mcp add` + `codex mcp login` | OAuth in supported clients; otherwise config with URL + header |
| Tools | `mcp__ragfly__session()` etc. | `mcp__ragfly__session()` etc. |
| Authentication | Browser OAuth or `--bearer-token-env-var RAGFLY_API_KEY` | Browser OAuth or client-specific bearer header |
| Discovery | MCP protocol automatic | MCP protocol automatic |
