# Exercise 05 — Build the API

| | |
|---|---|
| **Duration** | 15 minutes |
| **Feature** | GitHub Copilot — Skills + Agent Mode |
| **Goal** | Create a reusable Copilot skill and use it to build two REST API endpoints |

---

## What We Are Building

Two endpoints for the **Intelligent Task Management System (ITMS)**:

| # | Endpoint | Description |
|---|----------|-------------|
| 1 | `POST /api/v1/tasks` | Create a task; status always starts as `TO_DO` |
| 2 | `GET /api/v1/tasks` | List tasks with optional filters (status, priority, assignedUserId) |

**Architecture — three layers:**

```
Request → Controller (parse & respond)
              ↓
          Service (business logic & validation)
              ↓
        Repository (reads/writes JSON files)
```

**No database.** All data lives in JSON files loaded into memory at startup. Every write is persisted back to disk immediately.

---

## Before You Start

- Mode: **Agent** (not Ask or Edit)
- Agent: **GitHub Copilot** (default local agent)
- Prerequisite: `.github/copilot-instructions.md` from Exercise 01 must exist.

---

## Step 1 — Create the `build-api` Skill

A **skill** is a reusable, on-demand workflow stored in a `SKILL.md` file. You describe what the skill should do; Copilot writes the skill instructions. From then on, one short prompt invokes the full workflow — for any language.

**Copy and paste this prompt into Copilot Chat:**

```
/create-skill Name: build-api | Save: .github/skills/build-api/SKILL.md | Format: numbered phases, NO code blocks, NO example code

Phase 1 — Detect stack: Read .github/copilot-instructions.md → identify language, framework, data strategy.
Phase 2 — Scaffold: Entry point, /api/v1 router, JSON body parser, error middleware, folder structure per stack. Health check: GET /api/v1/health → {success:true, data:{status:"ok", timestamp, version:"1.0.0"}}.
Phase 3 — Data: Copy workshop/sample-data/*.json to: TypeScript→src/data/ | Python→app/data/ | Java→src/main/resources/data/ | C#→Data/. Load into memory on startup.
Phase 4 — Repository: In-memory store for tasks and users — findAll(filters), findById, create. No DB drivers. Persist every write to JSON immediately.
Phase 5 — Endpoints (all responses: {success,data,error,meta}):
  POST /api/v1/tasks — title required, priority in [LOW|MEDIUM|HIGH], assignedUserId must exist in users data, status always TO_DO, invalid→400 VALIDATION_ERROR, unknown user→404 NOT_FOUND.
  GET /api/v1/tasks — optional query filters: status, priority, assignedUserId; response includes meta with total count.
Phase 6 — Verify: Start server. curl: GET /health→success:true | GET /tasks→array | POST valid task→status TO_DO | POST {}→400 VALIDATION_ERROR | GET ?status=TO_DO→filtered results.
```

> **What to expect:** Copilot creates `.github/skills/build-api/SKILL.md` — a structured set of plain-English instruction phases, no code. The skill is now reusable for any project in any language.

---

**Verify the skill before continuing:**

- [ ] File exists at `.github/skills/build-api/SKILL.md`
- [ ] File contains 6 numbered phases — no code blocks or example code
- [ ] Phase 1 references reading `.github/copilot-instructions.md`
- [ ] Phase 5 lists exactly 2 endpoints: POST and GET `/api/v1/tasks`

> **If the skill contains code examples**, tell Copilot: `Rewrite .github/skills/build-api/SKILL.md using plain instruction prose only — no code blocks, no example implementations.`

---

## Step 2 — Invoke the Skill to Build the API

**Copy and paste this prompt into Copilot Chat:**

```
Read and follow .github/skills/build-api/SKILL.md to build the ITMS REST API.
```

> **What to expect:** The agent reads your skill, detects your stack from `copilot-instructions.md`, scaffolds the project, copies the seed data, builds the repository layer, implements the 2 endpoints, and runs the curl verification tests.

---

## Step 3 — Verify the Running API

Once the server starts, run these checks:

```bash
# Health check
curl -s http://localhost:3000/api/v1/health | jq .

# List all tasks (should return seeded tasks)
curl -s http://localhost:3000/api/v1/tasks | jq .

# Create a valid task (replace USER_ID with a real ID from src/data/users.json)
curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Implement Login","priority":"HIGH","assignedUserId":"<USER_ID>"}' | jq .

# Create with missing title — should return 400 VALIDATION_ERROR
curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"priority":"HIGH"}' | jq .

# List with filter
curl -s "http://localhost:3000/api/v1/tasks?status=TO_DO" | jq .
```

**Expected results:**

- [ ] `GET /health` → `{success: true, data: {status: "ok"}}`
- [ ] `GET /tasks` → array of tasks from seed data
- [ ] `POST` valid task → `{success: true, data: {status: "TO_DO", ...}}`
- [ ] `POST` without title → `{success: false, error: {code: "VALIDATION_ERROR"}}`
- [ ] `GET ?status=TO_DO` → filtered task list

---

## Key Takeaways

- **Skills are reusable, language-agnostic workflows.** The `build-api` skill works for TypeScript, Python, Java, or C# — it reads `copilot-instructions.md` to detect the stack.
- **Short prompt, consistent output.** A precisely-specified `/create-skill` prompt produces a clean SKILL.md every time. The invoke prompt is a single line.
- **Your standards applied automatically.** The response envelope, validation, error handling, and logging all came from `copilot-instructions.md`.

---

**Next**: [Exercise 06 — Build the UI](exercise-09-ui-design.md)

> **Optional tracks**: See [CLI Track](cli-track.md) or [Cloud Agent Track](cloud-agent-track.md) to build this same API using Copilot CLI `/plan`+`/fleet` or the Copilot Coding Agent via GitHub Issues.
