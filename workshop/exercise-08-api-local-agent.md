# Exercise 08 — Build APIs with a Copilot Skill

| | |
|---|---|
| **Duration** | 20 minutes |
| **Feature** | GitHub Copilot — Skills + Agent Mode |
| **Goal** | Create a reusable, language-agnostic Copilot skill and invoke it to build the core ITMS REST API |

---

## What We Are Building

You are building the **Intelligent Task Management System (ITMS)** REST API — a backend service that lets a software team create tasks and view task details.

This exercise focuses on **3 core endpoints**:

| # | Use Case | What It Does | Endpoint |
|---|----------|--------------|----------|
| UC-001 | Task Creation | Create a task; status always starts as `To Do` | `POST /api/v1/tasks` |
| UC-005 | List Tasks | List all tasks with optional filters | `GET /api/v1/tasks` |
| UC-004 | Task Detail | Get a single task by its ID | `GET /api/v1/tasks/:id` |

**Architecture — three layers:**

```
Request → Controller (parse & respond)
              ↓
          Service (business logic & rules)
              ↓
        Repository (reads/writes JSON files)
```

**No database.** All data lives in four JSON files loaded into memory at startup. Every write is persisted back to disk immediately.

---

## Before You Start

**Confirm your Copilot Chat settings:**
- Mode: **Agent** (not Ask or Edit)
- Agent: **GitHub Copilot** (default local agent)

**Prerequisite:** `.github/copilot-instructions.md` from Exercise 01 must exist. The skill reads it to detect your language and framework. If it is missing, complete Exercise 01 first.

---

## Step 1 — Create the `build-api` Skill

A **skill** is a reusable, on-demand workflow stored in a `SKILL.md` file. You describe what the skill should do; Copilot writes the skill instructions. From then on, one short prompt invokes the full workflow — for any language.

**Copy and paste this prompt into Copilot Chat:**

```
/create-skill Name: build-api | Save: .github/skills/build-api/SKILL.md | Format: numbered phases, NO code blocks, NO example code

Phase 1 — Detect stack: Read .github/copilot-instructions.md → identify language, framework, data strategy.
Phase 2 — Scaffold: Entry point, /api/v1 router, JSON body parser, error middleware, folder structure per stack. Health check: GET /api/v1/health → {success:true, data:{status:"ok", timestamp, version:"1.0.0"}}.
Phase 3 — Data: Copy workshop/sample-data/*.json to: TypeScript→src/data/ | Python→app/data/ | Java→src/main/resources/data/ | C#→Data/. Load into memory on startup.
Phase 4 — Repository: In-memory store — findAll(filters), findById, create, updateStatus. No DB drivers. Persist every write to JSON immediately.
Phase 5 — Endpoints (all responses: {success, data, error, meta}): POST /api/v1/tasks — title required, priority in [Low|Medium|High], assignedUserId must exist, new status always="To Do", invalid input→400 VALIDATION_ERROR. GET /api/v1/tasks — filters: status, priority, assignedUserId; meta: total, page, limit. GET /api/v1/tasks/:id — 404 NOT_FOUND if missing.
Phase 6 — Verify: Start server. curl: GET /health→success:true | GET /tasks→data is array | POST /tasks valid body→data.status="To Do" | GET /tasks/:id→data is object | POST /tasks {}→400 VALIDATION_ERROR.
```

> **What to expect:** Copilot creates `.github/skills/build-api/SKILL.md` — a structured set of plain-English instruction phases, no code. The skill is now reusable for any project in any language.

---

**Verify the skill before continuing:**

- [ ] File exists at `.github/skills/build-api/SKILL.md`
- [ ] File contains 6 numbered phases — no code blocks or example code
- [ ] Phase 1 references reading `.github/copilot-instructions.md`

> **If the skill contains code examples**, tell Copilot: `Rewrite .github/skills/build-api/SKILL.md using plain instruction prose only — no code blocks, no example implementations.`

---

## Step 2 — Invoke the Skill to Build the API

**Copy and paste this prompt into Copilot Chat:**

```
Read and follow .github/skills/build-api/SKILL.md to build the ITMS REST API.
```

> **What to expect:** The agent reads your skill, detects your stack from `copilot-instructions.md`, scaffolds the project, copies the seed data, builds the repository layer, implements the 3 endpoints, and runs the curl verification tests — all driven by the skill you created in Step 1. Results will match your chosen language and framework.

---

## Key Takeaways

- **Skills are reusable, language-agnostic workflows.** The `build-api` skill you wrote in Step 1 works for TypeScript, Python, Java, or C# — because it reads `copilot-instructions.md` to detect the stack rather than hardcoding it.
- **Short prompt, consistent output.** A precisely-specified `/create-skill` prompt (spec-sheet style, no code) produces a clean SKILL.md every time. The invoke prompt is a single line.
- **Your standards applied automatically.** The response envelope, validation, error handling, and logging all came from `copilot-instructions.md` — you didn't repeat them in the prompt.
- **Three-layer architecture.** Controllers never touch data files; repositories are the only place data is read or written. This separation is enforced by the skill, not by you hand-holding every prompt.
- **Exercise 15** uses the same skill pattern for the Context Map — a skill you run once to give Copilot accurate codebase awareness across all future prompts.

---

**Next**: [Exercise 09 — Design & Scaffold the Task Management UI](exercise-09-ui-design.md)

> **Optional exercises** you can complete before Exercise 13:
> - [Exercise 15 — Context Map Skill](exercise-15-context-map.md) — generate a codebase map that enriches all future prompts
> - [Exercise 16 — Database & SQL](exercise-16-database-sql.md) — generate the schema, migrations, and swap the repository layer to a real database
