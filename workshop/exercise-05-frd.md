> 🟡 **OPTIONAL DEEP DIVE** — Exercise 03 already generates `doc/frd.md` via the SDLC Docs Orchestrator. Return here only if you want to explore the FRD Agent in isolation.
>
> **Return to mandatory track**: [Exercise 04 — Plan Mode & Implementation Prompt](exercise-06-plan-mode.md)

# Exercise 05 (Optional) — Explore the FRD Agent in Isolation

**Duration**: 4 minutes  
**Copilot Feature**: FRD Custom Agent  
**Goal**: Understand how the FRD Agent synthesizes BRD + TSD into testable user stories.

---

## Background

The **FRD Author** agent produces the developer-ready document: use cases, Gherkin acceptance criteria, and validation rules. This exercise explores the agent independently.

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

## Key Takeaway

> Notice how each Gherkin scenario becomes a test case in Exercise 07 (Testing). FRD → Tests is a direct mapping — the acceptance criteria you read here will appear almost verbatim in the test descriptions.

---

**Return to mandatory track**: [Exercise 04 — Plan Mode & Implementation Prompt](exercise-06-plan-mode.md)

## Step 2 — Send the FRD Generation Prompt

Copy and paste this prompt:

```
Read #requirement.md, #brd.md, and #tsd.md; create doc/frd.md. Include roles/permissions, UC-001..UC-006, Gherkin stories, FR catalogue with traceability, validation rules, notification triggers, and user-facing error scenarios.
```

## Checkpoint — Docs Complete ✅

You should now have:

```
doc/
├── brd.md    ← Business requirements (from Exercise 02)
├── tsd.md    ← Technical architecture (from Exercise 03)
└── frd.md    ← Functional requirements + user stories (this exercise)
```

These three documents form the **specification foundation** for all remaining exercises. Every piece of code, database schema, test, and deployment script will trace back to one of these files.

---

## Key Takeaway

> Notice how each agent built on the previous output. BRD → TSD → FRD is the natural SDLC chain, and each agent was pre-wired to read the prior document. This is the power of **document-driven agentic workflows** — Copilot maintains context across the entire specification phase without you having to copy-paste content.

---

**Next**: [Exercise 06 — Plan Mode for Implementation](exercise-06-plan-mode.md)
