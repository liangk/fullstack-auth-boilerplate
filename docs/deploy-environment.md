# Environment Variables (Production)

Guidance for configuring production environment variables for StackInsight Auth Lite.

## Backend (.env)

Required variables for the backend service:

```env
# Core
NODE_ENV=production
PORT=4005
FRONTEND_URL=https://your-frontend-domain

# Database (enable SSL if your provider requires it)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=REPLACE_WITH_SECURE_RANDOM_64
JWT_REFRESH_SECRET=REPLACE_WITH_SECURE_RANDOM_64
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

# Email (example: Resend, Sendgrid, SES)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=apikey_or_username
SMTP_PASSWORD=your_password
SMTP_FROM=noreply@stackinsight.app

# CORS
CORS_ORIGINS=["https://your-frontend-domain"]

# Optional
LOG_LEVEL=info
```

## Frontend

Set the API URL in `frontend/src/environments/environment.ts`:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain/api'
};
```

For Angular dev builds, set `environment.development.ts` accordingly.

## Railway Deploy Notes

- Backend service
  - Set all variables above in Railway project → Variables
  - Expose port `4005`
  - Ensure `FRONTEND_URL` matches your frontend domain
- Frontend service
  - Built as static site served by nginx
  - No backend proxy in nginx
  - API calls point to `environment.apiUrl`

## Generating Secrets

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Verifying Configuration

- Open `/api/health` on backend
- Perform register → verify email → login on frontend
- Check cookies are `HttpOnly` and `Secure` in browser devtools
