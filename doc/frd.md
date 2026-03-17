# Functional Requirements Document
## Intelligent Task Management System

**Document Version:** 1.0  
**Date:** March 17, 2026  
**Prepared By:** Functional Analysis Team  
**Project Sponsor:** Product Management

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | March 17, 2026 | Functional Analysis Team | Initial FRD creation based on BRD and requirements |

---

## 1. Introduction & Purpose

### 1.1 Document Purpose

This Functional Requirements Document (FRD) defines the detailed functional specifications for the Intelligent Task Management System. This document translates business requirements from the Business Requirements Document (BRD) into testable, implementable functional specifications that developers and QA engineers can use to build and verify the system.

### 1.2 Scope

This FRD covers:
- User roles and permission model
- Detailed use cases for all major workflows
- User stories with acceptance criteria in Gherkin format
- Functional requirements catalog with traceability to BRD
- Data validation rules and constraints
- Notification requirements (future implementation)
- Error handling specifications
- Reporting requirements

### 1.3 Audience

This document is intended for:
- **Development Teams**: To understand what to build
- **QA Engineers**: To create test cases and verify functionality
- **Product Owners**: To validate that requirements are correctly captured
- **UI/UX Designers**: To design appropriate user interfaces
- **Business Analysts**: To ensure alignment with business needs

### 1.4 Document Relationships

- **Business Requirements Document (BRD)**: Provides business context and high-level requirements
- **Technical Specification Document (TSD)**: Defines technical architecture implementing these requirements
- **Test Plans**: Will be derived from acceptance criteria in this document

---

## 2. System Overview

The Intelligent Task Management System is a web-based application that enables software development teams to create, manage, and track tasks with automatic dependency detection and blocker identification. The system provides:

**Core Capabilities:**
- **Task Management**: Create, view, update, and delete tasks with rich attributes (title, description, priority, status, due date)
- **Assignment Management**: Assign tasks to team members and track workload distribution
- **Dependency Tracking**: Define task dependencies and automatically detect blocked tasks
- **Status Workflow**: Track task progression through "To Do" → "In Progress" → "Blocked" → "Completed" states
- **Filtering & Search**: Find tasks by status, priority, assignee, or due date
- **Progress Reporting**: View project-level metrics showing task distribution and completion rates
- **Audit Trail**: Maintain immutable history of all status changes

**User Experience Principles:**
- Intuitive, minimal-training-required interface
- Fast response times (< 2 seconds for most operations)
- Clear, actionable error messages
- Consistent interaction patterns across all features

---

## 3. User Roles & Permissions Matrix

The system supports four primary user roles with varying levels of access:

| Feature / Action | Developer | QA Engineer | Team Lead | Project Manager |
|------------------|:---------:|:-----------:|:---------:|:---------------:|
| **Authentication** |
| Register account | ✅ | ✅ | ✅ | ✅ |
| Login / Logout | ✅ | ✅ | ✅ | ✅ |
| Change own password | ✅ | ✅ | ✅ | ✅ |
| **Task Viewing** |
| View own assigned tasks | ✅ | ✅ | ✅ | ✅ |
| View all tasks in project | ✅ | ✅ | ✅ | ✅ |
| View task details | ✅ | ✅ | ✅ | ✅ |
| View task status history | ✅ | ✅ | ✅ | ✅ |
| View task dependencies | ✅ | ✅ | ✅ | ✅ |
| **Task Creation & Editing** |
| Create new task | ❌ | ❌ | ✅ | ✅ |
| Edit task details (title, description, priority) | ❌ | ❌ | ✅ | ✅ |
| Delete task | ❌ | ❌ | ✅ | ✅ |
| Update own task status | ✅ | ✅ | ✅ | ✅ |
| Update any task status | ❌ | ❌ | ✅ | ✅ |
| Update own task estimated completion date | ✅ | ✅ | ✅ | ✅ |
| **Task Assignment** |
| Assign task to team member | ❌ | ❌ | ✅ | ✅ |
| Reassign task to different member | ❌ | ❌ | ✅ | ✅ |
| Self-assign unassigned task | ✅ | ✅ | ✅ | ✅ |
| **Dependency Management** |
| Add task dependency | ❌ | ❌ | ✅ | ✅ |
| Remove task dependency | ❌ | ❌ | ✅ | ✅ |
| View blocking tasks | ✅ | ✅ | ✅ | ✅ |
| **Filtering & Search** |
| Filter tasks by status | ✅ | ✅ | ✅ | ✅ |
| Filter tasks by priority | ✅ | ✅ | ✅ | ✅ |
| Filter tasks by assignee | ✅ | ✅ | ✅ | ✅ |
| Filter tasks by due date | ✅ | ✅ | ✅ | ✅ |
| **Reporting** |
| View project progress summary | ✅ | ✅ | ✅ | ✅ |
| View user workload distribution | ❌ | ❌ | ✅ | ✅ |
| View overdue tasks report | ✅ | ✅ | ✅ | ✅ |
| View blocked tasks report | ✅ | ✅ | ✅ | ✅ |
| **User Management** |
| View list of team members | ✅ | ✅ | ✅ | ✅ |
| View user profile | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ |
| Deactivate user account | ❌ | ❌ | ❌ | ✅ |

**Legend:**
- ✅ = Permission granted
- ❌ = Permission denied

**Role Descriptions:**

- **Developer**: Software engineer working on implementation tasks. Can view all tasks, update status of own tasks, and access reports.
- **QA Engineer**: Quality assurance engineer testing features. Same permissions as Developer, focused on testing tasks.
- **Team Lead**: Technical lead managing a team. Can create/edit tasks, assign work, manage dependencies, and access all reports.
- **Project Manager**: Manager overseeing project delivery. Full permissions including user management and all reporting capabilities.

---

## 4. Use Cases

### UC-001: Task Creation

**Use Case ID**: UC-001  
**Use Case Name**: Create New Task  
**Actor**: Team Lead, Project Manager  
**Goal**: Create a new task with all required attributes to track work in the project  
**Preconditions**:
- User is authenticated and has Team Lead or Project Manager role
- At least one team member exists in the system to assign the task to

**Normal Flow**:
1. User navigates to the task creation interface
2. System displays task creation form with the following fields:
   - Title (required, text input)
   - Description (optional, text area)
   - Priority (required, dropdown: Low/Medium/High)
   - Status (required, dropdown: To Do/In Progress/Blocked/Completed, default: To Do)
   - Assigned User (required, dropdown of active team members)
   - Estimated Completion Date (required, date picker)
3. User enters task title "Implement Payment API"
4. User enters task description "Create RESTful API for payment processing with Stripe integration"
5. User selects priority "High"
6. User selects status "To Do"
7. User selects assigned user "John Doe" from dropdown
8. User selects estimated completion date "2026-04-15"
9. User clicks "Create Task" button
10. System validates all required fields are populated
11. System validates estimated completion date is today or future date
12. System validates assigned user exists and is active
13. System generates unique Task ID (e.g., "T-1001")
14. System saves task to database with Created At timestamp
15. System displays success message: "Task T-1001 'Implement Payment API' created successfully"
16. System redirects user to task detail view

**Alternative Flows**:

**Alt-1: Required Field Missing**
- Step 10: If any required field is empty, system displays validation error: "The following fields are required: [field names]"
- System highlights missing fields in red
- User corrects errors and resubmits

**Alt-2: Past Date Selected**
- Step 11: If estimated completion date is in the past, system displays error: "Estimated completion date must be today or a future date"
- User selects valid date and resubmits

**Alt-3: Invalid User Selected**
- Step 12: If selected user does not exist or is deactivated, system displays error: "Selected user is invalid or inactive. Please select an active team member."
- User selects valid user and resubmits

**Alt-4: User Cancels Creation**
- At any point before step 9, user clicks "Cancel" button
- System discards entered data and returns to previous page

**Postconditions**:
- Task is created in database with status "To Do"
- Task is assigned to selected team member
- Task appears in assigned user's task list
- Task has unique Task ID code
- Status history entry is created with initial status "To Do"

**Business Rules Referenced**: BR-R-001, BR-R-002, BR-R-003, BR-R-004, BR-R-008, BR-R-009  
**BRD Traceability**: BR-F-001, BR-F-002, BR-F-003, BR-F-004  
**Priority**: Must Have

---

### UC-002: Task Assignment

**Use Case ID**: UC-002  
**Use Case Name**: Assign Task to Team Member  
**Actor**: Team Lead, Project Manager  
**Goal**: Assign or reassign a task to a team member to distribute work  
**Preconditions**:
- User is authenticated with Team Lead or Project Manager role
- Task exists in the system
- At least one active team member exists

**Normal Flow**:
1. User navigates to task list or task detail view
2. User selects task "T-1001: Implement Payment API"
3. User clicks "Assign" or "Reassign" button
4. System displays assignment dialog with:
   - Current assignee (if task is already assigned)
   - Dropdown of all active team members
   - Optional reason/comment field
5. User selects new assignee "Jane Smith" from dropdown
6. User enters optional reason: "Jane has more experience with payment APIs"
7. User clicks "Confirm Assignment" button
8. System validates selected user exists and is active
9. System updates task's AssignedUserId to Jane Smith's user ID
10. System records assignment change with timestamp and user who made the change
11. System displays success message: "Task T-1001 reassigned to Jane Smith successfully"
12. System updates task view to show new assignee

**Alternative Flows**:

**Alt-1: Self-Assignment by Developer/QA**
- Any authenticated user (Developer, QA, Team Lead, Project Manager) can self-assign an unassigned task
- User clicks "Assign to Me" button on unassigned task
- System assigns task to current user without confirmation dialog
- System displays success message: "Task T-1001 assigned to you successfully"

**Alt-2: Invalid User Selected**
- Step 8: If selected user does not exist or is inactive, system displays error: "Cannot assign task to inactive user. Please select an active team member."
- User selects valid user and resubmits

**Alt-3: User Cancels Assignment**
- At step 7, user clicks "Cancel" button
- System discards changes and returns to task view with original assignee

**Alt-4: Concurrent Assignment Conflict**
- Between steps 3 and 9, another user modifies the same task
- System detects optimistic locking conflict
- System displays error: "Task has been modified by another user. Please refresh and try again."
- User refreshes task and repeats assignment process

**Postconditions**:
- Task is assigned to selected team member
- Assignment change is recorded in audit log
- Task appears in new assignee's task list
- Task is removed from previous assignee's task list (if reassigned)
- Notification is queued for new assignee (future feature)

**Business Rules Referenced**: BR-R-008  
**BRD Traceability**: BR-F-004, BR-F-005  
**Priority**: Must Have

---

### UC-003: Task Dependency Management

**Use Case ID**: UC-003  
**Use Case Name**: Define Task Dependencies  
**Actor**: Team Lead, Project Manager  
**Goal**: Define dependencies between tasks to ensure proper sequencing and automatically detect blockers  
**Preconditions**:
- User is authenticated with Team Lead or Project Manager role
- At least two tasks exist in the system
- User is viewing a task detail page

**Normal Flow**:
1. User navigates to task detail view for task "T-1005: Deploy Application"
2. User clicks "Add Dependency" button in the Dependencies section
3. System displays dependency creation dialog with:
   - Search/dropdown of all tasks except current task
   - Dependency type: "Depends On" (this task depends on selected task)
4. User searches for and selects "T-1003: Complete Integration Testing"
5. User clicks "Add Dependency" button
6. System validates:
   - Selected task exists
   - Selected task is not the current task (no self-dependency)
   - Dependency does not already exist
   - Adding dependency does not create circular dependency
7. System creates TaskDependency record linking T-1005 → T-1003
8. System checks if T-1003 status is "Completed"
9. T-1003 status is "In Progress" (not completed), so system automatically updates T-1005 status to "Blocked"
10. System creates StatusHistory entry recording automatic status change to "Blocked"
11. System displays success message: "Dependency added. Task T-1005 is now blocked by T-1003."
12. System updates task detail view showing:
    - T-1005 status is now "Blocked"
    - Dependencies section lists "T-1003: Complete Integration Testing (In Progress)"
    - Visual indicator showing task is blocked

**Alternative Flows**:

**Alt-1: Self-Dependency Attempt**
- Step 6: If user selects the current task as dependency, system displays error: "A task cannot depend on itself. Please select a different task."
- User selects valid dependency and resubmits

**Alt-2: Duplicate Dependency**
- Step 6: If dependency already exists, system displays error: "This dependency already exists for the task."
- User clicks OK to dismiss dialog

**Alt-3: Circular Dependency Detected**
- Step 6: If adding dependency would create circular chain (T-1005 → T-1003 → T-1007 → T-1005), system displays error: "Cannot add dependency. This would create a circular dependency chain: T-1005 → T-1003 → T-1007 → T-1005"
- User selects different dependency or cancels

**Alt-4: Dependency Task Already Completed**
- Step 8-9: If selected dependency task (T-1003) status is "Completed"
- System adds dependency but does NOT change current task status to "Blocked"
- System displays success message: "Dependency added. Prerequisite task is already completed."

**Alt-5: Remove Dependency**
- User clicks "Remove" button next to existing dependency
- System displays confirmation dialog: "Remove dependency on T-1003? This may unblock this task."
- User confirms removal
- System deletes dependency record
- System checks if task should remain "Blocked" based on remaining dependencies
- If no blocking dependencies remain, system updates task status from "Blocked" to "To Do"
- System displays success message: "Dependency removed. Task T-1005 is now unblocked."

**Postconditions**:
- Dependency relationship is created in database
- Dependent task status is automatically updated to "Blocked" if prerequisite is incomplete
- Task detail view shows all dependencies and blocking status
- System can prevent task progression until dependencies are met
- Status history records automatic blocker detection

**Business Rules Referenced**: BR-R-005, BR-R-006  
**BRD Traceability**: BR-F-006, BR-F-007  
**Priority**: Must Have

---

### UC-004: Task Status Tracking

**Use Case ID**: UC-004  
**Use Case Name**: Update Task Status  
**Actor**: Developer, QA Engineer, Team Lead, Project Manager  
**Goal**: Update task status to reflect current work state and maintain audit trail  
**Preconditions**:
- User is authenticated
- Task exists and is assigned to user (or user has Team Lead/Project Manager role)
- Task is not currently "Blocked" by dependencies

**Normal Flow**:
1. User navigates to task detail view for task "T-1003: Complete Integration Testing"
2. Current status is "In Progress"
3. User clicks "Update Status" button or status dropdown
4. System displays status selection with available transitions:
   - To Do (if reverting work)
   - In Progress (current, grayed out)
   - Completed (if work is done)
   - Blocked (if dependencies exist)
5. User selects "Completed" status
6. System displays confirmation dialog: "Mark task T-1003 as Completed?"
7. User can optionally add comment: "All integration tests passing, code reviewed"
8. User clicks "Confirm" button
9. System validates:
   - User has permission to update status
   - Status transition is valid
   - Task is not blocked by dependencies (if moving to Completed)
10. System updates task status to "Completed"
11. System updates task's UpdatedAt timestamp
12. System creates StatusHistory record with:
    - TaskId: 1003
    - OldStatus: "In Progress"
    - NewStatus: "Completed"
    - ChangedAt: 2026-03-17 14:30:00 UTC
    - ChangedByUserId: Current user ID
    - Comment: "All integration tests passing, code reviewed"
13. System checks if any tasks depend on T-1003
14. System finds T-1005 "Deploy Application" depends on T-1003 and is currently "Blocked"
15. System checks all dependencies of T-1005
16. All dependencies are now "Completed", so system automatically updates T-1005 status from "Blocked" to "To Do"
17. System creates StatusHistory entry for T-1005 automatic unblocking
18. System displays success message: "Task T-1003 marked as Completed. Task T-1005 has been automatically unblocked."
19. System refreshes task detail view showing new status

**Alternative Flows**:

**Alt-1: Task is Blocked by Dependencies**
- Step 9: User attempts to move task to "Completed" but task has incomplete dependencies
- System displays error: "Cannot complete task. The following dependencies are not yet completed: T-1002: Security Review (In Progress)"
- User can choose to update to different status or resolve dependencies first

**Alt-2: Insufficient Permissions**
- Step 9: Developer/QA attempts to update status of task not assigned to them
- System displays error: "You do not have permission to update this task. Only the assigned user or Team Lead/Project Manager can update task status."
- Status change is not saved

**Alt-3: Concurrent Status Update Conflict**
- Between steps 4 and 10, another user updates the same task status
- System detects optimistic locking conflict (version mismatch)
- System displays error: "Task has been modified by another user. Current status is: [new status]. Please refresh and try again."
- User refreshes task and sees updated status

**Alt-4: User Cancels Status Update**
- At step 7, user clicks "Cancel" button in confirmation dialog
- System discards changes and maintains current status
- No history entry is created

**Alt-5: View Status History**
- User clicks "View History" button in task detail view
- System displays status history table showing:
  - Date/Time of each status change
  - Old Status → New Status transition
  - User who made the change
  - Optional comment
- User can filter history by date range
- User closes history view

**Postconditions**:
- Task status is updated in database
- Status history entry is created (immutable audit trail)
- Dependent tasks are automatically unblocked if all prerequisites are met
- Task appears in appropriate status-filtered views
- UpdatedAt timestamp is refreshed

**Business Rules Referenced**: BR-R-004, BR-R-006, BR-R-007, BR-R-010  
**BRD Traceability**: BR-F-003, BR-F-007, BR-F-008  
**Priority**: Must Have

---

### UC-005: Task Listing and Filtering

**Use Case ID**: UC-005  
**Use Case Name**: Filter and Search Tasks  
**Actor**: Developer, QA Engineer, Team Lead, Project Manager  
**Goal**: Find specific tasks using filters to focus on relevant work  
**Preconditions**:
- User is authenticated
- At least one task exists in the system

**Normal Flow**:
1. User navigates to "Tasks" page
2. System displays task list with default view showing all tasks, paginated (20 per page)
3. Each task row displays:
   - Task ID (e.g., T-1001)
   - Title
   - Priority (color-coded: Red=High, Yellow=Medium, Green=Low)
   - Status (with visual indicator)
   - Assigned User
   - Estimated Completion Date
4. User wants to find all high-priority tasks assigned to them that are in progress
5. User clicks "Filter" button to expand filter panel
6. System displays filter options:
   - Status (multi-select: To Do, In Progress, Blocked, Completed)
   - Priority (multi-select: Low, Medium, High)
   - Assigned User (dropdown: All Users, Me, specific user)
   - Due Date Range (date pickers: From / To)
7. User selects:
   - Status: "In Progress" (checkbox)
   - Priority: "High" (checkbox)
   - Assigned User: "Me" (current user)
8. User clicks "Apply Filters" button
9. System constructs query with selected filters
10. System executes database query to retrieve matching tasks
11. System displays filtered results: 3 tasks found
12. Task list updates to show only matching tasks
13. System displays filter summary: "Showing 3 tasks: Status=In Progress, Priority=High, Assigned to Me"
14. User can click "Clear Filters" to reset to default view

**Alternative Flows**:

**Alt-1: No Tasks Match Filters**
- Step 11: Query returns zero results
- System displays message: "No tasks match the selected filters. Try adjusting your filter criteria."
- Empty task list is shown
- Filter panel remains open with current selections

**Alt-2: Filter by Due Date Range**
- At step 7, user selects due date range:
  - From: 2026-03-15
  - To: 2026-03-22
- System filters tasks where EstimatedCompletionDate is between selected dates (inclusive)
- System displays tasks due within the next week

**Alt-3: Multiple Status Filter**
- At step 7, user selects multiple statuses: "To Do" and "In Progress"
- System applies OR logic: show tasks that are either To Do OR In Progress
- System displays combined results

**Alt-4: Sort Results**
- After filtering, user clicks column header "Due Date" to sort
- System re-orders results by estimated completion date (ascending)
- User clicks "Due Date" header again to reverse sort (descending)
- Sort indicator (↑↓) shows current sort direction

**Alt-5: Pagination of Results**
- Step 11: Query returns 45 tasks
- System displays first 20 tasks (page 1 of 3)
- User clicks "Next" or page number "2" at bottom of list
- System loads next 20 tasks without losing filter state
- URL updates with page parameter for bookmarking

**Alt-6: Save Filter Preset (Future Enhancement)**
- User configures complex filter combination
- User clicks "Save Filter" button
- System prompts for filter name: "My High Priority Items"
- System saves filter preset for quick access
- User can load saved filter from preset dropdown

**Postconditions**:
- Task list displays only tasks matching filter criteria
- Filter selections are preserved during session
- User can bookmark filtered view via URL parameters
- Filter state is cleared when user logs out
- Performance meets <2 second response time target

**Business Rules Referenced**: BR-R-003, BR-R-004  
**BRD Traceability**: BR-F-009, BR-F-010, BR-F-011, BR-F-012  
**Priority**: Must Have

---

### UC-006: Project Progress Summary

**Use Case ID**: UC-006  
**Use Case Name**: View Project Progress Summary  
**Actor**: Developer, QA Engineer, Team Lead, Project Manager  
**Goal**: View high-level project metrics to understand project health and completion status  
**Preconditions**:
- User is authenticated
- At least one task exists in the project

**Normal Flow**:
1. User navigates to "Dashboard" or "Reports" page
2. User clicks "Project Progress" or views default dashboard
3. System queries database to aggregate task counts by status
4. System calculates:
   - Total Tasks: COUNT(*) from Tasks table
   - To Do: COUNT(*) WHERE Status = 'ToDo'
   - In Progress: COUNT(*) WHERE Status = 'InProgress'
   - Blocked: COUNT(*) WHERE Status = 'Blocked'
   - Completed: COUNT(*) WHERE Status = 'Completed'
   - Completion Percentage: (Completed / Total) * 100
5. System displays progress summary dashboard with:
   - **Total Tasks**: 20
   - **Completion Rate**: 40% (8 of 20 completed)
   - Progress bar showing 40% filled
   - **Status Breakdown**:
     - ✅ Completed: 8 tasks (40%)
     - 🔄 In Progress: 6 tasks (30%)
     - 🚫 Blocked: 2 tasks (10%)
     - 📋 To Do: 4 tasks (20%)
6. System displays visual chart (bar or pie chart) showing status distribution
7. System shows "Last Updated" timestamp
8. User can click on any status category to drill down
9. User clicks "Blocked: 2 tasks"
10. System navigates to filtered task list showing only blocked tasks
11. User can identify blockers and take action

**Alternative Flows**:

**Alt-1: No Tasks Exist**
- Step 4: Query returns zero tasks
- System displays message: "No tasks found in project. Create your first task to get started!"
- Progress summary shows all zeros
- "Create Task" button is prominently displayed

**Alt-2: View User Workload Distribution**
- User (Team Lead or Project Manager) clicks "User Workload" tab
- System queries tasks grouped by AssignedUserId
- System displays table:
  - User Name | Total Tasks | To Do | In Progress | Blocked | Completed
  - John Doe | 8 | 2 | 3 | 0 | 3
  - Jane Smith | 12 | 3 | 5 | 2 | 2
- System highlights users with high workload (>10 tasks) in yellow
- System highlights blocked tasks in red

**Alt-3: View Overdue Tasks**
- User clicks "Overdue Tasks" widget on dashboard
- System queries tasks WHERE EstimatedCompletionDate < TODAY AND Status != 'Completed'
- System displays list of 5 overdue tasks with:
  - Task ID and Title
  - Assigned User
  - Due Date (how many days overdue)
  - Status
- Tasks are sorted by most overdue first

**Alt-4: Export Progress Report**
- User clicks "Export" button on progress summary
- System displays export options: CSV, PDF, JSON
- User selects PDF
- System generates PDF report with:
  - Report date and time
  - All summary metrics
  - Status distribution chart
  - Overdue tasks list (if any)
- Browser downloads "Project_Progress_2026-03-17.pdf"

**Alt-5: Refresh Real-Time Data**
- User clicks "Refresh" button
- System re-queries database for latest counts
- System updates all metrics and charts
- System displays "Updated just now" timestamp
- Auto-refresh can be enabled (every 60 seconds)

**Alt-6: Compare Time Periods (Future Enhancement)**
- User selects date range: "Last 30 days"
- System shows trend line of completion rate over time
- System highlights velocity: "10 tasks completed this week vs. 8 last week"
- System predicts completion date based on current velocity

**Postconditions**:
- User has clear understanding of project health
- User can identify bottlenecks (blocked tasks)
- User can identify workload imbalances
- Report data is accurate as of query execution time
- User can drill down into specific status categories

**Business Rules Referenced**: BR-R-004  
**BRD Traceability**: BR-F-013, BO-001, BO-004  
**Priority**: Must Have

---

## 5. User Stories

### 5.1 Authentication & User Management

#### US-001: User Registration

**As a** new team member,  
**I want to** register for an account with my email and password,  
**So that** I can access the task management system.

**Acceptance Criteria:**

**Given** I am on the registration page  
**When** I enter valid email "john.doe@company.com", password "SecureP@ss123", first name "John", and last name "Doe"  
**And** I click the "Register" button  
**Then** my account is created with role "Developer"  
**And** I receive a success message "Account created successfully"  
**And** I am redirected to the login page  

**Given** I am on the registration page  
**When** I enter an email that already exists in the system  
**And** I click the "Register" button  
**Then** I see an error message "Email address is already registered"  
**And** my account is not created  

**Given** I am on the registration page  
**When** I enter an invalid email format "notanemail"  
**Then** I see validation error "Please enter a valid email address"  

**Given** I am on the registration page  
**When** I enter a password shorter than 8 characters  
**Then** I see validation error "Password must be at least 8 characters long"  

**Story Points**: 3  
**BRD Traceability**: BR-F-015  
**Priority**: Must Have

---

#### US-002: User Login

**As a** registered user,  
**I want to** log in with my email and password,  
**So that** I can access my assigned tasks and project information.

**Acceptance Criteria:**

**Given** I am on the login page  
**When** I enter valid email "john.doe@company.com" and correct password "SecureP@ss123"  
**And** I click the "Login" button  
**Then** I am authenticated and receive a JWT access token  
**And** I am redirected to the dashboard page  
**And** I see my name displayed in the header "Welcome, John Doe"  

**Given** I am on the login page  
**When** I enter valid email but incorrect password  
**And** I click the "Login" button  
**Then** I see an error message "Invalid email or password"  
**And** I remain on the login page  
**And** my account is locked after 5 failed attempts  

**Given** I am logged in  
**When** my access token expires after 1 hour  
**And** I make an API request  
**Then** I receive a 401 Unauthorized response  
**And** I am redirected to the login page  

**Given** I have a valid refresh token  
**When** my access token expires  
**And** I send the refresh token to `/auth/refresh`  
**Then** I receive a new access token  
**And** I can continue working without re-entering credentials  

**Story Points**: 3  
**BRD Traceability**: BR-F-015  
**Priority**: Must Have

---

### 5.2 Task Management

#### US-003: Create Task

**As a** Team Lead,  
**I want to** create a new task with all required details,  
**So that** work can be assigned and tracked in the project.

**Acceptance Criteria:**

**Given** I am logged in as a Team Lead  
**When** I navigate to the task creation page  
**And** I enter title "Implement Payment API"  
**And** I enter description "Create RESTful API for payment processing"  
**And** I select priority "High"  
**And** I select status "To Do"  
**And** I select assigned user "John Doe"  
**And** I select estimated completion date "2026-04-15"  
**And** I click "Create Task"  
**Then** a new task is created with auto-generated ID "T-1001"  
**And** I see success message "Task T-1001 created successfully"  
**And** the task appears in John Doe's task list  

**Given** I am on the task creation page  
**When** I leave the title field empty  
**And** I click "Create Task"  
**Then** I see validation error "Title is required"  
**And** the task is not created  

**Given** I am on the task creation page  
**When** I enter title longer than 200 characters  
**Then** I see validation error "Title must not exceed 200 characters"  

**Given** I am on the task creation page  
**When** I select estimated completion date in the past (e.g., "2026-03-10")  
**And** I click "Create Task"  
**Then** I see validation error "Estimated completion date must be today or a future date"  

**Given** I am logged in as a Developer (not Team Lead)  
**When** I attempt to access the task creation page  
**Then** I see error message "You do not have permission to create tasks"  
**And** I am redirected to the dashboard  

**Story Points**: 5  
**BRD Traceability**: BR-F-001, BR-F-002, BR-F-003, BR-F-004, BR-R-001, BR-R-002, BR-R-009  
**Priority**: Must Have

---

#### US-004: View Task Details

**As a** Developer,  
**I want to** view all details of a task,  
**So that** I understand what work needs to be done.

**Acceptance Criteria:**

**Given** I am logged in  
**When** I click on task "T-1001: Implement Payment API" from the task list  
**Then** I am taken to the task detail page  
**And** I see the following information:
- Task ID: T-1001
- Title: Implement Payment API
- Description: Create RESTful API for payment processing
- Priority: High (displayed in red)
- Status: In Progress (with visual indicator)
- Assigned to: John Doe
- Estimated Completion Date: 2026-04-15
- Created At: 2026-03-15 10:30:00
- Updated At: 2026-03-16 14:20:00
- Dependencies: None

**Given** I am viewing a task detail page  
**When** the task has dependencies  
**Then** I see a "Dependencies" section showing:
- "This task depends on: T-1002: Security Review (In Progress)"
- A warning if task is blocked: "⚠️ This task is blocked by incomplete dependencies"

**Given** I am viewing a task detail page  
**When** I click "View History" button  
**Then** I see a timeline of all status changes:
- 2026-03-16 14:20:00 - Changed from "To Do" to "In Progress" by John Doe
- 2026-03-15 10:30:00 - Task created with status "To Do" by Jane Smith (Team Lead)

**Given** I attempt to view a task that does not exist (e.g., T-9999)  
**When** I navigate to `/tasks/9999`  
**Then** I see error message "Task not found"  
**And** I am redirected to the task list  

**Story Points**: 3  
**BRD Traceability**: BR-F-014, BR-F-008  
**Priority**: Must Have

---

#### US-005: Update Task Status

**As a** Developer,  
**I want to** update the status of my assigned tasks,  
**So that** the team knows the current state of my work.

**Acceptance Criteria:**

**Given** I am logged in as a Developer  
**And** task "T-1001" is assigned to me  
**And** current status is "To Do"  
**When** I navigate to the task detail page  
**And** I click "Update Status" button  
**And** I select "In Progress"  
**And** I optionally add comment "Starting work on payment integration"  
**And** I click "Confirm"  
**Then** the task status is updated to "In Progress"  
**And** I see success message "Task status updated to In Progress"  
**And** a status history entry is created with my comment  
**And** the task appears in the "In Progress" filter  

**Given** I am viewing my task "T-1001" with status "In Progress"  
**When** I update status to "Completed"  
**And** another task "T-1005" depends on T-1001 and is currently "Blocked"  
**Then** T-1001 status updates to "Completed"  
**And** T-1005 status automatically changes from "Blocked" to "To Do"  
**And** I see message "Task T-1001 completed. Task T-1005 has been automatically unblocked."  

**Given** I am a Developer  
**When** I attempt to update status of a task not assigned to me  
**Then** I see error message "You can only update status of tasks assigned to you"  
**And** the status is not changed  

**Given** my task "T-1003" has incomplete dependencies  
**When** I attempt to update status to "Completed"  
**Then** I see error message "Cannot complete task. The following dependencies are not completed: T-1002: Security Review"  
**And** the status remains unchanged  

**Story Points**: 5  
**BRD Traceability**: BR-F-003, BR-F-007, BR-F-008, BR-R-004, BR-R-006, BR-R-007  
**Priority**: Must Have

---

#### US-006: Edit Task Details

**As a** Team Lead,  
**I want to** edit task details like title, description, and priority,  
**So that** task information stays accurate and up-to-date.

**Acceptance Criteria:**

**Given** I am logged in as a Team Lead  
**When** I navigate to task detail page for "T-1001"  
**And** I click "Edit" button  
**Then** all editable fields become enabled:
- Title (text input)
- Description (text area)
- Priority (dropdown)
- Estimated Completion Date (date picker)

**Given** I am editing task "T-1001"  
**When** I change title from "Implement Payment API" to "Implement Payment Gateway Integration"  
**And** I change priority from "High" to "Medium"  
**And** I click "Save Changes"  
**Then** the task is updated with new values  
**And** the UpdatedAt timestamp is refreshed  
**And** I see success message "Task updated successfully"  

**Given** I am editing a task  
**When** I clear the title field  
**And** I click "Save Changes"  
**Then** I see validation error "Title is required"  
**And** changes are not saved  

**Given** I am editing a task  
**When** another user modifies the same task before I save  
**And** I click "Save Changes"  
**Then** I see error "Task has been modified by another user. Please refresh and try again."  
**And** I can refresh to see latest version  

**Given** I am a Developer (not Team Lead)  
**When** I view a task detail page  
**Then** I do not see an "Edit" button  
**And** all fields are read-only  

**Story Points**: 3  
**BRD Traceability**: BR-F-014, BR-R-002, BR-NF-007  
**Priority**: Must Have

---

### 5.3 Task Assignment

#### US-007: Assign Task to Team Member

**As a** Team Lead,  
**I want to** assign a task to a specific team member,  
**So that** work is distributed across the team.

**Acceptance Criteria:**

**Given** I am logged in as a Team Lead  
**And** task "T-1002" exists and is unassigned  
**When** I navigate to the task detail page  
**And** I click "Assign" button  
**And** I select user "Jane Smith" from the dropdown  
**And** I optionally enter reason "Jane has experience with this technology"  
**And** I click "Confirm Assignment"  
**Then** the task is assigned to Jane Smith  
**And** I see success message "Task T-1002 assigned to Jane Smith"  
**And** the task appears in Jane's "My Tasks" list  

**Given** I assign task "T-1002" to Jane Smith  
**When** Jane logs in and navigates to "My Tasks"  
**Then** she sees "T-1002" in her task list  
**And** she can update its status  

**Given** I am viewing an assigned task "T-1003"  
**When** I click "Reassign" button  
**And** I select different user "Bob Johnson"  
**Then** the assignment change is recorded in audit log  
**And** T-1003 is removed from original assignee's list  
**And** T-1003 appears in Bob's task list  

**Given** I attempt to assign a task to an inactive user  
**When** I select an inactive user from dropdown  
**Then** system prevents selection or shows error "Cannot assign to inactive user"  

**Story Points**: 3  
**BRD Traceability**: BR-F-004, BR-F-005, BR-R-008  
**Priority**: Must Have

---

#### US-008: Self-Assign Task

**As a** Developer,  
**I want to** self-assign an unassigned task,  
**So that** I can pick up work without waiting for Team Lead assignment.

**Acceptance Criteria:**

**Given** I am logged in as a Developer  
**And** task "T-1007" is unassigned (no assigned user)  
**When** I navigate to the task list  
**And** I see "T-1007" marked as "Unassigned"  
**And** I click "Assign to Me" button  
**Then** the task is immediately assigned to me  
**And** I see success message "Task T-1007 assigned to you"  
**And** the task appears in "My Tasks" view  

**Given** I am viewing an unassigned task detail page  
**When** I click "Assign to Me" button  
**Then** no confirmation dialog is required  
**And** assignment happens immediately  

**Given** task "T-1008" is already assigned to another user  
**When** I view the task  
**Then** I do not see "Assign to Me" button  
**And** only "Currently assigned to: John Doe" is displayed  

**Story Points**: 2  
**BRD Traceability**: BR-F-004  
**Priority**: Should Have

---

### 5.4 Dependency Management

#### US-009: Add Task Dependency

**As a** Team Lead,  
**I want to** define that one task depends on another,  
**So that** the system can automatically detect blockers and enforce proper sequencing.

**Acceptance Criteria:**

**Given** I am logged in as a Team Lead  
**And** tasks "T-1003: Integration Testing" and "T-1005: Deploy Application" exist  
**When** I navigate to task detail page for "T-1005"  
**And** I click "Add Dependency" button  
**And** I search for and select "T-1003: Integration Testing"  
**And** I click "Add Dependency"  
**Then** dependency is created: T-1005 depends on T-1003  
**And** system checks T-1003 status  
**And** T-1003 status is "In Progress" (not completed)  
**And** T-1005 status is automatically updated to "Blocked"  
**And** I see message "Dependency added. Task T-1005 is now blocked by T-1003."  

**Given** T-1005 is blocked by T-1003  
**When** someone updates T-1003 status to "Completed"  
**Then** system automatically checks T-1005 dependencies  
**And** all dependencies are completed  
**And** T-1005 status automatically changes from "Blocked" to "To Do"  
**And** T-1005 assignee sees notification "Task T-1005 has been unblocked and is ready to start"  

**Given** I am adding a dependency to T-1005  
**When** I attempt to select T-1005 itself as the dependency  
**Then** I see error "A task cannot depend on itself"  
**And** dependency is not created  

**Given** tasks form a chain: T-1005 → T-1003 → T-1007  
**When** I attempt to add dependency: T-1007 → T-1005  
**Then** I see error "Cannot add dependency. This would create a circular dependency: T-1005 → T-1003 → T-1007 → T-1005"  
**And** dependency is not created  

**Story Points**: 8  
**BRD Traceability**: BR-F-006, BR-F-007, BR-R-005, BR-R-006  
**Priority**: Must Have

---

#### US-010: Remove Task Dependency

**As a** Team Lead,  
**I want to** remove a task dependency,  
**So that** I can adjust project sequencing when priorities change.

**Acceptance Criteria:**

**Given** I am logged in as a Team Lead  
**And** T-1005 depends on T-1003  
**And** T-1005 status is "Blocked"  
**When** I navigate to T-1005 detail page  
**And** I see dependency "T-1003: Integration Testing (In Progress)"  
**And** I click "Remove" button next to the dependency  
**Then** I see confirmation dialog "Remove dependency on T-1003? This may unblock this task."  

**Given** I confirm dependency removal  
**When** T-1005 has no other dependencies  
**Then** the dependency is deleted from database  
**And** T-1005 status automatically changes from "Blocked" to "To Do"  
**And** I see success message "Dependency removed. Task T-1005 is now unblocked."  

**Given** I confirm dependency removal  
**When** T-1005 has other incomplete dependencies (e.g., T-1002 still incomplete)  
**Then** the specific dependency is removed  
**And** T-1005 status remains "Blocked" (due to T-1002)  
**And** I see message "Dependency removed. Task remains blocked by other dependencies."  

**Story Points**: 3  
**BRD Traceability**: BR-F-006, BR-R-006  
**Priority**: Must Have

---

### 5.5 Filtering and Search

#### US-011: Filter Tasks by Status

**As a** Developer,  
**I want to** filter tasks by status,  
**So that** I can focus on tasks in a specific state.

**Acceptance Criteria:**

**Given** I am logged in  
**And** 20 tasks exist with various statuses  
**When** I navigate to the task list page  
**And** I click "Filter" button  
**And** I select status "In Progress"  
**And** I click "Apply Filters"  
**Then** the task list shows only tasks with status "In Progress"  
**And** I see filter summary "Showing 6 tasks: Status=In Progress"  
**And** pagination reflects filtered count  

**Given** I have status filter applied  
**When** I select additional status "Blocked"  
**And** I click "Apply Filters"  
**Then** the task list shows tasks with status "In Progress" OR "Blocked"  
**And** I see filter summary "Showing 8 tasks: Status=In Progress, Blocked"  

**Given** I have filters applied  
**When** I click "Clear Filters" button  
**Then** all filters are removed  
**And** the task list shows all tasks  
**And** filter summary is cleared  

**Given** I filter by status "Completed"  
**When** no tasks have "Completed" status  
**Then** I see message "No tasks match the selected filters"  
**And** empty task list is displayed  

**Story Points**: 3  
**BRD Traceability**: BR-F-009  
**Priority**: Must Have

---

#### US-012: Filter Tasks by Priority

**As a** Developer,  
**I want to** filter tasks by priority,  
**So that** I can focus on high-priority work first.

**Acceptance Criteria:**

**Given** I am logged in  
**When** I navigate to task list  
**And** I apply filter priority "High"  
**Then** I see only tasks with priority "High"  
**And** tasks are displayed with red priority indicator  

**Given** I apply filter priority "High" and "Medium"  
**Then** I see tasks with priority "High" or "Medium"  
**And** I do not see tasks with priority "Low"  

**Story Points**: 2  
**BRD Traceability**: BR-F-010  
**Priority**: Must Have

---

#### US-013: Filter Tasks by Assigned User

**As a** Team Lead,  
**I want to** filter tasks by assigned user,  
**So that** I can review a specific team member's workload.

**Acceptance Criteria:**

**Given** I am logged in as Team Lead  
**When** I navigate to task list  
**And** I apply filter assigned user "John Doe"  
**Then** I see only tasks assigned to John Doe  
**And** I see filter summary "Showing 8 tasks assigned to John Doe"  

**Given** I am a Developer  
**When** I apply filter "My Tasks" or "Assigned to Me"  
**Then** I see only tasks assigned to me  
**And** this provides quick access to my personal task list  

**Story Points**: 2  
**BRD Traceability**: BR-F-011  
**Priority**: Must Have

---

#### US-014: Filter Tasks by Due Date

**As a** Project Manager,  
**I want to** filter tasks by due date range,  
**So that** I can identify tasks due soon or overdue.

**Acceptance Criteria:**

**Given** I am logged in as Project Manager  
**When** I navigate to task list  
**And** I apply filter due date from "2026-03-15" to "2026-03-22"  
**Then** I see only tasks with estimated completion date between those dates (inclusive)  
**And** I see filter summary "Showing 12 tasks due between Mar 15 - Mar 22, 2026"  

**Given** I filter by due date range  
**When** I select from "2026-03-01" to "2026-03-17" (today)  
**Then** I see tasks due up to and including today  
**And** overdue tasks are highlighted in yellow or red  

**Story Points**: 3  
**BRD Traceability**: BR-F-012  
**Priority**: Should Have

---

#### US-015: Combine Multiple Filters

**As a** Team Lead,  
**I want to** apply multiple filters simultaneously,  
**So that** I can find very specific tasks (e.g., high-priority in-progress tasks assigned to specific user).

**Acceptance Criteria:**

**Given** I am logged in as Team Lead  
**When** I apply filters:
- Status: "In Progress"
- Priority: "High"  
- Assigned User: "John Doe"  
**And** I click "Apply Filters"  
**Then** I see only tasks matching ALL criteria (AND logic)  
**And** I see filter summary "Showing 2 tasks: Status=In Progress, Priority=High, Assigned to John Doe"  

**Given** I have multiple filters applied  
**When** I clear one filter (e.g., remove "High" priority)  
**Then** remaining filters stay active  
**And** results update to reflect remaining filters  

**Story Points**: 5  
**BRD Traceability**: BR-F-009, BR-F-010, BR-F-011, BR-F-012  
**Priority**: Must Have

---

### 5.6 Reporting

#### US-016: View Project Progress Summary

**As a** Project Manager,  
**I want to** view a dashboard showing overall project progress,  
**So that** I can quickly assess project health and identify issues.

**Acceptance Criteria:**

**Given** I am logged in as Project Manager  
**And** project has 20 tasks total  
**When** I navigate to the dashboard  
**Then** I see "Project Progress" widget displaying:
- Total Tasks: 20
- Completed: 8 (40%)
- In Progress: 6 (30%)
- Blocked: 2 (10%)
- To Do: 4 (20%)
- Completion Rate: 40%  
**And** I see a visual progress bar showing 40% completion  
**And** I see a pie/bar chart showing status distribution  

**Given** I am viewing the progress dashboard  
**When** I click on "Blocked: 2 tasks"  
**Then** I am taken to a filtered task list showing only blocked tasks  
**And** I can identify what is blocking them  

**Given** project has 5 overdue tasks  
**When** I view the dashboard  
**Then** I see a warning widget "⚠️ 5 tasks are overdue"  
**And** I can click to view overdue task list  

**Given** I view the progress summary  
**When** I click "Refresh" button  
**Then** all metrics are recalculated from current database state  
**And** I see "Last updated: just now"  

**Story Points**: 5  
**BRD Traceability**: BR-F-013, BO-001, BO-004  
**Priority**: Must Have

---

#### US-017: View User Workload Distribution

**As a** Team Lead,  
**I want to** see how tasks are distributed across team members,  
**So that** I can balance workload and prevent burnout.

**Acceptance Criteria:**

**Given** I am logged in as Team Lead  
**When** I navigate to "Reports" → "User Workload"  
**Then** I see a table showing all team members:
| User | Total Tasks | To Do | In Progress | Blocked | Completed |  
| John Doe | 8 | 2 | 3 | 0 | 3 |  
| Jane Smith | 12 | 3 | 5 | 2 | 2 |  
| Bob Johnson | 5 | 1 | 2 | 0 | 2 |  

**Given** I view workload distribution  
**When** a user has more than 10 tasks  
**Then** their row is highlighted in yellow as "High workload"  

**Given** I view workload distribution  
**When** a user has blocked tasks  
**Then** the blocked count is highlighted in red  
**And** I can click to see which tasks are blocked  

**Story Points**: 5  
**BRD Traceability**: BO-003  
**Priority**: Should Have

---

#### US-018: View Overdue Tasks Report

**As a** Project Manager,  
**I want to** see all tasks that are past their estimated completion date,  
**So that** I can take corrective action.

**Acceptance Criteria:**

**Given** I am logged in as Project Manager  
**And** today is 2026-03-17  
**And** 5 tasks have estimated completion date before today and status != "Completed"  
**When** I navigate to "Reports" → "Overdue Tasks"  
**Then** I see a list of 5 overdue tasks showing:
- Task ID and Title  
- Assigned User  
- Due Date  
- Days Overdue  
- Current Status  
**And** tasks are sorted by most overdue first  

**Given** I view overdue tasks report  
**When** a task is more than 7 days overdue  
**Then** it is highlighted in red  
**And** when 1-7 days overdue, highlighted in yellow  

**Story Points**: 3  
**BRD Traceability**: BO-001  
**Priority**: Should Have

---

## 6. Functional Requirements Catalogue

| FR-ID | Requirement Description | Priority | BRD Ref | Status | Acceptance Test |
|-------|-------------------------|----------|---------|--------|-----------------|
| **Authentication & Authorization** |
| FR-001 | System shall allow users to register with email, password, first name, last name | Must Have | BR-F-015 | Planned | US-001 |
| FR-002 | System shall validate email format during registration | Must Have | BR-F-015 | Planned | US-001 |
| FR-003 | System shall enforce password minimum length of 8 characters | Must Have | BR-F-015 | Planned | US-001 |
| FR-004 | System shall prevent duplicate email registration | Must Have | BR-F-015 | Planned | US-001 |
| FR-005 | System shall authenticate users with email and password | Must Have | BR-F-015 | Planned | US-002 |
| FR-006 | System shall issue JWT access tokens valid for 1 hour | Must Have | BR-F-015 | Planned | US-002 |
| FR-007 | System shall issue refresh tokens valid for 7 days | Must Have | BR-F-015 | Planned | US-002 |
| FR-008 | System shall lock account after 5 failed login attempts | Should Have | R-010 | Planned | US-002 |
| FR-009 | System shall support four user roles: Developer, QA Engineer, Team Lead, Project Manager | Must Have | BR-F-015 | Planned | Section 3 |
| FR-010 | System shall enforce role-based permissions as defined in permissions matrix | Must Have | BR-F-015 | Planned | Section 3 |
| **Task Management** |
| FR-011 | System shall allow Team Lead and Project Manager to create tasks | Must Have | BR-F-001 | Planned | UC-001, US-003 |
| FR-012 | System shall auto-generate unique Task ID in format T-#### | Must Have | BR-R-001 | Planned | UC-001, US-003 |
| FR-013 | System shall require title, priority, status, assigned user, estimated completion date for task creation | Must Have | BR-R-002 | Planned | UC-001, US-003 |
| FR-014 | System shall enforce title maximum length of 200 characters | Must Have | BR-R-002 | Planned | US-003 |
| FR-015 | System shall allow description maximum length of 2000 characters | Should Have | BR-R-002 | Planned | US-003 |
| FR-016 | System shall enforce priority values: Low, Medium, High | Must Have | BR-R-003, BR-F-002 | Planned | UC-001, US-003 |
| FR-017 | System shall enforce status values: To Do, In Progress, Blocked, Completed | Must Have | BR-R-004, BR-F-003 | Planned | UC-001, US-003 |
| FR-018 | System shall validate estimated completion date is today or future date | Must Have | BR-R-009 | Planned | UC-001, US-003 |
| FR-019 | System shall allow all authenticated users to view task details | Must Have | BR-F-014 | Planned | UC-005, US-004 |
| FR-020 | System shall display task ID, title, description, priority, status, assigned user, dates | Must Have | BR-F-014 | Planned | US-004 |
| FR-021 | System shall allow Team Lead and Project Manager to edit task details | Must Have | BR-F-014 | Planned | US-006 |
| FR-022 | System shall update UpdatedAt timestamp on any task modification | Must Have | BR-F-014 | Planned | US-006 |
| FR-023 | System shall allow Team Lead and Project Manager to delete tasks | Should Have | IS-001 | Planned | - |
| FR-024 | System shall display error "Task not found" for non-existent task IDs | Must Have | BR-NF-009 | Planned | US-004 |
| **Task Status Management** |
| FR-025 | System shall allow users to update status of tasks assigned to them | Must Have | BR-F-003 | Planned | UC-004, US-005 |
| FR-026 | System shall allow Team Lead and Project Manager to update status of any task | Must Have | BR-F-003 | Planned | UC-004, US-005 |
| FR-027 | System shall create StatusHistory record for every status change | Must Have | BR-F-008, BR-R-007 | Planned | UC-004, US-005 |
| FR-028 | System shall record timestamp, old status, new status, user, optional comment in history | Must Have | BR-F-008 | Planned | UC-004, US-005 |
| FR-029 | System shall prevent modification or deletion of StatusHistory records | Must Have | BR-R-007 | Planned | UC-004 |
| FR-030 | System shall display status history timeline on task detail page | Should Have | BR-F-008 | Planned | US-004 |
| FR-031 | System shall log unusual status transitions (e.g., Completed → To Do) | Should Have | BR-R-010 | Planned | UC-004 |
| **Task Assignment** |
| FR-032 | System shall allow Team Lead and Project Manager to assign tasks during creation | Must Have | BR-F-004 | Planned | UC-001, US-003 |
| FR-033 | System shall allow Team Lead and Project Manager to reassign tasks | Must Have | BR-F-005 | Planned | UC-002, US-007 |
| FR-034 | System shall validate assigned user exists and is active | Must Have | BR-R-008 | Planned | UC-001, UC-002 |
| FR-035 | System shall record assignment changes with timestamp and user | Should Have | BR-F-005 | Planned | UC-002, US-007 |
| FR-036 | System shall allow all users to self-assign unassigned tasks | Should Have | BR-F-004 | Planned | US-008 |
| FR-037 | System shall display tasks in assigned user's "My Tasks" view | Must Have | BR-F-011 | Planned | US-007 |
| **Dependency Management** |
| FR-038 | System shall allow Team Lead and Project Manager to add task dependencies | Must Have | BR-F-006 | Planned | UC-003, US-009 |
| FR-039 | System shall prevent task from depending on itself | Must Have | BR-R-005 | Planned | UC-003, US-009 |
| FR-040 | System shall detect and prevent circular dependencies | Must Have | BR-R-005, R-005 | Planned | UC-003, US-009 |
| FR-041 | System shall prevent duplicate dependencies | Must Have | BR-F-006 | Planned | UC-003 |
| FR-042 | System shall automatically mark task as "Blocked" when dependency is incomplete | Must Have | BR-F-007, BR-R-006 | Planned | UC-003, US-009 |
| FR-043 | System shall automatically unblock task when all dependencies are completed | Must Have | BR-F-007, BR-R-006 | Planned | UC-004, US-009 |
| FR-044 | System shall create StatusHistory entry for automatic status changes | Must Have | BR-F-008 | Planned | UC-003 |
| FR-045 | System shall display all dependencies on task detail page | Must Have | BR-F-006 | Planned | UC-003, US-004 |
| FR-046 | System shall allow Team Lead and Project Manager to remove dependencies | Must Have | BR-F-006 | Planned | US-010 |
| FR-047 | System shall show blocking tasks list (reverse dependencies) | Should Have | BR-F-007 | Planned | US-009 |
| **Filtering & Search** |
| FR-048 | System shall allow filtering tasks by status with multi-select | Must Have | BR-F-009 | Planned | UC-005, US-011 |
| FR-049 | System shall allow filtering tasks by priority with multi-select | Must Have | BR-F-010 | Planned | UC-005, US-012 |
| FR-050 | System shall allow filtering tasks by assigned user | Must Have | BR-F-011 | Planned | UC-005, US-013 |
| FR-051 | System shall allow filtering tasks by due date range | Should Have | BR-F-012 | Planned | UC-005, US-014 |
| FR-052 | System shall support combining multiple filters with AND logic | Must Have | BR-F-009 to BR-F-012 | Planned | UC-005, US-015 |
| FR-053 | System shall display filter summary showing active filters | Should Have | BR-F-009 | Planned | UC-005 |
| FR-054 | System shall allow clearing all filters at once | Should Have | BR-F-009 | Planned | UC-005, US-011 |
| FR-055 | System shall display "No tasks match filters" message when results are empty | Must Have | BR-NF-009 | Planned | UC-005, US-011 |
| FR-056 | System shall paginate filtered results (20 per page default) | Must Have | BR-NF-005 | Planned | UC-005 |
| FR-057 | System shall allow sorting by task ID, title, priority, status, due date | Should Have | BO-004 | Planned | UC-005 |
| **Reporting** |
| FR-058 | System shall calculate and display project progress summary | Must Have | BR-F-013 | Planned | UC-006, US-016 |
| FR-059 | System shall show total, completed, in progress, blocked, to do task counts | Must Have | BR-F-013 | Planned | UC-006, US-016 |
| FR-060 | System shall calculate completion percentage | Must Have | BR-F-013 | Planned | UC-006, US-016 |
| FR-061 | System shall display visual progress bar and status distribution chart | Should Have | BR-F-013 | Planned | UC-006, US-016 |
| FR-062 | System shall allow drill-down from summary to filtered task list | Should Have | BO-001 | Planned | UC-006, US-016 |
| FR-063 | System shall display user workload distribution report | Should Have | BO-003 | Planned | US-017 |
| FR-064 | System shall highlight users with high workload (>10 tasks) | Should Have | BO-003 | Planned | US-017 |
| FR-065 | System shall display overdue tasks report | Should Have | BO-001 | Planned | US-018 |
| FR-066 | System shall calculate days overdue for each task | Should Have | BO-001 | Planned | US-018 |
| FR-067 | System shall display blocked tasks report | Should Have | BO-002 | Planned | UC-006 |
| FR-068 | System shall show timestamp "Last Updated" on all reports | Should Have | BR-F-013 | Planned | UC-006 |
| FR-069 | System shall allow manual refresh of reports | Should Have | BR-F-013 | Planned | UC-006, US-016 |
| **Data Integrity & Concurrency** |
| FR-070 | System shall implement optimistic locking for concurrent updates | Must Have | BR-NF-007, R-004 | Planned | UC-002, US-006 |
| FR-071 | System shall detect concurrent modifications and display error message | Must Have | BR-NF-007 | Planned | UC-002, US-006 |
| FR-072 | System shall validate all required fields before saving | Must Have | BR-R-002 | Planned | All create/edit operations |
| FR-073 | System shall enforce foreign key constraints on user and task references | Must Have | BR-NF-007 | Planned | All operations |
| FR-074 | System shall use database transactions for multi-table operations | Must Have | BR-NF-007 | Planned | Dependency creation, status updates |

---

## 7. Data Requirements & Validation Rules

### 7.1 User Entity

| Field | Type | Required | Validation Rules | Error Message |
|-------|------|----------|------------------|---------------|
| **Email** | String | Yes | - Must match email format regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`<br>- Maximum 254 characters<br>- Must be unique in system | "Please enter a valid email address"<br>"Email address is already registered" |
| **Password** | String | Yes | - Minimum 8 characters<br>- Maximum 128 characters<br>- Must contain at least one letter and one number (recommended)<br>- Stored as bcrypt hash, never plaintext | "Password must be at least 8 characters long"<br>"Password is too weak" |
| **FirstName** | String | Yes | - Minimum 1 character<br>- Maximum 50 characters<br>- Only letters, spaces, hyphens, apostrophes | "First name is required"<br>"First name contains invalid characters" |
| **LastName** | String | Yes | - Minimum 1 character<br>- Maximum 50 characters<br>- Only letters, spaces, hyphens, apostrophes | "Last name is required"<br>"Last name contains invalid characters" |
| **Role** | Enum | Yes | - Must be one of: Developer, QAEngineer, TeamLead, ProjectManager<br>- Default: Developer | "Invalid role specified" |
| **IsActive** | Boolean | Yes | - Default: true | N/A |

### 7.2 Task Entity

| Field | Type | Required | Validation Rules | Error Message |
|-------|------|----------|------------------|---------------|
| **TaskIdCode** | String | Yes (auto-generated) | - Format: `T-####` where #### is auto-increment number starting at 1001<br>- System-generated, user cannot modify<br>- Must be unique | "Task ID already exists" (system error) |
| **Title** | String | Yes | - Minimum 1 character<br>- Maximum 200 characters<br>- No leading/trailing whitespace<br>- Cannot be only whitespace | "Title is required"<br>"Title must not exceed 200 characters"<br>"Title cannot be empty or whitespace only" |
| **Description** | String | No | - Maximum 2000 characters<br>- Can be empty or null<br>- Plain text or markdown | "Description must not exceed 2000 characters" |
| **Priority** | Enum | Yes | - Must be exactly one of: `Low`, `Medium`, `High`<br>- Case-sensitive<br>- No default, must be explicitly selected | "Priority is required"<br>"Priority must be Low, Medium, or High" |
| **Status** | Enum | Yes | - Must be exactly one of: `ToDo`, `InProgress`, `Blocked`, `Completed`<br>- Default: `ToDo` for new tasks<br>- Case-sensitive | "Status is required"<br>"Status must be ToDo, InProgress, Blocked, or Completed" |
| **AssignedUserId** | Integer | Yes | - Must reference existing, active user in Users table<br>- Foreign key constraint enforced<br>- Cannot be null | "Assigned user is required"<br>"Selected user does not exist or is inactive" |
| **EstimatedCompletionDate** | Date | Yes | - Must be today or future date (validated at creation time)<br>- Format: YYYY-MM-DD<br>- Cannot be null | "Estimated completion date is required"<br>"Estimated completion date must be today or a future date"<br>"Invalid date format" |
| **CreatedAt** | DateTime | Yes (auto-generated) | - System-generated on task creation<br>- UTC timestamp<br>- Immutable after creation | N/A |
| **UpdatedAt** | DateTime | Yes (auto-generated) | - System-generated on any task modification<br>- UTC timestamp<br>- Auto-updated on save | N/A |
| **CreatedByUserId** | Integer | Yes (auto-populated) | - References user who created the task<br>- Foreign key to Users table<br>- Immutable after creation | N/A |
| **Version** | Integer | Yes (auto-managed) | - Used for optimistic locking<br>- Starts at 1, increments on each update<br>- System-managed | "Task has been modified by another user. Please refresh and try again." |

### 7.3 TaskDependency Entity

| Field | Type | Required | Validation Rules | Error Message |
|-------|------|----------|------------------|---------------|
| **TaskId** | Integer | Yes | - Must reference existing task in Tasks table<br>- Foreign key constraint | "Task does not exist" |
| **DependsOnTaskId** | Integer | Yes | - Must reference existing task in Tasks table<br>- Cannot equal TaskId (no self-dependency)<br>- Foreign key constraint<br>- Unique combination with TaskId | "A task cannot depend on itself"<br>"This dependency already exists"<br>"Dependency task does not exist" |
| **Circular Dependency Check** | Validation | Yes | - System must validate no circular chain exists<br>- Use depth-first search to detect cycles<br>- Max dependency depth: 10 levels | "Cannot add dependency. This would create a circular dependency chain: [task chain]" |

### 7.4 StatusHistory Entity

| Field | Type | Required | Validation Rules | Error Message |
|-------|------|----------|------------------|---------------|
| **TaskId** | Integer | Yes | - Must reference existing task<br>- Foreign key constraint | "Task does not exist" |
| **OldStatus** | Enum | No | - Must be one of valid status values if provided<br>- Can be null for initial task creation | "Invalid status value" |
| **NewStatus** | Enum | Yes | - Must be one of: `ToDo`, `InProgress`, `Blocked`, `Completed`<br>- Cannot be null | "New status is required"<br>"Invalid status value" |
| **ChangedAt** | DateTime | Yes (auto-generated) | - UTC timestamp<br>- System-generated<br>- Immutable | N/A |
| **ChangedByUserId** | Integer | Yes | - Must reference existing user<br>- Foreign key constraint | "User does not exist" |
| **Comment** | String | No | - Maximum 500 characters<br>- Optional | "Comment must not exceed 500 characters" |
| **Immutability** | Constraint | Yes | - Records can only be inserted, never updated or deleted<br>- Database permissions enforce this | N/A (enforced at database level) |

---

## 8. Notification Requirements

### 8.1 Notification Overview

**Note**: Email notifications are marked as **Out of Scope (OS-005)** for MVP. This section defines future notification requirements for post-MVP implementation.

### 8.2 Notification Triggers & Content

| Notification ID | Trigger Event | Recipient(s) | Notification Subject | Notification Content | Priority |
|-----------------|---------------|--------------|---------------------|---------------------|----------|
| **N-001** | Task assigned to user | Assigned user | "New task assigned: [Task Title]" | "You have been assigned to task [Task ID]: [Task Title].<br>Priority: [Priority]<br>Due Date: [Date]<br>Assigned by: [User Name]<br>[View Task Button]" | Future |
| **N-002** | Task reassigned to different user | New assignee | "Task reassigned to you: [Task Title]" | "Task [Task ID]: [Task Title] has been reassigned to you.<br>Previous assignee: [Previous User]<br>Priority: [Priority]<br>Due Date: [Date]<br>Reason: [Reason if provided]<br>[View Task Button]" | Future |
| **N-003** | Task reassigned away from user | Previous assignee | "Task reassigned: [Task Title]" | "Task [Task ID]: [Task Title] has been reassigned from you to [New User].<br>Reason: [Reason if provided]<br>[View Task Button]" | Future |
| **N-004** | Task status changed to Blocked | Assigned user, Team Lead | "Task blocked: [Task Title]" | "Task [Task ID]: [Task Title] is now blocked.<br>Blocked by: [List of incomplete dependencies]<br>Please contact owners of blocking tasks.<br>[View Task Button]" | Future |
| **N-005** | Task status changed to Completed | Team Lead, Project Manager | "Task completed: [Task Title]" | "Task [Task ID]: [Task Title] has been marked as completed by [User Name].<br>Completed on: [Date]<br>[View Task Button]" | Future |
| **N-006** | Task automatically unblocked | Assigned user | "Task unblocked: [Task Title]" | "Good news! Task [Task ID]: [Task Title] has been automatically unblocked.<br>All dependencies are now completed.<br>Status: To Do<br>[View Task Button]" | Future |
| **N-007** | Dependency added to user's task | Assigned user of dependent task | "New dependency added to your task: [Task Title]" | "A dependency has been added to task [Task ID]: [Task Title].<br>Now depends on: [Dependency Task Title]<br>Your task may be blocked if the dependency is incomplete.<br>Added by: [User Name]<br>[View Task Button]" | Future |
| **N-008** | User's task is blocking another task | Assigned user of dependency | "Your task is blocking another task: [Task Title]" | "Task [Task ID]: [Task Title] is blocking another task.<br>Task [Blocked Task ID]: [Blocked Task Title] is waiting for your task to complete.<br>Blocked task assigned to: [User Name]<br>[View Task Button]" | Future |
| **N-009** | Task approaching due date (3 days) | Assigned user, Team Lead | "Task due soon: [Task Title]" | "Reminder: Task [Task ID]: [Task Title] is due in 3 days.<br>Due Date: [Date]<br>Current Status: [Status]<br>[View Task Button]" | Future |
| **N-010** | Task overdue | Assigned user, Team Lead, Project Manager | "Task overdue: [Task Title]" | "⚠️ Task [Task ID]: [Task Title] is now overdue.<br>Due Date: [Date]<br>Days Overdue: [Count]<br>Current Status: [Status]<br>Please update status or extend due date.<br>[View Task Button]" | Future |
| **N-011** | Circular dependency detected | User attempting to create dependency | "Error: Circular dependency prevented" | "Could not add dependency to task [Task ID]: [Task Title].<br>This would create a circular dependency:<br>[Task Chain]<br>Please review task dependencies." | Future |
| **N-012** | Task details updated | Assigned user (if not the updater) | "Task updated: [Task Title]" | "Task [Task ID]: [Task Title] has been updated by [User Name].<br>Changes:<br>[List of changed fields]<br>[View Task Button]" | Future |

### 8.3 Notification Delivery Channels

| Channel | Implementation | Priority |
|---------|----------------|----------|
| **In-App Bell Icon** | Browser notification center with unread count badge | Future |
| **Email** | HTML email sent to user's registered email address | Future (OS-005) |
| **Browser Push** | Web push notifications (requires user permission) | Future |

### 8.4 Notification Preferences

**Future Enhancement**: Allow users to configure notification preferences:
- Enable/disable each notification type
- Choose delivery channels per notification type
- Set quiet hours (no notifications during specified times)
- Digest mode (batch notifications into daily/weekly summary)

---

## 9. Error Handling Requirements

### 9.1 Error Response Structure

All errors must follow **RFC 7807 Problem Details** format:

```json
{
  "type": "https://api.taskmgmt.azure.com/errors/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "The title field is required.",
  "instance": "/api/v1/tasks",
  "errors": {
    "title": ["The title field is required."],
    "priority": ["Priority must be one of: Low, Medium, High"]
  },
  "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00"
}
```

### 9.2 Error Scenarios & Messages

| Error ID | Scenario | HTTP Status | User-Facing Error Message | Technical Details (logged) |
|----------|----------|-------------|---------------------------|---------------------------|
| **Authentication Errors** |
| E-001 | Invalid login credentials | 401 | "Invalid email or password. Please try again." | Log: Failed login attempt for email [email] from IP [ip] |
| E-002 | Account locked after failed attempts | 403 | "Your account has been locked due to multiple failed login attempts. Please contact your administrator or try again in 30 minutes." | Log: Account [userId] locked after 5 failed attempts |
| E-003 | Token expired | 401 | "Your session has expired. Please log in again." | Log: Expired JWT token for user [userId] |
| E-004 | Invalid or malformed token | 401 | "Authentication failed. Please log in again." | Log: Invalid JWT signature or format |
| E-005 | Missing authorization header | 401 | "You must be logged in to access this resource." | Log: Missing Authorization header for endpoint [endpoint] |
| **Permission Errors** |
| E-101 | Insufficient role permissions | 403 | "You do not have permission to perform this action. This action requires [required role] role." | Log: User [userId] with role [role] attempted [action] |
| E-102 | Attempt to update task not assigned to user | 403 | "You can only update status of tasks assigned to you. Contact a Team Lead to update this task." | Log: User [userId] attempted to update task [taskId] assigned to [assignedUserId] |
| E-103 | Attempt to delete task without permission | 403 | "You do not have permission to delete tasks. This action requires Team Lead or Project Manager role." | Log: User [userId] attempted to delete task [taskId] |
| **Validation Errors** |
| E-201 | Required field missing | 400 | "The following fields are required: [field names]" | Log: Validation failed for [entity] - missing required fields [fields] |
| E-202 | Field exceeds maximum length | 400 | "[Field name] must not exceed [max] characters." | Log: Field [field] length [length] exceeds maximum [max] |
| E-203 | Invalid enum value | 400 | "[Field name] must be one of: [valid values]" | Log: Invalid value [value] for field [field] |
| E-204 | Invalid date format | 400 | "Please enter a valid date in YYYY-MM-DD format." | Log: Invalid date format [value] for field [field] |
| E-205 | Past date for future-only field | 400 | "Estimated completion date must be today or a future date." | Log: Past date [date] provided for EstimatedCompletionDate |
| E-206 | Invalid email format | 400 | "Please enter a valid email address." | Log: Invalid email format [email] |
| E-207 | Password too short | 400 | "Password must be at least 8 characters long." | Log: Password validation failed - too short |
| E-208 | Duplicate email registration | 409 | "This email address is already registered. Please use a different email or login." | Log: Duplicate registration attempt for email [email] |
| **Resource Not Found Errors** |
| E-301 | Task not found | 404 | "Task not found. The task may have been deleted or you may not have access." | Log: Task [taskId] not found in database |
| E-302 | User not found | 404 | "User not found. The user may have been deactivated." | Log: User [userId] not found in database |
| E-303 | Dependency not found | 404 | "Dependency not found or has already been removed." | Log: Task dependency [dependencyId] not found |
| **Business Rule Violations** |
| E-401 | Self-dependency attempt | 422 | "A task cannot depend on itself. Please select a different task." | Log: Circular self-dependency attempt for task [taskId] |
| E-402 | Circular dependency detected | 422 | "Cannot add dependency. This would create a circular dependency chain: [task chain]. Please remove one of the dependencies in the chain." | Log: Circular dependency detected: [chain] |
| E-403 | Duplicate dependency | 409 | "This dependency already exists for the task." | Log: Duplicate dependency [taskId] → [dependsOnTaskId] |
| E-404 | Cannot complete task with incomplete dependencies | 422 | "Cannot mark task as Completed. The following dependencies are not yet completed: [list of blocking tasks with IDs and titles]" | Log: Task [taskId] completion blocked by dependencies [dependencyIds] |
| E-405 | Inactive user assignment | 422 | "Cannot assign task to inactive user. Please select an active team member." | Log: Attempted assignment to inactive user [userId] |
| E-406 | Task already assigned | 409 | "This task is already assigned to [user name]. Use 'Reassign' to change the assignment." | Log: Task [taskId] already assigned to user [userId] |
| **Concurrency Errors** |
| E-501 | Optimistic locking conflict | 409 | "Task has been modified by another user. Please refresh the page and try again." | Log: Optimistic locking conflict for task [taskId] - version mismatch |
| E-502 | Database deadlock | 500 | "A temporary error occurred. Please try again." | Log: Database deadlock detected for transaction [transactionId] |
| **System Errors** |
| E-601 | Database connection failure | 503 | "We're experiencing technical difficulties. Please try again in a few moments." | Log: Database connection failed - [error details] |
| E-602 | Unexpected server error | 500 | "An unexpected error occurred. Our team has been notified. Please try again or contact support if the issue persists." | Log: Unhandled exception [exception] at [location] |
| E-603 | Rate limit exceeded | 429 | "Too many requests. Please slow down and try again in [seconds] seconds." | Log: Rate limit exceeded for user [userId] - [requestCount] requests |

### 9.3 Error Handling Principles

1. **User-Friendly Messages**: Error messages should be clear, actionable, and free of technical jargon
2. **Security**: Never expose sensitive information (stack traces, database details, internal paths) to users
3. **Logging**: All errors are logged with full technical details and trace IDs for debugging
4. **Consistency**: All errors follow the same RFC 7807 structure
5. **Actionability**: Error messages should tell users what to do next (e.g., "Please refresh and try again")
6. **Graceful Degradation**: System remains stable even when errors occur; partial functionality is maintained when possible

---

## 10. UI/UX Requirements

### 10.1 Task List View

**Purpose**: Display paginated, filterable list of tasks

**Screen Elements**:
- **Header**: Page title "Tasks", "Create Task" button (if user has permission)
- **Filter Panel**: Collapsible filter section with status, priority, assignee, due date filters
- **Task Table/Cards**: Each task displays:
  - Task ID (clickable link to detail)
  - Title (truncated to 50 chars with "..." if longer)
  - Priority badge (color-coded: Red=High, Yellow=Medium, Green=Low)
  - Status badge with icon (📋 To Do, 🔄 In Progress, 🚫 Blocked, ✅ Completed)
  - Assigned user avatar and name
  - Due date (with overdue indicator in red if past due)
- **Pagination Controls**: Page numbers, Previous/Next buttons, items per page selector
- **Sort Controls**: Column headers are clickable to sort ascending/descending
- **Empty State**: If no tasks, display "No tasks found. Create your first task!" with prominent "Create Task" button

**Interaction Patterns**:
- Click task row/card → Navigate to task detail view
- Click "Filter" → Expand filter panel
- Click "Clear Filters" → Reset to default view
- Click column header → Sort by that column
- Hover over truncated text → Show full text in tooltip

**Responsive Behavior**:
- Desktop: Table layout with all columns
- Tablet: Card layout with essential info
- Mobile: Stacked card layout, swipe for actions

---

### 10.2 Task Detail View

**Purpose**: Display all details of a single task

**Screen Elements**:
- **Header**: Task ID and Title, "Edit" button (if user has permission), "Delete" button (if user has permission)
- **Status Section**:
  - Current status with visual indicator
  - "Update Status" button
  - If blocked, warning banner: "⚠️ This task is blocked by incomplete dependencies"
- **Task Details**:
  - Description (with markdown rendering if applicable)
  - Priority badge
  - Assigned user (avatar + name)
  - Created date and user
  - Updated date and user
  - Estimated completion date (with overdue warning if past)
- **Dependencies Section**:
  - "Add Dependency" button (if user has permission)
  - List of dependencies with status indicators
  - "Remove" button for each dependency (if user has permission)
  - "Blocked by" section showing incomplete dependencies
  - "Blocking" section showing tasks waiting on this task
- **History Section**:
  - "View History" button/toggle
  - Timeline of status changes with date, user, old→new status, optional comment
- **Action Buttons Footer**: "Back to Tasks", "Edit Task", "Update Status"

**Interaction Patterns**:
- Click "Edit" → Enter edit mode (fields become editable)
- Click "Update Status" → Show status selection modal
- Click "Add Dependency" → Show task search/select modal
- Click "View History" → Expand/collapse history timeline
- Click dependency task → Navigate to that task's detail view

---

### 10.3 Task Creation/Edit Form

**Purpose**: Create new task or edit existing task

**Screen Elements**:
- **Form Header**: "Create New Task" or "Edit Task: [Task ID]"
- **Form Fields**:
  - Title: Text input, required, character counter (200 max)
  - Description: Text area, optional, character counter (2000 max), markdown support hint
  - Priority: Radio buttons or dropdown (Low/Medium/High), required
  - Status: Radio buttons or dropdown (To Do/In Progress/Blocked/Completed), required
  - Assigned User: Searchable dropdown of active users, required
  - Estimated Completion Date: Date picker, required, blocks past dates
- **Validation**: Real-time validation with inline error messages below each field
- **Action Buttons**: "Save Task" / "Create Task", "Cancel"

**Interaction Patterns**:
- As user types → Show character count, validate format, show/hide error messages
- Select past date → Show error immediately
- Click "Save" → Validate all fields, show summary of errors if any, save if valid
- Click "Cancel" → Show confirmation if changes exist: "Discard unsaved changes?"

---

### 10.4 Progress Dashboard

**Purpose**: Show high-level project metrics

**Screen Elements**:
- **Summary Cards**:
  - Total Tasks (number)
  - Completion Rate (percentage + progress bar)
  - Tasks Completed (number + change from last week)
  - Tasks Blocked (number, red if > 0)
- **Status Distribution Chart**: Pie or bar chart showing tasks by status
- **Priority Distribution Chart**: Bar chart showing high/medium/low priority tasks
- **Overdue Tasks Widget**: Count + list of top 5 overdue tasks
- **Blocked Tasks Widget**: List of blocked tasks with blocking reasons
- **Filters**: Date range selector to show metrics for specific time period
- **Refresh Button**: Manual refresh with "Last updated: [timestamp]"

**Interaction Patterns**:
- Click on any metric → Drill down to filtered task list
- Click chart segment → Filter tasks by that status/priority
- Click overdue task → Navigate to task detail
- Click "Refresh" → Re-query database and update all metrics

---

### 10.5 Filter Panel

**Purpose**: Allow users to filter task list by multiple criteria

**Screen Elements**:
- **Status Filter**: Checkboxes for To Do, In Progress, Blocked, Completed (multi-select)
- **Priority Filter**: Checkboxes for Low, Medium, High (multi-select)  
- **Assigned User Filter**: Dropdown with options: All Users, Me, [list of team members]
- **Due Date Filter**: Two date pickers (From / To) for date range
- **Apply Filters Button**: Triggers filter application
- **Clear Filters Button**: Resets all filters to default
- **Active Filters Summary**: Shows applied filters as removable chips/tags

**Interaction Patterns**:
- Select filter criteria → "Apply Filters" button becomes highlighted
- Click "Apply Filters" → Update task list, show filter summary
- Click "Clear Filters" → Reset all selections, reload full task list
- Click X on filter chip → Remove that specific filter, re-apply remaining

---

## 11. Reporting Requirements

### 11.1 Project Progress Summary Report

**Report ID**: RPT-001  
**Report Name**: Project Progress Summary  
**Purpose**: Provide high-level overview of project task completion status  
**Access**: All authenticated users

**Data Fields**:
- Total Tasks (count)
- Completed Tasks (count + percentage)
- In Progress Tasks (count + percentage)
- Blocked Tasks (count + percentage)
- To Do Tasks (count + percentage)
- Completion Rate (percentage)
- Generated At (timestamp)

**Filters**: None (shows all project tasks)

**Output Formats**:
- On-screen dashboard widget (default)
- JSON (for API consumers)
- CSV export (future)
- PDF export (future)

**Refresh**: Manual or auto-refresh every 60 seconds (configurable)

**BRD Traceability**: BR-F-013, BO-001, BO-004

---

### 11.2 User Workload Distribution Report

**Report ID**: RPT-002  
**Report Name**: User Workload Distribution  
**Purpose**: Show task distribution across team members to identify workload imbalances  
**Access**: Team Lead, Project Manager

**Data Fields** (per user):
- User Name
- Total Tasks Assigned (count)
- To Do (count)
- In Progress (count)
- Blocked (count)
- Completed (count)
- Workload Level (High if >10 tasks, Normal otherwise)

**Filters**: None

**Sorting**: By total tasks (descending by default)

**Output Formats**:
- On-screen table
- JSON (for API consumers)
- CSV export (future)

**Visualizations**: Bar chart showing tasks per user

**BRD Traceability**: BO-003

---

### 11.3 Overdue Tasks Report

**Report ID**: RPT-003  
**Report Name**: Overdue Tasks  
**Purpose**: Identify tasks past their estimated completion date  
**Access**: All authenticated users

**Data Fields** (per task):
- Task ID
- Task Title
- Assigned User
- Estimated Completion Date
- Days Overdue (calculated: today - due date)
- Current Status
- Priority

**Filters**: 
- Assigned User (optional)
- Priority (optional)

**Sorting**: By days overdue (most overdue first)

**Output Formats**:
- On-screen table
- JSON (for API consumers)
- CSV export (future)

**Criteria**: `EstimatedCompletionDate < TODAY AND Status != 'Completed'`

**BRD Traceability**: BO-001

---

### 11.4 Blocked Tasks Report

**Report ID**: RPT-004  
**Report Name**: Blocked Tasks  
**Purpose**: Show all tasks currently blocked by dependencies  
**Access**: All authenticated users

**Data Fields** (per task):
- Task ID
- Task Title
- Assigned User
- Blocked By (list of incomplete dependency tasks with IDs and titles)
- Days Blocked (calculated from when status changed to "Blocked")
- Priority

**Filters**:
- Assigned User (optional)
- Priority (optional)

**Sorting**: By days blocked (longest blocked first)

**Output Formats**:
- On-screen table
- JSON (for API consumers)

**Criteria**: `Status = 'Blocked'`

**BRD Traceability**: BR-F-007, BO-002

---

### 11.5 Priority Distribution Report

**Report ID**: RPT-005  
**Report Name**: Priority Distribution  
**Purpose**: Show breakdown of tasks by priority level  
**Access**: Team Lead, Project Manager

**Data Fields**:
- High Priority Tasks (count + percentage)
- Medium Priority Tasks (count + percentage)
- Low Priority Tasks (count + percentage)
- Total Tasks

**Filters**: 
- Status (optional - show distribution for specific status)

**Output Formats**:
- On-screen dashboard widget (pie or bar chart)
- JSON (for API consumers)

**BRD Traceability**: BO-004

---

## 12. Constraints & Assumptions

### 12.1 Functional Constraints

| Constraint ID | Constraint Description | Impact | Mitigation |
|---------------|------------------------|--------|------------|
| FC-001 | System supports English language only in MVP | Users in non-English speaking regions may have difficulty | Document internationalization architecture for future implementation |
| FC-002 | No mobile native applications (iOS/Android) | Users must access via web browser on mobile devices | Ensure responsive web design works on mobile browsers |
| FC-003 | Email notifications deferred to post-MVP | Users will not receive email alerts for task changes | Implement in-app notification bell icon as alternative |
| FC-004 | No real-time collaboration features (chat, comments) | Users must use external tools for task discussions | Provide task description field for notes; integrate with external tools in future |
| FC-005 | No file attachments to tasks | Users cannot attach documents or images to tasks | Reference external document management systems; implement in future release |
| FC-006 | Maximum 10 levels of dependency depth | Complex dependency chains deeper than 10 levels not supported | Encourage simpler task breakdown; system will reject deeper dependencies |
| FC-007 | Single project/workspace only in MVP | All users share same task pool; no multi-project support | Implement project/workspace concept in future release |
| FC-008 | No time tracking or effort logging | Cannot track actual hours worked on tasks | Defer to future release; focus on task completion tracking |
| FC-009 | Static user roles (no custom roles) | Four predefined roles only; cannot create custom permissions | Document extensible RBAC architecture for future |
| FC-010 | Pagination fixed at 20 items per page | Not configurable by user in MVP | Allow user preference in future release |

### 12.2 Assumptions

| Assumption ID | Assumption | Validation Approach | Risk if Invalid |
|---------------|------------|---------------------|-----------------|
| A-001 | Users have modern web browsers (Chrome, Firefox, Edge, Safari latest versions) | Document browser compatibility matrix; test on specified browsers | Users with older browsers may experience UI issues |
| A-002 | Users have stable internet connectivity | Document offline behavior (show error message) | Users may lose work if connection drops during save |
| A-003 | Team sizes are 5-50 members per project | Test with 50 concurrent users in load testing | Performance degradation with larger teams |
| A-004 | Average project has 50-500 tasks | Test with 5,000 tasks in performance testing | Filtering and reporting may slow down with more tasks |
| A-005 | Users understand basic task management concepts (status, priority, dependencies) | Provide minimal in-app help text; plan user training | Users may misuse system without training |
| A-006 | Task dependencies are mostly linear with few circular attempts | Implement robust circular dependency detection | System may slow down with complex dependency graphs |
| A-007 | Users will primarily use "My Tasks" view (filtered to assigned user) | Optimize database queries for assigned-user filter | If users view all tasks frequently, may need additional indexing |
| A-008 | English language is acceptable for all users | Survey user base | Some users may struggle; may need localization sooner |
| A-009 | Task status updates happen a few times per day, not continuously | Design for moderate update frequency | High-frequency updates may cause database contention |
| A-010 | Users accept manual refresh for reports (no real-time updates) | Include "Last Updated" timestamp on all reports | Users may make decisions on stale data |

### 12.3 Technical Constraints

| Constraint ID | Constraint Description | Source |
|---------------|------------------------|--------|
| TC-001 | System must be deployed on Azure platform | BRD requirement, TSD decision |
| TC-002 | API response time must be < 2 seconds for 95% of requests | BR-NF-005 |
| TC-003 | System must support 100 concurrent users | BR-NF-006 |
| TC-004 | System must support 10,000 active tasks | BR-NF-006 |
| TC-005 | Unit test coverage must be ≥ 80% for core business logic | BR-NF-002 |
| TC-006 | Database must enforce ACID transactions for data integrity | BR-NF-007 |
| TC-007 | All APIs must be RESTful and follow OpenAPI standards | BR-NF-003 |
| TC-008 | Authentication must use JWT tokens | TSD security architecture |
| TC-009 | All data in transit must use TLS 1.3 encryption | Security requirement R-010 |
| TC-010 | System must implement OWASP Top 10 mitigations | Security requirement R-010 |

---

## 13. Traceability Matrix

### 13.1 BRD to FRD Mapping

| BRD Requirement ID | FRD Use Case(s) | FRD User Story(ies) | FRD FR ID(s) |
|--------------------|-----------------|---------------------|--------------|
| BR-F-001 | UC-001 | US-003 | FR-011, FR-012, FR-013 |
| BR-F-002 | UC-001 | US-003 | FR-016 |
| BR-F-003 | UC-001, UC-004 | US-003, US-005 | FR-017, FR-025, FR-026, FR-027 |
| BR-F-004 | UC-001, UC-002 | US-003, US-007, US-008 | FR-032, FR-033, FR-036 |
| BR-F-005 | UC-002 | US-007 | FR-033, FR-035 |
| BR-F-006 | UC-003 | US-009, US-010 | FR-038 to FR-046 |
| BR-F-007 | UC-003, UC-004 | US-009 | FR-042, FR-043, FR-044, FR-047 |
| BR-F-008 | UC-004 | US-004, US-005 | FR-027, FR-028, FR-029, FR-030 |
| BR-F-009 | UC-005 | US-011 | FR-048, FR-052 to FR-057 |
| BR-F-010 | UC-005 | US-012 | FR-049, FR-052 to FR-057 |
| BR-F-011 | UC-005 | US-013 | FR-050, FR-052 to FR-057 |
| BR-F-012 | UC-005 | US-014 | FR-051, FR-052 to FR-057 |
| BR-F-013 | UC-006 | US-016 | FR-058 to FR-062, FR-068, FR-069 |
| BR-F-014 | UC-001, UC-005 | US-004, US-006 | FR-019 to FR-022 |
| BR-F-015 | - | US-001, US-002 | FR-001 to FR-010 |

### 13.2 Requirements to Test Cases

Each User Story maps to specific test scenarios:
- **Unit Tests**: Validate business logic (dependency detection, status transitions, validation rules)
- **Integration Tests**: Validate API endpoints, database operations, end-to-end workflows
- **UI Tests**: Validate user interface behavior, form validation, navigation
- **Acceptance Tests**: Validate Given/When/Then criteria from user stories

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Lead Business Analyst | | | |
| QA Lead | | | |
| Engineering Manager | | | |

---

## Appendix A: Acronyms & Definitions

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface |
| **BRD** | Business Requirements Document |
| **CRUD** | Create, Read, Update, Delete |
| **FRD** | Functional Requirements Document |
| **JWT** | JSON Web Token |
| **MVP** | Minimum Viable Product |
| **RBAC** | Role-Based Access Control |
| **REST** | Representational State Transfer |
| **TSD** | Technical Specification Document |
| **UC** | Use Case |
| **US** | User Story |

---

**Next Steps:**
1. Review and approve this FRD with stakeholders
2. QA team creates detailed test plan based on acceptance criteria
3. Development team begins sprint planning and implementation
4. UI/UX team creates wireframes and prototypes based on UI/UX requirements
