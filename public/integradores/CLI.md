# RAGfly CLI

Install `ragfly-cli` 2.0.0 to operate RAGfly from a terminal or CI job:

```bash
pip install ragfly-cli
ragfly login
ragfly cloud me
ragfly cloud entity set 000057
ragfly cloud entity set --clear
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
    ├── entity      set [ENTITY_CODE] | set --clear
    ├── api-key     create | list | revoke
    ├── document    list | show | edges
    ├── space       list | show
    ├── queue       show | runs
    ├── skill       list | show | run
    ├── catalog
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
ragfly cloud search "active maintenance contracts" -o json
ragfly cloud skill run SUMMARIZE_DOCUMENT --space 42 -o json
ragfly cloud agent context --profile user_chat -o json
ragfly cloud chat ask "What is the renewal date?" -o json
```

Machine-readable output uses public keys such as `code`, `name`, `status`,
`space_id`, `skill_code`, `answer` and `conversation_id`. Standard failures use
the English REST error envelope.

## Authentication

Interactive login stores a JWT in the OS keyring. CI should use an API key via
`RAGFLY_API_KEY`. See [REST.md](REST.md) for the authorization header and
[MCP.md](MCP.md) for `fs.home_var` / `fs.relative_path` and local-file resolution.

A signed-in person issues API keys. A fixed-entity key cannot change focus.
A flexible key can select an authorized entity or clear focus with
`ragfly cloud entity set --clear`; `--release` remains a compatibility alias.
The server stores focus, so it persists across CLI invocations. See
[INTEGRATION.md](INTEGRATION.md#credentials) for the shared key contract.
