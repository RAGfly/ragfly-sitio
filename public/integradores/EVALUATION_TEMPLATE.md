# RAGfly — Evaluation Report Template

**Integrator:** [name / organization]  
**Date:** [YYYY-MM-DD]  
**Environment tested:** production (api.ragfly.ai)  
**Tenant(s) used:** A / B / both

---

## Executive summary

[2–3 sentences: what was tested, overall result, most important finding]

---

## Test battery checklist

| Battery | Status | Notes |
|---|---|---|
| 1.1 JWT login | ✅ / ❌ / ⏭ skipped | |
| 1.2 GET /auth/me | ✅ / ❌ / ⏭ | |
| 1.3 Create API Key | ✅ / ❌ / ⏭ | |
| 2.1 List documents | ✅ / ❌ / ⏭ | |
| 2.2 Semantic search Tenant A | ✅ / ❌ / ⏭ | |
| 2.2 Semantic search Tenant B | ✅ / ❌ / ⏭ | |
| 3. Multi-tenant isolation | ✅ / ❌ / ⏭ | |
| 4. Queue and workspaces | ✅ / ❌ / ⏭ | |
| 5. MCP (Claude Code / Cursor) | ✅ / ❌ / ⏭ | |
| 6. Codex (MCP) | ✅ / ❌ / ⏭ | |
| 7. CLI | ✅ / ❌ / ⏭ | |
| 8. Python SDK direct | ✅ / ❌ / ⏭ | |
| 9. TypeScript SDK direct | ✅ / ❌ / ⏭ | |

---

## Findings

### Finding 1 — [brief title]

**Severity:** Critical / High / Medium / Low / Info  
**Battery:** [guide section number]  
**Tenant:** A / B / both  

**Request:**
```
METHOD /endpoint
Header: Authorization: Bearer [REDACTED]
Body: { ... }
```

**Response received:**
```json
{ ... }
```

**Expected behavior per the guide:**
[description]

**Reproduction:**
[minimum steps to reproduce]

---

### Finding 2 — [brief title]

[repeat structure]

---

## RAG questions — results

Fill in with questions relevant to the evaluator's corpus and their expected answers.

| Question asked | System response | Expected | ✅/❌ |
|---|---|---|---|
| [question 1] | | [expected answer] | |
| [question 2] | | [expected answer] | |
| [question with no evidence] | | Should indicate no information found | |

### Isolation test (if two accounts are available)

| Question (with account B over corpus A) | Result | ✅/❌ |
|---|---|---|
| [question specific to corpus A] | | 0 results |

---

## Codex / MCP configuration

**Client used:** [Claude Code / Cursor / Cline / Codex / other]  
**MCP transport:** SSE / streamable_http / not applicable  
**Setup issues:** [if any, describe]

---

## Additional observations

[Friction points, documentation suggestions, open questions]

---

## Evaluator environment

| Attribute | Value |
|---|---|
| OS | [macOS / Linux / Windows] |
| Python | [version] |
| MCP client / tool | [name and version] |
| Observed average latency | [ms approx.] |
