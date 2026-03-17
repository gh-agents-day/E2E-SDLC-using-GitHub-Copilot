# Task Management API Documentation

This document describes the four main Task Management API endpoints implemented in the ITMS backend.

## Overview

The Task Management API provides RESTful endpoints for creating, reading, and managing tasks with support for:
- Status workflow management with automatic blocking based on task dependencies
- Flexible filtering, pagination, and sorting
- Structured error responses with request tracing
- Comprehensive status history tracking

All endpoints return responses in a consistent envelope format and include request IDs for tracing.

## API Response Envelope

All responses follow this standardized structure:

```typescript
{
  "success": true|false,                    // Operation success status
  "data": <T> | null,                       // Response data (null on error)
  "error": {                                // Error details (null on success)
    "code": "ERROR_CODE",                   // Machine-readable error code
    "message": "Human-readable message",    // User-friendly error message
    "details": {}                           // Additional error details
  } | null,
  "meta": {
    "timestamp": "2026-03-17T10:30:45Z",   // ISO 8601 timestamp
    "requestId": "550e8400-e29b-41d4...",  // Unique request identifier
    "pagination": {                          // Only for list endpoints
      "page": 1,
      "pageSize": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

## HTTP Status Codes

- **201**: Created (POST with successful creation)
- **200**: OK (successful GET, PATCH)
- **204**: No Content (successful DELETE)
- **400**: Bad Request (validation errors, invalid filters)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

## Endpoints

### 1. POST /api/v1/tasks - Create Task

Creates a new task with the provided details. Automatically generates a task ID code (e.g., T-1001) and records the initial status in history.

**Request**

```http
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "Implement Payment API",
  "description": "Create RESTful API for payment processing with Stripe integration",
  "priority": "High",
  "status": "ToDo",
  "assignedUserId": 5,
  "estimatedCompletionDate": "2026-04-15"
}
```

**Request Schema**

| Field | Type | Required | Max Length | Constraints |
|-------|------|----------|-----------|-------------|
| `title` | string | ✅ | 200 | Cannot be empty |
| `description` | string | ❌ | 2000 | Optional |
| `priority` | enum | ✅ | - | Low, Medium, High |
| `status` | enum | ✅ | - | ToDo, InProgress, Blocked, Completed |
| `assignedUserId` | number | ✅ | - | Must be positive integer |
| `estimatedCompletionDate` | date | ✅ | - | Must be today or future date |

**Response**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "taskIdCode": "T-1001",
    "title": "Implement Payment API",
    "description": "Create RESTful API for payment processing with Stripe integration",
    "priority": "High",
    "status": "ToDo",
    "assignedUserId": 5,
    "estimatedCompletionDate": "2026-04-15T00:00:00Z",
    "createdAt": "2026-03-17T10:30:45.123Z",
    "updatedAt": "2026-03-17T10:30:45.123Z",
    "createdByUserId": 1,
    "version": 1
  },
  "error": null,
  "meta": {
    "timestamp": "2026-03-17T10:30:45.123Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Error Responses**

```json
// Missing required field
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid task data",
    "details": {
      "validationErrors": [
        {
          "field": "title",
          "message": "Title is required"
        }
      ]
    }
  },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```

**Example cURL**

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement Payment API",
    "priority": "High",
    "status": "ToDo",
    "assignedUserId": 5,
    "estimatedCompletionDate": "2026-04-15"
  }'
```

---

### 2. GET /api/v1/tasks - List Tasks

Retrieves a paginated list of tasks with optional filtering, sorting, and pagination. Supports multiple filter criteria that can be combined.

**Request**

```http
GET /api/v1/tasks?status=InProgress&priority=High&pageNumber=1&pageSize=20&sortBy=estimatedCompletionDate&sortOrder=asc
```

**Query Parameters**

| Parameter | Type | Default | Max | Description | Example |
|-----------|------|---------|-----|-------------|---------|
| `status` | enum | - | - | Filter by status | `?status=InProgress` |
| `priority` | enum | - | - | Filter by priority | `?priority=High` |
| `assignedUserId` | number | - | - | Filter by assigned user | `?assignedUserId=5` |
| `dueDateFrom` | date | - | - | Tasks due on/after date | `?dueDateFrom=2026-03-01` |
| `dueDateTo` | date | - | - | Tasks due on/before date | `?dueDateTo=2026-03-31` |
| `pageNumber` | number | 1 | - | Page number (1-based) | `?pageNumber=2` |
| `pageSize` | number | 20 | 100 | Items per page | `?pageSize=50` |
| `sortBy` | string | createdAt | - | Sort field | `?sortBy=priority` |
| `sortOrder` | enum | desc | - | Sort direction (asc/desc) | `?sortOrder=asc` |

**Valid Filter Values**
- `status`: ToDo, InProgress, Blocked, Completed
- `priority`: Low, Medium, High
- `sortBy`: Any task field (createdAt, priority, status, etc.)
- `sortOrder`: asc, desc

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "taskIdCode": "T-1001",
      "title": "Implement Payment API",
      "priority": "High",
      "status": "InProgress",
      "assignedUserId": 5,
      "estimatedCompletionDate": "2026-04-15T00:00:00Z",
      "createdAt": "2026-03-17T10:30:45.123Z",
      "updatedAt": "2026-03-17T11:00:00.000Z",
      "createdByUserId": 1,
      "version": 2
    },
    {
      "id": 2,
      "taskIdCode": "T-1002",
      "title": "Write API documentation",
      "priority": "Medium",
      "status": "ToDo",
      "assignedUserId": 3,
      "estimatedCompletionDate": "2026-04-20T00:00:00Z",
      "createdAt": "2026-03-17T10:32:15.000Z",
      "updatedAt": "2026-03-17T10:32:15.000Z",
      "createdByUserId": 1,
      "version": 1
    }
  ],
  "error": null,
  "meta": {
    "timestamp": "2026-03-17T10:35:20.000Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440001",
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 42,
      "totalPages": 3
    }
  }
}
```

**Example cURL - Different Filters**

```bash
# Get all in-progress tasks assigned to user 5
curl "http://localhost:3000/api/v1/tasks?status=InProgress&assignedUserId=5"

# Get high-priority tasks due this week
curl "http://localhost:3000/api/v1/tasks?priority=High&dueDateFrom=2026-03-17&dueDateTo=2026-03-24"

# Get second page with 10 items per page, sorted by due date
curl "http://localhost:3000/api/v1/tasks?pageNumber=2&pageSize=10&sortBy=estimatedCompletionDate&sortOrder=asc"
```

---

### 3. GET /api/v1/tasks/:id - Get Task Details

Retrieves detailed information about a specific task, including all metadata and status history information.

**Request**

```http
GET /api/v1/tasks/1
```

**URL Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | ✅ | Task ID (positive integer) |

**Response**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "taskIdCode": "T-1001",
    "title": "Implement Payment API",
    "description": "Create RESTful API for payment processing with Stripe integration",
    "priority": "High",
    "status": "InProgress",
    "assignedUserId": 5,
    "estimatedCompletionDate": "2026-04-15T00:00:00Z",
    "createdAt": "2026-03-17T10:30:45.123Z",
    "updatedAt": "2026-03-17T11:00:00.000Z",
    "createdByUserId": 1,
    "updatedByUserId": 1,
    "version": 2
  },
  "error": null,
  "meta": {
    "timestamp": "2026-03-17T10:35:20.000Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440002"
  }
}
```

**Error Responses**

```json
// Task not found
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Task 99999 not found"
  },
  "meta": { "timestamp": "...", "requestId": "..." }
}

// Invalid task ID format
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_TASK_ID",
    "message": "Task ID must be a positive integer"
  },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```

**Example cURL**

```bash
# Get task details
curl http://localhost:3000/api/v1/tasks/1
```

---

### 4. PATCH /api/v1/tasks/:id/status - Update Task Status

Updates the status of a task with automatic business rule enforcement. Automatically blocks tasks that have pending dependencies. Creates a status history entry for audit purposes.

**Request**

```http
PATCH /api/v1/tasks/1/status
Content-Type: application/json

{
  "status": "Completed",
  "comment": "Task completed successfully"
}
```

**Request Schema**

| Field | Type | Required | Max Length | Values |
|-------|------|----------|-----------|--------|
| `status` | enum | ✅ | - | ToDo, InProgress, Blocked, Completed |
| `comment` | string | ❌ | 500 | Optional status change reason |

**Business Rules**

Per TSD Section 5.6.1, the following rules are automatically enforced:

1. **Automatic Blocking**: If a task has pending (uncompleted) dependencies, status is automatically set to "Blocked" regardless of requested status.
2. **Status Validation**: New status must be one of the four valid statuses.
3. **History Recording**: Every status change is recorded in status history with timestamp and user ID.
4. **Version Increment**: Task version is incremented on each update (optimistic locking).

**Response**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "taskIdCode": "T-1001",
    "title": "Implement Payment API",
    "description": "Create RESTful API for payment processing with Stripe integration",
    "priority": "High",
    "status": "Completed",
    "assignedUserId": 5,
    "estimatedCompletionDate": "2026-04-15T00:00:00Z",
    "createdAt": "2026-03-17T10:30:45.123Z",
    "updatedAt": "2026-03-17T12:30:00.000Z",
    "createdByUserId": 1,
    "updatedByUserId": 1,
    "version": 3
  },
  "error": null,
  "meta": {
    "timestamp": "2026-03-17T12:30:00.000Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440003"
  }
}
```

**Error Responses**

```json
// Invalid status value
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid status update data",
    "details": {
      "validationErrors": [
        {
          "field": "status",
          "message": "Status must be one of: ToDo, InProgress, Blocked, Completed"
        }
      ]
    }
  },
  "meta": { "timestamp": "...", "requestId": "..." }
}

// Task not found
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Task 99999 not found"
  },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```

**Example cURL - Status Transitions**

```bash
# Start work on a task
curl -X PATCH http://localhost:3000/api/v1/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "InProgress", "comment": "Started implementation"}'

# Complete a task
curl -X PATCH http://localhost:3000/api/v1/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Completed", "comment": "Implementation complete and tested"}'

# Block a task (e.g., waiting for another task)
curl -X PATCH http://localhost:3000/api/v1/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Blocked", "comment": "Blocked: awaiting backend API implementation"}'
```

---

## Headers

### Request Headers

| Header | Example | Notes |
|--------|---------|-------|
| `Content-Type` | application/json | Required for POST/PATCH requests |
| `x-request-id` | 550e8400-e29b-41d4... | Optional; auto-generated if not provided |

### Response Headers

| Header | Example |
|--------|---------|
| `x-request-id` | 550e8400-e29b-41d4-a716-446655440000 |
| `Content-Type` | application/json |

---

## Data Types & Formats

### Task Priority
- `Low`: Low priority tasks
- `Medium`: Medium priority tasks
- `High`: High priority tasks

### Task Status
- `ToDo`: Task not yet started
- `InProgress`: Task currently being worked on
- `Blocked`: Task blocked due to dependencies or other reasons
- `Completed`: Task successfully completed

### Date Format
All dates use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ` or `YYYY-MM-DD` for input.

Examples:
- Input: `"2026-04-15"` or `"2026-04-15T00:00:00Z"`
- Output: `"2026-04-15T00:00:00.000Z"`

---

## Implementation Notes

### Request ID Tracking
Every request receives a unique `requestId` in the response `meta` object. Use this ID to trace logs and correlate requests in multi-service environments.

### Pagination
- Default page size: 20 items
- Maximum page size: 100 items (larger requests are capped)
- Page numbers are 1-based (first page is page 1)
- Total count is always included in response

### Validation
All inputs are validated against strict schemas:
- Required fields must be present
- String lengths are enforced
- Enum values must match exactly (case-sensitive)
- Dates must be valid and (typically) in the future

### Dependency Management
Tasks automatically transition to "Blocked" status if they have uncompleted dependencies. This is enforced on:
- Status creation (if dependencies exist at creation time)
- When updating status to non-"Blocked" value
- Automatically when dependencies are added

### Structured Logging
All requests are logged with structured JSON format including:
- Request method and path
- Request ID for tracing
- Client IP address
- User agent information
- Request body (for POST/PATCH)
- Response status and latency

---

## Running the Server

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test

# Integration tests only
npm run test:integration
```

The API starts on `http://localhost:3000` by default. Check the health endpoint:

```bash
curl http://localhost:3000/api/v1/health
```
