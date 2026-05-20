# CLI Track — Build ITMS with Copilot CLI

| | |
|---|---|
| **Duration** | 20 minutes |
| **Features** | Copilot CLI — `/plan`, `/fleet` |
| **Goal** | Build the ITMS API (POST + GET tasks) and UI (Task List + Create Task) using Copilot CLI's plan and parallel execution modes |

---

> **This track covers the same features as the VS Code mandatory track (Exercises 01–08) but uses Copilot CLI instead of VS Code Copilot Chat.**
>
> **Prerequisites**: Exercise 01 (Custom Instructions) complete; Copilot CLI installed.
>
> **Install Copilot CLI**: https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli

---

## Part 1 — Set Up Copilot CLI

### Step 1.1 — Start a CLI Session

```bash
cd <project-root>
copilot
```

When the CLI prompt appears, you are ready.

### Step 1.2 — Select the Right Model

```
/model
```

Choose **Claude Sonnet** (or Auto) for multi-file changes.

### Step 1.3 — Verify Copilot Instructions

If `.github/copilot-instructions.md` does not exist:

```
Read the project structure and create .github/copilot-instructions.md documenting: language/framework, response envelope {success,data,error,meta}, AppError/ValidationError/NotFoundError hierarchy, routes→controllers→services→repositories layering, JSON persistence in src/data/, and no DB/ORM.
```

---

## Part 2 — Generate SDLC Docs

### Step 2.1 — Generate BRD, TSD, FRD

```
Read requirement.md. Generate doc/brd.md (BR-F01 create task, BR-F02 list tasks), doc/tsd.md (POST and GET /api/v1/tasks only, Mermaid diagram), and doc/frd.md (UC-001 Create Task + UC-002 List Tasks, Gherkin acceptance criteria). Save all three files.
```

---

## Part 3 — Plan the Implementation

### Step 3.1 — Switch to Plan Mode

Press **Shift+Tab** to switch to plan mode (the prompt label changes to `plan>`):

```
Analyze requirement.md and doc/frd.md. Plan implementation of:
A — Scaffold: entry point, /api/v1 router, health check, error middleware
B — Repository: in-memory JSON store for tasks/users (findAll with filters, create)
C — POST /api/v1/tasks: validate title required, priority enum, assignedUserId exists
D — GET /api/v1/tasks: filter by status/priority/assignedUserId, return {success,data,meta}
E — UI: TaskListPage (GET tasks, filters) and TaskCreatePage (POST form)

Use checkboxes. Note A must complete before B; B before C and D; C and D can be parallel; E parallel with C/D.
```

Press **Shift+Tab** again to exit plan mode after the plan is created.

> Verify `plan.md` covers all 5 features before continuing. Edit it directly if needed.

---

## Part 4 — Implement with `/fleet`

### Step 4.1 — Run Parallel Implementation

`/fleet` splits independent tasks across parallel subagents:

```
/fleet Implement plan.md with three subagents:
1) Scaffold + Repository (A + B): entry point, router, middleware, health check, JSON data loader, findAll(filters), create, persist writes
2) API Endpoints (C + D): POST /api/v1/tasks with validation, GET /api/v1/tasks with filters — follow AppError/ValidationError/NotFoundError pattern and ApiEnvelope format
3) UI (E): React + TypeScript + Vite in ui/, TaskListPage with status/priority filters, TaskCreatePage with title required form, api.ts with listTasks() and createTask(), wire BrowserRouter

Follow existing patterns from .github/copilot-instructions.md. When complete, start the server.
```

> Subagents 2 and 3 can run simultaneously after Subagent 1 finishes. You will see output streams from each.

---

## Part 5 — Verify

### Step 5.1 — API Verification

```bash
# Health check
curl -s http://localhost:3000/api/v1/health | jq .

# List tasks
curl -s http://localhost:3000/api/v1/tasks | jq .

# Create a task (replace USER_ID with a real ID from src/data/users.json)
curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"CLI Task","priority":"HIGH","assignedUserId":"<USER_ID>"}' | jq .

# Create without title — expect 400
curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"priority":"LOW"}' | jq .

# Filter by status
curl -s "http://localhost:3000/api/v1/tasks?status=TO_DO" | jq .
```

### Step 5.2 — UI Verification

```bash
cd ui && npm run dev -- --port 5173
```

Open `http://localhost:5173` and verify:
- [ ] Task list loads with seeded tasks
- [ ] Status and priority filters work
- [ ] "New Task" navigates to the form
- [ ] Valid form submission creates a task (status TO_DO)
- [ ] Missing title shows inline error

---

## Part 6 — Generate Tests

```
Generate unit tests for TaskService (createTask and getAllTasks) and integration tests for POST /api/v1/tasks and GET /api/v1/tasks. Use the UC-001 and UC-002 Gherkin criteria from doc/frd.md. Run tests and show coverage.
```

---

## Key Takeaways

> **`/plan` before code** — For multi-file features with shared layers (repo → service → controller), planning first identifies sequencing constraints. Here: scaffold must precede repository; repository must precede endpoints.

> **`/fleet` for parallel work** — Once the shared scaffold is done, API and UI have no shared state — they can build simultaneously. `/fleet` turns 20 minutes of sequential work into ~8 minutes of parallel execution.

> **Same features, different tool** — The CLI produces the same ITMS result as the VS Code track (Exercises 01–08). The difference is the interaction mode: CLI is terminal-native and integrates naturally into developer workflows.

---

**Return to VS Code Track**: [Exercise 08 — Build & Debug](exercise-13-build-debug.md)

**Cloud Agent Track**: [Build with the Copilot Coding Agent →](cloud-agent-track.md)
