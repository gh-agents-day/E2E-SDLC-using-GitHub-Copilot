# Exercise 18 — Complete ITMS: CLI with /plan & /fleet + Coding Agent via MCP

| | |
|---|---|
| **Duration** | 30 minutes |
| **Features** | GitHub Copilot CLI (`/plan`, `/fleet`) · GitHub MCP · Copilot Coding Agent |
| **Goal** | Finish the remaining ITMS backend gaps using Copilot CLI in parallel, then delegate all missing UI features to the Copilot coding agent via GitHub Issues |

---

## Context — What Exercises 08 & 09 Left Incomplete

After Exercises 08 and 09, the ITMS has a working core but several gaps remain.

**Backend — What's Done**

| Endpoint | Status |
|----------|--------|
| `POST /api/v1/tasks` | ✅ Implemented |
| `GET /api/v1/tasks` | ✅ Implemented |
| `GET /api/v1/tasks/:id` | ✅ Implemented |
| `PATCH /api/v1/tasks/:id/status` | ✅ Implemented |
| `GET /api/v1/tasks/:id/history` | ✅ Implemented |
| `GET /api/v1/tasks/:id/dependencies` (read-only) | ✅ Implemented |
| `GET /api/v1/users` | ✅ Implemented |
| `GET /api/v1/health` | ✅ Implemented |

**Frontend — What's Done**

| Feature | Status |
|---------|--------|
| TaskListPage — summary bar, filters, table, row navigation | ✅ Implemented |
| TaskDetailPage — info card, dependency view (read-only), status history, update form | ✅ Implemented |
| `StatusBadge`, `SummaryBar` components | ✅ Implemented |
| `api.ts` client, `task.types.ts`, routing in `App.tsx` | ✅ Implemented |

**What Remains**

| Layer | Gap | UC / Ref |
|-------|-----|----------|
| Backend | Auto-set `BLOCKED` when a dependency is not `COMPLETED` | T-027 |
| Backend | `GET /api/v1/reports/progress` — task count summary | T-028 |
| Backend | `PATCH /api/v1/tasks/:id/assign` — reassign task to another user | UC-002 |
| Backend | `POST /api/v1/tasks/:id/dependencies` — create a dependency link | UC-003 |
| Backend | `DELETE /api/v1/tasks/:id/dependencies/:dependencyId` — remove a dependency link | UC-003 |
| Frontend | Task creation page (`POST /api/v1/tasks`) | UC-001 |
| Frontend | Dependency management UI (add/remove in TaskDetailPage) | UC-003 |
| Frontend | Pagination controls in TaskListPage | UC-005 |
| Frontend | Progress dashboard page (`GET /api/v1/reports/progress`) | UC-006 |

This exercise completes **all** of the above in two parallel streams.

---

## Prerequisites

- [ ] Exercises 08 and 09 are complete — the API is running on port 3000 and the UI dev server on port 5173
- [ ] Copilot CLI is installed: `copilot --version` returns a version number
  - Install guide: https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli
- [ ] GitHub MCP server is connected in VS Code (Copilot Chat → MCP Servers → GitHub ✅)
- [ ] The ITMS repository is pushed to GitHub (needed for coding agent to open PRs)

---

---

## Part 1 — Backend Completion with Copilot CLI

> **Why CLI?** The five backend gaps are **interrelated** — the auto-blocking logic (T-027) must be wired into both the assign endpoint and the dependency endpoint. `/plan` gives Copilot the full picture before writing any code. `/fleet` then splits the independent groups across parallel subagents so all three groups finish simultaneously.

### Step 1.1 — Open a CLI Session at the Project Root

In your terminal:

```bash
cd itms-project
copilot
```

> When the CLI prompt appears, you are ready.

### Step 1.2 — Select the Right Model

At the CLI prompt:

```
/model
```

Choose **Claude Opus 4.5** (or Auto). These tasks involve multi-file changes with shared logic — you want the most capable model.

### Step 1.3 — Create a `.github/copilot-instructions.md` (if not already present)

If `.github/copilot-instructions.md` does not exist at the repo root, run from the CLI:

```
Read src/app.ts, src/routes/v1/tasks.ts, src/services/task.service.ts,
src/repositories/json-store.ts, and src/types/index.ts.

Write .github/copilot-instructions.md that documents:
- Stack: Node.js + Express + TypeScript + Zod + JSON persistence
- Response envelope: { success, data, error, meta: { requestId, timestamp } }
- Error classes: AppError, NotFoundError, ValidationError (from src/errors/app-error.ts)
- Folder pattern: routes → controllers → services → repositories
- All writes persist to JSON file immediately via JsonStore
- Logger: src/utils/logger.ts (no console.log)
- Validation: Zod schemas in src/validators/
```

### Step 1.4 — Use `/plan` to Create a Structured Implementation Plan

Press **Shift+Tab** to switch to plan mode (the prompt label changes to `plan>`), then enter:

```
Analyse src/services/task.service.ts, src/routes/v1/tasks.ts,
src/controllers/task.controller.ts, src/repositories/json-store.ts,
and src/types/index.ts.

Plan the implementation of these five backend features for the ITMS:

FEATURE A — Auto-blocking logic (T-027)
  In task.service.ts: whenever a dependency is created via POST
  /api/v1/tasks/:id/dependencies, check if the dependency task status
  is not COMPLETED. If so, set the parent task status to BLOCKED and
  record the status change in task_status_history.json.
  Similarly, when DELETE /api/v1/tasks/:id/dependencies/:dependencyId
  removes a dependency, re-evaluate: if all remaining dependencies are
  COMPLETED (or there are none), restore the task to its previous
  non-blocked status (default to IN_PROGRESS if unknown).

FEATURE B — Task assignment endpoint (UC-002)
  PATCH /api/v1/tasks/:id/assign
  Body: { assignedUserId: string }
  - Validate assignedUserId exists in users.json
  - Update task.assignedUserId
  - Append a record to task_status_history.json noting the reassignment
  - Response: updated task wrapped in ApiEnvelope

FEATURE C — Dependency management endpoints (UC-003)
  POST /api/v1/tasks/:id/dependencies
  Body: { dependsOnTaskId: string }
  - Validate both task IDs exist
  - Prevent duplicate dependencies (409 CONFLICT)
  - Prevent circular dependencies (task cannot depend on itself)
  - Persist to task_dependencies.json
  - Trigger Feature A auto-blocking check
  - Response: created dependency wrapped in ApiEnvelope

  DELETE /api/v1/tasks/:id/dependencies/:dependencyId
  - Validate dependency exists and belongs to this task
  - Remove from task_dependencies.json
  - Trigger Feature A re-evaluation
  - Response: 204 No Content

FEATURE D — Reports endpoint (T-028)
  GET /api/v1/reports/progress
  - Count tasks grouped by status: TO_DO, IN_PROGRESS, BLOCKED, COMPLETED
  - Return: { total, completed, inProgress, blocked, toDo }
  - Wire a new reports router at src/routes/v1/reports.ts
  - Mount at /api/v1/reports in src/routes/v1/index.ts

Organise the plan as checkboxes grouped by feature. Note which features can be
implemented in parallel (B, C, D are independent of each other; A must be wired
in after C is scaffolded). Save the plan to plan.md.
```

Press **Shift+Tab** again to exit plan mode after the plan is created.

> **What to expect:** Copilot analyses the codebase, asks any clarifying questions, then produces a checklist plan in `plan.md`. Press **Ctrl+Y** to open `plan.md` in your editor and verify it covers all five features before continuing.

**Verify the plan before proceeding:**

- [ ] Plan contains checkboxes for Features A, B, C, and D
- [ ] Plan notes that B, C, D can be parallelised
- [ ] Plan notes that A requires C to be scaffolded first (dependency creation is the trigger)

> If you need to adjust the plan, edit `plan.md` directly and tell Copilot: `I have updated plan.md — proceed with the revised plan.`

### Step 1.5 — Use `/fleet` to Implement in Parallel

`/fleet` breaks the task into parallel subagents. Each subagent works independently on its group, then results are merged back. Use it here because B, C, and D have no shared state changes:

```
/fleet Implement the ITMS backend features from plan.md using three parallel subagents:

Subagent 1 — FEATURE B: Task Assignment
  Implement PATCH /api/v1/tasks/:id/assign following the existing pattern in
  src/controllers/task.controller.ts and src/services/task.service.ts.
  Add a Zod schema AssignTaskSchema in src/validators/task.validator.ts.
  Wire the route in src/routes/v1/tasks.ts.

Subagent 2 — FEATURES C + A: Dependency CRUD + Auto-blocking
  Implement POST /api/v1/tasks/:id/dependencies and
  DELETE /api/v1/tasks/:id/dependencies/:dependencyId.
  After scaffolding both, wire the auto-blocking logic from FEATURE A into
  the dependency service methods — check all dependencies on save and
  re-evaluate on delete.
  Add Zod schema CreateDependencySchema in src/validators/task.validator.ts.
  Wire both routes in src/routes/v1/tasks.ts.

Subagent 3 — FEATURE D: Reports Endpoint
  Create src/routes/v1/reports.ts with GET /progress.
  Create src/controllers/report.controller.ts.
  Add a getProgressSummary() method to src/services/task.service.ts.
  Mount the reports router in src/routes/v1/index.ts at /reports.

All subagents must follow the existing code patterns, use the AppError hierarchy,
wrap responses in ApiEnvelope, and log with src/utils/logger.ts.
When all subagents are done, run: npx ts-node src/server.ts
```

> **What to expect:** Three subagents run simultaneously. You will see output streams from each. When all complete, Copilot starts the server. If any subagent hits an error it will report back and ask for guidance before the others are affected.

### Step 1.6 — Verify the New Endpoints

Once the server is running, run these from a separate terminal:

```bash
# 1. Assign a task to a different user (use real IDs from your tasks.json / users.json)
curl -s -X PATCH http://localhost:3000/api/v1/tasks/<TASK_ID>/assign \
  -H "Content-Type: application/json" \
  -d '{"assignedUserId":"<USER_ID>"}' | jq .

# 2. Add a dependency — should auto-set the task to BLOCKED if dep is not COMPLETED
curl -s -X POST http://localhost:3000/api/v1/tasks/<TASK_ID>/dependencies \
  -H "Content-Type: application/json" \
  -d '{"dependsOnTaskId":"<OTHER_TASK_ID>"}' | jq .

# 3. Confirm the parent task is now BLOCKED
curl -s http://localhost:3000/api/v1/tasks/<TASK_ID> | jq .data.status

# 4. Remove the dependency — task should return to non-blocked status
curl -s -X DELETE http://localhost:3000/api/v1/tasks/<TASK_ID>/dependencies/<DEP_ID>

# 5. Confirm task is no longer BLOCKED
curl -s http://localhost:3000/api/v1/tasks/<TASK_ID> | jq .data.status

# 6. Progress summary
curl -s http://localhost:3000/api/v1/reports/progress | jq .
```

Expected results:

- [ ] `PATCH /assign` → `{ success: true, data: { assignedUserId: "<new user>" } }`
- [ ] `POST /dependencies` → `{ success: true, data: { id, taskId, dependsOnTaskId } }` and parent task is `BLOCKED`
- [ ] `DELETE /dependencies/:id` → 204 and parent task is no longer `BLOCKED`
- [ ] `GET /reports/progress` → `{ success: true, data: { total, completed, inProgress, blocked, toDo } }`

### Step 1.7 — Commit via CLI

Back in the Copilot CLI prompt:

```
Stage all changed files and commit with message:
"feat: add task assign, dependency CRUD, auto-blocking, and progress report endpoint"

Show me the git diff summary before committing so I can review.
```

> Copilot will run `git diff --stat`, show you the summary, then wait for your approval before committing.

---

---

## Part 2 — Frontend Features via GitHub Issues + Copilot Coding Agent

> **Why Issues + Coding Agent?** Each of the four remaining UI features maps cleanly to a single Use Case from the FRD — they are independently scoped, well-defined, and do not depend on each other. Creating a GitHub Issue gives the coding agent a structured spec to work from, and each feature gets its own PR for focused review.

### Step 2.1 — Confirm GitHub MCP is Connected

In VS Code, open Copilot Chat (Agent mode). At the bottom of the Chat panel, confirm the GitHub MCP server shows a green connected indicator.

If not connected: `Ctrl+Shift+P` → **MCP: Connect Server** → select **GitHub**.

### Step 2.2 — Create GitHub Issues via MCP

In Copilot Chat, send the following prompt to create all four issues in one go:

```
Use the GitHub MCP server to create 4 issues in this repository.
For each issue, set the label to "copilot" and assign it to the copilot bot user.

Issue 1:
  Title: "[UC-001] Task Creation Page — Add form to create new tasks"
  Body:
  ## Context
  The ITMS backend already implements `POST /api/v1/tasks` but the React UI has
  no way to create tasks. Users are blocked from adding new work items.

  ## Acceptance Criteria
  - A "New Task" button on TaskListPage navigates to a `/tasks/new` route
  - The creation form collects: Title (required), Description, Priority
    (LOW / MEDIUM / HIGH dropdown), Assigned To (user dropdown from
    `listUsers()`), Estimated Completion Date (date picker)
  - On submit, call `createTask()` in `ui/src/services/api.ts`
    (add this function: `POST /api/v1/tasks`)
  - On success, redirect to `/tasks/:newId`
  - On validation error (400), display inline field errors from the API envelope
  - Wire the route `/tasks/new` in `ui/src/App.tsx` before `/tasks/:id`

  ## References
  - `ui/src/services/api.ts` — add `createTask(body)` function
  - `ui/src/types/task.types.ts` — `CreateTaskBody` type
  - `itms-project/src/routes/v1/tasks.ts` — `POST /` endpoint spec
  - `doc/frd.md` UC-001

Issue 2:
  Title: "[UC-003] Dependency Management UI — Add/remove dependencies in TaskDetailPage"
  Body:
  ## Context
  TaskDetailPage shows dependencies (read-only) but users cannot add or remove
  them. The backend endpoints `POST /tasks/:id/dependencies` and
  `DELETE /tasks/:id/dependencies/:dependencyId` are now implemented (Part 1).

  ## Acceptance Criteria
  - Below the existing Dependencies table, add an "Add Dependency" form:
      Task ID input (or dropdown of existing tasks from `listTasks()`)
      "Add" button — calls `addDependency(taskId, dependsOnTaskId)` in `api.ts`
  - Each row in the dependencies table has a "Remove" button:
      Calls `removeDependency(taskId, dependencyId)` in `api.ts`
      On success, refreshes the dependencies list and the task status
      (the task may have changed from BLOCKED to another status)
  - If the API returns an error (e.g. circular dependency), show an inline
    error message above the form
  - Add these functions to `ui/src/services/api.ts`:
      `addDependency(taskId, dependsOnTaskId)` → `POST /tasks/:id/dependencies`
      `removeDependency(taskId, dependencyId)` → `DELETE /tasks/:id/dependencies/:depId`

  ## References
  - `ui/src/pages/TaskDetailPage.tsx`
  - `ui/src/services/api.ts`
  - `itms-project/src/routes/v1/tasks.ts` — dependency endpoints

Issue 3:
  Title: "[UC-005] Pagination Controls — Page navigation in TaskListPage"
  Body:
  ## Context
  TaskListPage loads only the first 20 tasks. Users with larger projects cannot
  browse beyond the first page. The backend already supports `page` and `limit`
  query parameters.

  ## Acceptance Criteria
  - Below the task table, add a pagination row showing:
      "Showing X–Y of Z tasks"
      Previous / Next buttons (disable when at first/last page)
      Page size selector: 10 | 20 | 50
  - `listTasks()` in `api.ts` already accepts `page` and `limit` — pass them
    from component state
  - The `meta` field in the API response contains `{ total, page, limit }` —
    use these to calculate total pages
  - When filters change, reset to page 1
  - Update `ui/src/services/api.ts` `listTasks()` signature to accept
    `page?: number` and `limit?: number` in its filters argument

  ## References
  - `ui/src/pages/TaskListPage.tsx`
  - `ui/src/services/api.ts`
  - `itms-project/src/types/index.ts` — `PaginatedMeta` interface

Issue 4:
  Title: "[UC-006] Progress Dashboard — Project summary report page"
  Body:
  ## Context
  The backend now exposes `GET /api/v1/reports/progress` returning task counts
  by status. There is no frontend page to visualise this data for project managers.

  ## Acceptance Criteria
  - Create `ui/src/pages/ProgressPage.tsx` with route `/progress`
  - Add a "Progress" link in the top navigation (or a nav bar if one does not exist)
  - The page calls `getProgress()` from `api.ts` on mount
  - Display a summary card for each status (TO_DO, IN_PROGRESS, BLOCKED,
    COMPLETED) using the same colour scheme as `StatusBadge`
  - Show a total task count prominently at the top
  - Add `getProgress()` to `ui/src/services/api.ts`:
      `GET /api/v1/reports/progress` → returns `ProgressSummary` type
  - Add `ProgressSummary` type to `ui/src/types/task.types.ts`:
      `{ total: number; completed: number; inProgress: number; blocked: number; toDo: number }`
  - Wire `/progress` in `ui/src/App.tsx`

  ## References
  - `ui/src/services/api.ts`
  - `ui/src/types/task.types.ts`
  - `ui/src/App.tsx`
  - `itms-project/src/routes/v1/reports.ts` — backend endpoint
```

> **What to expect:** Copilot Chat uses the GitHub MCP `create_issue` tool to open 4 issues in your repository, each with the `copilot` label and `@copilot` assigned. Confirm each issue URL is returned.

### Step 2.3 — Verify Issues are Created

In Copilot Chat:

```
List the 4 issues we just created and show their URLs and assignees.
Use the GitHub MCP server.
```

- [ ] 4 issues are open on GitHub
- [ ] Each has the label `copilot`
- [ ] Each is assigned to the Copilot bot

### Step 2.4 — Monitor the Coding Agent

The Copilot coding agent will pick up each issue and start working automatically (usually within 1–3 minutes per issue).

You can track progress in Copilot Chat:

```
Use the GitHub MCP server to list open pull requests in this repository.
Show title, status, and linked issue for each.
```

Or navigate to your repository on GitHub → **Pull Requests** tab.

Each PR will:
1. Reference the issue it resolves
2. Contain only the changes for that single feature
3. Wait for your review before merging

### Step 2.5 — Review and Merge Each PR

For each of the 4 PRs, review using this checklist:

**PR 1 — Task Creation Page**
- [ ] `/tasks/new` route exists in `App.tsx`
- [ ] Form validates `title` as required; shows API error messages inline
- [ ] `createTask()` added to `api.ts`
- [ ] On success, redirects to the new task's detail page

**PR 2 — Dependency Management UI**
- [ ] "Add Dependency" form present below the dependencies table
- [ ] "Remove" button on each dependency row
- [ ] `addDependency()` and `removeDependency()` added to `api.ts`
- [ ] Status refreshes after adding a dependency (may change to `BLOCKED`)

**PR 3 — Pagination Controls**
- [ ] Pagination row shows "Showing X–Y of Z tasks"
- [ ] Previous/Next buttons work and disable at boundaries
- [ ] Page size selector (10/20/50) changes results
- [ ] Filter changes reset to page 1

**PR 4 — Progress Dashboard**
- [ ] `/progress` route in `App.tsx`
- [ ] `ProgressPage.tsx` exists with status summary cards
- [ ] `getProgress()` added to `api.ts`
- [ ] `ProgressSummary` type added to `task.types.ts`

Merge each PR after review. If a PR needs fixes, leave a review comment — the coding agent will push an update.

---

## End-to-End Verification

With all backend changes deployed and all 4 frontend PRs merged, verify the full ITMS:

```bash
# Start the API
cd itms-project && npm run dev

# Start the UI (separate terminal)
cd itms-project/ui && npm run dev -- --port 5173
```

| Test | Expected Result |
|------|----------------|
| Open `http://localhost:5173` | TaskListPage loads with task table |
| Click "New Task", fill form, submit | Task created, redirected to detail page |
| On TaskDetailPage, add a dependency on an incomplete task | Parent task status changes to `BLOCKED` |
| Remove the dependency | Task status returns to non-blocked |
| Use Previous/Next on TaskListPage | Table page changes |
| Open `http://localhost:5173/progress` | Progress dashboard shows per-status counts |
| `GET /api/v1/reports/progress` | Returns `{ total, completed, inProgress, blocked, toDo }` |

---

## Key Takeaways

> **CLI `/plan` before implementation.** For five interrelated backend features, creating a plan first let Copilot identify the dependency between features (auto-blocking logic must be wired into the dependency creation endpoint, not added as an afterthought). This prevented rework.

> **CLI `/fleet` for parallel execution.** Independent feature groups (assign, dependency CRUD, reports) ran simultaneously across three subagents. A task that would take 25 minutes sequentially completed in ~10 minutes.

> **Issues as specs for the coding agent.** A well-written issue body — with acceptance criteria, API references, and file paths — gives the coding agent everything it needs to open a correct PR without back-and-forth. The UC-ID ties the feature to the FRD for traceability.

> **Stream of work without switching context.** While the coding agent handled the four frontend features asynchronously, you could review, merge, or continue on other work — the same parallel workstream principle as the Background Agent in Exercise 14.

---

**Next**: [Exercise 10 — Write Tests](exercise-10-testing.md) (mandatory track)

**Optional**: [Exercise 15 — Context Map Skill](exercise-15-context-map.md) · [Exercise 16 — Database & SQL](exercise-16-database-sql.md) · [Exercise 17 — IaC & CI/CD](exercise-17-iac-cicd.md)
