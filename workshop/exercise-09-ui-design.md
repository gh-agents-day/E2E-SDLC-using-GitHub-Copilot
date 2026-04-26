# Exercise 09 — Design & Scaffold the Task Management UI

| | |
|---|---|
| **Duration** | 5 minutes |
| **Feature** | Local Agent — UI Scaffolding from API Spec |
| **Goal** | Use Copilot to scaffold a frontend for the ITMS that lists tasks and shows individual task details |

---

## Background

Your ITMS API is now running. This exercise builds the read-facing UI that team members use to browse and inspect tasks. Copilot reads the **FRD user stories** and the **running API routes** to scaffold components already wired to real endpoints.

The UI covers two views:
- **Task List** — a table of all tasks from `GET /api/v1/tasks`
- **Task Detail** — full task information from `GET /api/v1/tasks/:id`

---

## Step 1 — Scaffold the UI Project

In Copilot Chat (Agent mode, Local agent), send:

```
Read src/routes/v1/tasks.ts and src/routes/v1/users.ts to understand all available API endpoints.

Scaffold a frontend project for the ITMS inside a new ui/ folder at the workspace root.

Requirements:
- Framework: React + TypeScript + Vite
- Folder structure:
    ui/src/components/    ← reusable UI components
    ui/src/pages/         ← full-page views
    ui/src/services/      ← API client functions
    ui/src/types/         ← TypeScript types mirroring API response shapes
- Create ui/src/types/task.types.ts with these exact types:
    - TaskStatus: 'TO_DO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED'
    - TaskPriority: 'LOW' | 'MEDIUM' | 'HIGH'
    - Task: { id, title, description, priority, status, assignedUserId, estimatedCompletionDate, completedAt, createdBy, createdAt, updatedAt }
    - User: { id, email, firstName, lastName, role }
    - TaskStatusHistory: { id, taskId, previousStatus, newStatus, changedBy, changedAt, note }
    - TaskDependency: { id, taskId, dependsOnTaskId, createdBy, createdAt }
    - ApiEnvelope<T>: { success, data, error, meta: { requestId, timestamp, page?, limit?, total? } }
- Create ui/src/services/api.ts as a shared Fetch client that:
    - Reads base URL from VITE_API_BASE_URL (default: http://localhost:3000/api/v1)
    - Exports these functions, each returning unwrapped data from the envelope:
        listTasks(filters?: { status?, priority?, assignedUserId? }): Promise<Task[]>
        getTask(id: string): Promise<Task>
        listUsers(): Promise<User[]>
        getTaskHistory(id: string): Promise<TaskStatusHistory[]>
        getTaskDependencies(id: string): Promise<TaskDependency[]>
        updateTaskStatus(id: string, body: { status: TaskStatus, changedBy: string, note: string }): Promise<Task>
- Create ui/.env.example:
    VITE_API_BASE_URL=http://localhost:3000/api/v1

Do NOT implement any page content yet — scaffolding, types, and API client only.
```

---

## Step 2 — Generate the Task List Page

The Task List maps to **UC-005 (List Tasks)** in `doc/frd.md`. Send:

```
Read ui/src/services/api.ts and ui/src/types/task.types.ts.

Generate ui/src/pages/TaskListPage.tsx — the main dashboard. It must:

1. On load, call both listTasks() and listUsers() in parallel (Promise.all).
   Build a Map<userId, "FirstName LastName"> from the users response.

2. Render a summary bar at the top showing live counts from the loaded tasks:
   Total | Completed | In Progress | Blocked | To Do
   Each count in a coloured pill (match StatusBadge colours).

3. Render filter controls below the summary bar:
   - Status dropdown: All | TO_DO | IN_PROGRESS | BLOCKED | COMPLETED
   - Priority dropdown: All | LOW | MEDIUM | HIGH
   - Assigned To dropdown: All | <each user's full name>
   When any filter changes, re-call listTasks() with the selected filters.

4. Render the filtered tasks in a table with these exact columns:
   Task ID (short — first 8 chars + "…") | Title | Priority | Status | Assigned To (full name) | Due Date
   - Status column uses StatusBadge component
   - Each row is clickable and navigates to /tasks/:id

5. Extract StatusBadge into ui/src/components/StatusBadge.tsx
   Colour map: COMPLETED=green (#d4edda/#155724), IN_PROGRESS=blue (#cce5ff/#004085),
   BLOCKED=red (#f8d7da/#721c24), TO_DO=grey (#e2e3e5/#383d41)

Wire this page as the default route /.
Keep each component under 50 lines — extract SummaryBar into ui/src/components/SummaryBar.tsx.
```

---

## Step 3 — Generate the Task Detail Page

Task Detail maps to **UC-004 (Task Detail)** in `doc/frd.md`. Send:

```
Read ui/src/services/api.ts and ui/src/types/task.types.ts.

Generate ui/src/pages/TaskDetailPage.tsx. On mount, call these three APIs in parallel:
  getTask(id), getTaskHistory(id), getTaskDependencies(id)
Also call listUsers() to resolve user names.

The page must have three sections inside one card layout:

SECTION 1 — Task Info Card
  - Header row: task title (h2) + StatusBadge on the right
  - Fields table: Description | Priority | Assigned To (full name) | Due Date | Completed At | Created At

SECTION 2 — Dependencies (FR-3: Task Dependency Management)
  - Heading: "Dependencies"
  - If no dependencies: show "No dependencies"
  - If dependencies exist: render a table with columns:
    Depends On (task ID, first 8 chars) | Status of that dependency (fetch via getTask for each dependsOnTaskId)
  - If any dependency status is not COMPLETED, show a warning banner:
    "⚠️ This task is blocked by incomplete dependencies"

SECTION 3 — Status History (FR-4: Status Tracking)
  - Heading: "Status History"
  - Table columns: Date | Changed By (resolve user name) | From | To | Note
  - Most recent entry first (sort by changedAt descending)

SECTION 4 — Update Status (FR-4: Status Tracking)
  - Heading: "Update Status"
  - A small inline form:
      Status dropdown: TO_DO | IN_PROGRESS | BLOCKED | COMPLETED
      Note input (text, optional)
      changedBy: hardcode the first user from listUsers() for now (no auth)
      Submit button "Update Status"
  - On submit, call updateTaskStatus(id, { status, changedBy, note })
  - On success, refresh all three data fetches and show "Status updated" confirmation

Add a "← Back to Task List" button at the top.
Wire this page at route /tasks/:id.
```

---

## Step 4 — Wire Router, Apply Visual Design, and Run the UI

Once both pages are scaffolded, send:

```
Wire ui/src/App.tsx with BrowserRouter: "/" → TaskListPage, "/tasks/:id" → TaskDetailPage, catch-all → redirect "/".

Replace ui/src/index.css with a clean ITMS design system:
- Inter font via Google Fonts
- CSS variables for colour, spacing, shadow, and radius
- Utility classes: .itms-header (sticky dark-navy bar), .itms-main (centred column),
  .card (white surface, shadow), .data-table (styled table with hover),
  .summary-bar / .summary-chip with coloured variants (total/done/inprog/blocked/todo),
  .filter-bar, .btn-primary, .btn-ghost, .form-input, .badge-* (status pills),
  .alert-warn, .toast-ok/.toast-err, .priority-high/medium/low
Update all components to use these classes instead of inline styles.
Set index.html <title> to "ITMS — Intelligent Task Management".

Then run: cd ui && npm install react-router-dom && npm run dev -- --port 5173

Verify: task list shows summary counts, filters work, names show (not UUIDs),
clicking a row opens detail with dependencies, history, and a working status-update form.
```

If any step fails, diagnose the error and apply the fix before moving on.

> **Both servers must be running**: the API on port 3000 (Exercise 08) and the UI dev server on port 5173.

---

## Checkpoint — UI Complete ✅

At the end of this exercise you should have:

```
ui/
├── src/
│   ├── components/
│   │   └── StatusBadge.tsx
│   ├── pages/
│   │   ├── TaskListPage.tsx
│   │   └── TaskDetailPage.tsx
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── task.types.ts
└── .env.example
```

Each page traces back to a `UC-ID` in `doc/frd.md` — the same document that drove the API and the tests.

---

## Key Takeaway

> The same document-driven workflow — **FRD → architecture → prompt → Copilot generates** — works equally well for UI as it did for the API. You did not write a single component from scratch; you directed Copilot by referencing the FRD use cases and the exact API routes already in your workspace.

---

**Next**: [Exercise 10 — Write Tests](exercise-10-testing.md)