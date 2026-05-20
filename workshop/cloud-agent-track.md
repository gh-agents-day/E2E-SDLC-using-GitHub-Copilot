# Cloud Agent Track — Build ITMS with the Copilot Coding Agent

| | |
|---|---|
| **Duration** | 25 minutes |
| **Features** | GitHub Copilot Coding Agent · GitHub MCP · GitHub Issues |
| **Goal** | Delegate the ITMS feature implementation to the Copilot Coding Agent via GitHub Issues and review the resulting PRs |

---

> **This track demonstrates an alternative to writing code yourself**: you write well-specified GitHub Issues, assign them to the Copilot Coding Agent, and the agent opens pull requests. You review, request changes if needed, and merge.
>
> **Prerequisites**:
> - A GitHub repository with the project pushed (or push it now)
> - GitHub MCP Server configured in VS Code
> - GitHub Personal Access Token with `repo` and `issues` scopes
> - Exercise 03 complete — `doc/brd.md`, `doc/tsd.md`, `doc/frd.md` exist

---

## Part 1 — Environment Setup

### Step 1.1 — Connect GitHub MCP (if not already connected)

Open VS Code Command Palette (`Ctrl+Shift+P`) → **MCP: Add Server** → search `github` → select the official GitHub MCP Server → enter your Personal Access Token when prompted → reload VS Code.

### Step 1.2 — Push Your Repository to GitHub

If your ITMS project is not yet on GitHub, push it:

```bash
git init
git add .
git commit -m "feat: initial project setup"
git remote add origin https://github.com/<your-username>/itms-app.git
git push -u origin main
```

### Step 1.3 — Verify GitHub MCP is Active

In Copilot Chat, confirm the GitHub MCP server shows as connected (MCP Servers icon in the bottom status bar → GitHub ✅).

---

## Part 2 — Generate SDLC Docs (if not done)

If Exercise 03 was not completed, run the SDLC Docs Orchestrator now:

```
Read requirement.md. Generate BRD → TSD → FRD focused on POST /api/v1/tasks (create task) and GET /api/v1/tasks (list tasks with filters). Save as doc/brd.md, doc/tsd.md, doc/frd.md.
```

---

## Part 3 — Create GitHub Issues for the Coding Agent

### Step 3.1 — Create the Backend Issue

In Copilot Chat (default agent), send:

```
Using the GitHub MCP, create a GitHub Issue in <your-username>/itms-app titled:
"[BE] Build ITMS REST API — POST /api/v1/tasks + GET /api/v1/tasks"

Body:
## Objective
Implement two REST API endpoints for the ITMS backend.

## Endpoints

### POST /api/v1/tasks
- Accept: title (required string), description (optional), priority (LOW|MEDIUM|HIGH, required), assignedUserId (required, must exist in users data), estimatedCompletionDate (optional ISO date)
- Always set status to TO_DO on creation
- Return 201 with {success:true, data: <task>}
- Return 400 VALIDATION_ERROR if title missing or priority invalid
- Return 404 NOT_FOUND if assignedUserId does not exist

### GET /api/v1/tasks
- Accept optional query params: status, priority, assignedUserId
- Return 200 with {success:true, data: <array>, meta: {total}}

## Architecture
- 3-layer: controller → service → repository
- JSON file persistence (src/data/tasks.json, src/data/users.json loaded at startup)
- Follow patterns in .github/copilot-instructions.md
- Response envelope: {success, data, error, meta}

## References
- doc/frd.md: UC-001 (Create Task), UC-002 (List Tasks)
- doc/tsd.md: Architecture and endpoint spec

Add label: copilot. Assign to: Copilot.
```

### Step 3.2 — Create the Frontend Issue

```
Using the GitHub MCP, create a GitHub Issue in <your-username>/itms-app titled:
"[FE] Build ITMS UI — Task List Page + Create Task Page"

Body:
## Objective
Build two UI pages using React + TypeScript + Vite.

## Pages

### TaskListPage (route: /)
- Call GET /api/v1/tasks on mount
- Dropdown filters: status (TO_DO, IN_PROGRESS, BLOCKED, COMPLETED), priority (LOW, MEDIUM, HIGH) — re-fetch on change
- Table: ID (first 8 chars), title, priority, StatusBadge (grey/blue/red/green), due date
- "New Task" button → /tasks/new

### TaskCreatePage (route: /tasks/new)
- Form: title (required), description (optional), priority (dropdown, default MEDIUM), estimatedCompletionDate (date, optional)
- On submit: POST /api/v1/tasks via api.ts
- Show inline error if title is empty
- Show API error message if request fails
- On success: redirect to /
- Cancel button → /

## Setup
- Scaffold under ui/ with Vite + React + TypeScript
- ui/src/services/api.ts — listTasks(filters?) and createTask(body)
- ui/src/types/task.types.ts — Task, TaskStatus, TaskPriority, ApiEnvelope<T>
- Wire BrowserRouter: / → TaskListPage, /tasks/new → TaskCreatePage
- Run on port 5173

## References
- doc/frd.md: UC-001 (Create Task), UC-002 (List Tasks)
- Exercise 05 API must be running on port 3000

Add label: copilot. Assign to: Copilot.
```

---

## Part 4 — Monitor the Coding Agent

### Step 4.1 — Track Progress in Chat

```
Use the GitHub MCP server to list open pull requests in <your-username>/itms-app. Show title, status, and linked issue for each.
```

The Copilot Coding Agent picks up each `copilot`-labeled issue within 1–3 minutes and opens a PR for each.

### Step 4.2 — Watch on GitHub

Navigate to your repository on GitHub → **Pull Requests** tab. You will see:
- A PR for the backend issue
- A PR for the frontend issue

Each PR shows the agent's progress and links back to the source issue.

---

## Part 5 — Review and Merge PRs

### Backend PR Review Checklist

- [ ] `POST /api/v1/tasks` route exists and returns 201 with `status: "TO_DO"`
- [ ] `GET /api/v1/tasks` route exists and supports status/priority/assignedUserId filters
- [ ] 3-layer architecture: route → controller → service → repository
- [ ] JSON file persistence (no database driver)
- [ ] Missing title returns 400 VALIDATION_ERROR
- [ ] Unknown assignedUserId returns 404 NOT_FOUND
- [ ] Response uses `{success, data, error, meta}` envelope

### Frontend PR Review Checklist

- [ ] `ui/` folder scaffolded with Vite + React + TypeScript
- [ ] TaskListPage at `/` fetches and displays tasks
- [ ] Filters (status, priority) trigger a new API call
- [ ] `StatusBadge` component uses correct colors
- [ ] TaskCreatePage at `/tasks/new` with required title validation
- [ ] `api.ts` exports `listTasks()` and `createTask()`
- [ ] On successful create, redirects to `/`

### Requesting Changes

If a PR needs fixes, leave a review comment:

```
In the PR review, comment: "The POST endpoint does not validate that assignedUserId exists in the users data. It should return 404 NOT_FOUND if the user is not found. Please fix."
```

The coding agent will push an update commit to the same PR branch.

### Merging

After both PRs pass review, merge them. Verify the full E2E flow:

```bash
# Start the API
cd <project-root> && npm run dev

# Start the UI (separate terminal)
cd <project-root>/ui && npm run dev -- --port 5173
```

Open `http://localhost:5173` and confirm both pages work.

---

## Part 6 — Optional: Convert the Implementation Plan to Issues

If you want to also create GitHub Issues from the implementation plan (for project tracking):

```
Use the GitHub MCP to read doc/implementation-plan.md and convert Phase 0 and Phase 1 tasks to GitHub Issues in <your-username>/itms-app. Create a milestone per phase, assign labels (backend, frontend), and add checkbox acceptance criteria to each issue body.
```

---

## Key Takeaways

> **Issues as specs.** A well-written issue body — with explicit endpoint contracts, acceptance criteria, architecture references, and file path hints — gives the Copilot Coding Agent everything it needs to open a correct PR without back-and-forth. Vague issues produce vague PRs.

> **Parallel delegation.** The backend and frontend issues are independent — the agent works on both simultaneously. This mirrors how engineering teams split work across squads.

> **Review is essential.** The coding agent produces good first drafts but benefits from human review. Your checklist above ensures the agent's output matches the FRD acceptance criteria (UC-001, UC-002).

> **GitHub MCP = project management in chat.** Creating issues, reading PR status, and requesting changes all happen in Copilot Chat — the same place where you generate code and docs.

---

**Return to VS Code Track**: [Exercise 08 — Build & Debug](exercise-13-build-debug.md)

**CLI Track**: [Build with Copilot CLI →](cli-track.md)
