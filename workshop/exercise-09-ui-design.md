# Exercise 09 — Build the UI

| | |
|---|---|
| **Duration** | 10 minutes |
| **Feature** | GitHub Copilot — Agent Mode + Prompt File |
| **Goal** | Run `/ui` to scaffold the React frontend and verify it against the live API |

---

## Before You Start

- API running on port 3000 (Exercise 08) ✅
- `ui.prompt.md` authored in Exercise 07 ✅
- Mode: **Agent**, Agent: **GitHub Copilot**

---

## Step 1 — Invoke the UI Prompt

In Copilot Chat, type:

```
/ui
```

> Copilot reads `doc/frd.md` and the API routes, scaffolds `ui/`, creates types, the API service, both pages, wires the router, and starts Vite on port 5173.

---

## Step 2 — Verify the File Structure

```
ui/
├── src/
│   ├── components/StatusBadge.tsx
│   ├── pages/TaskListPage.tsx
│   ├── pages/TaskCreatePage.tsx
│   ├── services/api.ts
│   └── types/task.types.ts
└── .env.example
```

- [ ] All files above exist
- [ ] `api.ts` reads `VITE_API_BASE_URL`

---

## Step 3 — Verify the Running UI

Open `http://localhost:5173`:

- [ ] Task list loads with seeded tasks
- [ ] Status and priority filters re-fetch on change
- [ ] **New Task** navigates to `/tasks/new`
- [ ] Valid submission redirects to `/` with new task in list
- [ ] Empty title shows inline error (no API call)

---

## Key Takeaway

> The prompt file from Exercise 07 encoded all UI standards once — tech stack, folder layout, API wiring, validation rules. Exercise 09 consumed it with a single `/ui` command.

---

**Next**: [Exercise 10 — CLI Fleet & Coding Agent](exercise-10-cli-fleet-and-coding-agent.md)