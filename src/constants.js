export const SAMPLE_ENDPOINTS = `POST /api/users/register
Description: Register a new user account
Headers:
  Content-Type: application/json
Body:
  name: string (required) - Full name of the user
  email: string (required) - Valid email address
  password: string (required) - Min 8 characters
  role: string (optional) - "admin" | "user" | "viewer", defaults to "user"
Responses:
  201: User created successfully
    { id: string, name: string, email: string, createdAt: ISO8601 }
  400: Validation error
    { error: string, fields: string[] }
  409: Email already exists
    { error: "EMAIL_TAKEN" }

---

GET /api/users/:id
Description: Retrieve a user by ID
Headers:
  Authorization: Bearer <token>
Params:
  id: string (required) - UUID of the user
Responses:
  200: User found
    { id: string, name: string, email: string, role: string, createdAt: ISO8601 }
  401: Unauthorized
    { error: "UNAUTHORIZED" }
  404: User not found
    { error: "NOT_FOUND" }

---

PUT /api/users/:id
Description: Update an existing user
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Params:
  id: string (required) - UUID of the user
Body:
  name: string (optional) - New full name
  email: string (optional) - New email address
Responses:
  200: Updated successfully
    { id: string, name: string, email: string, updatedAt: ISO8601 }
  400: Validation error
  401: Unauthorized
  404: User not found

---

DELETE /api/users/:id
Description: Delete a user account
Headers:
  Authorization: Bearer <token>
Params:
  id: string (required) - UUID of the user
Responses:
  204: Deleted successfully
  401: Unauthorized
  404: User not found`;
