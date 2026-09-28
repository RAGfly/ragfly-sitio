# RAGfly — MCP Interface

Connect any MCP-compatible agent to your RAGfly group's documents and capabilities. RAGfly uses the same MCP endpoint and OAuth authorization flow across clients; setup instructions differ only where each client exposes its own MCP settings. A bearer API key remains available for clients and scripts that need manual credentials.

> **Opening original files from disk?** Searching, asking and citing need zero
> extra config. Only if your agent must open the **original file** on disk
> (web-uploaded documents) you set one variable, `RAGFLY_ROOT`, once per machine.
> Clear walkthrough with an example:
> [§ Setting up `RAGFLY_ROOT`](#setting-up-ragfly_root--once-per-machine-in-3-steps).

---

## Prerequisite

For the recommended OAuth setup, sign in to RAGfly during the client authorization flow; you do not need to copy an API key into the MCP client. For clients that do not support MCP OAuth, use an API key for your group. See [INTEGRATION.md § Credentials](INTEGRATION.md).

---

## Connect from an MCP client with OAuth

Use this path when your client supports the MCP authorization flow. RAGfly's remote
Streamable HTTP endpoint is:

```text
https://api.ragfly.ai/mcp-http
```

The client discovers OAuth metadata, opens the RAGfly sign-in and consent page,
then stores the credential for later MCP calls. The resulting credential is a
normal RAGfly `rf_` API key with the role, area and entity you selected; it is
recorded with origin `OAUTH` and can be reviewed or revoked at
[`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys). OAuth changes how the
credential is delivered. It does not change the MCP tools or their RBAC.

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
human web session (`POST /auth/api-key` requires one), so the agent cannot do
this one step. It should say so plainly rather than ask for your password.
Your part:

1. Sign in at [app.ragfly.ai/api-keys](https://app.ragfly.ai/api-keys).
2. **New key.** Pick a role (`DOCS-USUARIO-FINAL` if it only reads). For a bot
   identity instead of your own account, ask an administrator to create a
   `PERFIL` user for it first — that's the owner field in the same form.
3. Copy the `rf_…` value shown (once) and hand it to the agent.

Everything else from here — client config, role/area choice,
`session()`/`list_operations()` verification, troubleshooting — the agent can
do on its own.

---

## Quick setup (manual API key)

No installation required. Add to your MCP client:

### Claude Code — `.mcp.json` (project) or `~/.mcp.json` (global)

**SSE** (compatible with all clients):
```json
{
  "mcpServers": {
    "ragfly": {
      "url": "https://api.ragfly.ai/mcp/sse",
      "headers": {
        "Authorization": "Bearer rf_xxxxxxxxxx"
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
      "url": "https://api.ragfly.ai/mcp-http",
      "headers": {
        "Authorization": "Bearer rf_xxxxxxxxxx"
      }
    }
  }
}
```

Restart your client. Tools appear with the prefix `mcp__ragfly__`.

The streamable session lives in the server process. If a call answers `404` for the
session (the server was redeployed), open a new session; compliant MCP clients do it
on their own.

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
| `compile_space` | Compiles a Workspace (background job). The leaf skill must be one your role can run; the default page compiler is internal and answers 404 | `space_id`, `leaf_skill_code?` |
| `queue` | Current state of the processing pipeline | `process`, `status`, `limit` |
| `list_runs` | Skill run history | `limit` |
| `catalog` | User capabilities: available functions + LLM skills (RBAC-filtered) | `type?` (`FUNCTIONS`\|`SKILLS`\|`ALL`) |
| `list_skills` | LLM skills available to you (the same list as `catalog`) | — |
| `get_skill` | Skill detail: type and output; prompt and model only if your role administers skills | `skill_code` |
| `run_skill` | Queues a run over a workspace or document | `skill_code`, `space_id?`, `document_code?` |
| `search_documents` | Direct semantic search over the corpus | `query`, `limit?`, `min_similarity?`, `entity_code?` |
| `ask` | Natural language question with full RAG (non-streaming) | `message`, `function_code?`, `conversation_id?`, `title?` |
| `get_agent_context` | Authenticated layered prompt, identity, allowed tools and limits for Agentic Retrieval. The tools it lists follow the web chat and can change | `function_profile?` (`user_chat`\|`support_chat`) |
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

Only the English names in the table exist. The transitional aliases
(`session_status`, `get_queue`, `search_chunks`) and the Spanish ones were
removed: calling them returns `Unknown tool`. The minimum compatible clients are
Python SDK `0.3.0`, TypeScript SDK `0.3.0` and CLI `2.0.0`.

**Always call `session` first** to confirm the connection is valid, then
`list_operations` to see what this key can do. Use `get_operation` for an
operation's schema and `run_operation` to run it; a `write_confirm` operation
returns a preview (`executed: false`) until you repeat the call with
`confirm=true` after the person agrees.

For **Retrieval**, call `search_documents` and let your agent reason over the
returned evidence. For **Agentic Retrieval**, call `get_agent_context`, use its
`system_prompt` and limits, and invoke only tools declared in `tools` through
`run_agent_tool`. Those tools are the web chat's own: their names and
parameters follow the chat and can change, so read them from the context at run
time instead of hard-coding them. Never cache or persist the prompt or
credentials; campaign artifacts should retain only `system_prompt_hash` and the
per-layer hashes.

### Document `status` values

`LOADED` · `METADATA` · `SCANNED` · `CHUNKED` · `VECTORIZED` · `NOT_SCANNABLE` · `REVIEW`

### Opening a document on disk (`fs` block)

`list_documents` and `get_document` return an `fs` block so an agent that
runs **on the same machine where the documents live** can open the file on disk.
The `how_to_open` field tells the agent exactly what to do — read it and follow it.

The same `fs` block is attached **per document** when you retrieve *many* at once:
`read_space(space_id, resolution="manifest")` and the `space://{id}`
resource enumerate the documents of a Working Space (the set that indexes them),
and every item in the manifest carries its own `fs`. Retrieving one document or a
whole set follows the identical rule below. (Only the `manifest` resolution lists
files; `chunks`/`text` return fragments, not file locations.)

```json
"fs": {
  "path": "/Users/you/Dropbox/RUFINO/CONCERTS/poster.pdf",
  "origin": "DESKTOP",
  "is_absolute": true,
  "is_public_url": false,
  "relative_folder": "RUFINO/CONCERTS",
  "file_name": "poster.pdf",
  "how_to_open": "Open `path` directly (it is already absolute)."
}
```

**Why these cases exist** — it depends on how the documents were loaded. Check
`is_cloud_only` first, then read `origin`; never guess from the shape of the string:

| Loaded via | `origin` | `path` | Agent action |
|---|---|---|---|
| **RAGfly Desktop** | `DESKTOP` | real OS path (`/Users/...`, `C:\...`) | open it directly |
| **Web upload** (browser) | `WEB` | logical path `/​<root_folder>/sub/file` | prepend `$RAGFLY_ROOT` |
| **Public source** | `PUBLIC` | full URL (`https://...`) | open the URL as-is |
| **Google Drive** | usually `WEB` | connector logical path | `is_cloud_only: true`; fetch with `source_id` instead of `RAGFLY_ROOT` |
| **Dropbox** | usually `WEB` | connector logical path | `is_cloud_only: true`; fetch with `source_id` instead of `RAGFLY_ROOT` |

The browser's File System Access API never exposes the real disk path, so a
web-uploaded document is stored relative to the folder the user picked, with that
folder's name as the first segment (`/MyDocuments/lyrics/song.txt`).

A **public source** is a document captured from an official public URL (a law, a
regulation, an agency circular). Its location *is* the citable address of the
original, so it needs no local disk access at all — and prepending `$RAGFLY_ROOT`
to it would break it.

**The single rule the agent follows:** Check `is_cloud_only` before `origin`.

1. `is_cloud_only: true` → never open `path` and never prepend `RAGFLY_ROOT`
   (it is only a logical citation path, not resolvable to a real one). The
   original lives with the named `ingestion_source` (`GOOGLE_DRIVE` or
   `DROPBOX`). Two sub-cases, both read from `how_to_open`:
   - **`source_id` present** (document indexed after the connector started
     capturing provider ids) → the original is fetchable with **your own**
     provider credentials — `files/download` with `{"path": source_id}` for
     Dropbox (the id survives renames), `files.get(fileId=source_id,
     alt='media')` for Drive — or by opening `source_url` in a browser
     session that has access to it. RAGfly never sees or stores that
     credential; its own indexed content and citations remain usable without
     one.
   - **`source_id` absent** (document indexed before that, or the connector
     scan hasn't re-run) → no original to fetch; rely on RAGfly's indexed
     content and citations.
2. `origin: "PUBLIC"` (or `is_public_url: true`) → open `path` as-is. It is a
   URL, not a file path. Never prepend anything.
3. `origin: "DESKTOP"` (`is_absolute: true`) → open `path` as-is. Done. (No
   config needed.)
4. `origin: "WEB"` and `is_cloud_only: false` → open `$RAGFLY_ROOT + path`.
   That's the web-local-folder upload case —
   set up `RAGFLY_ROOT` once, as follows.

#### Cloud connector originals (`source_id` / `source_path` / `source_url`)

```json
"fs": {
  "path": "/CompanyDocs/finance/tax-2026.pdf",
  "origin": "WEB",
  "is_absolute": false,
  "is_public_url": false,
  "is_cloud_only": true,
  "ingestion_source": "DROPBOX",
  "source_id": "id:a1B2c3D4e5F6",
  "source_path": "/team/finance/tax-2026.pdf",
  "source_url": "https://www.dropbox.com/home/team/finance?preview=tax-2026.pdf",
  "how_to_open": "The original lives in Dropbox. Fetch it with your OWN Dropbox credentials: `files/download` with `{\"path\": source_id}` (the id survives renames), or open `source_url` in a browser session with access. RAGfly's indexed content and citations remain available without any provider credential."
}
```

`source_id` is the provider's **stable** id (Dropbox `id:…`, Drive `fileId`) —
unlike `source_path`, it survives renames and moves. It is only present for
documents ingested after the connector started capturing it; older rows omit
all three `source_*` fields and `how_to_open` falls back to the no-original text
above. No RAGfly credential unlocks the original — fetching it always requires
**your own** Dropbox/Drive credential, kept entirely on your side. This is the
cloud-connector counterpart of `RAGFLY_ROOT`: instead of a path prefix you
configure once, it is a provider id RAGfly hands you per document.

> `is_absolute` means "already an openable OS path". A public URL is **not**
> absolute in that sense: it comes as `is_absolute: false` **and**
> `is_public_url: true`. Check `origin` first — it is unambiguous.

#### Setting up `RAGFLY_ROOT` — once per machine, in 3 steps

`RAGFLY_ROOT` is a variable **you** define on the machine where the agent runs.
RAGfly never reads it and never stores it — it only tells *your agent* how to
turn the relative path RAGfly returns into a real path on *your* disk.

**Step 1 — find the value.** It is the **parent folder** of the folder you
selected when you uploaded your documents to RAGfly. Concrete example — Ana
uploaded the folder `MyDocuments` from the web app:

```
/Users/ana/Dropbox            ← RAGFLY_ROOT = the PARENT of what she uploaded
└── MyDocuments               ← the folder Ana picked in the web upload
    └── lyrics
        └── song.txt          ← RAGfly returns "/MyDocuments/lyrics/song.txt"
```

So on Ana's machine:

```
RAGFLY_ROOT=/Users/ana/Dropbox
```

and the composition works out to:

```
RAGFLY_ROOT      +  path                          =  real path on disk
/Users/ana/Dropbox  /MyDocuments/lyrics/song.txt     /Users/ana/Dropbox/MyDocuments/lyrics/song.txt
```

**Step 2 — put it where your agent can read it.** Anywhere the agent can see the
value works; pick what matches your setup:

| Where your agent lives | Where to set it |
|---|---|
| Terminal, scripts, SDKs, CLI | Shell profile: `echo 'export RAGFLY_ROOT="/Users/ana/Dropbox"' >> ~/.zshrc` (macOS) or `~/.bashrc` (Linux) · Windows: `setx RAGFLY_ROOT "C:\Users\ana\Dropbox"` |
| Coding agent that reads a context file (Claude Code, Codex, Cursor…) | One line in your project's `CLAUDE.md` / `AGENTS.md`: ``RAGFLY_ROOT=/Users/ana/Dropbox`` |
| MCP client whose config supports env vars | The `env` block of the RAGfly entry in your MCP config |

**Step 3 — verify.** Take any document whose `fs` block says
`is_absolute: false` and check the composed path exists:

```bash
ls "$RAGFLY_ROOT/MyDocuments/lyrics/song.txt"   # should list the file
```

**When you DON'T need `RAGFLY_ROOT`:**

- Documents loaded via **RAGfly Desktop** — their paths are already absolute.
- Documents fed through **Google Drive or Dropbox** — their originals remain
  with the provider. `is_cloud_only: true` means never resolve their logical
  path against a local root.
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
  directly (`is_absolute: true`). No `RAGFLY_ROOT`, no instructions.
- **Clients who upload via the browser:** one line — *"Set `RAGFLY_ROOT` to the
  parent folder of the folder you selected when uploading your documents (e.g.
  you uploaded `/Users/ana/Dropbox/MyDocuments` → `RAGFLY_ROOT=/Users/ana/Dropbox`)."*
  That's the only special instruction the manual needs.

### Queue `status` values

A document's queue lifecycle: `PENDING` → `IN_PROGRESS` → `COMPLETED` / `ERROR`.

> You may occasionally see `WAITING`, a transient internal state used while an orchestrated step waits for its dependencies. Treat it like `IN_PROGRESS`.

---

## Example flow (agent)

```
# 1. Verify connection
session()
→ {"authenticated": true, "user": {"code": "bot-finance", "name": "Finance bot"},
   "active_group": "COMPANY", "active_entity": "COMPANY", "roles": ["DOCS-USUARIO-FINAL"], ...}

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

Each tool operates in the context of the API Key's user — same RBAC as the web interface. `list_operations` and `catalog` show what the key can reach; a tool outside that reach fails with a `403` in the tool error. For instance, a `DOCS-USUARIO-FINAL` key of a standard user cannot read the processing queue.

---

## Troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `HTTP 401` before handshake | Invalid or revoked API Key | Check the key at [`app.ragfly.ai/api-keys`](https://app.ragfly.ai/api-keys) |
| Tools don't appear | Client not restarted | Restart the MCP client |
| `HTTP 403` on a tool | Role lacks permission for that operation | Check `list_operations`; ask the admin for a role with more permissions |
| `Unknown tool: …` | An old tool name (`estado_sesion`, `search_chunks`, …) | Use the names in the table above |
| `HTTP 404` on a request of an open session | The MCP session expired or was lost | Reconnect. Clients that follow the MCP spec start a new session on their own |

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
