# Employee Directory --- Development Document

## 1. Project Overview

The Employee Directory is a basic full-stack application for managing
employee records. Each record contains a name, email address, and job
role.

The project was built to meet the supplied Full Stack Developer
assignment. The implementation uses a React and TypeScript frontend, an
Express REST API, and a PostgreSQL database hosted by Supabase.

## 2. Scope and Requirements

The assignment requested:

-   A React + TypeScript frontend.
-   A form to add an employee using name, email, and role.
-   A table or list to display employees.
-   Edit and delete actions.
-   Axios for frontend-to-backend communication.
-   Basic styling.
-   A REST API with GET, POST, PUT, and DELETE operations.
-   PostgreSQL or MySQL storage with `id`, `name`, `email`, `role`, and
    `created_at` fields.
-   CORS support.
-   Optional search, pagination, and improved UI.
-   A public GitHub repository and instructions for opening the project.

## 3. Features Implemented

### Employee management

-   **Create:** Add an employee with a name, email, and role.
-   **Read:** Fetch and display employee records in a table.
-   **Update:** Edit an existing employee's details.
-   **Delete:** Delete an employee after confirming the action.

### Search

The frontend filters the fetched employee list by name, email, or role.
The search is case-insensitive.

### Pagination

Client-side pagination displays five employees per page. The page resets
when the search query changes. The current page is corrected if deleting
records reduces the number of available pages.

### Form and modal behaviour

-   The same employee form is used for both adding and editing.
-   API validation errors, including duplicate-email errors, are
    displayed inside the form modal.
-   The modal can be closed with Cancel or by clicking the overlay
    outside the modal.
-   Clicking inside the modal does not close it.
-   Failed submissions keep the form open so the user can correct the
    input.

### Validation and error handling

-   Zod validates employee input on the backend.
-   Name and role must contain at least two characters.
-   Email must be a valid email address.
-   Field lengths are limited to match the database schema.
-   Duplicate email addresses are rejected by the database unique
    constraint and returned as a conflict response.
-   Invalid IDs and missing employee records are handled by the API.

## 4. Technology and Architecture

### Frontend

-   React with TypeScript
-   Vite
-   Tailwind CSS
-   Axios
-   Lucide React icons

### Backend

-   Node.js with Express
-   TypeScript
-   `pg` for PostgreSQL connections
-   Zod for request validation
-   CORS and dotenv

### Database

Supabase PostgreSQL is used as the managed PostgreSQL database. The
Express server connects to PostgreSQL using the `pg` package and a
connection string stored in the server environment.

### Request flow

``` text
React UI
   |
   | Axios HTTP request
   v
Express REST API
   |
   | Validate request (Zod)
   v
PostgreSQL query (pg)
   |
   v
Supabase PostgreSQL
```

The frontend does not connect directly to the database. Database access
is performed by the backend.

## 5. Database Schema

The `employees` table uses the following schema:

``` sql
CREATE TABLE employees (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

  Column         Purpose
  -------------- ----------------------------
  `id`           Auto-generated primary key
  `name`         Employee name
  `email`        Employee email; unique
  `role`         Employee job role
  `created_at`   Record creation timestamp

## 6. API Endpoints

The employee router is mounted at `/api/employees`.

  Method   Endpoint               Purpose
  -------- ---------------------- ----------------------
  GET      `/api/employees`       Return all employees
  POST     `/api/employees`       Create an employee
  PUT      `/api/employees/:id`   Update an employee
  DELETE   `/api/employees/:id`   Delete an employee
  GET      `/api/health`          API health check

The assignment describes the employee routes without an `/api` prefix.
This implementation adds the conventional `/api` prefix, so the actual
request paths include it.

## 7. Development Findings and Issues Faced

This section records the issues encountered during development and the
fixes applied.

### Issue 1 --- Database password authentication failure

**Observed:** PostgreSQL returned authentication error code `28P01`.

**Cause investigated:** The database connection string credentials were
incorrect or not encoded correctly.

**Resolution:** The Supabase connection details and username/password in
the connection string were checked and corrected. The connection then
worked.

### Issue 2 --- `Cannot POST /api/employees`

**Observed:** Sending a POST request returned an Express HTML error page
containing `Cannot POST /api/employees`.

**Cause:** The employee router was not correctly registered with the
Express application, or the route configuration did not match the
requested path.

**Resolution:** The employee router import and mount were checked in
`app.ts`, and the POST route was registered at `/` inside the employee
router. The server was restarted and the endpoint worked.

### Issue 3 --- Duplicate email error appeared behind the modal

**Observed:** When an employee was submitted with an email address that
already existed, the error message appeared on the page behind the open
form modal.

**Cause:** The error message was rendered globally in `App.tsx`, outside
the modal.

**Resolution:** The global error display was restricted to when the form
modal is closed. When the modal is open, the error is rendered inside
it, above the form fields. The modal remains open so the user can
correct the email address.

### Issue 4 --- Redundant form submission loading state

**Observed:** Loading state was maintained in both `App.tsx` and
`EmployeeForm.tsx`.

**Finding:** The form component owns the form submission interaction and
can manage its own loading state. A separate parent `saving` state was
unnecessary.

**Resolution:** The redundant `saving` state was removed from `App.tsx`.
`EmployeeForm.tsx` manages its local loading state, while the parent
handles the API operation and error message. Failed submissions are
re-thrown so the form can handle the failure and stop its loading
indicator.

### Issue 5 --- Modal dismissal behaviour

**Requirement identified during UI testing:** The employee form should
close when the user clicks outside the modal.

**Resolution:** A click handler was added to the overlay, and click
propagation is stopped on the modal panel. This means clicking the
overlay closes the modal, while clicking inside the form does not.

## 8. Testing and Verification

The application was tested through both Postman and the React frontend. All required CRUD operations and the implemented features were verified successfully.

### Backend Testing (Postman)

- GET: Successfully retrieved employee records.
- POST: Successfully created employee records.
- PUT: Successfully updated existing employee records.
- DELETE: Successfully deleted employee records.
- Input validation and duplicate email handling were tested.
- Appropriate responses were verified for invalid input and missing records.

### Frontend Testing (Browser)

- Successfully added, viewed, edited, and deleted employees.
- Verified that changes persist after refreshing the application.
- Search works across employee names, email addresses, and roles.
- Pagination works correctly.
- Form validation and duplicate email errors display inside the modal.
- Modal closes using the Cancel button or by clicking outside it.
- Confirmed that both frontend and backend communicate successfully.

**Verification Result:** All implemented core features and API operations were tested successfully using Postman and the application interface.

## 9. Current Limitations and Possible Improvements

-   Pagination is client-side. For a much larger directory, server-side
    pagination would reduce the amount of data transferred.
-   The application does not include user authentication or role-based
    access control.
-   Search is performed against the employee data already fetched by the
    frontend.
-   Automated unit and integration tests have not been documented as
    implemented.
-   Deployment is not documented as completed.

These are outside the essential CRUD scope of the supplied assignment,
but could be considered in a future iteration.

## 10. Submission Notes

The assignment asks for a public GitHub repository and instructions for
viewing the project.

Before sharing the repository:

1.  Confirm both frontend and backend start using the README
    instructions.
2.  Ensure `.env` files are excluded from Git.
3.  Include `.env.example` files with placeholder values.
4.  Verify the repository contains the source code and this
    documentation.
5.  Add deployment URLs only if the application has actually been
    deployed and tested.
