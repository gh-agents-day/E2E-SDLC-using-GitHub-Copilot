# Exercise 13 — Write Unit & Functional Tests

**Duration**: 5 minutes  
**Copilot Feature**: Local Agent + Prompt Files  
**Goal**: Generate comprehensive unit and integration/functional tests for the ITMS API.

---

## Background

Tests are where the FRD's acceptance criteria become code. Each **Given/When/Then** scenario in `doc/frd.md` maps to an automated test. Copilot can read those acceptance criteria and write tests that verify them — turning the FRD into a living test suite.

---

## Step 1 — Generate the Test Configuration

Send this prompt in Copilot Chat (Agent mode):

> **Note**: Adjust the prompt based on your tech stack (Node.js, Python, Java). And if you have skipped Exercise 11, make sure to update the prompt by removing the context map references `.github/skills/context-map/context-map.md`.

```
Reference the context map at .github/skills/context-map/context-map.md and .github/copilot-instructions.md.

Set up the testing infrastructure for the ITMS project:
1. Install and configure the appropriate test framework for the tech stack (Jest for Node.js, pytest for Python, JUnit for Java)
2. Create tests/unit/ and tests/integration/ directory structure
3. Set up a test database configuration (use the mock data from db/mock/ if real DB is unavailable)
4. Create a tests/helpers/ folder with:
   - A factory function to create test users with different roles (Developer, Team Lead, Project Manager, QA Engineer)
   - A function to create authenticated test requests (with valid JWT)
   - A database cleanup helper to reset state between tests
5. Add test scripts to package.json / pyproject.toml:
   - "test:unit" — runs unit tests only
   - "test:integration" — runs integration tests
   - "test:all" — runs everything with coverage report
```

---

## Step 2 — Generate Unit Tests for the Service Layer

Send this prompt:

```
Read #frd.md (focus on FR-IDs for task management) and the service files in src/services/.

Generate unit tests in tests/unit/ for the Task Service:

Test Suite: TaskService.createTask()
- Test: Should create a task with status "To Do" when all required fields are provided
  (maps to: Given a Developer provides title, priority, and due date When they submit the task Then a "To Do" task is created)
- Test: Should throw ValidationError when title is missing
- Test: Should throw ValidationError when priority is not Low/Medium/High
- Test: Should throw NotFoundError when assignedUserId does not exist
- Test: Should correctly record the creator in createdBy field

Test Suite: TaskService.updateTaskStatus()
- Test: Should update status from "To Do" to "In Progress" successfully
- Test: Should set status to "Blocked" when a dependency task is not Completed
- Test: Should allow status change to "Completed" when all dependencies are Completed
- Test: Should throw BlockedTaskError when trying to start a blocked task
- Test: Should record status change in task history

Use mocks for the repository layer in all unit tests.
Each test must include Arrange / Act / Assert structure as comments.
```

---

## Step 3 — Generate Integration Tests for the API

Send this prompt:

```
Read #frd.md (focus on the Gherkin acceptance criteria in user stories US-001 to US-006).

Generate integration tests in tests/integration/ for the Task Management API:

Test Suite: POST /api/v1/tasks
- Scenario: "Developer creates a valid task"
  Given: Authenticated as a Developer
  When: POST /api/v1/tasks with { title, description, priority: "High", assignedUserId, dueDate }
  Then: 201 Created, response has { success: true, data: { id, status: "To Do", priority: "High" } }

- Scenario: "Task creation rejected when title is missing"
  Given: Authenticated user
  When: POST /api/v1/tasks with missing title
  Then: 400 Bad Request, { success: false, error: { code: "VALIDATION_ERROR" } }

- Scenario: "Unauthenticated request is rejected"
  Given: No JWT token
  When: POST request
  Then: 401 Unauthorized

Test Suite: PATCH /api/v1/tasks/:id/status
- Scenario: "User updates task from To Do to In Progress"
  Given: Task with no blocking dependencies
  When: PATCH with { status: "In Progress" }
  Then: 200 OK, task status updated, history entry created

- Scenario: "Task is blocked when dependency is incomplete"
  Given: Task with an incomplete dependency
  When: PATCH with { status: "In Progress" }
  Then: 422 Unprocessable Entity, { success: false, error: { code: "TASK_BLOCKED" } }

Test Suite: POST /api/v1/tasks/:id/dependencies
- Scenario: "Add a valid dependency between two tasks"
- Scenario: "Circular dependency is rejected" → 422 Unprocessable Entity
- Scenario: "Adding dependency to incomplete task sets status to Blocked"

Each integration test should start with a clean database state using the test helpers from Step 1.
```

---

## Step 4 — Generate a Test for a SQL Stored Procedure

Send this prompt:

```
The update_task_status() and add_task_dependency() PostgreSQL functions in db/procedures/ need tests.

Create tests/unit/database/ test files that verify:
- update_task_status: transitions from TO_DO to IN_PROGRESS succeed when no unresolved dependencies
- update_task_status: raises exception when task has unresolved (non-COMPLETED) dependencies
- add_task_dependency: correctly sets task to BLOCKED when dependency is not COMPLETED
- add_task_dependency: raises exception on circular dependency detection
- resolve_task_dependency: unblocks tasks when their last dependency completes

If not using a real database, create equivalent unit tests using the JavaScript/Python implementation of dependency logic.
```

---

## Step 5 — Run Tests and Check Coverage

Send this prompt:

```
Run the unit tests using the terminal and show me the coverage report.
Identify any files in src/ that have less than 80% test coverage and list them.
```

---

## Verify

- [ ] Unit tests exist for `TaskService` with at least 8 test cases
- [ ] Integration tests cover the 3 main API endpoints
- [ ] Tests use the test helpers (factory functions, auth helper)
- [ ] Each test follows Arrange/Act/Assert structure
- [ ] Coverage report is generated

---

## Key Takeaway

> When Copilot writes tests from the FRD's Gherkin criteria, the tests become a **living specification**. Every test failure tells you exactly which user story is broken. This is the promise of Behavior-Driven Development — and Copilot makes it practical by eliminating the tedious work of writing the test boilerplate.

---

**Next**: [Exercise 14 — Security Review](exercise-14-security.md)
