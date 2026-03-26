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
Read src/routes/v1/tasks.ts to understand the available API endpoints.

Scaffold a frontend project for the ITMS inside a new ui/ folder at the workspace root.

Requirements:
- Framework: React + TypeScript + Vite
- Folder structure:
    ui/src/components/    ← reusable UI components
    ui/src/pages/         ← full-page views
    ui/src/services/      ← API client functions
    ui/src/types/         ← TypeScript types mirroring API response shapes
- Create ui/src/services/api.ts as a shared Fetch client that:
    - Points to http://localhost:3000/api/v1 by default
    - Reads base URL from VITE_API_BASE_URL environment variable
    - Uses the { success, data, error, meta } envelope types from .github/copilot-instructions.md
- Create ui/.env.example:
    VITE_API_BASE_URL=http://localhost:3000/api/v1
- Add a README note that the API (Exercise 08) must be running before starting the UI

Do NOT implement any page content yet — scaffolding and API client only.
```

---

## Step 2 — Generate the Task List Page

The Task List maps to **UC-005 (List Tasks)** in `doc/frd.md`. Send:

```
Read the GET /api/v1/tasks endpoint (check src/routes/v1/tasks.ts for the exact path and response shape).

Generate ui/src/pages/TaskListPage.tsx:
- Call GET /api/v1/tasks on load and render all tasks in a table
- Table columns: Task ID | Title | Priority | Status | Assigned To | Due Date
- Add a status badge: colour-code Completed (green), In Progress (blue), Blocked (red), To Do (grey)
- Each row should be clickable and navigate to /tasks/:id
- Wire the page into the router as the default route /

Keep each component under 50 lines. Extract the status badge into
ui/src/components/StatusBadge.tsx.
```

---

## Step 3 — Generate the Task Detail Page

Task Detail maps to **UC-004 (Task Detail)** in `doc/frd.md`. Send:

```
Read the GET /api/v1/tasks/:id endpoint (check src/routes/v1/tasks.ts for the response shape).

Generate ui/src/pages/TaskDetailPage.tsx:
- Fetch the task by ID from GET /api/v1/tasks/:id on mount
- Display all task fields in a card layout: title, description, priority, status, assignee, due date, createdAt
- Show a status badge (reuse ui/src/components/StatusBadge.tsx)
- Add a "Back to Task List" link that navigates to /

Wire the page into the router at /tasks/:id.
```

---

## Step 4 — Run the UI

Once both pages are scaffolded, send:


Install UI dependencies and start the development server:
1. cd ui && npm install
2. Start the Vite dev server: npm run dev
3. Open http://localhost:5173 in the browser

Verify:
- Task List page loads and shows all tasks from the live API in a table
- Clicking a row navigates to the Task Detail page
- Task Detail page shows the correct task fields

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