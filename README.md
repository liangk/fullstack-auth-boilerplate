# Fullstack Auth Boilerplate

[![Backend CI](https://github.com/liangk/fullstack-auth-boilerplate/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/liangk/fullstack-auth-boilerplate/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/liangk/fullstack-auth-boilerplate/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/liangk/fullstack-auth-boilerplate/actions/workflows/frontend-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready, secure, and feature-rich authentication boilerplate for modern fullstack applications. Built with **Angular**, **Express.js**, **PostgreSQL**, and **Prisma**, this starter kit provides a rock-solid foundation for your next project, with a strong emphasis on security and developer experience.

This project implements authentication the right way: using **JWTs stored in secure, HTTP-only cookies** with refresh token rotation.

---

## Features

- **Secure JWT Authentication**: Access/refresh tokens stored in `HttpOnly` cookies.
- **Refresh Token Rotation**: Automatically rotates refresh tokens to prevent replay attacks.
- **Email Verification**: New user accounts must be verified via a secure email link.
- **Password Reset Flow**: Secure, token-based password reset that invalidates old sessions.
- **Dockerized Development**: One-command setup with Docker Compose for all services (Postgres, MailDev, Backend, Frontend).
- **CI/CD Ready**: GitHub Actions workflows for automated linting, testing, and building.
- **Security Hardening**: Includes Helmet, CORS, rate limiting, and input validation.
- **Modern UI**: Clean and responsive UI built with Angular and Angular Material.
- **Hot Reloading**: Instant feedback during development for both frontend and backend.

## Tech Stack

| Area     | Technology                                                                                                  |
| :------- | :---------------------------------------------------------------------------------------------------------- |
| **Backend**  | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/), [JWT](https://jwt.io/), [TypeScript](https://www.typescriptlang.org/) |
| **Frontend** | [Angular](https://angular.io/), [Angular Material](https://material.angular.io/), [RxJS](https://rxjs.dev/), [SCSS](https://sass-lang.com/), [TypeScript](https://www.typescriptlang.org/)      |
| **DevOps**   | [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/), [GitHub Actions](https://github.com/features/actions)                               |

## Getting Started

This project is designed to be run with Docker, which is the recommended and quickest way to get started.

### Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) installed and running.
- A shell environment (like Bash, Zsh, or PowerShell).

### 1. Clone the Repository

```bash
git clone https://github.com/liangk/fullstack-auth-boilerplate.git
cd fullstack-auth-boilerplate
```

### 2. Start the Application

Use the provided helper script to start all services:

```bash
./docker-dev.sh start
```

This single command will:
1.  Build the Docker images for the frontend and backend.
2.  Start the PostgreSQL database and a MailDev email testing server.
3.  Run database migrations to set up the schema.
4.  Start the backend and frontend servers with hot-reloading enabled.

### 3. Access the Services

Your full development environment is now running and accessible:

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: `http://localhost:4000`
- **MailDev (Email Viewer)**: [http://localhost:1080](http://localhost:1080)
- **PostgreSQL Database**: `localhost:5432`

### 4. Verify the Setup

- **Register a new user** through the frontend.
- **Check MailDev**: Open [http://localhost:1080](http://localhost:1080) to see the verification email. Click the link to verify your account.
- **Log in**: You should now be able to log in successfully.
- **Check Cookies**: Use your browser's developer tools to confirm that `access_token` and `refresh_token` cookies are set as `HttpOnly`.

<details>
<summary><h3>Docker Helper Script Commands</h3></summary>

The `docker-dev.sh` script provides a convenient interface for managing your development environment. Here are the available commands:

| Command                  | Description                                                              |
| :----------------------- | :----------------------------------------------------------------------- |
| `./docker-dev.sh start`    | Starts all services in the foreground.                                   |
| `./docker-dev.sh start-bg` | Starts all services in the background (detached mode).                   |
| `./docker-dev.sh stop`     | Stops all running services.                                              |
| `./docker-dev.sh restart`  | Restarts all services.                                                   |
| `./docker-dev.sh logs`     | Tails the logs from all running services.                                |
| `./docker-dev.sh migrate`  | Runs Prisma database migrations inside the backend container.            |
| `./docker-dev.sh seed`     | Seeds the database with sample data.                                     |
| `./docker-dev.sh studio`   | Opens Prisma Studio to view and manage your database.                    |
| `./docker-dev.sh shell`    | Opens a shell inside the running backend container for debugging.        |
| `./docker-dev.sh db-shell` | Opens a `psql` shell to the PostgreSQL database.                         |
| `./docker-dev.sh clean`    | **(Destructive)** Stops and removes all containers, volumes, and networks. |

</details>

<details>
<summary><h3>Manual Local Setup (Without Docker)</h3></summary>

If you prefer not to use Docker, you can run the services locally. You will need:
- Node.js (v18 or later)
- A running PostgreSQL instance

1.  **Set up PostgreSQL**: Ensure you have a PostgreSQL database running and create a new database (e.g., `auth_boilerplate`).

2.  **Set up MailDev**: For local email testing, run `npx maildev` in a separate terminal.

3.  **Configure Backend**:
    - Navigate to the `backend` directory.
    - Run `npm install`.
    - Copy `.env.example` to `.env` and fill in the required values (see the Environment Variables section below).
    - Run `npm run prisma:migrate` to set up the database schema.
    - Run `npm run dev` to start the backend server.

4.  **Configure Frontend**:
    - Navigate to the `frontend` directory.
    - Run `npm install`.
    - Run `npm start` to start the frontend server.

</details>

<details>
<summary><h3>Environment Variables</h3></summary>

The backend requires the following environment variables, which should be defined in a `.env` file in the `backend` directory. You can copy the `.env.example` file to get started.

| Variable                      | Description                                                                                                 | Default / Example                                    |
| :---------------------------- | :---------------------------------------------------------------------------------------------------------- | :--------------------------------------------------- |
| `PORT`                        | The port on which the backend server will run.                                                              | `4000`                                               |
| `NODE_ENV`                    | The application environment. Set to `production` in production.                                             | `development`                                        |
| `CORS_ORIGIN`                 | The URL of the frontend application for CORS policy.                                                        | `http://localhost:3000`                              |
| `DATABASE_URL`                | The connection string for your PostgreSQL database.                                                         | `postgresql://USER:PASS@HOST:PORT/DB`                |
| `JWT_ACCESS_SECRET`           | **(Required)** A strong, random secret for signing access tokens.                                           | `replace_me_with_a_strong_access_secret`             |
| `JWT_ACCESS_EXPIRES`          | The expiration time for access tokens.                                                                      | `15m`                                                |
| `JWT_REFRESH_SECRET`          | **(Required)** A strong, random secret for signing refresh tokens.                                          | `replace_me_with_a_strong_refresh_secret`            |
| `JWT_REFRESH_EXPIRES`         | The expiration time for refresh tokens.                                                                     | `7d`                                                 |
| `JWT_EMAIL_SECRET`            | **(Required)** A strong, random secret for signing email verification tokens.                               | `replace_me_with_a_strong_email_secret`              |
| `JWT_EMAIL_EXPIRES`           | The expiration time for email verification tokens.                                                          | `24h`                                                |
| `JWT_PASSWORD_RESET_SECRET`   | **(Required)** A strong, random secret for signing password reset tokens.                                   | `replace_me_with_a_strong_password_reset_secret`     |
| `JWT_PASSWORD_RESET_EXPIRES`  | The expiration time for password reset tokens.                                                              | `1h`                                                 |
| `SKIP_EMAIL_VERIFICATION`     | If `true`, new users will not need to verify their email to log in. **Should be `false` in production.**      | `false`                                              |
| `RATE_LIMIT_WINDOW_MINUTES`   | The time window in minutes for the general API rate limiter.                                                | `15`                                                 |
| `RATE_LIMIT_MAX`              | The maximum number of requests allowed per IP in the general rate limit window.                             | `100`                                                |
| `AUTH_RATE_LIMIT_WINDOW_MINUTES` | The time window in minutes for the authentication-specific rate limiter.                                    | `1`                                                  |
| `AUTH_RATE_LIMIT_MAX`         | The maximum number of requests allowed per IP in the auth rate limit window.                                | `5`                                                  |
| `SMTP_HOST`                   | The host of your SMTP server for sending emails. (Leave empty for local MailDev)                            | `smtp.example.com`                                   |
| `SMTP_PORT`                   | The port of your SMTP server.                                                                               | `587`                                                |
| `SMTP_USER`                   | The username for your SMTP server.                                                                          | `your_email@example.com`                             |
| `SMTP_PASS`                   | The password for your SMTP server.                                                                          | `your_app_password`                                  |

</details>

<details>
<summary><h3>Project Structure</h3></summary>

```
backend/
  prisma/          # Prisma schema, migrations, and seed scripts
  src/
    controllers/   # Express route handlers
    middleware/    # Express middleware (auth, validation, etc.)
    routes/        # API route definitions
    services/      # Business logic (user creation, etc.)
    utils/         # Helper functions and constants
    index.ts       # Main application entry point
  package.json

frontend/
  src/
    app/
      components/  # Reusable UI components
      guards/      # Angular route guards (e.g., AuthGuard)
      interceptors/ # HTTP interceptors (e.g., for adding auth tokens)
      pages/       # Page-level components
      services/    # Angular services (e.g., AuthService)
      routes.ts    # Application routes
    environments/  # Environment-specific configuration
    index.html
  package.json
```

</details>

## CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration. Workflows are defined in the `.github/workflows` directory and run automatically on pushes and pull requests to the `main` and `develop` branches.

- **Backend CI**: Lints, formats, tests, and validates the backend code, uploading coverage reports to Codecov.
- **Frontend CI**: Lints and builds the frontend application to ensure it remains in a deployable state.

<details>
<summary><h3>API Endpoints</h3></summary>

| Method | Endpoint                      | Description                                   |
| :----- | :---------------------------- | :-------------------------------------------- |
| `POST` | `/api/auth/register`          | Register a new user.                          |
| `POST` | `/api/auth/login`             | Authenticate a user and receive tokens.       |
| `POST` | `/api/auth/logout`            | Invalidate the user's session.                |
| `POST` | `/api/auth/refresh`           | Obtain a new access token using a refresh token.|
| `GET`  | `/api/auth/profile`           | Get the current authenticated user's profile. |
| `GET`  | `/api/auth/verify-email`      | Verify a user's email address with a token.   |
| `POST` | `/api/auth/resend-verification` | Resend the email verification link.           |
| `POST` | `/api/auth/forgot-password`   | Request a password reset email.               |
| `POST` | `/api/auth/reset-password`    | Set a new password using a reset token.       |
| `GET`  | `/api/health`                 | Health check endpoint.                        |

</details>

<details>
<summary><h3>Security Overview</h3></summary>

This boilerplate is built with a security-first mindset.

- **Secure Cookies**: JWTs are stored in `HttpOnly`, `Secure` (in production), and `SameSite` cookies.
- **Password Hashing**: Passwords are hashed using `bcrypt`.
- **API Protection**: Includes rate limiting, Helmet for security headers, and strict CORS policies.
- **Input Validation**: All API inputs are validated to prevent injection attacks.
- **Session Invalidation**: Password resets automatically invalidate all other active sessions.

</details>

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.