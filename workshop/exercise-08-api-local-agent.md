# Exercise 08 — Build APIs with the Local Agent

| | |
|---|---|
| **Duration** | 15 minutes |
| **Feature** | GitHub Copilot — Agent Mode |
| **Goal** | Use Copilot Agent mode to build and run the core ITMS REST API — no database required |

---

## What We Are Building

You are building the **Intelligent Task Management System (ITMS)** REST API — a backend service that lets a software team create tasks and view task details.

This simplified exercise focuses on **3 core endpoints**:

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

**No database.** All data lives in four JSON files under `src/data/`. Every write is persisted immediately with `fs.writeFileSync`.

---

## Before You Start

**Confirm your Copilot Chat settings:**
- Mode: **Agent** (not Ask or Edit)
- Agent: **GitHub Copilot** (default local agent)

The agent will read your workspace files, create and edit source files, and run terminal commands — all automatically.

---

## Step 1 — Scaffold the Project Structure

Before writing any business logic, use Copilot to generate the project skeleton — the entry point, folder layout, health check, and configuration files.

**Copy and paste this prompt into Copilot Chat:**

```
Read #file:doc/tsd.md and scaffold the initial project structure for the
ITMS REST API using TypeScript and Express.

Create:
1. package.json — include express, dotenv, zod, uuid, helmet,
   express-rate-limit as dependencies; typescript, tsx, @types/express,
   @types/node, jest, supertest as devDependencies. Add scripts:
   dev (tsx watch src/server.ts), build (tsc), start (node dist/server.js),
   test (jest).

2. tsconfig.json — strict mode, target ES2020, moduleResolution node,
   outDir dist, rootDir src.

3. .env.example:
   PORT=3000
   NODE_ENV=development

4. src/server.ts — entry point that calls app.listen() on PORT from .env.

5. src/app.ts — Express app setup (no listen). Mount /api/v1 router.
   Apply helmet and express.json() middleware.

6. src/config/constants.ts — export APP_VERSION = "1.0.0"

7. src/routes/v1/index.ts — v1 router that registers sub-routes.

8. Health check: GET /api/v1/health → { success: true, data: { status: "ok",
   timestamp: <ISO 8601>, version: "1.0.0" } }

9. Create empty placeholder folders (with .gitkeep) for:
   src/controllers, src/services, src/repositories, src/middleware,
   src/errors, src/types, src/validators, src/utils, src/data

Do NOT implement business logic — scaffolding only.
Follow all standards in .github/copilot-instructions.md.
```

> **What to expect:** The agent creates the file structure, installs dependencies, and starts the server. You can verify the scaffold is working with: `curl http://localhost:3000/api/v1/health`

---

## Step 2 — Copy the Seed Data

The JSON data files are already prepared in `workshop/sample-data/`. Copy them into `src/data/` so the API has data to work with.

Copy the files manully or run this in the terminal:

```bash
# Windows
copy workshop\sample-data\*.json src\data\

# macOS / Linux
cp workshop/sample-data/*.json src/data/
```

**What's in the seed data?**
- 5 users (1 Project Manager, 1 Team Lead, 2 Developers, 1 QA Engineer)
- 10 tasks covering every status and priority combination
- 3 dependency links (2 tasks intentionally blocked)
- 6 status history entries showing realistic task progression

---

## Step 3 — Build the Data Layer

**Copy and paste this prompt into Copilot Chat:**

```
Read #file:doc/frd.md sections UC-001 to UC-006 and the existing files in
src/repositories/. Build the complete data access layer for the ITMS API.

The data files are already in src/data/ (tasks.json, users.json,
task_dependencies.json, task_status_history.json).

Create or complete these files:

1. src/repositories/json-store.ts
   Generic JsonRepository<T> class with: findAll(filters?), findById(id),
   create(item), update(id, patch), delete(id).
   Reads the JSON file into memory on startup. Every write calls
   fs.writeFileSync to persist changes immediately.

2. src/repositories/task.repository.ts
   Uses JsonRepository for tasks, history, and dependencies.
   Exports: findAll(filters, page, limit), findById(id), create(data),
   updateStatus(id, status, changedBy, note), findHistory(taskId),
   findDependencies(taskId).

3. src/repositories/user.repository.ts
   Uses JsonRepository for users.
   Exports: findAll(), findById(id), findByEmail(email).

Follow all standards in .github/copilot-instructions.md.
```

> **What to expect:** The agent creates the three repository files, defines TypeScript interfaces for `Task`, `User`, `TaskStatusHistory`, and `TaskDependency`, and wires them to the JSON files in `src/data/`.

---

## Step 4 — Build the Task API Endpoints

**Copy and paste this prompt into Copilot Chat:**

```
Read #file:doc/frd.md (UC-001, UC-004, UC-005) and implement the task management
endpoints. Use the repository layer in src/repositories/ — never read JSON
files directly in a service or controller.

Implement these three endpoints:

  POST   /api/v1/tasks     — Create a task (UC-001)
  GET    /api/v1/tasks     — List all tasks with optional filters:
                             status, priority, assignedUserId, page, limit (UC-005)
  GET    /api/v1/tasks/:id — Get a single task by ID (UC-004)

Business rules to enforce:
  - New tasks always start with status "To Do"
  - Status must be one of: To Do, In Progress, Blocked, Completed
  - Priority must be one of: Low, Medium, High
  - assignedUserId must reference a user that exists in users.json

Create: src/services/task.service.ts, src/controllers/task.controller.ts,
src/routes/v1/tasks.ts. Mount routes at /api/v1 in src/app.ts.

Every response must use the envelope: { success, data, error, meta }.
Follow all standards in .github/copilot-instructions.md.
```

> **What to expect:** The agent creates the service, controller, and route files, adds Zod validation, wires error handling to the central error middleware, and mounts the three routes in `app.ts`.

---

## Step 5 — Run and Verify

**Copy and paste this prompt into Copilot Chat:**

```
Start the application and verify the ITMS endpoints are working. Run these
curl tests in order and confirm each response uses the
{ success, data, error, meta } envelope:

1. Health check
   GET /api/v1/health

2. List all tasks
   GET /api/v1/tasks

3. Create a new task (use a valid user id from src/data/users.json)
   POST /api/v1/tasks
   Body: { "title": "Test task", "priority": "High", "assignedUserId": "<id>" }

4. Get the task you just created
   GET /api/v1/tasks/:id

5. Confirm validation — missing title should return 400
   POST /api/v1/tasks with body {}
```

> Confirm that step 4 returns `{ success: true, data: { id, status: "To Do", ... } }` and step 5 returns `{ success: false, error: { code: "VALIDATION_ERROR" } }`.

---

## Key Takeaways

- **Copilot read your standards automatically.** The response envelope, Zod validation, and structured logging came from `copilot-instructions.md` — you didn't have to repeat them in every prompt.
- **Three-layer architecture.** Controllers never touch JSON files; services never import `fs`. The repository is the only place data is read or written. Keeping this clean means the three endpoints you just built can grow to a full API without touching the controller or service layers.
- **FRD → code traceability.** Each prompt referenced a specific use case from `doc/frd.md`, giving the agent accurate context and giving you a clear audit trail from requirement to implementation.

---

**Next**: [Exercise 09 — Design & Scaffold the Task Management UI](exercise-09-ui-design.md)

> **Optional exercises** you can complete before Exercise 13:
> - [Exercise 14 — Background Agent](exercise-14-cli-agent.md) — delegate a long-running task while you keep working
> - [Exercise 15 — Context Map Skill](exercise-15-context-map.md) — generate a codebase map that enriches all future prompts
> - [Exercise 16 — Database & SQL](exercise-16-database-sql.md) — generate the schema, migrations, and swap the repository layer to a real database
