# Exercise 08 — Build the API with a Copilot Skill

| | |
|---|---|
| **Duration** | 15 minutes |
| **Feature** | GitHub Copilot — Skills + Agent Mode |
| **Goal** | Create a reusable `build-api` skill, then invoke it to build two REST endpoints |

---

## What We Are Building

| # | Endpoint | Rule |
|---|----------|------|
| 1 | `POST /api/v1/tasks` | title required; status always `TO_DO` |
| 2 | `GET /api/v1/tasks` | optional filters: status, priority, assignedUserId |

**Architecture:** Request → Controller → Service → Repository (JSON files, in-memory, persisted on write)

---

## Before You Start

- Mode: **Agent** (not Ask or Edit)
- Agent: **GitHub Copilot** (default local agent)
- Prerequisite: `.github/copilot-instructions.md` from Exercise 01 must exist.

---

## Step 1 — Create the `build-api` Skill

A **skill** is a reusable, on-demand workflow stored in a `SKILL.md` file. You describe what the skill should do; Copilot writes the skill instructions.

**Paste this into Copilot Chat:**

```
/create-skill Name: build-api | Save: .github/skills/build-api/SKILL.md | Format: numbered phases, NO code blocks

Phase 1 — Detect stack: Read .github/copilot-instructions.md → identify language, framework, data strategy.
Phase 2 — Scaffold: Entry point, /api/v1 router, JSON body parser, error middleware. Health check: GET /api/v1/health → {success:true,data:{status:"ok",timestamp,version:"1.0.0"}}.
Phase 3 — Data: Copy workshop/sample-data/*.json → src/data/ (TS) | app/data/ (Python) | src/main/resources/data/ (Java) | Data/ (C#). Load into memory on startup.
Phase 4 — Repository: In-memory store (tasks + users): findAll(filters), findById, create. Persist every write to JSON immediately.
Phase 5 — Endpoints (all responses: {success,data,error,meta}):
  POST /api/v1/tasks — title required, priority∈[LOW|MEDIUM|HIGH], assignedUserId must exist, status=TO_DO; invalid→400 VALIDATION_ERROR, unknown user→404 NOT_FOUND.
  GET /api/v1/tasks — filter by status/priority/assignedUserId; meta.total = count.
Phase 6 — Verify: curl GET /health→success:true | GET /tasks→array | POST valid→TO_DO | POST {}→400 | GET ?status=TO_DO→filtered.
```

**Verify before continuing:**
- [ ] `.github/skills/build-api/SKILL.md` exists
- [ ] Contains 6 numbered phases — no code blocks
- [ ] Phase 1 references `.github/copilot-instructions.md`

> If the skill has code examples, tell Copilot: `Rewrite .github/skills/build-api/SKILL.md using plain instruction prose only — no code blocks.`

---

## Step 2 — Invoke the Skill

**Paste this into Copilot Chat:**

```
Read and follow .github/skills/build-api/SKILL.md to build the ITMS REST API.
```

> The agent reads your skill, detects your stack, scaffolds the project, seeds data, builds the repository, implements the 2 endpoints, and runs the curl verification steps.

---

## Step 3 — Verify the Running API

```bash
curl -s http://localhost:3000/api/v1/health | jq .
curl -s http://localhost:3000/api/v1/tasks | jq .
curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Implement Login","priority":"HIGH","assignedUserId":"<USER_ID>"}' | jq .
curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"priority":"HIGH"}' | jq .
curl -s "http://localhost:3000/api/v1/tasks?status=TO_DO" | jq .
```

- [ ] `GET /health` → `{success: true, data: {status: "ok"}}`
- [ ] `GET /tasks` → array of seeded tasks
- [ ] `POST` valid task → `{success: true, data: {status: "TO_DO", ...}}`
- [ ] `POST` without title → `{success: false, error: {code: "VALIDATION_ERROR"}}`
- [ ] `GET ?status=TO_DO` → filtered list

---

## Key Takeaways

- **Skills are reusable and language-agnostic** — `build-api` works for TypeScript, Python, Java, or C#; it auto-detects the stack from `copilot-instructions.md`.
- **Short prompt, consistent output** — the invoke prompt is a single line.
- **Your standards applied automatically** — envelope, validation, error handling, and logging all come from `copilot-instructions.md`.

---

**Next**: [Exercise 09 — Build the Create Task UI](exercise-09-ui-design.md)
