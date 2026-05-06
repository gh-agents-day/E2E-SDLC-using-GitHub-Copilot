# Exercise 11 — Write Tests

**Duration**: 5 minutes  
**Copilot Feature**: Local Agent + Prompt Files + Agent Orchestration  
**Goal**: Generate unit and integration tests for the task creation and task retrieval API endpoints.

---

## Fast Path — Run Everything with the Test Orchestrator (1 Prompt)

Three specialist agents are pre-built in `.github/agents/`:

| Agent | Role | Output |
|-------|------|--------|
| `unit-test` | Unit Test Author | `tests/unit/task.service.test.*` |
| `integration-test` | Integration Test Author | `tests/integration/tasks.api.test.*` |
| `test-orchestrator` | Orchestrator | Runs setup → dispatches both agents in parallel → runs coverage |

**How it works:**

```
Step 1 — Test Infrastructure Setup  (sequential — fixtures + helpers must exist first)
                    ↓
Step 2a — Unit Test Author  ←─ parallel ─→  Step 2b — Integration Test Author
                    ↓
Step 3 — npm run test:all + coverage report  (sequential — needs both test files)
```

Steps 2a and 2b run **simultaneously** — the orchestrator invokes both specialist agents at the same time, halving the time to generate both test suites.

All three agents are **language-agnostic**: they read `.github/copilot-instructions.md` and `doc/tsd.md` first to detect your stack (Node.js/Jest, Python/pytest, Java/JUnit, C#/xUnit), then generate the correct framework code.

### To Run

1. In Copilot Chat, click the agent selector and choose **Test Orchestrator**
2. Send this single prompt:

```
Read doc/frd.md and generate the full test suite for the ITMS project.
Set up the test infrastructure, then generate unit and integration tests in parallel.
Run the full suite and report any files below 80% coverage.
```

3. Review the plan — confirm it shows **3 steps** with Step 2 dispatching two agents simultaneously
4. Click **Continue**

> **Tip**: The orchestrator delegates test *writing* to the specialist agents — it never writes test code itself. This is the same pattern as the SDLC Docs Orchestrator in Exercise 02.

> Skip to the [Verify](#verify) section to confirm the output. If you prefer to understand each step individually, continue with the Manual Path below.

---

## Manual Path — Step by Step

---

### Background

Tests are where the FRD's acceptance criteria become code. Each **Given/When/Then** scenario in `doc/frd.md` maps to an automated test. Copilot can read those acceptance criteria and write tests that verify them — turning the FRD into a living test suite.

---

### Step 1 — Generate the Test Configuration

Send this prompt in Copilot Chat (Agent mode):

> **Note**: Adjust the prompt based on your tech stack (Node.js, Python, Java). And if you have skipped Exercise 11, make sure to update the prompt by removing the context map references `.github/skills/context-map/context-map.md`.


Reference the context map at ```.github/skills/context-map/context-map.md``` and ```.github/copilot-instructions.md.```
```
Set up the testing infrastructure for the ITMS project:
1. Install and configure the appropriate test framework for the tech stack (Jest for Node.js, pytest for Python, JUnit for Java)
2. Create tests/unit/ and tests/integration/ directory structure
3. Set up test data configuration using the JSON seed files from src/data/ — no database required.
   Copy the JSON files to a tests/fixtures/ folder so tests work with isolated, known data.
4. Create a tests/helpers/ folder with:
   - A factory function to create test task objects and test user objects with different roles
     (Developer, Team Lead, Project Manager, QA Engineer)
   - A helper that resets the in-memory JSON store to the fixture state before each test
     (so tests are isolated and repeatable without a database)
5. Add test scripts to package.json / pyproject.toml:
   - "test:unit" — runs unit tests only
   - "test:integration" — runs integration tests
   - "test:all" — runs everything with coverage report
```

---

### Step 2 — Generate Unit Tests for the Service Layer

Send this prompt:

```
Read the service files in src/services/ and the validators in src/validators/.

Generate unit tests in tests/unit/ for the Task Service:

Test Suite: TaskService.createTask()
- Test: Should create a task with status "To Do" when all required fields are provided
  (Given a user provides title, priority, and assignedUserId, When they submit the task, Then a task with status "To Do" is returned)
- Test: Should throw ValidationError when title is missing
- Test: Should throw ValidationError when priority is not Low/Medium/High
- Test: Should throw NotFoundError when assignedUserId does not exist
- Test: Should set the id field using crypto.randomUUID()

Test Suite: TaskService.getAllTasks()
- Test: Should return all tasks from the repository
- Test: Should return an empty array when no tasks exist
- Test: Should apply status filter when provided

Test Suite: TaskService.getTaskById()
- Test: Should return the matching task when the id exists
- Test: Should throw NotFoundError when no task with the given id exists

Use mocks for the repository layer in all unit tests.
Each test must include Arrange / Act / Assert structure as comments.
```

---

### Step 3 — Generate Integration Tests for the API

Send this prompt:

```
Generate integration tests in tests/integration/ for the Task Management API.
Use the test helper from Step 1 to reset the in-memory store before each test.

Test Suite: POST /api/v1/tasks
- Scenario: "Creates a valid task"
  Given: A valid assignedUserId exists in the users fixture data
  When: POST /api/v1/tasks with { title, priority: "High", assignedUserId }
  Then: 201 Created, { success: true, data: { id, status: "To Do", priority: "High" } }

- Scenario: "Rejected when title is missing"
  When: POST /api/v1/tasks with body {}
  Then: 400 Bad Request, { success: false, error: { code: "VALIDATION_ERROR" } }

- Scenario: "Rejected when assignedUserId does not exist"
  When: POST /api/v1/tasks with a random unknown assignedUserId
  Then: 404 Not Found, { success: false, error: { code: "NOT_FOUND" } }

Test Suite: GET /api/v1/tasks
- Scenario: "Returns all tasks"
  When: GET /api/v1/tasks
  Then: 200 OK, { success: true, data: [...], meta: { total, page, pageSize } }

- Scenario: "Filter by status returns only matching tasks"
  When: GET /api/v1/tasks?status=To Do
  Then: All returned tasks have status "To Do"

Test Suite: GET /api/v1/tasks/:id
- Scenario: "Returns the task when id exists"
  When: GET /api/v1/tasks/:id with a known task id from fixture data
  Then: 200 OK, { success: true, data: { id, title, status, priority, ... } }

- Scenario: "Returns 404 when id does not exist"
  When: GET /api/v1/tasks/non-existent-id
  Then: 404 Not Found, { success: false, error: { code: "NOT_FOUND" } }
```

---

### Step 4 — Run Tests and Check Coverage

> **(Optional) Database stored procedure tests**: If you have completed [Exercise 16](exercise-16-database-sql.md) and are running a real database, ask Copilot to also generate tests in `tests/unit/database/` for the `update_task_status()`, `add_task_dependency()`, and `resolve_task_dependency()` PL/pgSQL functions.

Send this prompt:

```
Run the unit tests using the terminal and show me the coverage report.
Identify any files in src/ that have less than 80% test coverage and list them.
```

---

## Verify

- [ ] Unit tests exist for `TaskService.createTask()`, `getAllTasks()`, and `getTaskById()` with at least 8 test cases total
- [ ] Integration tests cover `POST /api/v1/tasks`, `GET /api/v1/tasks`, and `GET /api/v1/tasks/:id`
- [ ] Tests use the factory helper and JSON store reset helper
- [ ] Each test follows Arrange/Act/Assert structure
- [ ] Coverage report is generated
- [ ] No test requires a running database or live server to pass

---

## Key Takeaway

> When Copilot writes tests from the FRD's Gherkin criteria, the tests become a **living specification**. Every test failure tells you exactly which user story is broken. This is the promise of Behavior-Driven Development — and Copilot makes it practical by eliminating the tedious work of writing the test boilerplate.

---

**Next**: [Exercise 12 — Security Review](exercise-12-security.md)
