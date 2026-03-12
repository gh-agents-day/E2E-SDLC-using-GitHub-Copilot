# Exercise 09 — Build APIs with the Local Agent

**Duration**: 5 minutes  
**Copilot Feature**: Local (Default) Agent — Agentic Coding  
**Goal**: Use Copilot's local agent to scaffold the project and implement REST API endpoints for task management, backed by a JSON file data store that runs without any database setup.

---

## Background

The **Local Agent** (also called the default Copilot agent in Agent mode) can read your workspace files, create new files, edit existing ones, run terminal commands, and iterate — all within your local VS Code environment. It's the primary tool for hands-on coding.

By this point, your **copilot-instructions.md** is active, so every piece of code the agent writes will follow your team's standards automatically.

> **No database required.** The API in this exercise uses a **JSON file-based data store** by default so everyone can run it immediately. If you want to wire up a real database later, see [Exercise 12 — Database & SQL](exercise-12-database-sql.md) — the repository layer is designed so you can swap the JSON store for a real DB with a single environment variable (`USE_DATABASE=true`).

---

## Step 1 — Switch to Agent Mode

In Copilot Chat:
1. Make sure the **local agent** is selected (not a custom agent)
2. Ensure mode is set to **Agent** (not Ask or Plan)

---

## Step 2 — Scaffold the Project Structure

Send this prompt:

```
Read #tsd.md and the API Design section. Then, scaffold the initial project structure for the ITMS REST API.

Scaffold the initial project structure for the ITMS REST API. Create:
- The root configuration files (package.json / pyproject.toml / pom.xml — match the stack from copilot-instructions.md)
- The folder structure:
    src/routes/
    src/controllers/
    src/services/
    src/repositories/
    src/models/
    src/middleware/
    src/config/
    src/data/          ← JSON flat-file data store (default, no DB needed)
- A basic Express/FastAPI/Spring Boot app entry point that starts on port 3000 / 8000
- Environment variable loading (.env.example with these variables:
    PORT=3000
    NODE_ENV=development
    USE_DATABASE=false       # set to true to switch to a real DB
    DB_CONNECTION_STRING=    # only used when USE_DATABASE=true
  )
- A basic health check endpoint: GET /api/v1/health → { status: "ok", timestamp: <ISO>, version: "1.0.0" }
- A README.md with setup instructions

Do NOT implement any business logic yet — just the scaffolding.
```

Watch the agent create files. When it pauses to ask about choices, make decisions based on your tech stack from Exercise 05.

---

## Step 3 — Create the JSON Data Store

Before building the API endpoints, set up the JSON-based data layer that the API will read from and write to. Send this prompt:

```
Create a JSON-based data store so the API can run without any database connection.

1. Copy the following pre-built seed files from the workshop's sample-data/ folder
   into src/data/ — the data is already consistent and ready to use:

   - [sample-data/users.json](sample-data/users.json) → copy to `src/data/users.json`
   - [sample-data/tasks.json](sample-data/tasks.json) → copy to `src/data/tasks.json`
   - [sample-data/task_dependencies.json](sample-data/task_dependencies.json) → copy to `src/data/task_dependencies.json`
   - [sample-data/task_status_history.json](sample-data/task_status_history.json) → copy to `src/data/task_status_history.json`

   > **What's in the data**: 5 team members (1 PM, 1 TL, 2 Devs, 1 QA) · 10 tasks
   > spanning all priorities (HIGH/MEDIUM/LOW) and statuses (TO_DO/IN_PROGRESS/BLOCKED/COMPLETED)
   > · 3 dependency relationships (two tasks are blocked by incomplete dependencies)
   > · 6 status history entries showing realistic task progression.
   > All IDs cross-reference correctly between files.

2. Create src/repositories/json-store.ts (or equivalent for your stack) — a generic
   JsonRepository<T> class that:
   - Loads the JSON file into memory on startup
   - Implements: findAll(filters?), findById(id), create(item), update(id, patch), delete(id)
   - Writes changes back to the JSON file after each mutation (fs.writeFileSync / equivalent)
   - Is generic / reusable across all entity types

3. Create src/repositories/task.repository.ts (or equivalent) that uses JsonRepository
   to implement task-specific queries:
   - findAll(filters: { status?, priority?, assignedUserId? }): paginated results
   - findById(id)
   - create(taskData)
   - updateStatus(id, newStatus, changedBy, note)
   - addStatusHistoryEntry(entry)

Make sure the data in users.json, tasks.json, and task_dependencies.json is
self-consistent (task assignedUserId values actually exist in users.json, etc.).
```

> **Tip**: If the agent needs more guidance for items 2 and 3, send these as a follow-up prompt:

```
Create the repository layer for the ITMS JSON data store.

1. Create src/repositories/json-store.ts
   - Export a generic class JsonRepository<T extends { id: string }>
   - Constructor accepts a file path (e.g. src/data/tasks.json)
   - On construction: read and parse the JSON file into a private in-memory array
   - Implement these methods:
       findAll(filters?: Partial<T>): T[]
         → return all items; if filters provided, return only items where every
           filter key matches (simple equality check)
       findById(id: string): T | undefined
       create(item: T): T
         → push to the array and write the full array back to the JSON file
       update(id: string, patch: Partial<T>): T | undefined
         → find by id, shallow-merge patch, write back to file, return updated item
       delete(id: string): boolean
         → remove by id, write back to file, return true if found
   - All write operations must use fs.writeFileSync with JSON.stringify(data, null, 2)
     so the files stay human-readable
   - If the JSON file doesn't exist on startup, initialise with an empty array

2. Create src/repositories/task.repository.ts
   - Import JsonRepository and the Task, TaskStatusHistory, TaskDependency types
     from src/models/
   - Instantiate three JsonRepository instances:
       taskRepo       → src/data/tasks.json
       historyRepo    → src/data/task_status_history.json
       dependencyRepo → src/data/task_dependencies.json
   - Export these functions (not a class):

       findAll(filters: { status?: string; priority?: string; assignedUserId?: string },
               page = 1, limit = 20): { data: Task[]; total: number }
         → filter tasks using taskRepo.findAll(filters), then paginate

       findById(id: string): Task | undefined

       create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Task
         → generate a UUID for id, set status to "TO_DO", set createdAt/updatedAt
           to current ISO timestamp, call taskRepo.create()

       updateStatus(id: string, newStatus: string, changedBy: string, note: string): Task
         → read current task, call taskRepo.update(), then call addStatusHistoryEntry()

       addStatusHistoryEntry(entry: Omit<TaskStatusHistory, 'id' | 'changedAt'>): void
         → generate UUID, set changedAt to now, call historyRepo.create()

       findDependencies(taskId: string): TaskDependency[]
         → return all dependency records where taskId matches

       findStatusHistory(taskId: string): TaskStatusHistory[]
         → return all history records where taskId matches

3. Create src/repositories/user.repository.ts
   - Instantiate JsonRepository for src/data/users.json
   - Export: findById(id): User | undefined, findByEmail(email): User | undefined,
     findAll(): User[]

Apply coding standards from .github/copilot-instructions.md throughout.
```

---

## Step 4 — Implement the Task Management API

Now implement the REST endpoints. Send this prompt:

```
Implement the Task Management API endpoints from #tsd.md.

Use the repository layer from src/repositories/task.repository.ts (created in the
previous step) — do NOT query a database directly. The service layer should call the
repository, not raw JSON files.

Create:
1. POST /api/v1/tasks
   - Accepts: { title, description, priority, assignedUserId, dueDate }
   - Validates: title required, priority must be LOW/MEDIUM/HIGH,
     dueDate must be a valid date, assignedUserId must exist in users data
   - Returns 201: { success: true, data: <created task with status "TO_DO"> }
   - Returns 400 on validation failure: { success: false, error: { code: "VALIDATION_ERROR", message: "..." } }

2. GET /api/v1/tasks
   - Query params: status, priority, assignedUserId, page (default 1), limit (default 20)
   - Returns 200: { success: true, data: [...tasks], meta: { total, page, limit } }

3. PATCH /api/v1/tasks/:id/status
   - Accepts: { status } — one of TO_DO / IN_PROGRESS / BLOCKED / COMPLETED
   - Business rule: if any dependency task is not COMPLETED, set status to BLOCKED
     and return { success: false, error: { code: "TASK_BLOCKED", message: "..." } }
     with HTTP 422
   - On success: records a status history entry and returns the updated task
   - Returns 404 if task not found

4. GET /api/v1/tasks/:id
   - Returns a single task with its status history and dependency list (resolved)
   - Returns 404 if not found

Create the corresponding service files in src/services/ and controller files
in src/controllers/. Register routes in src/routes/tasks.ts.

Apply all standards from .github/copilot-instructions.md:
- Input validation using schema library
- Structured logging with request ID
- Proper HTTP status codes
- Response envelope: { success, data, error, meta }
```

> **Tip**: If the agent needs more guidance, send this detailed follow-up prompt:

```
Implement the four ITMS Task Management API endpoints in full. Use the repository
functions from src/repositories/task.repository.ts and src/repositories/user.repository.ts.

--- src/models/task.model.ts ---
Define and export these TypeScript interfaces / enums:
  enum Priority   { LOW = "LOW", MEDIUM = "MEDIUM", HIGH = "HIGH" }
  enum TaskStatus { TO_DO = "TO_DO", IN_PROGRESS = "IN_PROGRESS",
                    BLOCKED = "BLOCKED", COMPLETED = "COMPLETED" }
  interface Task {
    id: string; title: string; description: string;
    priority: Priority; status: TaskStatus;
    assignedUserId: string; estimatedCompletionDate: string;
    createdBy: string; createdAt: string; updatedAt: string;
    completedAt: string | null;
  }
  interface TaskStatusHistory {
    id: string; taskId: string; previousStatus: string; newStatus: string;
    changedBy: string; changedAt: string; note: string;
  }
  interface TaskDependency {
    id: string; taskId: string; dependsOnTaskId: string;
    createdBy: string; createdAt: string;
  }

--- src/services/task.service.ts ---
Export these functions (all throw typed errors — never return raw catches):

  createTask(payload: { title: string; description: string; priority: string;
                        assignedUserId: string; dueDate: string;
                        createdBy: string }): Task
    1. Validate: title not empty, priority in ["LOW","MEDIUM","HIGH"],
       dueDate is a valid ISO date (not in the past), assignedUserId exists via
       userRepository.findById() — throw ValidationError with field-level message if any fail
    2. Call taskRepository.create() with status TO_DO
    3. Return the created task

  listTasks(filters: { status?: string; priority?: string; assignedUserId?: string },
            page: number, limit: number): { data: Task[]; total: number }
    1. Call taskRepository.findAll(filters, page, limit)
    2. Return paginated result as-is

  getTaskById(id: string): Task & { statusHistory: TaskStatusHistory[];
                                     dependencies: TaskDependency[] }
    1. Call taskRepository.findById(id) — throw NotFoundError if missing
    2. Attach taskRepository.findStatusHistory(id) as statusHistory
    3. Attach taskRepository.findDependencies(id) as dependencies
    4. Return the enriched object

  updateTaskStatus(id: string, newStatus: string, changedBy: string, note: string): Task
    1. Fetch task — throw NotFoundError if missing
    2. If newStatus is IN_PROGRESS or COMPLETED:
       - load all dependencies via taskRepository.findDependencies(id)
       - for each dependency, fetch the dependsOnTask via taskRepository.findById()
       - if ANY dependsOnTask.status !== "COMPLETED", throw TaskBlockedError
    3. Call taskRepository.updateStatus(id, newStatus, changedBy, note)
    4. If newStatus is "COMPLETED", set completedAt to current ISO timestamp
    5. Return the updated task

--- src/controllers/task.controller.ts ---
  POST   /api/v1/tasks         → call taskService.createTask(), respond 201
  GET    /api/v1/tasks         → call taskService.listTasks(), respond 200
  GET    /api/v1/tasks/:id     → call taskService.getTaskById(), respond 200
  PATCH  /api/v1/tasks/:id/status → call taskService.updateTaskStatus(), respond 200

All controllers must:
  - Wrap every handler in try/catch
  - Map ValidationError   → 400 { success: false, error: { code: "VALIDATION_ERROR", message, fields? } }
  - Map NotFoundError     → 404 { success: false, error: { code: "NOT_FOUND", message } }
  - Map TaskBlockedError  → 422 { success: false, error: { code: "TASK_BLOCKED", message } }
  - Map unknown errors    → 500 { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } }
  - Always wrap success responses as { success: true, data: <payload>, meta?: <pagination> }
  - Log each request with: method, path, requestId (uuid), statusCode, durationMs

--- src/middleware/error.middleware.ts ---
Create a centralised Express error-handling middleware that applies the same
error-to-response mapping above as a fallback for any unhandled errors.

--- src/routes/tasks.ts ---
Register all four routes on an Express Router and export it.
Mount the router in the app entry point at /api/v1.

--- src/errors/ ---
Create ValidationError, NotFoundError, and TaskBlockedError classes, each extending
a base AppError class that carries a statusCode and code string property.
```

---

## Step 5 — Verify the APIs

Once the agent finishes, send:

```
Start the application in the terminal. Then test all four endpoints with curl and show
me the commands and their expected JSON responses:

1. GET  /api/v1/health
2. POST /api/v1/tasks     — create a new High priority task with a valid assignedUserId from src/data/users.json
3. GET  /api/v1/tasks     — list all tasks, then filter with ?status=TO_DO&priority=HIGH
4. GET  /api/v1/tasks/:id — fetch the task created in step 2 (use its returned id)
5. PATCH /api/v1/tasks/:id/status — update the task status to IN_PROGRESS
```

Watch that:
- All responses follow the `{ success, data, error, meta }` envelope from your `copilot-instructions.md`
- The status history entry is visible in the GET `:id` response after the PATCH
- Filtering and pagination work on the list endpoint

---

## (Optional) Step 6 — Switch to a Real Database

> Skip this unless you have a database server available. When you are ready, complete [Exercise 12 — Database & SQL](exercise-12-database-sql.md) first, then come back here.

```
I have completed Exercise 12 and the database migrations are in db/migrations/.
Update the repository layer so that when USE_DATABASE=true in .env, the API reads
from and writes to the real database instead of the JSON files.

- Create src/repositories/db-task.repository.ts (or equivalent) that implements the
  same interface as the JSON repository but uses parameterized DB queries / ORM
- Update src/config/data-source.ts to export the active repository based on the
  USE_DATABASE environment variable
- Keep the JSON repositories unchanged — they remain the default fallback

Everything else (services, controllers, routes) should work without modification.
```

---

## Key Takeaway

> Notice two things: (1) the local agent follows the patterns in your `copilot-instructions.md` automatically — response envelope, input validation, structured logging; (2) the **repository abstraction** lets the same service and controller code work with both the JSON file store and a real database. Swapping the data layer is a one-line config change, not a rewrite.

---

**Next**: [Exercise 13 — Unit & Functional Tests](exercise-13-testing.md)

> 🟡 **Optional exercises available here** — pick any before continuing to Exercise 13:
> - [Exercise 10 — Background Agent Task](exercise-10-background-agent.md) — delegate a long task to run asynchronously while you work
> - [Exercise 11 — Context Map Skill](exercise-11-context-map.md) — generate a structured codebase map that enriches all subsequent Copilot prompts
> - [Exercise 12 — Database & SQL / PL/SQL](exercise-12-database-sql.md) — generate the full DB schema, migrations, and stored procedures (then return here to complete the optional Step 6 above)
