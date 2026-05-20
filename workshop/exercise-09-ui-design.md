# Exercise 06 — Build the UI

| | |
|---|---|
| **Duration** | 10 minutes |
| **Feature** | Local Agent — UI Scaffolding from API Spec |
| **Goal** | Scaffold a frontend with two pages: Task List and Create Task |

---

## What We Are Building

Two UI pages that match the two API endpoints:

| Page | API | Use Case |
|------|-----|----------|
| **Task List** | `GET /api/v1/tasks` | UC-002 — browse and filter tasks |
| **Create Task** | `POST /api/v1/tasks` | UC-001 — submit the create-task form |

---

## Before You Start

Confirm the API from Exercise 05 is running on port 3000:

```bash
curl -s http://localhost:3000/api/v1/health | jq .
```

---

## Step 1 — Scaffold the UI Project

In Copilot Chat (Agent mode, Local agent), send:

```
Read src/routes/v1/tasks.ts (or equivalent for your stack). Scaffold ui/ with React + TypeScript + Vite, folders: components/ pages/ services/ types/, and ui/.env.example. Create:
- ui/src/types/task.types.ts: TaskStatus='TO_DO'|'IN_PROGRESS'|'BLOCKED'|'COMPLETED', TaskPriority='LOW'|'MEDIUM'|'HIGH', Task (id, title, description, priority, status, assignedUserId, estimatedCompletionDate), User (id, name, email), and ApiEnvelope<T>.
- ui/src/services/api.ts: base URL from VITE_API_BASE_URL (default http://localhost:3000/api/v1), and two functions: listTasks(filters?: {status?, priority?, assignedUserId?}) and createTask(body). Return unwrapped envelope data.
No pages yet.
```

---

## Step 2 — Generate the Task List Page

The Task List page maps to **UC-002 (List Tasks)**. Send:

```
Read ui/src/services/api.ts and ui/src/types/task.types.ts. Create TaskListPage as the root route (/):
- Load listTasks() on mount; show loading state.
- Filter bar: status dropdown, priority dropdown — re-fetch on change.
- Table columns: ID (first 8 chars), title, priority, status (StatusBadge), assigned user (name from users if available), due date.
- Extract StatusBadge component (TO_DO=grey, IN_PROGRESS=blue, BLOCKED=red, COMPLETED=green).
- "New Task" button that navigates to /tasks/new.
Keep each component under 60 lines.
```

---

## Step 3 — Generate the Create Task Page

The Create Task page maps to **UC-001 (Create Task)**. Send:

```
Read ui/src/services/api.ts and ui/src/types/task.types.ts. Create TaskCreatePage at /tasks/new:
- Form fields: title (required text), description (optional textarea), priority (dropdown LOW/MEDIUM/HIGH, default MEDIUM), estimatedCompletionDate (date picker, optional).
- On submit: call createTask(); show inline validation error if title missing; show API error message if request fails.
- On success: navigate to the Task List (/).
- "Cancel" button that returns to /.
```

---

## Step 4 — Wire Router and Run the UI

Once both pages are scaffolded, send:

```
Wire BrowserRouter: / -> TaskListPage, /tasks/new -> TaskCreatePage, catch-all -> /.
Install react-router-dom if needed.
Run Vite on port 5173 and verify:
1. Task list loads with seeded tasks
2. Filters work (try status=TO_DO)
3. "New Task" navigates to the form
4. Submit a valid task — list refreshes with new task
5. Submit without title — inline error shown
```

---

## Checkpoint — UI Complete ✅

```
ui/
├── src/
│   ├── components/
│   │   └── StatusBadge.tsx
│   ├── pages/
│   │   ├── TaskListPage.tsx
│   │   └── TaskCreatePage.tsx
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── task.types.ts
└── .env.example
```

**Manual verification:**
- [ ] `http://localhost:5173` loads TaskListPage with task table
- [ ] Status and priority filters re-fetch and update the table
- [ ] "New Task" button navigates to `/tasks/new`
- [ ] Creating a task with valid fields succeeds and redirects to task list
- [ ] Creating a task without a title shows an inline error

---

## Key Takeaway

> The same document-driven workflow — **FRD → prompt → Copilot generates** — works for UI as well as for the API. You directed Copilot by referencing the FRD use cases and the exact API routes already in your workspace.

---

**Next**: [Exercise 07 — Testing](exercise-11-testing.md)

> **Optional tracks**: See [CLI Track](cli-track.md) or [Cloud Agent Track](cloud-agent-track.md) to build additional UI features (pagination, task detail page) using Copilot CLI or the Coding Agent.