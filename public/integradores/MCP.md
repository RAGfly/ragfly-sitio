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
| `session` | Verifies the connection and returns the user context | — |
| `list_documents` | Lists group documents with filters | `status`, `limit`, `page` |
| `get_document` | Full detail of a document | `document_code` |
| `list_spaces` | Lists the group's Workspaces | `limit` |
| `get_space` | Workspace detail: criteria + documents + queue | `space_id`, `doc_limit` |
| `compose_spaces` | Set algebra (COMPOSE) of two Workspaces → a new Workspace handle | `operation`, `space_id_a`, `space_id_b`, `name?`, `space_type?` |
| `read_space` | Materialize a Workspace (READ) at a chosen resolution, paginated | `space_id`, `resolution?`, `query?`, `limit?` |
| `refresh_space` | Re-applies the Workspace's natural-language criteria and re-materializes its set (picks up newly qualifying documents) | `space_id` |
| `promote_space` | Promotes a temporary Workspace (AREA) to permanent (SPACE) | `space_id` |
| `queue` | Current state of the processing pipeline | `process`, `status`, `limit` |
| `list_runs` | Skill run history | `limit` |
| `catalog` | User capabilities: available functions + LLM skills (RBAC-filtered) | `type?` (`FUNCTIONS`\|`SKILLS`\|`ALL`) |
| `list_skills` | Catalog of available LLM skills | — |
| `get_skill` | Skill detail: prompt, model, output type | `skill_code` |
| `run_skill` | Queues a run over a workspace or document | `skill_code`, `space_id?`, `document_code?` |
| `search_documents` | Direct semantic search over the corpus | `query`, `limit?`, `min_similarity?`, `entity_code?` |
| `ask` | Natural language question with full RAG (non-streaming) | `message`, `function_code?`, `conversation_id?`, `title?` |
| `get_agent_context` | Authenticated layered prompt, identity, allowed tools and limits for Agentic Retrieval | `function_profile?` (`user_chat`\|`support_chat`) |
| `run_agent_tool` | Runs one tool from the current authenticated AgentContext | `public_name`, `arguments_json?`, `function_profile?` |

### English cutover and compatibility window

Release A (2026-08-09) publishes the English tools and keeps the following
legacy aliases temporarily: `session_status`→`session`, `get_queue`→`queue`,
`search_chunks`→`search_documents`, plus the existing Spanish aliases. The
aliases delegate to the same implementation and return the same English JSON;
they are input-only compatibility names, not a second contract.

The minimum compatible clients for the cutover are Python SDK `0.3.0`,
TypeScript SDK `0.3.0` and CLI `2.0.0`. Release B may remove the aliases after
the 14-day window closes on 2026-08-23, once connected clients and telemetry
have been checked. New integrations must use the canonical English names now.

**Always call `session` first** to confirm the connection is valid.

For **Retrieval**, call `search_documents` and let your agent reason over the
returned evidence. For **Agentic Retrieval**, call `get_agent_context`, use its
`system_prompt` and limits, and invoke only tools declared in `tools` through
`run_agent_tool`. Never cache or persist the prompt or credentials; campaign
artifacts should retain only `system_prompt_hash` and the per-layer hashes.

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
→ {"user": "bot-finance", "active_group": "COMPANY", "role": "DOC-ADMIN"}

# 2. Ask over documents
ask(message="What are the penalty clauses in the 2024 contracts?")
→ RAG response with chunk citations

# 3. List vectorized documents
list_documents(status="VECTORIZED", limit=10)

# 4. Run a skill over a workspace
run_skill(skill_code="SUMMARIZE_DOCUMENT", space_id=42)

# 5. Monitor progress
queue(status="IN_PROGRESS")
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
| Tools | `mcp__ragfly__session()` etc. | `mcp__ragfly__session()` etc. |
| Authentication | `--bearer-token-env-var RAGFLY_API_KEY` | Declared in `.mcp.json` |
| Discovery | MCP protocol automatic | MCP protocol automatic |
