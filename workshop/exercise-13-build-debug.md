# Exercise 08 — Build & Debug

**Duration**: 5 minutes  
**Copilot Feature**: Local Agent + Terminal Tool  
**Goal**: Use Copilot to build the ITMS application, interpret errors, and iterate until both endpoints and both UI pages work end-to-end.

---

## Background

The local agent can run terminal commands, read their output, diagnose errors, and make code changes — all in one conversation. This creates a tight **build → error → fix → build** loop that compresses debugging time significantly.

---

## Step 1 — Start a Build-and-Fix Session

In Copilot Chat (Agent mode), send:

```
Build and run ITMS: install dependencies, build/compile, start the app, and fix errors at root cause. For each error show message, cause, fix, and re-run. Continue until GET /api/v1/health returns status ok.
```

The agent will run commands in the terminal, read the output, and iterate on fixes. You'll see it:
1. Run `npm install` (or equivalent)
2. Run `npm run build`(or equivalent)
3. Fix any TypeScript errors or import issues
4. Start the server
5. Test the health endpoint

---

## Step 2 — Run Unit Tests

Once the app builds, send:

```
Run unit tests using npm run test:unit or the stack equivalent. For failures, show test + message, decide code vs test bug, fix root cause, rerun until green, then show coverage.
```

---

## Step 3 — Debug a Specific Scenario

Try a deliberate debugging exercise. Send:

```
Use curl to POST /api/v1/tasks with a valid assignedUserId from src/data/users.json, due date next Friday, priority HIGH, title "Implement Payment API". Then GET the returned ID. Show commands, responses, logs, and fix if POST is not 201 TO_DO or GET is 404.
```

If the request fails, Copilot will:
1. Look at the server logs
2. Trace the request through the controller → service → repository
3. Identify the bug (e.g., date validation blocking valid future dates, or missing FK constraint handling)
4. Apply the fix and re-test

---

## Step 4 — Run Integration Tests

Send:

```
Start the app if needed, then run npm run test:integration or stack equivalent. For failures, compare with doc/frd.md Gherkin criteria for UC-001 and UC-002, fix root cause, and rerun.
```

---

## Step 5 — Verify End-to-End Flow

Send a final validation prompt:

```
Run a full E2E curl verification:
1. GET /api/v1/tasks — list seeded tasks
2. POST /api/v1/tasks — create a HIGH priority task for a valid user with a future due date
3. Confirm response has status TO_DO and a task ID
4. GET /api/v1/tasks?status=TO_DO — confirm the new task appears in the filtered list
5. POST /api/v1/tasks with missing title — confirm 400 VALIDATION_ERROR
Show all commands, responses, and fix any error found.
```

---

## Debugging Tips

If Copilot gets stuck in a loop on a specific error:

```
Stop trying to fix [specific error]. Let's approach this differently.
What is the root cause of this error based on the stack trace?
What are the 3 most likely causes? Eliminate them one by one.
```

If a test keeps failing after fixes:

```
Read the original acceptance criteria in doc/frd.md for UC-001 or UC-002.
Is the test testing the right thing? Is the implementation correct per the FRD?
Tell me which is wrong — the test or the implementation — before making any changes.
```

---

## Key Takeaway

> The local agent's superpower is the **terminal + code edit + reasoning** combination. It reads error output, traces the root cause through the stack, makes a targeted fix, and re-runs — all in one session. Give it a **goal** ("all tests pass, E2E flow works") rather than micro-managing each step.

---

**🏁 Mandatory Track Complete!**

You have completed all 8 mandatory exercises and built a working ITMS with:
- `POST /api/v1/tasks` — create a task
- `GET /api/v1/tasks` — list tasks with filters
- Task List UI + Create Task UI
- Unit + integration tests

| Completed | Output |
|-----------|--------|
| Ex 01 | `.github/copilot-instructions.md` |
| Ex 02 | Custom agents + SDLC orchestrator |
| Ex 03 | `doc/brd.md`, `doc/tsd.md`, `doc/frd.md` |
| Ex 04 | `doc/implementation-plan.md`, prompt file |
| Ex 05 | REST API — POST + GET `/api/v1/tasks` |
| Ex 06 | UI — TaskListPage + TaskCreatePage |
| Ex 07 | Unit + integration tests |
| Ex 08 | Build verified, E2E flow passing |

---

## Continue with Optional Exercises

| Exercise | Topic |
|----------|-------|
| [Ex 09 — Context Map](exercise-15-context-map.md) | Generate a codebase map to improve Copilot accuracy |
| [Ex 10 — GitHub Issues via MCP](exercise-14-github-issues.md) | Convert the plan to GitHub Issues |
| [Ex 11 — Security Review](exercise-12-security.md) | OWASP Top 10 audit and fixes |
| [Ex 12 — Database & SQL](exercise-16-database-sql.md) | Swap JSON store for a real database |
| [Ex 13 — IaC & CI/CD](exercise-17-iac-cicd.md) | Docker, Bicep/Terraform, GitHub Actions |
| [CLI Track](cli-track.md) | Rebuild features with Copilot CLI /plan + /fleet |
| [Cloud Agent Track](cloud-agent-track.md) | Delegate features to the Copilot Coding Agent |
