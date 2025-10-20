# Environment Configuration

Complete guide to configuring environment variables for the StackInsight Auth Lite.

## Overview

The application uses environment variables for configuration, allowing different settings for development, testing, and production environments.

## Backend Environment Variables

### Location

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

### Required Variables

#### Server Configuration

**`PORT`**
- **Description**: Port number for the backend server
- **Default**: `4005`
- **Example**: `PORT=4005`
- **Note**: Must match frontend proxy configuration

**`NODE_ENV`**
- **Description**: Application environment
- **Values**: `development` | `production` | `test`
- **Default**: `development`
- **Example**: `NODE_ENV=production`

#### CORS Configuration

**`CORS_ORIGIN`**
- **Description**: Allowed frontend origins (comma-separated)
- **Format**: Complete URLs with protocol
- **Development**: `http://localhost:4205`
- **Production**: `https://your-app.vercel.app`
- **Multiple**: `https://app1.com,https://app2.com`
- **Example**: 
  ```
  CORS_ORIGIN=http://localhost:4205
  ```

#### Database Configuration

**`DATABASE_URL`**
- **Description**: PostgreSQL connection string
- **Format**: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`
- **Development**: `postgresql://postgres:password@localhost:5432/auth_boilerplate?schema=public`
- **Production**: Your database provider's connection string
- **Example**: 
  ```
  DATABASE_URL=postgresql://postgres:password@localhost:5432/auth_boilerplate?schema=public
  ```

**Security Note**: Never commit actual database credentials to version control.

#### JWT Secrets

**`JWT_ACCESS_SECRET`**
- **Description**: Secret key for signing access tokens
- **Required**: Yes
- **Format**: Strong random string (32+ characters)
- **Generate**: 
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Example**: `JWT_ACCESS_SECRET=your_strong_random_secret_here_32_chars_minimum`

**`JWT_ACCESS_EXPIRES`**
- **Description**: Access token expiration time
- **Default**: `15m`
- **Format**: Zeit/ms format (`15m`, `1h`, `1d`)
- **Recommended**: `15m` (15 minutes)
- **Example**: `JWT_ACCESS_EXPIRES=15m`

**`JWT_REFRESH_SECRET`**
- **Description**: Secret key for signing refresh tokens
- **Required**: Yes
- **Format**: Strong random string (32+ characters, different from access secret)
- **Example**: `JWT_REFRESH_SECRET=different_strong_random_secret_here`

**`JWT_REFRESH_EXPIRES`**
- **Description**: Refresh token expiration time
- **Default**: `7d`
- **Format**: Zeit/ms format
- **Recommended**: `7d` (7 days)
- **Example**: `JWT_REFRESH_EXPIRES=7d`

**`JWT_EMAIL_SECRET`**
- **Description**: Secret key for email verification tokens
- **Required**: Yes
- **Format**: Strong random string
- **Example**: `JWT_EMAIL_SECRET=email_verification_secret_here`

**`JWT_EMAIL_EXPIRES`**
- **Description**: Email verification token expiration
- **Default**: `24h`
- **Format**: Zeit/ms format
- **Recommended**: `24h` (24 hours)
- **Example**: `JWT_EMAIL_EXPIRES=24h`

**`JWT_PASSWORD_RESET_SECRET`**
- **Description**: Secret key for password reset tokens
- **Required**: Yes
- **Format**: Strong random string
- **Example**: `JWT_PASSWORD_RESET_SECRET=password_reset_secret_here`

**`JWT_PASSWORD_RESET_EXPIRES`**
- **Description**: Password reset token expiration
- **Default**: `1h`
- **Format**: Zeit/ms format
- **Recommended**: `1h` (1 hour)
- **Example**: `JWT_PASSWORD_RESET_EXPIRES=1h`

#### Cookie Names (Optional)

**`ACCESS_TOKEN_COOKIE`**
- **Description**: Name of access token cookie
- **Default**: `access_token`
- **Example**: `ACCESS_TOKEN_COOKIE=access_token`

**`REFRESH_TOKEN_COOKIE`**
- **Description**: Name of refresh token cookie
- **Default**: `refresh_token`
- **Example**: `REFRESH_TOKEN_COOKIE=refresh_token`

#### Email Configuration

**`SKIP_EMAIL_VERIFICATION`**
- **Description**: Skip email verification requirement
- **Values**: `true` | `false`
- **Development**: `true` (for faster testing)
- **Production**: `false` (always require verification)
- **Example**: `SKIP_EMAIL_VERIFICATION=false`

**`SMTP_HOST`**
- **Description**: SMTP server hostname
- **Development**: Leave empty to use MailDev automatically
- **Production**: Your email service (e.g., `smtp.gmail.com`)
- **Example**: `SMTP_HOST=smtp.gmail.com`

**`SMTP_PORT`**
- **Description**: SMTP server port
- **Common Ports**: `587` (TLS), `465` (SSL), `25` (plain)
- **Recommended**: `587`
- **Example**: `SMTP_PORT=587`

**`SMTP_USER`**
- **Description**: SMTP authentication username (usually email)
- **Example**: `SMTP_USER=your-email@gmail.com`

**`SMTP_PASS`**
- **Description**: SMTP authentication password
- **Gmail**: Use App Password, not account password
- **Example**: `SMTP_PASS=your_app_password`

**Gmail App Password Setup**:
1. Go to Google Account settings
2. Security → 2-Step Verification
3. App Passwords → Generate
4. Use the generated 16-character password

#### Rate Limiting

**`RATE_LIMIT_WINDOW_MINUTES`**
- **Description**: Time window for general API rate limiting
- **Default**: `15`
- **Format**: Number (minutes)
- **Example**: `RATE_LIMIT_WINDOW_MINUTES=15`

**`RATE_LIMIT_MAX`**
- **Description**: Max requests per IP in the time window
- **Default**: `100`
- **Format**: Number
- **Example**: `RATE_LIMIT_MAX=100`

**`AUTH_RATE_LIMIT_WINDOW_MINUTES`**
- **Description**: Time window for auth endpoint rate limiting
- **Default**: `1`
- **Format**: Number (minutes)
- **Example**: `AUTH_RATE_LIMIT_WINDOW_MINUTES=1`

**`AUTH_RATE_LIMIT_MAX`**
- **Description**: Max auth requests per IP in the time window
- **Default**: `5`
- **Format**: Number
- **Recommended**: Keep low (3-5) to prevent brute force
- **Example**: `AUTH_RATE_LIMIT_MAX=5`

### Complete Example `.env`

```bash
# Server
PORT=4005
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:4205

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/auth_boilerplate?schema=public

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_ACCESS_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1
JWT_REFRESH_EXPIRES=7d
JWT_EMAIL_SECRET=m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6
JWT_EMAIL_EXPIRES=24h
JWT_PASSWORD_RESET_SECRET=l6k5j4i3h2g1f0e9d8c7b6a5z4y3x2w1v0u9t8s7r6q5p4o3n2m1
JWT_PASSWORD_RESET_EXPIRES=1h

# Cookie names (optional)
ACCESS_TOKEN_COOKIE=access_token
REFRESH_TOKEN_COOKIE=refresh_token

# Email verification
SKIP_EMAIL_VERIFICATION=true

# Rate limiting
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_WINDOW_MINUTES=1
AUTH_RATE_LIMIT_MAX=5

# Email (SMTP) - Leave empty for local MailDev
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_app_password
```

## Frontend Environment Variables

### Location

Frontend uses TypeScript files for environment configuration:

- **Development**: `frontend/src/environments/environment.development.ts`
- **Production**: `frontend/src/environments/environment.ts`

### Development Environment

**File**: `frontend/src/environments/environment.development.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4005/api'
};
```

### Production Environment

**File**: `frontend/src/environments/environment.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: '/api'  // Relative URL (proxied by Vercel)
};
```

**Important**: Production uses relative URL because Vercel proxies API requests to avoid CORS issues.

### Vercel Proxy Configuration

**File**: `frontend/vercel.json` (create if doesn't exist)

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend.onrender.com/api/:path*"
    }
  ]
}
```

Replace `your-backend.onrender.com` with your actual backend URL.

## Docker Environment Variables

### docker-compose.yml

Environment variables for Docker Compose:

```yaml
services:
  postgres:
    environment:
      POSTGRES_DB: auth_boilerplate
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password

  backend:
    environment:
      NODE_ENV: development
      PORT: 4005
      CORS_ORIGIN: http://localhost:4205
      DATABASE_URL: postgresql://postgres:password@postgres:5432/auth_boilerplate?schema=public
      SMTP_HOST: maildev
      SMTP_PORT: 1025
      JWT_ACCESS_SECRET: dev_access_secret_replace_in_production
      JWT_ACCESS_EXPIRES: 15m
      JWT_REFRESH_SECRET: dev_refresh_secret_replace_in_production
      JWT_REFRESH_EXPIRES: 7d
      JWT_EMAIL_SECRET: dev_email_secret_replace_in_production
      JWT_EMAIL_EXPIRES: 24h
      JWT_PASSWORD_RESET_SECRET: dev_password_reset_secret_replace_in_production
      JWT_PASSWORD_RESET_EXPIRES: 1h
      ACCESS_TOKEN_COOKIE: access_token
      REFRESH_TOKEN_COOKIE: refresh_token
      SKIP_EMAIL_VERIFICATION: false
      RATE_LIMIT_WINDOW_MINUTES: 15
      RATE_LIMIT_MAX: 100
      AUTH_RATE_LIMIT_WINDOW_MINUTES: 1
      AUTH_RATE_LIMIT_MAX: 5

  maildev:
    environment:
      MAILDEV_WEB_PORT: 1080
      MAILDEV_SMTP_PORT: 1025
```

## Production Deployment

### Vercel (Frontend)

Set environment variables in Vercel dashboard:

1. Go to Project Settings
2. Environment Variables
3. Add:
   - `PRODUCTION=true` (optional)

### Render.com (Backend)

Set environment variables in Render dashboard:

1. Go to your service
2. Environment tab
3. Add all backend variables listed above
4. **Critical**: Use strong secrets in production

### Neon (Database)

Copy the connection string from Neon dashboard:

```
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
```

## Environment-Specific Configurations

### Development

```bash
NODE_ENV=development
PORT=4005
CORS_ORIGIN=http://localhost:4205
SKIP_EMAIL_VERIFICATION=true
SMTP_HOST=  # Empty for MailDev
```

**Features**:
- MailDev for email testing
- Relaxed security (HTTP cookies work)
- Skip email verification option
- Detailed error messages

### Production

```bash
NODE_ENV=production
PORT=4005  # Or let platform assign
CORS_ORIGIN=https://your-app.vercel.app
SKIP_EMAIL_VERIFICATION=false
SMTP_HOST=smtp.gmail.com
```

**Features**:
- Real SMTP server
- Secure cookies (HTTPS required)
- Email verification required
- Generic error messages

### Testing

```bash
NODE_ENV=test
DATABASE_URL=postgresql://postgres:password@localhost:5432/auth_test
```

## Generating Secure Secrets

### Using Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Using OpenSSL

```bash
openssl rand -hex 32
```

### Using Online Tools

- [Random.org](https://www.random.org/strings/)
- [1Password Generator](https://1password.com/password-generator/)

**Length Recommendations**:
- JWT Secrets: 32+ characters
- Production: 64+ characters recommended

## Environment Variable Priority

Variables are loaded in this order (later overrides earlier):

1. Default values in code
2. `.env` file
3. Shell environment variables
4. Platform environment variables (Vercel, Render)

## Security Best Practices

### ✅ DO

- Use strong random secrets (32+ chars)
- Use different secrets for each JWT type
- Rotate secrets periodically
- Use environment-specific configurations
- Keep `.env` in `.gitignore`
- Use platform secret managers in production

### ❌ DON'T

- Commit `.env` to version control
- Share secrets in plain text
- Reuse secrets across environments
- Use weak or predictable secrets
- Hardcode secrets in source code
- Use development secrets in production

## Troubleshooting

### "JWT secret not defined"

**Error**: Application crashes on startup

**Solution**: Ensure all JWT secrets are defined in `.env`

```bash
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=different_secret_here
JWT_EMAIL_SECRET=email_secret_here
JWT_PASSWORD_RESET_SECRET=reset_secret_here
```

### CORS Errors

**Error**: Cross-origin request blocked

**Solution**: Check `CORS_ORIGIN` matches frontend URL exactly

```bash
# Development
CORS_ORIGIN=http://localhost:4205

# Production
CORS_ORIGIN=https://your-app.vercel.app
```

### Database Connection Failed

**Error**: Can't connect to PostgreSQL

**Solution**: Verify `DATABASE_URL` format

```bash
DATABASE_URL=postgresql://USER:PASS@HOST:PORT/DATABASE?schema=public
```

### Email Not Sending

**Error**: SMTP connection failed

**Solution**: 
1. Check SMTP credentials
2. For Gmail, use App Password
3. Verify SMTP_PORT (usually 587)
4. In development, leave SMTP_HOST empty for MailDev

### Invalid Token Errors

**Error**: JWT verification fails

**Solution**: 
1. Secrets must match between token generation and verification
2. Check token hasn't expired
3. Ensure secrets haven't changed (invalidates all tokens)

## Checking Current Configuration

### Backend

Add a health check endpoint:

```typescript
app.get('/api/config-check', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    hasCorsOrigin: !!process.env.CORS_ORIGIN,
    hasDbUrl: !!process.env.DATABASE_URL,
    hasAccessSecret: !!process.env.JWT_ACCESS_SECRET,
    // Don't expose actual secrets!
  });
});
```

## Related Documentation

- [Getting Started](./getting-started.md) - Setup guide
- [Deployment](./deployment.md) - Production deployment
- [Security](./security.md) - Security best practices
- [Troubleshooting](./troubleshooting.md) - Common issues
