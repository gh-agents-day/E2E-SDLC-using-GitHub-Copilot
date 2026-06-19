# Exercise 07 — Write Tests

**Duration**: 5 minutes  
**Copilot Feature**: Local Agent + Agent Orchestration  
**Goal**: Generate unit and integration tests for the two ITMS endpoints.

---

## What We Are Testing

| Test Type | Target | Scenarios |
|-----------|--------|-----------|
| Unit | `TaskService.createTask()` | Valid creation, missing title, invalid priority, unknown user |
| Unit | `TaskService.getAllTasks()` | Return all, empty list, filter by status |
| Integration | `POST /api/v1/tasks` | Valid create, 400 missing title, 404 unknown user |
| Integration | `GET /api/v1/tasks` | List all, filter by status, filter by priority |

---

## Fast Path — Run the Test Orchestrator (1 Prompt)

Three specialist agents are pre-built in `.github/agents/`:

| Agent | Role | Output |
|-------|------|--------|
| `unit-test` | Unit Test Author | `tests/unit/task.service.test.*` |
| `integration-test` | Integration Test Author | `tests/integration/tasks.api.test.*` |
| `test-orchestrator` | Orchestrator | Runs setup → dispatches both agents → runs coverage |

All three agents are **language-agnostic**: they read `.github/copilot-instructions.md` to detect your stack and generate the correct test framework (Jest, pytest, JUnit, xUnit).

### To Run

1. In Copilot Chat, choose **Test Orchestrator**
2. Send this prompt:

```
Read doc/frd.md (UC-001 and UC-002 only). Set up ITMS test infrastructure, generate unit + integration tests for POST /api/v1/tasks and GET /api/v1/tasks in parallel, run the suite, and report files below 80% coverage.
```

3. Confirm the plan shows 3 steps with Step 2 dispatching two agents simultaneously
4. Click **Continue**

> Skip to [Verify](#verify) to confirm the output.

---

## Manual Path — Step by Step

### Step 1 — Generate the Test Configuration

```
Set up ITMS tests: stack-appropriate framework (Jest/pytest/JUnit/xUnit), tests/unit/, tests/integration/, tests/fixtures/ copied from src/data/, helpers for task/user factories and JSON-store reset, and scripts: test:unit, test:integration, test:all with coverage.
```

---

### Step 2 — Generate Unit Tests

```
Read the service files in src/services/ and validators in src/validators/.

Generate unit tests in tests/unit/ for TaskService:

Test Suite: TaskService.createTask()
- Should create a task with status "TO_DO" when all required fields are provided
- Should throw ValidationError when title is missing
- Should throw ValidationError when priority is not LOW/MEDIUM/HIGH
- Should throw NotFoundError when assignedUserId does not exist in users data

Test Suite: TaskService.getAllTasks()
- Should return all tasks from the repository
- Should return an empty array when no tasks exist
- Should apply status filter when provided
- Should apply priority filter when provided

Use mocks for the repository layer. Each test must include Arrange/Act/Assert comments.
```

---

### Step 3 — Generate Integration Tests

```
Generate integration tests in tests/integration/ for the two ITMS endpoints. Reset the JSON store before each test.

POST /api/v1/tasks:
- Valid task with title, priority HIGH, valid assignedUserId → 201, status TO_DO
- Missing title → 400 VALIDATION_ERROR
- Invalid priority → 400 VALIDATION_ERROR
- Unknown assignedUserId → 404 NOT_FOUND

GET /api/v1/tasks:
- List all tasks → 200, array
- Filter by status=TO_DO → returns only TO_DO tasks
- Filter by priority=HIGH → returns only HIGH priority tasks
- No matching filter → 200, empty array
```

---

### Step 4 — Run Tests and Check Coverage

```
Run the unit tests using the terminal and show me the coverage report. Identify any files in src/ with less than 80% coverage and list them.
```

---

## Step 5 — UI Functionality Test with Playwright MCP

Use Playwright MCP directly to validate the UI works in a browser. This is a functional check only and is independent of unit/integration tests.

> **Prerequisite**: start the app and keep it running at `http://localhost:3000`.

### Run in Copilot Chat (Playwright MCP)

Send this single prompt for a quick functional check:

```
Use Playwright MCP to test ITMS UI functionality on http://localhost:3000.

Validate these flows:
1) Open /tasks and confirm task list page loads.
2) Apply status filter TO_DO and verify only TO_DO tasks are shown.
3) Click Create New Task and verify navigation to /create-task.

Return a concise pass/fail report for each step with screenshot references when failures occur.
```

### Detailed Check (Select UI Test Author Agent)

If you want complete UI coverage, choose **UI Test Author** in Copilot Chat and send:

```
Run a detailed Playwright MCP UI validation for ITMS on http://localhost:3000.

Cover all key flows end-to-end and return a detailed report with:
1) Step-by-step pass/fail

```

### Expected Result

- You get a step-by-step pass/fail functional report.
- Any failure includes the failing selector/action and evidence for quick debugging.

---

## Verify

- [ ] Unit tests exist for `TaskService.createTask()` and `TaskService.getAllTasks()` — at least 8 tests total
- [ ] Integration tests cover `POST /api/v1/tasks` and `GET /api/v1/tasks`
- [ ] Tests use the factory helper and JSON store reset helper
- [ ] Each test follows Arrange/Act/Assert
- [ ] Coverage report is generated
- [ ] _(Optional)_ Playwright MCP functional UI check runs independently and reports pass/fail for core flows

---

## Key Takeaway

> Each Gherkin scenario in `doc/frd.md` (UC-001, UC-002) becomes a test case here. The FRD's acceptance criteria are now executable — every test failure tells you exactly which user story is broken.

---

**Next**: [Exercise 08 — Build & Debug](exercise-13-build-debug.md)

> **Optional exercises** you can explore before or after Exercise 08:
> - [Exercise 09 (Optional) — Context Map Skill](exercise-15-context-map.md)
> - [Exercise 10 (Optional) — GitHub Issues via MCP](exercise-14-github-issues.md)
> - [Exercise 11 (Optional) — Security Review](exercise-12-security.md)
