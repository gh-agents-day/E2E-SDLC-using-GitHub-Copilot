> 🟡 **OPTIONAL DEEP DIVE** — Exercise 03 already generates `doc/tsd.md` via the SDLC Docs Orchestrator. Return here only if you want to explore the TSD Agent in isolation.
>
> **Return to mandatory track**: [Exercise 04 — Plan Mode & Implementation Prompt](exercise-06-plan-mode.md)

# Exercise 04 (Optional) — Explore the TSD Agent in Isolation

**Duration**: 4 minutes  
**Copilot Feature**: TSD Custom Agent  
**Goal**: Understand how the TSD Agent works independently by running it against your scoped BRD.

---

## Background

The **TSD Author** agent reads the BRD and designs the system architecture — data model, API contracts, tech stack, and security considerations. This exercise lets you explore the agent in isolation to understand its reasoning.

> **Language inherited from Exercise 01**: The TSD agent reads `.github/copilot-instructions.md` and will design the architecture using your chosen language and framework automatically.

---

## Step 1 — Switch to the TSD Agent

1. In Copilot Chat, click the agent selector
2. Select **TSD Author**

---

## Step 2 — Send the Scoped TSD Prompt

```
Read #brd.md and #requirement.md. Create doc/tsd.md focused on POST /api/v1/tasks and GET /api/v1/tasks only. Include: Mermaid architecture diagram, REST endpoint table for exactly these 2 endpoints, 3-layer architecture (controller/service/repository), stack rationale, OWASP Top 10 considerations, and BRD traceability.
```

---

## Step 3 — Review the Output

Open `doc/tsd.md` and verify:

- [ ] Mermaid architecture diagram is present
- [ ] REST endpoint table shows exactly 2 entries: POST and GET `/api/v1/tasks`
- [ ] 3-layer architecture is described
- [ ] Security considerations mention input validation and injection prevention
- [ ] BRD traceability links to BR-F01 and BR-F02

---

## Key Takeaway

> The TSD agent bridges business requirements and engineering. Notice it references the BRD IDs (BR-F01, BR-F02) to maintain traceability — every architectural decision traces back to a business requirement.

---

**Return to mandatory track**: [Exercise 04 — Plan Mode & Implementation Prompt](exercise-06-plan-mode.md)

## Step 3 — Monitor the Plan

The TSD agent will plan its approach. Look for:
- It plans to read BOTH `#brd.md` AND `#requirement.md`
- It mentions Mermaid diagrams
- It is NOT writing application code

Approve the plan.

---

## Step 4 — Ask for a Specific Architecture Decision (Optional)

Try this follow-up to see how the agent reasons:

```
Update doc/tsd.md Integration Points for async SendGrid email, Microsoft Teams manager alerts, and a sequence diagram for task-status notification flow.
```

---

## Key Takeaway

> The architecture designed here becomes the **source of truth** for the next exercises. Every API you build, every table you create, and every test you write will trace back to `doc/tsd.md`. This is how Copilot becomes a true SDLC co-pilot — not just a code generator, but an architectural collaborator.

---

**Next**: [Exercise 05 — Generate FRD](exercise-05-frd.md)
