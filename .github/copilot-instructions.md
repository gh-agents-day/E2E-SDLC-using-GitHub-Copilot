# Copilot Instructions for REST API Project

This file contains workspace-wide coding standards for the TypeScript/Express/SQL REST API project. GitHub Copilot will follow these guidelines when generating code.

## 1. Language & Framework Conventions

### Naming Conventions
- **Variables & functions**: Use `camelCase` (e.g., `getUserById`, `isValidEmail`)
- **Classes & interfaces**: Use `PascalCase` (e.g., `UserService`, `IUserRepository`)
- **Constants**: Use `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`, `DEFAULT_TIMEOUT_MS`)
- **Files**: Use `kebab-case` for files (e.g., `user-service.ts`, `error-handler.ts`)
- **Directories**: Use `kebab-case` for directories (e.g., `src/routes/`, `src/middleware/`)

### File Structure & Organization
```
src/
  ├── controllers/         # Request handlers, should delegate to services
  ├── services/            # Business logic and domain operations
  ├── repositories/        # Data access layer, abstracts database queries
  ├── middleware/          # Express middleware (auth, validation, error handling)
  ├── models/              # TypeScript interfaces and types
  ├── utils/               # Utility functions and helpers
  ├── config/              # Configuration files
  ├── database/            # Migrations and database setup
  └── routes/              # API route definitions
tests/
  ├── unit/                # Unit tests
  └── integration/         # Integration tests
```

### Module Organization
- Export named exports from modules, not default exports (except for middleware functions)
- Keep module dependencies unidirectional: controllers → services → repositories → models
- Group related functionality in the same file (e.g., all user validation logic in one file)
- Use dependency injection for testability and loose coupling

---

## 2. API Design Rules

### Versioning
- All API endpoints must start with `/api/v1/` prefix
- Example: `/api/v1/users`, `/api/v1/tasks/{id}`, `/api/v1/tasks/{id}/comments`
- Update major version only for breaking changes

### Response Envelope
All API responses must follow this consistent structure:

```typescript
interface ApiResponse<T> {
  success: boolean;              // true for success (2xx), false for error (4xx, 5xx)
  data: T | null;                // Actual response data
  error: {
    code: string;               // Error code (e.g., "VALIDATION_ERROR", "RESOURCE_NOT_FOUND")
    message: string;            // Human-readable error message
    details?: Record<string, any>; // Additional error details (validation errors, etc.)
  } | null;
  meta: {
    timestamp: string;          // ISO 8601 timestamp
    requestId: string;          // Unique request identifier
    pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}
```

### Route Design
- Use RESTful conventions: GET (retrieve), POST (create), PUT (replace), PATCH (update), DELETE (remove)
- Use resource-based URLs: `/api/v1/users/{id}`, not `/api/v1/getUser`
- Plural nouns for collections: `/api/v1/tasks` not `/api/v1/task`
- Support filtering, pagination, and sorting via query parameters: `/api/v1/tasks?status=active&page=1&pageSize=20&sort=createdAt:desc`

---

## 3. Error Handling

### Custom Error Classes
Create custom error classes extending Error:

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Specific error types
class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, any>) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

class NotFoundError extends ApiError {
  constructor(message: string) {
    super(404, 'RESOURCE_NOT_FOUND', message);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
  }
}

class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(403, 'FORBIDDEN', message);
  }
}
```

### Centralized Error Middleware
Implement a global error handler middleware that catches all errors and formats them consistently:

```typescript
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Convert to ApiError if not already
  const error = err instanceof ApiError ? err : new ApiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred');
  
  // Log error with request context
  logger.error('Request failed', {
    requestId: req.id,
    error: error.message,
    code: error.code,
    statusCode: error.statusCode,
  });
  
  // Send consistent error response
  res.status(error.statusCode).json(createErrorResponse(error, req.id));
});
```

### HTTP Status Codes
- Use appropriate status codes:
  - `200` OK - Successful GET, successful PUT/PATCH
  - `201` Created - Successful POST that creates a resource
  - `204` No Content - Successful DELETE
  - `400` Bad Request - Validation errors
  - `401` Unauthorized - Missing/invalid authentication
  - `403` Forbidden - Missing permissions
  - `404` Not Found - Resource doesn't exist
  - `409` Conflict - Duplicate key or conflict
  - `422` Unprocessable Entity - Semantic validation errors
  - `500` Internal Server Error - Unexpected server errors

---

## 4. Security

### Input Validation
- **Always validate incoming data** against a schema using a validation library (Joi, Zod, or similar)
- Never trust user input - validate in controllers before passing to services
- Validate at the boundary: sanitize, type-check, and enforce constraints

```typescript
// Example with Joi
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().max(255).required(),
});

router.post('/users', async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      throw new ValidationError('Invalid user data', error.details);
    }
    // Continue with validated data
  } catch (err) {
    next(err);
  }
});
```

### SQL Injection Prevention
- **Always use parameterized queries** - never concatenate strings into SQL
- Use a query builder (Knex.js) or ORM (TypeORM, Prisma) that handles parameterization
- Never use raw SQL concatenation, even if you "trust" the input

```typescript
// ❌ WRONG - SQL injection vulnerability
const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ CORRECT - Parameterized query
const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

// ✅ CORRECT - Using query builder
const user = await db('users').where('id', userId).first();
```

### Other Security Practices
- Use environment variables for sensitive configuration (API keys, database URLs) - never hardcode secrets
- Implement rate limiting on API endpoints
- Use HTTPS in production
- Sanitize error messages - don't expose internal system details in error responses
- Implement proper authentication and authorization checks
- Use helmet.js middleware for security headers

---

## 5. Database

### Migrations
- All schema changes **must use migrations**, never direct SQL modifications
- Each migration file should have a timestamp and descriptive name: `20240317_125030_create_users_table.ts`
- Migrations should be idempotent and reversible (include both up and down steps)
- Run migrations as part of deployment process before starting the application

```typescript
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('name').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
```

### Query Builder/ORM
- **Use Knex.js, QueryBuilder, or an ORM like TypeORM/Prisma** - never raw SQL strings
- Query builders provide:
  - Automatic parameterization (SQL injection prevention)
  - Type safety (with TypeScript)
  - Better readability and maintainability
  - Easy migration to different databases

```typescript
// ✅ CORRECT - Using Knex query builder
const users = await db('users').where('status', 'active').select();
const user = await db('users').where('id', userId).first();
await db('users').insert({ email, name });
await db('users').where('id', userId).update({ name: newName });
await db('users').where('id', userId).delete();
```

### Repository Pattern
- Implement repository layer to abstract database access
- Each entity (users, tasks, etc.) should have a corresponding repository class
- Repositories handle all database queries for that entity
- Services call repositories to access data

```typescript
class UserRepository {
  async findById(id: number): Promise<User | null> {
    return db('users').where('id', id).first();
  }

  async findByEmail(email: string): Promise<User | null> {
    return db('users').where('email', email).first();
  }

  async create(userData: CreateUserInput): Promise<User> {
    const [id] = await db('users').insert(userData);
    return this.findById(id);
  }
}
```

---

## 6. Testing

### Unit Tests
- **Every new function must have corresponding unit tests**
- Use Jest for testing framework
- Test file locations: `tests/unit/{component}.test.ts` alongside the component's source
- Aim for >80% code coverage on business logic
- Mock external dependencies (database, services, APIs)

```typescript
// Example: tests/unit/user-service.test.ts
describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      create: jest.fn(),
    } as any;
    service = new UserService(mockRepository);
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const user = { id: 1, email: 'test@example.com' };
      mockRepository.findById.mockResolvedValue(user);

      const result = await service.getUserById(1);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundError when user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getUserById(999)).rejects.toThrow(NotFoundError);
    });
  });
});
```

### Integration Tests
- **Integration tests required for all API endpoints**
- Test file locations: `tests/integration/{endpoint}.test.ts`
- Start a test database and seed test data
- Test complete request/response flow including middleware

```typescript
// Example: tests/integration/users.test.ts
describe('POST /api/v1/users', () => {
  it('should create a new user and return success response', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({ email: 'test@example.com', password: 'Password123' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('test@example.com');
  });

  it('should return validation error for invalid email', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({ email: 'invalid', password: 'Password123' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

### Test Execution
- Run tests on every push: `npm test`
- Run tests with coverage: `npm run test:coverage`
- Integration tests require: `npm run test:integration`

---

## 7. Logging

### Structured JSON Logging
- Use a structured logging library (Winston, Pino, or similar)
- Every log entry must be valid JSON for easy parsing and aggregation
- Include request ID, user ID (if authenticated), operation name, and context

```typescript
// Configure Winston logger
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/app.log' }),
    process.env.NODE_ENV === 'development' && new winston.transports.Console(),
  ],
});

// Log with context
logger.info('User created', {
  requestId: req.id,
  userId: req.user?.id,
  operation: 'CREATE_USER',
  email: user.email,
  duration: Date.now() - startTime,
});

logger.error('Database query failed', {
  requestId: req.id,
  operation: 'FIND_USER',
  error: err.message,
  query: 'SELECT * FROM users WHERE id = ?',
  severity: 'ERROR',
});
```

### Logging Levels
- `ERROR` - Serious problems, service might fail
- `WARN` - Potential problems, service continues
- `INFO` - Important events (user login, resource created, etc.)
- `DEBUG` - Detailed technical information for developers
- Never use `DEBUG` logs in production code path - wrap in `if (isDevelopment)`

### Sensitive Data
- **Never log passwords, API keys, tokens, or personal data**
- Sanitize logged values before output
- Use log filters to redact sensitive fields

---

## 8. Code Style

### Line Length & Function Size
- Maximum line length: 100 characters
- **Functions must be under 30 lines** (including comments and blank lines)
- If a function exceeds 30 lines, break it into smaller functions with descriptive names
- Files should be under 400 lines - split into multiple files if larger

### Console in Production
- **No `console.log()` in production code** - use the structured logger instead
- `console.log()` only acceptable in:
  - Scripts in `scripts/` directory
  - Development-only code wrapped in `if (isDevelopment)`
  - Test utilities

```typescript
// ❌ WRONG
console.log('User found:', user);

// ✅ CORRECT
logger.info('User found', { userId: user.id });
```

### TODO Comments
- **Every TODO comment must reference a ticket number** (JIRA, GitHub issue, etc.)
- Format: `// TODO: [TICKET-123] description of what needs to be done`
- Remove completed TODOs when done

```typescript
// ❌ WRONG
// TODO: optimize this query

// ✅ CORRECT
// TODO: [ISSUE-456] optimize this query - currently N+1 problem
```

### Code Formatting
- Use Prettier for automatic formatting: `prettier --write .`
- Use ESLint for linting: `npm run lint`
- Fix linting errors before committing: `npm run lint:fix`
- Configure pre-commit hooks to enforce this

---

## 9. Documentation

### JSDoc/TypeScript Documentation
- **Every exported function must have JSDoc documentation**
- Include parameter descriptions, return type, and example usage
- Document exceptions/errors that can be thrown

```typescript
/**
 * Retrieves a user by ID from the database.
 * 
 * @param userId - The unique identifier of the user
 * @returns Promise resolving to the User object
 * @throws {NotFoundError} When user with given ID doesn't exist
 * @throws {DatabaseError} When database query fails
 * 
 * @example
 * const user = await userService.getUserById(123);
 * console.log(user.email);
 */
export async function getUserById(userId: number): Promise<User> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError(`User ${userId} not found`);
  }
  return user;
}
```

### Exported Interfaces/Types
- Document complex types and interfaces
- Explain what each field represents

```typescript
/**
 * Represents a user in the application
 */
export interface User {
  /** Unique identifier */
  id: number;
  /** User's email address */
  email: string;
  /** User's full name */
  name: string;
  /** Account creation timestamp */
  createdAt: Date;
}
```

### README Documentation
- Include setup instructions
- Document API endpoints with examples
- Include testing and deployment instructions

---

## 10. Git Practices

### Conventional Commits
- Follow Conventional Commits specification: `<type>(<scope>): <description>`
- Commit types:
  - `feat:` - New feature
  - `fix:` - Bug fix
  - `docs:` - Documentation changes
  - `test:` - Test additions or changes
  - `refactor:` - Code refactoring without feature/fix changes
  - `perf:` - Performance improvements
  - `chore:` - Build, dependency, or tooling changes
  - `ci:` - CI/CD configuration changes

### Commit Message Format
```
feat(api): add user authentication endpoint

- Implement JWT token generation
- Add login validation middleware
- Create refresh token mechanism

Closes #123
```

### Good Practices
- **Commit early and often** with meaningful messages
- Keep commits focused on single concerns
- Include related issue/ticket numbers: `Closes #123`, `Fixes #456`
- Use present tense: "add feature" not "added feature"
- Prefix breaking changes with `BREAKING CHANGE:` in commit body
- Don't commit directly to main - use feature branches and PRs

### Branch Naming
- Format: `{type}/{ticket-number}-{short-description}`
- Examples:
  - `feat/issue-123-add-authentication`
  - `fix/bug-456-user-validation-error`
  - `docs/issue-789-api-documentation`

---

## Summary Checklist

Before committing code, verify:
- [ ] All functions <30 lines and properly named
- [ ] Unit tests exist for business logic (>80% coverage)
- [ ] Integration tests for all new endpoints
- [ ] Input validation on all endpoints using schema library
- [ ] No raw SQL queries - only parameterized/query builder
- [ ] Structured logging with requestId and context
- [ ] No console.log - use logger instead
- [ ] All exported functions have JSDoc documentation
- [ ] Error handling with custom error classes
- [ ] API responses follow standard envelope format
- [ ] No TODO comments without ticket numbers
- [ ] Code formatted with Prettier and passes ESLint
- [ ] Conventional commit message
- [ ] Database migrations created for schema changes
- [ ] No hardcoded secrets or sensitive data

