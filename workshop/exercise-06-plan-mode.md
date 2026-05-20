# Exercise 04 — Plan Mode & Implementation Prompt

**Duration**: 5 minutes  
**Copilot Features**: Plan Mode (Copilot Edits) + Prompt Files (`.prompt.md`)  
**Goal**: Use Plan Mode to create a focused implementation plan for two endpoints, then package it as a reusable prompt file.

---

## Part A — Plan Mode (3 minutes)

### Why Plan Mode?

Without Plan Mode, Copilot jumps straight into writing code. For a feature that touches controllers, services, and repositories, that is a gamble — you can't course-correct until after the fact.

**Plan Mode flips the order**: Copilot maps out every file it intends to touch and shows you the plan first. You review it, adjust it if needed, and only then approve execution.

### Step 1 — Switch to Plan Mode

In Copilot Chat:
1. Click the **mode selector** at the bottom-left of the chat panel
2. Select **Plan** (this may appear as `Plan` or the pencil/plan icon)

> You should see a visual indicator that Plan mode is active.

---

### Step 2 — Send the Scoped Planning Prompt

This prompt instructs Copilot to read your FRD and TSD and produce a phased plan — **without creating any files yet**.

Copy and paste this prompt:

```
Read #frd.md and #tsd.md. Create doc/implementation-plan.md scoped to:
- Phase 0: Project scaffolding (entry point, router, middleware, folder structure, health check)
- Phase 1: API — POST /api/v1/tasks and GET /api/v1/tasks (controller, service, repository)
- Phase 2: UI — TaskListPage (GET tasks, filters) and TaskCreatePage (POST task form)
- Phase 3: Tests — unit tests for TaskService, integration tests for POST + GET /tasks

For each task: ID, title, effort S/M/L, FRD ref (UC-001 or UC-002), parallel/sequential.
Do not create any code files.
```

---

### Step 3 — Review and Save the Plan

Copilot displays the full plan before touching any file. Review:

- [ ] Phase 0 includes project scaffolding
- [ ] Phase 1 covers only POST + GET `/api/v1/tasks`
- [ ] Phase 2 covers TaskListPage and TaskCreatePage
- [ ] Phase 3 covers tests for these endpoints only
- [ ] Tasks reference FRD IDs (UC-001, UC-002)

Click **Open in Editor** — this saves the plan as `doc/implementation-plan.md`.

---

## Part B — Implementation Prompt File (2 minutes)

### Why Prompt Files?

A `.prompt.md` file packages your prompt so any team member can run it with a single `/` command — no copy-pasting required.

### Step 1 — Create the Project Prompt File

In Copilot Chat (Agent mode, default agent), send:

```
Create .github/prompts/itms-implementation-plan.prompt.md for the ITMS project. It must:
- Read #frd.md and #tsd.md
- Focus on POST /api/v1/tasks and GET /api/v1/tasks only
- Reference src/routes/, src/services/, src/repositories/, src/models/
- Include UI pages: TaskListPage and TaskCreatePage
- Output phases as H2 headers with a table: ID | Task | Effort | FRD Ref | Parallel?
```

### Step 2 — Verify the Command

In Copilot Chat, type `/` — you should see **itms-implementation-plan** in the command palette.

---

## Key Takeaway

> Plan Mode prevents premature code generation. The prompt file turns your planning workflow into a team-wide standard — one command gives any developer the same implementation plan, scoped exactly to the two features you are building.

---

**Next**: [Exercise 05 — Build the API](exercise-08-api-local-agent.md)
