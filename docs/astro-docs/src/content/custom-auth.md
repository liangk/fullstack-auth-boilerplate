# Custom Authentication Strategies

Extend StackInsight Auth Lite with OAuth, 2FA, and custom providers.

## OAuth (Social Login)

### Flow Overview
1. Frontend redirects to provider (Google, GitHub, etc.)
2. Provider redirects back with code
3. Backend exchanges code for tokens
4. Backend creates/links local user and issues app cookies

### Backend Endpoint Shape
```http
GET /auth/oauth/:provider/start
GET /auth/oauth/:provider/callback?code=...
```

### Data Model
- Users table includes `provider`, `providerId`
- When an OAuth account logs in first time: create user if not exists; otherwise link

### Security Notes
- Validate state param to prevent CSRF
- Use PKCE for public clients where possible
- Short lifetime for one-time login “nonce”

## Two-Factor Authentication (2FA)

### Options
- Time-based OTP (TOTP) via Authenticator apps
- Email one-time code (simpler, less secure)

### Backend Additions
- Secret storage per user (encrypted)
- Recovery codes (hashed, one-time use)
- Verification endpoints

### Example Endpoints
```http
POST /auth/2fa/setup           # generate secret + QR
POST /auth/2fa/enable          # confirm code and enable
POST /auth/2fa/verify          # verify code during login
POST /auth/2fa/disable         # require password + code
```

### Frontend UX
- Wizard: enable → scan QR → verify code → backup codes
- During login: prompt for code after password success

## Passwordless (Magic Link)

### Flow
1. User enters email
2. Backend sends time-limited link with token
3. Clicking link creates session and issues cookies

### Endpoint
```http
POST /auth/passwordless/start
GET  /auth/passwordless/callback?token=...
```

### Security
- Single-use tokens, short expiry (e.g., 10 minutes)
- Anti-bruteforce by rate limits per email/IP

## Enterprise SSO (SAML/OIDC)

- Prefer OIDC if you control both sides (simpler than SAML)
- Map IdP claims → local roles/permissions
- Maintain Just-In-Time user provisioning

## Auditing & Telemetry

- Log provider, user id, ip, and success/failure
- Track linkage/unlink events (user adds/removes OAuth providers)

## Best Practices
- **Least privilege**: request minimal scopes
- **Account linking**: require password to link new providers
- **Session hardening**: verify 2FA after provider login if enabled
- **Recovery**: offer fallback login when provider unavailable

## See Also
- [Security Best Practices](./security.md)
- [Authentication API](./api-auth.md)
