# Authentication Service (Node.js + Express + TypeScript + PostgreSQL)

A secure, robust authentication service backend with REST APIs for user registration and login. Built with TypeScript, Express, PostgreSQL, JSON Web Tokens (JWT), and Bcrypt.

## Features

- **Automated Database Setup**: Upon starting up, the service automatically checks if the target database (`auth_db`) and schema (the `users` table) exist. If they do not, it creates them on-the-fly.
- **Robust Input Validation**: Strict client-side parameter validation for registration and login payloads, returning clean, contextual error messages.
- **Secure Hashing**: Password hashing using `bcryptjs` before database persistence.
- **JWT Authorization**: Signed JSON Web Tokens (JWT) for secure authentication.
- **Access Protection**: Injected `authMiddleware` to guard private/sensitive routes (like `GET /api/auth/me`).
- **Graceful Shutdown**: Hooks on SIGINT/SIGTERM to close active database connections and stop the server cleanly.

---

## Getting Started

### 1. Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** running locally or remotely

### 2. Installation

From the project root directory (`C:\Users\230225940\Projects\web-apps\auth-service`), run:

```bash
npm install
```

### 3. Environment Settings

Create a `.env` file in the root directory (based on `.env.example`):

```ini
PORT=3001
NODE_ENV=development

# Database configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_me_in_production
JWT_EXPIRES_IN=24h
```

---

## Running the Application

### Development Mode

Runs the server using `ts-node-dev` with live reload on changes:

```bash
npm run dev
```

### Production Build & Run

To compile TypeScript into JavaScript and run:

```bash
npm run build
npm start
```

---

## API Documentation

### 1. Health Check
Checks if the server is up and responsive.

* **URL**: `/health`
* **Method**: `GET`
* **Response**: `200 OK`
  ```json
  {
    "status": "success",
    "message": "Authentication service is healthy",
    "timestamp": "2026-07-15T12:00:00.000Z"
  }
  ```

### 2. User Registration
Creates a new user account.

* **URL**: `/api/auth/register`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Body Request**:
  ```json
  {
    "username": "alice123",
    "email": "alice@example.com",
    "password": "securepassword"
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "status": "success",
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": 1,
        "username": "alice123",
        "email": "alice@example.com",
        "created_at": "2026-07-15T12:00:00.000Z"
      }
    }
  }
  ```
* **Error Response (`400 Bad Request` - Validation Failed)**:
  ```json
  {
    "status": "error",
    "message": "Validation failed",
    "errors": {
      "username": "Username must be between 3 and 50 characters.",
      "password": "Password must be at least 6 characters long."
    }
  }
  ```
* **Error Response (`409 Conflict` - Email/Username Exists)**:
  ```json
  {
    "status": "error",
    "message": "Conflict",
    "errors": {
      "email": "Email is already registered."
    }
  }
  ```

### 3. User Login
Authenticates a user and returns a JSON Web Token.

* **URL**: `/api/auth/login`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Body Request**:
  ```json
  {
    "email": "alice@example.com",
    "password": "securepassword"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGljZTEyMyIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDQxNDQwMDAsImV4cCI6MTcwNDIzMDQwMH0...",
      "user": {
        "id": 1,
        "username": "alice123",
        "email": "alice@example.com",
        "created_at": "2026-07-15T12:00:00.000Z"
      }
    }
  }
  ```
* **Error Response (`401 Unauthorized` - Incorrect Credentials)**:
  ```json
  {
    "status": "error",
    "message": "Invalid credentials"
  }
  ```

### 4. Fetch Current User Details
Retrieves details of the logged-in user from the JWT payload.

* **URL**: `/api/auth/me`
* **Method**: `GET`
* **Headers**: 
  - `Authorization: Bearer <your_jwt_token>`
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": {
      "user": {
        "id": 1,
        "username": "alice123",
        "email": "alice@example.com"
      }
    }
  }
  ```
* **Error Response (`401 Unauthorized` - Invalid/Missing Token)**:
  ```json
  {
    "status": "error",
    "message": "Access denied. No authorization token provided."
  }
  ```
