> ✅ **Already completed by Exercise 02** — If you ran the **SDLC Docs Orchestrator** in Exercise 02, all three documents are generated. Skip directly to [Exercise 04 — Plan Mode & Implementation Prompt](exercise-06-plan-mode.md).

# Exercise 03 — Generate SDLC Documentation (BRD + TSD + FRD)

**Duration**: 5 minutes  
**Copilot Feature**: SDLC Docs Orchestrator Agent  
**Goal**: Generate focused BRD, TSD, and FRD — all scoped to two features: create a task and list tasks.

---

## What This Exercise Covers

This exercise uses the **SDLC Docs Orchestrator** to generate all three specification documents in one run. All documents are scoped to exactly:

| # | Feature | Endpoint |
|---|---------|----------|
| 1 | Create a task | `POST /api/v1/tasks` |
| 2 | List tasks with filters | `GET /api/v1/tasks` |

Scoping upfront keeps each document concise and token-efficient. Every subsequent exercise — API, UI, tests — will trace back to these two use cases.

---

## Step 1 — Select the SDLC Docs Orchestrator

1. Open Copilot Chat (`Ctrl+Alt+I`)
2. Click the **agent selector** and choose **SDLC Docs Orchestrator**

---

## Step 2 — Send the Scoped Prompt

```
Read #requirement.md. Generate BRD → TSD → FRD focused ONLY on:
1. POST /api/v1/tasks — create a task (title required, description, priority LOW/MEDIUM/HIGH, assignedUserId, estimatedCompletionDate; status always starts as TO_DO)
2. GET /api/v1/tasks — list tasks with optional filters: status, priority, assignedUserId

BRD: BR-F01 (create task), BR-F02 (list tasks), stakeholders, risks/mitigations, glossary.
TSD: Mermaid architecture diagram, REST endpoint table for only these 2 endpoints, stack rationale, 3-layer architecture (controller/service/repository), OWASP Top 10 considerations, BRD traceability.
FRD: UC-001 (Create Task) and UC-002 (List Tasks) with Gherkin acceptance criteria, validation rules, and error scenarios.

Save to doc/brd.md, doc/tsd.md, doc/frd.md.
```

---

## Step 3 — Review the Plan

The orchestrator will show a plan before creating any files. Confirm:
- [ ] Step 1 creates `doc/brd.md` via the BRD Author agent
- [ ] Step 2 creates `doc/tsd.md` via the TSD Author agent (reads brd.md)
- [ ] Step 3 creates `doc/frd.md` via the FRD Author agent (reads brd.md + tsd.md)

Click **Continue** to run the orchestration.

---

## Step 4 — Verify the Output

Once complete, check:

```
doc/
├── brd.md    ← Business requirements for create + list tasks
├── tsd.md    ← Technical design for POST and GET /api/v1/tasks
└── frd.md    ← UC-001 (Create Task) + UC-002 (List Tasks) with Gherkin
```

- [ ] `doc/brd.md` — Contains BR-F01 and BR-F02 only; no unrelated features
- [ ] `doc/tsd.md` — REST endpoint table shows exactly 2 entries; Mermaid diagram present
- [ ] `doc/frd.md` — Contains UC-001 and UC-002 with Given/When/Then acceptance criteria

---

## Explore Each Agent in Isolation (Optional)

If you want to understand how each specialist agent works independently, run them individually:

**BRD Agent only:**
```
Read #requirement.md. Scope to POST /api/v1/tasks and GET /api/v1/tasks only. Create doc/brd.md with BR-F01 (create task), BR-F02 (list tasks), stakeholders, risks, and glossary.
```

**TSD Agent only** — switch to the TSD Author agent, then:
```
Read #brd.md and #requirement.md. Create doc/tsd.md for only POST and GET /api/v1/tasks. Include Mermaid architecture diagram, endpoint table, 3-layer design, OWASP Top 10, and BRD traceability.
```

**FRD Agent only** — switch to the FRD Author agent, then:
```
Read #requirement.md, #brd.md, and #tsd.md. Create doc/frd.md with UC-001 (Create Task) and UC-002 (List Tasks), Gherkin acceptance criteria, validation rules, and error scenarios. No other use cases.
```

---

## Key Takeaway

> The orchestrator chains BRD → TSD → FRD automatically, each document building on the previous. Scoping the input to exactly two features keeps all three documents concise and directly usable — every field, rule, and acceptance criterion maps to code you will write in the next exercises.

---

**Next**: [Exercise 04 — Plan Mode & Implementation Prompt](exercise-06-plan-mode.md)
