# FAQ

Frequently asked questions about StackInsight Auth Lite.

## General

### What is StackInsight Auth Lite?
A production-ready authentication starter using Angular + Express + PostgreSQL with secure, cookie-based auth.

### Who is it for?
Teams who want a secure, pragmatic auth system without vendor lock-in.

## Authentication

### Where are tokens stored?
In `HttpOnly` cookies to protect against XSS.

### Can I use localStorage tokens?
Not recommended. Cookies with `SameSite` and `Secure` flags are safer.

### Does it support refresh tokens?
Yes. Access tokens are short-lived; refresh tokens rotate on use.

## Email

### Which email providers are supported?
Any SMTP provider (Resend, Sendgrid, SES, Mailgun). Configure via environment variables.

### Why didn't I receive a verification email?
- Check spam folder
- Verify SMTP settings
- In development, use MailDev at `http://localhost:1080`

## Deployment

### Can I deploy frontend and backend separately?
Yes. Set `environment.apiUrl` on frontend and proper CORS on backend.

### Does it work on Railway/Render?
Yes. See `docs/deploy-environment.md` for variables and tips.

## Security

### Is CSRF a concern with cookies?
With `SameSite=strict` and same-origin requests, risk is reduced. For cross-site scenarios, implement CSRF tokens.

### Are passwords stored securely?
Yes, using bcrypt hashing. Passwords are never stored in plain text.

## Frontend

### How do I protect a route?
Use `authGuard` in `app.routes.ts`.

### How do I show the current user?
Subscribe to `AuthService.currentUser$`.

## Backend

### How do I add a new field to user?
Update Prisma schema, run migration, extend DTOs and controllers.

### How do I add roles?
Start with a `role` enum on `User` and add middleware checks. See `docs/rbac.md`.

## Troubleshooting

### Login works locally but not in production
- Ensure HTTPS
- Use correct domain for cookies
- CORS `credentials: true` and allowed origin

### 401 after refresh
Refresh token may be invalid/expired. Clear cookies and login again.

## Contributing

See `docs/contributing.md`.
