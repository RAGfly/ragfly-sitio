# RAGfly CLI

Install `ragfly-cli` 1.21.1 to operate RAGfly from a terminal or CI job:

```bash
pip install ragfly-cli
ragfly login
ragfly cloud me
ragfly cloud workspace set 000057
ragfly cloud workspace set --clear
ragfly cloud workspace unset
ragfly cloud area set FINANCE
ragfly cloud area set --release
```

Cloud commands call `/v1`; JSON output is the same English contract as REST and
MCP. Human table labels and errors are English too.

## Commands

```text
ragfly
├── login / logout / version
└── cloud
    ├── me
    ├── group       list | switch | clear
    ├── workspace   set [WORKSPACE_CODE] | set --clear | unset
    ├── area        set [AREA_CODE] | set --release | list
    ├── location    list
    ├── api-key     create | list | revoke
    ├── document    list | show | edges
    ├── collection  list | show | compose | read | refresh | save
    ├── queue       show | runs
    ├── skill       list | show | run
    ├── catalog
    ├── document-type  list
    ├── characteristic list
    ├── search
    ├── chat        ask
    └── agent       context | tool
```

Legacy command and flag spellings, where still accepted, are input-only
compatibility aliases. They are not part of the published contract, examples or
machine-readable output; use the English command and flag names shown here.

## Examples

```bash
export RAGFLY_API_KEY=rf_xxxxxxxxxx

ragfly cloud document list --status VECTORIZED --limit 20 -o json
ragfly cloud document show DOC-2024-001 -o json
ragfly cloud area list --limit 50 -o json
ragfly cloud location list --limit 50 -o json
ragfly cloud search "active maintenance contracts" --location LOC-DOCUMENTS -o json
ragfly cloud skill run SUMMARIZE_DOCUMENT --collection 42 -o json
ragfly cloud agent context --profile user_chat -o json
ragfly cloud chat ask "What is the renewal date?" --location LOC-DOCUMENTS -o json
ragfly cloud chat ask "How do I release the workspace focus of my key?" --mode help
ragfly cloud document-type list -o json
ragfly cloud search "statements" --filter @filter.json --collection 42 -o json
ragfly cloud collection compose difference 12 15 --name "Only in 12"
```

Machine-readable output uses public keys such as `code`, `name`, `status`,
`collection_id`, `skill_code`, `answer` and `conversation_id`. Standard failures use
the English REST error envelope.

## Authentication

Interactive login stores a JWT in the OS keyring. CI should use an API key via
`RAGFLY_API_KEY`. See [REST.md](REST.md) for the authorization header and
[MCP.md](MCP.md) for `fs.home_var` / `fs.relative_path` and local-file resolution.

A signed-in person issues API keys. A fixed-workspace key cannot change focus.
A flexible key can select an authorized workspace or clear focus with
`ragfly cloud workspace set --clear` or `ragfly cloud workspace unset` (needs `ragfly-cli` 2.1.0 or newer);
`--release` remains a compatibility alias.
The server stores focus, so it persists across CLI invocations. See
[INTEGRATION.md](INTEGRATION.md#credentials) for the shared key contract.

Area focus is also stored for API keys; releasing it keeps the current workspace.
Locations are temporary request filters. The `--location` flag on `search`,
`document list`, and `chat ask` narrows that request to a visible folder tree.
