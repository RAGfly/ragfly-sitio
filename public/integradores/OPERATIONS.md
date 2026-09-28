# Operations reference

> Generated from `backend/baselines/agent_surface/parity_manifest.json` by
> `backend/scripts/generar_referencia_operaciones.py`. Do not edit by hand.

Besides its named routes, `/v1` runs **every operation of the RAGfly application** through
one generic executor, with the same permissions as the web app. What a key can run depends
on its role: `GET /v1/operations` lists only what that key can run, and this page lists
everything that exists.

## Call any operation, on any surface

| Surface | List | Detail (input and output schema) | Run |
|---|---|---|---|
| REST | `GET /v1/operations` | `GET /v1/operations/{code}` | `POST /v1/operations/{code}:execute` with `{"input": {…}, "confirm": false}` |
| MCP | `list_operations` | `get_operation(code)` | `run_operation(code, input, confirm)` |
| CLI | `ragfly cloud operation list` | `ragfly cloud operation show CODE` | `ragfly cloud operation run CODE --input-json '{…}' [--confirm]` |
| Python SDK | `client.list_operations()` | `client.get_operation(code)` | `client.run_operation(code, input, confirm=False)` |
| TypeScript SDK | `client.listOperations()` | `client.getOperation({ code })` | `client.runOperation({ code, input, confirm })` |

Kinds:

- `read` does not change anything;
- `write` changes data;
- `write_confirm` (deletes, reverts, resets) does nothing unless `confirm` is true. Without
  it, the answer is `{"executed": false, "preview": …}`.

Field names are English. Catalog values (statuses, types) still travel as the web app uses
them: check `document_statuses.list` before filtering by status.

## Operations (108: 41 read, 50 write, 17 write_confirm)

*Minimum profile* is the lowest access level of the screens that use the operation;
the key's role must also include one of those screens.

### `applications`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `applications.list` | read | ADMINISTRATOR | `MANAGE_USERS` |

### `areas`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `areas.add_location` | write | ADMINISTRATOR | `MANAGE_ENTITIES` |
| `areas.create` | write | ADMINISTRATOR | `MANAGE_ENTITIES` |
| `areas.delete` | write_confirm | ADMINISTRATOR | `MANAGE_ENTITIES` |
| `areas.list` | read | USER | `API_KEYS`, `MANAGE_ENTITIES`, `MANAGE_USERS`, `WORKSPACES` |
| `areas.list_locations` | read | ADMINISTRATOR | `MANAGE_ENTITIES` |
| `areas.remove_location` | write_confirm | ADMINISTRATOR | `MANAGE_ENTITIES` |
| `areas.update` | write | ADMINISTRATOR | `MANAGE_ENTITIES` |

### `audit`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `audit.list` | read | ADMINISTRATOR | `AUDIT_USERS`, `SECURITY-DASHBOARD` |

### `document_statuses`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `document_statuses.list` | read | ADMINISTRATOR | `DOCS_DASHBOARD` |

### `document_types`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `document_types.add_category` | write | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |
| `document_types.add_feature` | write | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |
| `document_types.create` | write | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES`, `GROUP_DOCUMENT_TYPES` |
| `document_types.delete` | write_confirm | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES`, `GROUP_DOCUMENT_TYPES` |
| `document_types.get_boundary` | read | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |
| `document_types.get_impact` | read | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |
| `document_types.list` | read | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |
| `document_types.list_categories` | read | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |
| `document_types.list_features` | read | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |
| `document_types.remove_category` | write_confirm | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |
| `document_types.remove_feature` | write_confirm | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |
| `document_types.set_boundary` | write | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |
| `document_types.summary_by_entity` | read | ADMINISTRATOR | `GROUP_DOCUMENT_TYPES` |
| `document_types.update` | write | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES`, `GROUP_DOCUMENT_TYPES` |
| `document_types.update_category` | write | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |
| `document_types.update_feature` | write | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |

### `documents`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `documents.count_by_status` | read | ADMINISTRATOR | `DOCS_DASHBOARD`, `PROCESS_DOCUMENTS`, `PROCESS_PIPELINE` |
| `documents.delete` | write_confirm | USER | `DOCUMENTS`, `PROCESS_DOCUMENTS` |
| `documents.get` | read | USER | `DOCUMENTS` |
| `documents.get_chunks` | read | USER | `DOCUMENTS` |
| `documents.get_features` | read | USER | `DOCUMENTS` |
| `documents.list` | read | USER | `DOCS_DASHBOARD`, `DOCUMENTS`, `PROCESS_DOCUMENTS` |
| `documents.report_missing` | write_confirm | ADMINISTRATOR | `PROCESS_DOCUMENTS` |
| `documents.revert` | write_confirm | USER | `DOCUMENTS`, `PROCESS_DOCUMENTS` |
| `documents.set_ingestion_order` | write | ADMINISTRATOR | `PROCESS_DOCUMENTS` |

### `entities`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `entities.create` | write | ADMINISTRATOR | `MANAGE_ENTITIES` |
| `entities.delete` | write_confirm | ADMINISTRATOR | `MANAGE_ENTITIES` |
| `entities.get_dependencies` | read | ADMINISTRATOR | `MANAGE_ENTITIES` |
| `entities.list` | read | ADMINISTRATOR | `MANAGE_ENTITIES`, `MANAGE_USERS`, `SECURITY-DASHBOARD` |
| `entities.update` | write | ADMINISTRATOR | `MANAGE_ENTITIES` |

### `feature_categories`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `feature_categories.generate_md` | write | ADMINISTRATOR | `DOC_FEATURE_CATEGORIES` |

### `functions`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `functions.get` | read | USER | `AUDIT_USERS`, `CHAT-USER`, `DOCS_DASHBOARD`, `MANAGE_GROUP_PROCESSES`, `SECURITY-DASHBOARD`, `SUBSCRIPTION_CANCELLATIONS` |

### `group_processes`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `group_processes.create` | write | ADMINISTRATOR | `MANAGE_GROUP_PROCESSES` |
| `group_processes.delete` | write_confirm | ADMINISTRATOR | `MANAGE_GROUP_PROCESSES` |
| `group_processes.list` | read | ADMINISTRATOR | `MANAGE_GROUP_PROCESSES` |
| `group_processes.reorder` | write | ADMINISTRATOR | `MANAGE_GROUP_PROCESSES` |
| `group_processes.update` | write | ADMINISTRATOR | `MANAGE_GROUP_PROCESSES` |

### `group_tasks`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `group_tasks.create` | write | ADMINISTRATOR | `MANAGE_GROUP_TASKS` |
| `group_tasks.delete` | write_confirm | ADMINISTRATOR | `MANAGE_GROUP_TASKS` |
| `group_tasks.list` | read | ADMINISTRATOR | `MANAGE_GROUP_TASKS` |
| `group_tasks.reorder` | write | ADMINISTRATOR | `MANAGE_GROUP_TASKS` |
| `group_tasks.update` | write | ADMINISTRATOR | `MANAGE_GROUP_TASKS` |

### `groups`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `groups.update` | write | ADMINISTRATOR | `MANAGE_ENTITIES` |
| `groups.update_parameters` | write | ADMINISTRATOR | `MANAGE_ENTITIES` |

### `ingestion_runs`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `ingestion_runs.advance` | write | ADMINISTRATOR | `PROCESS_PIPELINE` |
| `ingestion_runs.cancel` | write_confirm | ADMINISTRATOR | `PROCESS_PIPELINE` |
| `ingestion_runs.start` | write | ADMINISTRATOR | `PROCESS_PIPELINE` |

### `locations`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `locations.create` | write | ADMINISTRATOR | `DOC_LOCATIONS` |
| `locations.delete` | write_confirm | ADMINISTRATOR | `DOC_LOCATIONS`, `PROCESS_PIPELINE` |
| `locations.generate_md` | write | ADMINISTRATOR | `DOC_LOCATIONS` |
| `locations.get_acquisition_skill` | read | ADMINISTRATOR | `DOC_LOCATIONS` |
| `locations.list` | read | USER | `CHAT-USER`, `DOC_LOCATIONS`, `MANAGE_ENTITIES`, `PROCESS_DOCUMENTS`, `PROCESS_PIPELINE` |
| `locations.materialize_web` | write | ADMINISTRATOR | `DOC_LOCATIONS` |
| `locations.preview_delete` | read | ADMINISTRATOR | `DOC_LOCATIONS`, `PROCESS_PIPELINE` |
| `locations.rebuild_hierarchy` | write | ADMINISTRATOR | `DOC_LOCATIONS` |
| `locations.research_web` | write | ADMINISTRATOR | `DOC_LOCATIONS` |
| `locations.review_web` | write | ADMINISTRATOR | `DOC_LOCATIONS` |
| `locations.sync` | write | ADMINISTRATOR | `DOC_LOCATIONS`, `PROCESS_PIPELINE` |
| `locations.update` | write | ADMINISTRATOR | `DOC_LOCATIONS`, `PROCESS_PIPELINE` |

### `parameter_categories`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `parameter_categories.list` | read | ADMINISTRATOR | `MANAGE_GROUP_PARAMS` |

### `parameter_types`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `parameter_types.list` | read | ADMINISTRATOR | `MANAGE_GROUP_PARAMS` |

### `parameters`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `parameters.list_group` | read | ADMINISTRATOR | `MANAGE_GROUP_PARAMS` |
| `parameters.update_group` | write | ADMINISTRATOR | `MANAGE_GROUP_PARAMS` |

### `pipeline_runs`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `pipeline_runs.list` | read | ADMINISTRATOR | `PROCESS_DOCUMENTS`, `PROCESS_PIPELINE` |
| `pipeline_runs.update` | write | ADMINISTRATOR | `PROCESS_DOCUMENTS` |

### `processes`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `processes.delete` | write_confirm | USER | `PROFILE_PROCESS` |
| `processes.get` | read | USER | `PROFILE_PROCESS` |
| `processes.list` | read | USER | `PROFILE_PROCESS` |
| `processes.profile_dashboard` | read | USER | `PROFILE_PROCESS` |
| `processes.reorder` | write | USER | `PROFILE_PROCESS` |
| `processes.update` | write | USER | `PROFILE_PROCESS` |

### `queue`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `queue.batch_status` | read | ADMINISTRATOR | `PROCESS_DOCUMENTS` |
| `queue.list_orphans` | read | ADMINISTRATOR | `PROCESS_PIPELINE` |
| `queue.list_run` | read | ADMINISTRATOR | `PROCESS_DOCUMENTS` |
| `queue.pipeline_summary` | read | ADMINISTRATOR | `DOCS_DASHBOARD`, `PROCESS_PIPELINE` |
| `queue.process_batch` | write | ADMINISTRATOR | `PROCESS_DOCUMENTS`, `PROCESS_PIPELINE` |
| `queue.resolve_llm_alerts` | write | ADMINISTRATOR | `PROCESS_PIPELINE` |

### `roles`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `roles.list` | read | ADMINISTRATOR | `API_KEYS`, `MANAGE_USERS`, `SECURITY-DASHBOARD` |

### `session`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `session.set_active_entity` | write | USER | `SESSION` |

### `spaces`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `spaces.create` | write | USER | `WORKSPACES` |
| `spaces.delete` | write_confirm | USER | `WORKSPACES` |
| `spaces.list` | read | USER | `CHAT-USER`, `WORKSPACES` |
| `spaces.list_documents` | read | USER | `WORKSPACES` |
| `spaces.promote` | write | USER | `WORKSPACES` |
| `spaces.reapply_skill` | write | USER | `WORKSPACES` |
| `spaces.refresh` | write | USER | `WORKSPACES` |
| `spaces.set_criteria` | write | USER | `WORKSPACES` |
| `spaces.update` | write | USER | `WORKSPACES` |

### `users`

| Operation | Kind | Minimum profile | Screens |
|---|---|---|---|
| `users.add_entity` | write | ADMINISTRATOR | `MANAGE_USERS` |
| `users.add_role` | write | ADMINISTRATOR | `MANAGE_USERS` |
| `users.create` | write | ADMINISTRATOR | `MANAGE_USERS` |
| `users.delete` | write_confirm | ADMINISTRATOR | `MANAGE_USERS` |
| `users.list` | read | ADMINISTRATOR | `MANAGE_USERS` |
| `users.list_entities` | read | ADMINISTRATOR | `MANAGE_USERS` |
| `users.list_roles` | read | ADMINISTRATOR | `MANAGE_USERS` |
| `users.remove_entity` | write_confirm | ADMINISTRATOR | `MANAGE_USERS` |
| `users.reorder_roles` | write | ADMINISTRATOR | `MANAGE_USERS` |
| `users.update` | write | ADMINISTRATOR | `MANAGE_USERS` |

## Not published, and why (34)

These parts of the application do not cross to agents. A person does them in the web app,
or they are already available under another name.

| Why | Screens | Operations |
|---|---|---|
| Plan changes, purchases and cancellations move money or a contract: a person does them in the web app. | `PAYMENT_METHODS`, `SUBSCRIPTION_CANCELLATIONS` | 10 |
| An agent credential does not manage credentials (API keys). | `API_KEYS`, `SECURITY-DASHBOARD` | 5 |
| Connector secrets need a person's session. | — | 4 |
| Ingestion steps driven by the web app's session. How an agent drives them is still to be decided. | `PROCESS_DOCUMENTS`, `PROCESS_PIPELINE` | 4 |
| Already published as `GET /v1/organization`. | `MANAGE_ENTITIES` | 1 |
| Already published as `GET /v1/skills`. | `PROCESS_PIPELINE` | 1 |
| Already published as `GET /v1/usage`. | `LLM_COSTS_GROUP` | 1 |
| Already published as `POST /v1/ask`. | `CHAT-HISTORY` | 1 |
| Already published as `parameters.list_group`. | `MANAGE_ENTITIES` | 1 |
| Internal machinery (LLM model registry), outside the DOCS application. | `DOC_FEATURE_CATEGORIES` | 1 |
| Internal machinery (prompt engine), outside the DOCS application. | `DOC_FEATURE_CATEGORIES`, `DOC_LOCATIONS` | 1 |
| Internal machinery (translation engine), outside the DOCS application. | `DOC_FEATURE_CATEGORIES` | 1 |
| Revealing a private parameter value needs a person's session. | `MANAGE_GROUP_PARAMS` | 1 |
| Revealing encrypted content needs a person's session. The document text never crosses the boundary. | `DOCUMENTS` | 1 |
| The full document text is shown only to a person in the web app. Agents get the summary and chunks. | `DOCUMENTS` | 1 |
| The payment portal needs a person's session. | `PAYMENT_METHODS` | 1 |
