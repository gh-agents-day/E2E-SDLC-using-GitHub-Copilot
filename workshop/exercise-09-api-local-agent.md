# Exercise 09 — Build APIs with the Local Agent

**Duration**: 5 minutes  
**Copilot Feature**: Local (Default) Agent — Agentic Coding  
**Goal**: Use Copilot's local agent to scaffold the project and implement 2–3 REST API endpoints end-to-end.

---

## Background

The **Local Agent** (also called the default Copilot agent in Agent mode) can read your workspace files, create new files, edit existing ones, run terminal commands, and iterate — all within your local VS Code environment. It's the primary tool for hands-on coding.

By this point, your **copilot-instructions.md** is active, so every piece of code the agent writes will follow your team's standards automatically.

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
- The folder structure: src/routes/, src/controllers/, src/services/, src/repositories/, src/models/, src/middleware/, src/config/
- A basic Express/FastAPI/Spring Boot app entry point that starts on port 3000 / 8000
- Environment variable loading (.env.example with all required variables)
- A basic health check endpoint: GET /api/v1/health → { status: "ok", timestamp: <ISO>, version: "1.0.0" }
- A README.md with setup instructions

Do NOT implement any business logic yet — just the scaffolding.
```

Watch the agent create files. When it pauses to ask about choices, make decisions based on your tech stack from Exercise 05.

---

## Step 3 — Implement the Authentication API

Send this prompt:

```
Now implement the Authentication API following #tsd.md's API Design section.

Create these endpoints:
1. POST /api/v1/auth/login
   - Accepts: { email, password }
   - Validates input (reject if email invalid format, password < 8 chars)
   - Returns: { success: true, data: { token, refreshToken, expiresIn, user: { id, name, email, role } } }
   - On failure: { success: false, error: { code: "INVALID_CREDENTIALS", message: "..." } }
   - Rate limit: 5 attempts per minute per IP

2. POST /api/v1/auth/logout
   - Requires JWT auth header
   - Invalidates the current token

3. POST /api/v1/auth/refresh
   - Accepts: { refreshToken }
   - Returns: new access token

Apply all standards from .github/copilot-instructions.md:
- Input validation using schema library
- Parameterized queries only
- Structured logging with request ID
- Proper HTTP status codes (200, 400, 401, 429)
```

---

## Step 4 — Implement the Task Management API

Send this prompt:

```
Implement the Task Management API endpoints from doc/tsd.md.

Create:
1. POST /api/v1/tasks
   - Auth required: any role
   - Accepts: { title, description, priority, assignedUserId, dueDate }
   - Validates: title required, priority must be Low/Medium/High, dueDate must be valid
   - Returns: created task with status "To Do"

2. GET /api/v1/tasks
   - Auth required
   - Query params: status, priority, assignedUserId, dueDate, page, limit

3. PATCH /api/v1/tasks/:id/status
   - Auth required
   - Accepts: { status } (To Do / In Progress / Blocked / Completed)
   - Records status change in history
   - Returns: updated task

Create the corresponding service, repository, and model/schema files.
Follow the folder structure created in the previous step.
```

---

## Step 5 — Verify the APIs

Once the agent finishes, send:

```
Start the application in the terminal and test all three endpoints with curl:
1. Test POST /api/v1/auth/login with valid credentials
2. Test POST /api/v1/tasks with the JWT from step 1
3. Test GET /api/v1/tasks to see the created task

Show me the curl commands and expected responses.
```

---

## Key Takeaway

> Notice how the local agent follows the patterns in your `copilot-instructions.md` automatically — response envelope format, input validation, parameterized queries. The instructions you wrote in Exercise 05 are now silently shaping every file, and you don't have to repeat those standards in every prompt.

---

**Next**: [Exercise 13 — Unit & Functional Tests](exercise-13-testing.md)

> 🟡 **Optional exercises available here** — pick any before continuing to Exercise 13:
> - [Exercise 10 — Background Agent Task](exercise-10-background-agent.md) — delegate a long task to run asynchronously while you work
> - [Exercise 11 — Context Map Skill](exercise-11-context-map.md) — generate a structured codebase map that enriches all subsequent Copilot prompts
> - [Exercise 12 — Database & SQL / PL/SQL](exercise-12-database-sql.md) — generate the full DB schema, migrations, and stored procedures
