# Exercise 07 — Author the UI Prompt File

| | |
|---|---|
| **Duration** | 5 minutes |
| **Feature** | Prompt Files (`.prompt.md`) |
| **Goal** | Write the `ui.prompt.md` prompt that Copilot will use in Exercise 09 to scaffold the React UI |

---

## Background

Understand reusable prompt files to generate Ui components, pages, types, and services from the API spec and TSD.

> **Why React?** The TSD does not specify a UI stack. We use **React 18 + TypeScript + Vite** for this workshop — this is fixed regardless of the backend language you chose in Exercise 01.

---

## Step 1 — Open the Prompt File

From settings select prompts - new prompt- workspace level- name Ui - create `.github/prompts/ui.prompt.md` and open it.

---

## Step 2 — Replace the Content

Replace the file contents with:

```markdown
---
name: ui
description: "Scaffold the ITMS React UI from the tsd and API spec."
---

Read #file:doc/tsd.md for the API contract (endpoints, request/response shapes, envelope format).

Scaffold ui/ using React 18 + TypeScript + Vite with folders: components/ pages/ services/ types/.
Ensure all generated files have zero unused imports or local variables to satisfy strict tsconfig rules.

Create:
- ui/src/vite-env.d.ts — Contains `/// <reference types="vite/client" />` to register Vite's environment types.
- ui/src/types/task.types.ts — TaskStatus (TO_DO|IN_PROGRESS|BLOCKED|COMPLETED), TaskPriority (LOW|MEDIUM|HIGH), Task, User, ApiEnvelope<T>.
- ui/src/services/api.ts — base URL from VITE_API_BASE_URL (default http://localhost:3000/api/v1); export listTasks(filters?) and createTask(body), both unwrap the envelope. Ensure API payload values for status/priority are strictly uppercase.
- ui/src/components/StatusBadge.tsx — colour map: TO_DO=grey, IN_PROGRESS=blue, BLOCKED=red, COMPLETED=green.
- ui/src/pages/TaskListPage.tsx — root route /; load listTasks() on mount; status + priority filter dropdowns that re-fetch on change; table: ID (8 chars), title, priority, StatusBadge (imported and rendered), due date; New Task button → /tasks/new.
- ui/src/pages/TaskCreatePage.tsx — route /tasks/new; fields: title (required), description (optional), priority (default MEDIUM), estimatedCompletionDate (optional);  inline error if title empty; on success navigate to /; Cancel → /, use an existing valid user ID (from users.json) for assignedUserId to satisfy API validation.
- ui/src/main.tsx — Setup BrowserRouter directly in this file: / → TaskListPage, /tasks/new → TaskCreatePage, catch-all → /. Clean up and delete any redundant App.tsx wrappers.
- ui/.env.example — VITE_API_BASE_URL=http://localhost:3000/api/v1

Install react-router-dom if needed. Start Vite on port 5173.

```

---

## Step 3 — Verify

- [ ] `.github/prompts/ui.prompt.md` is saved
- [ ] In Copilot Chat, type `/` — **ui** appears in the command palette

---

**Next**: [Exercise 08 — Build the API](exercise-08-api-local-agent.md)
