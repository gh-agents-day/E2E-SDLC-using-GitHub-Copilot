# ITMS Implementation Plan - Detailed Phases & Tasks

Generated from TSD Section 5 and FRD Use Cases with TypeScript/Express/SQL stack

## Phase 0: Project Setup & Foundation (Week 1)

| ID | Task | Effort | FRD Ref | Parallel? | Background Agent? |
|---|---|---|---|---|---|
| P0-001 | Initialize Express.js project with TypeScript configuration | 3h | Section 2 | No | Yes - Project scaffolding |
| P0-002 | Set up development environment (tsconfig, ESLint, Prettier) | 2h | BR-NF-008 | No | Yes - DevOps setup |
| P0-003 | Create folder structure (routes, services, repositories, models) | 1h | BR-NF-001 | No | Yes - Infrastructure |
| P0-004 | Implement request ID middleware and structured logging | 4h | BR-NF-009 | Yes | Yes - Logging setup |
| P0-005 | Create API response envelope interface & error handling | 3h | BR-NF-009 | Yes | Yes - Error handling |
| P0-006 | Set up Jest testing framework with integration tests | 3h | BR-NF-002 | No | Yes - Testing infrastructure |
| P0-007 | Create basic health check endpoint (GET /api/v1/health) | 2h | BR-F-014 | Yes | Yes - Basic endpoint |
| P0-008 | Write project README with setup instructions | 2h | BO-005 | Yes | No |
| **P0 Total** | **8 tasks** | **20h** | | | |

## Phase 1: Database Schema & Data Access Layer (Week 2)

| ID | Task | Effort | FRD Ref | Parallel? | Background Agent? |
|---|---|---|---|---|---|
| P1-001 | Design database schema (Users, Tasks, Dependencies, StatusHistory) | 4h | Section 4.2 | No | No |
| P1-002 | Create Knex.js migrations: users table | 2h | Section 4.2 | No | Yes - Migration generation |
| P1-003 | Create Knex.js migrations: tasks table | 2h | Section 4.2 | No | Yes - Migration generation |
| P1-004 | Create Knex.js migrations: task_dependencies table | 2h | Section 4.2 | No | Yes - Migration generation |
| P1-005 | Create Knex.js migrations: status_history table (INSERT-only) | 2h | BR-F-008 | No | Yes - Migration generation |
| P1-006 | Implement IUserRepository interface | 2h | BR-NF-001 | Yes | Yes - Interface definition |
| P1-007 | Implement UserRepository (CRUD operations) | 4h | Section 4.2 | No | Yes - Repository implementation |
| P1-008 | Implement ITaskRepository interface | 2h | BR-NF-001 | Yes | Yes - Interface definition |
| P1-009 | Implement TaskRepository (CRUD + dependencies + history) | 6h | Section 4.2 | No | Yes - Repository implementation |
| P1-010 | Set up database connection pooling (Knex.js config) | 3h | BR-NF-005 | No | Yes - DB configuration |
| P1-011 | Create seed data for development (test users & tasks) | 3h | BR-NF-008 | Yes | No |
| P1-012 | Write unit tests for repositories (80%+ coverage) | 6h | BR-NF-002 | No | No |
| **P1 Total** | **12 tasks** | **38h** | | | |

## Phase 2: User Authentication & Authorization (Week 3)

| ID | Task | Effort | FRD Ref | Parallel? | Background Agent? |
|---|---|---|---|---|---|
| P2-001 | Create User model & TypeScript interface | 2h | Section 4.2 | Yes | Yes - Model definition |
| P2-002 | Implement password hashing (bcrypt) utility | 2h | R-010 | No | Yes - Security utility |
| P2-003 | Create auth service (register, login, JWT generation) | 6h | BR-F-015 | No | No |
| P2-004 | Implement JWT middleware for request authentication | 4h | BR-F-015 | No | Yes - Middleware |
| P2-005 | Create auth controller (POST /auth/register, /auth/login) | 4h | BR-F-015 | No | Yes - Controller implementation |
| P2-006 | Implement role-based authorization (RBAC) middleware | 4h | FRD Section 3 | No | Yes - Authorization |
| P2-007 | Create refresh token mechanism | 3h | BR-F-015 | Yes | Yes - Auth feature |
| P2-008 | Implement logout & token invalidation | 2h | BR-F-015 | Yes | Yes - Auth feature |
| P2-009 | Write integration tests for authentication endpoints | 6h | BR-NF-002 | No | No |
| P2-010 | Implement change password endpoint | 3h | R-010 | Yes | Yes - Auth feature |
| **P2 Total** | **10 tasks** | **36h** | | | |

## Phase 3: Task Management Core API (Week 4-5)

| ID | Task | Effort | FRD Ref | Parallel? | Background Agent? |
|---|---|---|---|---|---|
| P3-001 | Create Task model & TypeScript interfaces | 2h | Section 4.2 | Yes | Yes - Model definition |
| P3-002 | Create task validation schemas (Joi) | 3h | BR-R-002 | No | Yes - Validation schema |
| P3-003 | Implement TaskService business logic | 8h | UC-001 | No | No |
| P3-004 | Create task controller (POST /tasks) | 3h | UC-001 | No | Yes - Endpoint implementation |
| P3-005 | Create task listing controller (GET /tasks with filtering) | 4h | BR-F-009-012 | No | Yes - Endpoint implementation |
| P3-006 | Implement pagination & sorting for task lists | 3h | BR-NF-005 | Yes | Yes - Query feature |
| P3-007 | Create task detail controller (GET /tasks/:id) | 2h | BR-F-014 | Yes | Yes - Endpoint implementation |
| P3-008 | Create task update controller (PATCH /tasks/:id) | 3h | BR-F-014 | Yes | Yes - Endpoint implementation |
| P3-009 | Create task deletion controller (DELETE /tasks/:id) | 2h | IS-001 | Yes | Yes - Endpoint implementation |
| P3-010 | Create task assignment controller (PUT /tasks/:id/assign) | 3h | BR-F-004 | Yes | Yes - Endpoint implementation |
| P3-011 | Implement task status update with dependency checking | 5h | BR-F-003, BR-R-006 | No | No |
| P3-012 | Create status history retrieval endpoint | 2h | BR-F-008 | Yes | Yes - Endpoint implementation |
| P3-013 | Write integration tests for task CRUD endpoints | 8h | BR-NF-002 | No | No |
| P3-014 | Write unit tests for task service (80%+ coverage) | 6h | BR-NF-002 | No | No |
| **P3 Total** | **14 tasks** | **54h** | | | |

## Phase 4: Task Dependencies & Business Logic (Week 6)

| ID | Task | Effort | FRD Ref | Parallel? | Background Agent? |
|---|---|---|---|---|---|
| P4-001 | Create TaskDependency model & interface | 2h | Section 4.2 | Yes | Yes - Model definition |
| P4-002 | Implement dependency validation schemas (Joi) | 3h | BR-R-005 | No | Yes - Validation schema |
| P4-003 | Implement dependency engine service (BR-R-005 rules) | 8h | BR-F-006, BR-F-007 | No | No |
| P4-004 | Implement circular dependency detection | 4h | BR-R-005 | No | No |
| P4-005 | Create dependency management controller (POST dependencies) | 3h | BR-F-006 | Yes | Yes - Endpoint implementation |
| P4-006 | Create dependency retrieval endpoints | 3h | BR-F-006 | Yes | Yes - Endpoint implementation |
| P4-007 | Create dependency deletion endpoint | 2h | BR-F-006 | Yes | Yes - Endpoint implementation |
| P4-008 | Implement automatic task blocking on dependency creation | 4h | BR-R-006 | No | No |
| P4-009 | Implement automatic unblocking on dependency completion | 4h | BR-R-006 | No | No |
| P4-010 | Create blocked-by and blocking task endpoints | 3h | BR-F-007 | Yes | Yes - Endpoint implementation |
| P4-011 | Write integration tests for dependency endpoints | 6h | BR-NF-002 | No | No |
| P4-012 | Write unit tests for dependency engine (80%+ coverage) | 6h | BR-NF-002 | No | No |
| **P4 Total** | **12 tasks** | **48h** | | | |

## Phase 5: User Management & Reporting (Week 7)

| ID | Task | Effort | FRD Ref | Parallel? | Background Agent? |
|---|---|---|---|---|---|
| P5-001 | Create user listing endpoint (GET /users) | 2h | BR-F-004 | Yes | Yes - Endpoint implementation |
| P5-002 | Create user detail endpoint (GET /users/:id) | 2h | BR-F-015 | Yes | Yes - Endpoint implementation |
| P5-003 | Create user profile update endpoint (PUT /users/:id) | 3h | BR-F-015 | Yes | Yes - Endpoint implementation |
| P5-004 | Create user deactivation endpoint (DELETE /users/:id) | 2h | BR-F-015 | Yes | Yes - Endpoint implementation |
| P5-005 | Implement progress reporting service | 4h | BR-F-013 | No | No |
| P5-006 | Create progress summary endpoint (GET /reports/progress) | 2h | BR-F-013 | Yes | Yes - Endpoint implementation |
| P5-007 | Implement workload distribution reporting | 4h | BO-003 | No | No |
| P5-008 | Create workload endpoint (GET /reports/user-workload) | 2h | BO-003 | Yes | Yes - Endpoint implementation |
| P5-009 | Implement overdue tasks reporting | 3h | BO-001 | No | No |
| P5-010 | Create overdue tasks endpoint (GET /reports/overdue-tasks) | 2h | BO-001 | Yes | Yes - Endpoint implementation |
| P5-011 | Implement blocked tasks reporting | 2h | BO-002 | No | No |
| P5-012 | Create blocked tasks endpoint (GET /reports/blocked-tasks) | 2h | BO-002 | Yes | Yes - Endpoint implementation |
| P5-013 | Implement priority distribution reporting | 2h | BO-004 | No | No |
| P5-014 | Create priority distribution endpoint | 2h | BO-004 | Yes | Yes - Endpoint implementation |
| P5-015 | Write integration tests for reporting endpoints | 6h | BR-NF-002 | No | No |
| **P5 Total** | **15 tasks** | **42h** | | | |

## Phase 6: OpenAPI Documentation & Security Hardening (Week 8)

| ID | Task | Effort | FRD Ref | Parallel? | Background Agent? |
|---|---|---|---|---|---|
| P6-001 | Install and configure Swagger/OpenAPI | 3h | BR-NF-003, R-009 | No | Yes - Documentation setup |
| P6-002 | Generate OpenAPI spec from code annotations | 4h | R-009 | No | No |
| P6-003 | Create interactive Swagger UI at /api/v1/docs | 2h | R-009 | Yes | Yes - Documentation |
| P6-004 | Implement rate limiting middleware | 4h | R-010 | No | No |
| P6-005 | Implement input sanitization/XSS prevention | 3h | R-010 | Yes | No |
| P6-006 | Implement CORS configuration | 2h | R-010 | Yes | Yes - Security |
| P6-007 | Implement security headers (Helmet.js) | 2h | R-010 | Yes | Yes - Security |
| P6-008 | Implement API key authentication for system integrations | 4h | BR-F-015 | No | No |
| P6-009 | Add comprehensive security testing | 6h | BR-NF-008 | No | No |
| P6-010 | Document security best practices | 3h | R-010 | Yes | No |
| P6-011 | Implement request validation at all boundaries | 4h | BR-R-002 | No | No |
| P6-012 | Create security integration tests | 6h | BR-NF-002 | No | No |
| **P6 Total** | **12 tasks** | **43h** | | | |

## Phase 7: Docker Containerization & Azure Deployment (Week 9)

| ID | Task | Effort | FRD Ref | Parallel? | Background Agent? |
|---|---|---|---|---|---|
| P7-001 | Create Dockerfile with Node.js base image | 2h | BR-NF-006 | No | Yes - Docker setup |
| P7-002 | Create docker-compose.yml for local development | 2h | BR-NF-006 | Yes | Yes - Docker compose |
| P7-003 | Create .dockerignore file | 1h | BR-NF-006 | Yes | Yes - Docker config |
| P7-004 | Set up GitHub Actions CI/CD pipeline | 6h | BR-NF-004 | No | No |
| P7-005 | Create deployment workflow (build, test, push to ACR) | 5h | BR-NF-004 | No | No |
| P7-006 | Create Azure App Service deployment configuration | 4h | BR-NF-006 | No | No |
| P7-007 | Implement health checks in container | 2h | BR-NF-005 | Yes | Yes - Container setup |
| P7-008 | Create Azure SQL Database setup scripts | 3h | BR-NF-007 | No | No |
| P7-009 | Configure Application Insights monitoring | 4h | BR-NF-005 | No | No |
| P7-010 | Create production environment configuration | 3h | BO-002 | Yes | No |
| P7-011 | Document deployment procedures | 3h | BO-005 | Yes | No |
| P7-012 | Create disaster recovery & backup plan | 4h | BR-NF-007 | No | No |
| **P7 Total** | **12 tasks** | **39h** | | | |

## Summary

| Phase | Task Count | Total Effort | Week |
|-------|-----------|--------------|------|
| Phase 0 | 8 | 20h | Week 1 |
| Phase 1 | 12 | 38h | Week 2 |
| Phase 2 | 10 | 36h | Week 3 |
| Phase 3 | 14 | 54h | Week 4-5 |
| Phase 4 | 12 | 48h | Week 6 |
| Phase 5 | 15 | 42h | Week 7 |
| Phase 6 | 12 | 43h | Week 8 |
| Phase 7 | 12 | 39h | Week 9 |
| **TOTAL** | **97 tasks** | **360h** | **9 weeks** |

Note: Estimates assume 8-hour workday and one developer. Parallel tasks can be distributed across team members.
