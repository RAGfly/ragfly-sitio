# RAGfly CLI

Install `ragfly-cli` 2.0.0 to operate RAGfly from a terminal or CI job:

```bash
pip install ragfly-cli
ragfly login
ragfly cloud me
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

Spanish command and flag spellings remain input-only compatibility aliases (for
example `documento listar` and `--estado`). They are not emitted in JSON or
required by the public contract.

## Examples

```bash
export RAGFLY_API_KEY=slm_live_xxxxxxxxxx

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
[MCP.md](MCP.md) for the optional `RAGFLY_ROOT` file-opening rule.
