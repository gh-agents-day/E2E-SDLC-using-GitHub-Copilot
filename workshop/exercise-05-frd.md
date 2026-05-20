> 🟡 **OPTIONAL INDIVIDUAL-AGENT PATH** — Exercise 02 already generates `doc/frd.md` through the SDLC Docs Orchestrator. Use this exercise only if you want to run the FRD specialist agent independently.
>
> **Return to mandatory track**: [Exercise 06 — Plan Mode & Implementation Prompt](exercise-06-plan-mode.md)

# Exercise 05 (Optional) — Explore the FRD Agent in Isolation

**Duration**: 4 minutes  
**Copilot Feature**: FRD Custom Agent  
**Goal**: Understand how the FRD Agent synthesizes BRD + TSD into testable user stories.

---

## Background

The **FRD Author** agent produces the developer-ready document: use cases, Gherkin acceptance criteria, and validation rules. This exercise explores the agent independently.

> **Required inputs**: `doc/brd.md` and `doc/tsd.md` must exist before you run this exercise. If they do not, complete Exercise 03 and Exercise 04 in the optional path, or use the orchestrator in Exercise 02.

---

## Step 1 — Switch to the FRD Agent

1. In Copilot Chat, click the agent selector
2. Select **FRD Author**

---

## Step 2 — Send the Scoped FRD Prompt

```
Read #requirement.md, #brd.md, and #tsd.md. Create doc/frd.md with ONLY:
- UC-001 (Create Task): POST /api/v1/tasks — Gherkin acceptance criteria for valid creation, missing title (400), invalid priority (400), unknown assignedUserId (404)
- UC-002 (List Tasks): GET /api/v1/tasks — Gherkin for list all, filter by status, filter by priority, filter by assignedUserId, empty result
Include validation rules table and error scenario catalogue.
```

---

## Step 3 — Verify the Output

Open `doc/frd.md` and check:

- [ ] UC-001 (Create Task) with Given/When/Then scenarios for happy path and error cases
- [ ] UC-002 (List Tasks) with Given/When/Then scenarios for filters
- [ ] Validation rules table with field-level rules (title required, priority enum, date format)
- [ ] Error scenarios with HTTP status codes

---

## Checkpoint — Docs Complete

You should now have:

```
doc/
├── brd.md    ← Business requirements for create + list tasks
├── tsd.md    ← Technical architecture for POST and GET /api/v1/tasks
└── frd.md    ← UC-001 and UC-002 with Gherkin acceptance criteria
```

These three documents form the **specification foundation** for all remaining exercises. Every piece of code, database schema, test, and deployment script will trace back to one of these files.

---

## Key Takeaway

> Notice how each agent built on the previous output. BRD → TSD → FRD is the natural SDLC chain, and each Gherkin scenario becomes a test case later in the workshop.

---

**Next for the mandatory track**: [Exercise 06 — Plan Mode & Implementation Prompt](exercise-06-plan-mode.md)
