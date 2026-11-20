# Employee Directory

A simple full-stack Employee Directory application for managing employee
records. Users can add, view, edit, delete, and search employees through
a React interface backed by a REST API and PostgreSQL database.

## Features

-   Create employee records with name, email, and role.
-   View employees in a responsive table.
-   Edit existing employee records.
-   Delete employees with a confirmation dialog.
-   Search by employee name, email, or role.
-   Client-side pagination (5 employees per page).
-   Form validation and duplicate-email error handling.
-   Data persistence with PostgreSQL through Supabase.
-   Modal closes through Cancel or by clicking outside it.

## Tech Stack

**Frontend** - React - TypeScript - Vite - Tailwind CSS - Axios - Lucide
React

**Backend** - Node.js - Express - TypeScript - PostgreSQL (`pg`) - Zod -
CORS

**Database** - Supabase PostgreSQL

## Project Structure

``` text
employee-directory/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteDialog.tsx
│   │   │   ├── EmployeeForm.tsx
│   │   │   └── EmployeeTable.tsx
│   │   ├── services/
│   │   │   └── employeeService.ts
│   │   ├── types/
│   │   │   └── employee.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   └── employeeController.ts
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   └── employeeRoutes.ts
│   │   ├── types/
│   │   │   └── employee.ts
│   │   ├── validators/
│   │   │   └── employeeValidator.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   └── package.json
├── DOCUMENT.md
└── README.md
```

## Prerequisites

-   Node.js and npm
-   A Supabase project with a PostgreSQL database
-   Git (for cloning the repository)

## Database Setup

In the Supabase SQL Editor, create the `employees` table:

``` sql
CREATE TABLE employees (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

The `email` column is unique, so the database prevents duplicate
employee email addresses.

## Environment Variables

Create `server/.env`:

``` env
PORT=5000
DATABASE_URL=your_supabase_postgresql_connection_string
```

Create `client/.env`:

``` env
VITE_API_URL=http://localhost:5000/api
```

Do not commit either `.env` file. Keep real database credentials
private. The server should include a `.env.example` with placeholder
values for setup reference.

## Installation and Run

Open two terminal windows from the project root.

### 1. Start the backend

``` bash
cd server
npm install
npm run dev
```

The API runs at:

``` text
http://localhost:5000
```

Health check:

``` text
GET http://localhost:5000/api/health
```

### 2. Start the frontend

In a second terminal:

``` bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually:

``` text
http://localhost:5173
```

Keep both development servers running while using the application.

## API Endpoints

The backend mounts employee routes under `/api/employees`.

  Method   Endpoint               Description
  -------- ---------------------- ---------------------
  GET      `/api/employees`       Fetch all employees
  POST     `/api/employees`       Create an employee
  PUT      `/api/employees/:id`   Update an employee
  DELETE   `/api/employees/:id`   Delete an employee
  GET      `/api/health`          Check API status

### Example request body

``` json
{
  "name": "Ahmed Khan",
  "email": "ahmed@example.com",
  "role": "Software Engineer"
}
```

The create and update endpoints validate the request data. Duplicate
email addresses return HTTP `409 Conflict`; invalid input returns HTTP
`400 Bad Request`; missing employee records return HTTP `404 Not Found`.

## Notes

-   Search and pagination are handled in the browser after all employee
    records are fetched.
-   Pagination displays five employees per page.
-   This project does not include authentication, authorization,
    payroll, attendance, or leave management; it is a basic employee
    directory.
-   The assignment's endpoint paths are implemented with the `/api`
    prefix. Use the exact paths listed above when testing.

## Troubleshooting

See [DOCUMENT.md](DOCUMENT.md) for implementation findings, issues
encountered during development, and their resolutions.
