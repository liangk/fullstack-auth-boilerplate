# Security Best Practices

Security measures implemented in StackInsight Auth Lite and best practices for maintaining a secure application.

## Authentication Security

### HTTP-Only Cookies

**Implementation:**
- Access and refresh tokens stored in HTTP-only cookies
- Cannot be accessed via JavaScript (XSS protection)
- Automatically sent with requests (no manual token management)

```typescript
// Backend: Setting HTTP-only cookie
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000 // 15 minutes
});
```

**Benefits:**
- ✅ Protected from XSS attacks
- ✅ No token storage in localStorage
- ✅ Automatic CSRF protection with SameSite attribute

### JWT Token Strategy

**Access Tokens:**
- Short-lived (15 minutes)
- Used for API authentication
- Stored in HTTP-only cookie

**Refresh Tokens:**
- Long-lived (7 days)
- Used to obtain new access tokens
- Stored in HTTP-only cookie
- Automatically rotated on use

**Token Rotation:**
```typescript
// Old refresh token invalidated when new one issued
await prisma.refreshToken.delete({
  where: { token: oldRefreshToken }
});

// New refresh token created
const newRefreshToken = await prisma.refreshToken.create({
  data: {
    token: newToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
});
```

### Password Security

**Hashing:**
- bcrypt with salt rounds of 10
- Passwords never stored in plain text
- One-way encryption (cannot be decrypted)

```typescript
import bcrypt from 'bcrypt';

// Hashing password
const hashedPassword = await bcrypt.hash(password, 10);

// Verifying password
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Password Reset:**
- Time-limited reset tokens (1 hour)
- Tokens invalidated after use
- Email verification required

## API Security

### Rate Limiting

Prevents brute force and DDoS attacks:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);

// Stricter limits for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter);
```

### CORS Configuration

**Development:**
```typescript
app.use(cors({
  origin: 'http://localhost:4205',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Production:**
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Helmet.js Protection

Security headers automatically set:

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

**Headers Added:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`
- `Content-Security-Policy`

### Input Validation

**Backend Validation:**
```typescript
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  name: z.string().min(2).max(100).optional()
});

// Validate request
const result = registerSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ 
    error: 'Validation failed',
    details: result.error.errors 
  });
}
```

**SQL Injection Protection:**
- Prisma ORM with parameterized queries
- No raw SQL queries
- Automatic input sanitization

## Email Security

### Email Verification

**Token Generation:**
```typescript
import crypto from 'crypto';

const verificationToken = crypto.randomBytes(32).toString('hex');
const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

await prisma.user.update({
  where: { id: user.id },
  data: {
    verificationToken,
    verificationTokenExpiry: tokenExpiry
  }
});
```

**Verification Link:**
- Time-limited (24 hours)
- One-time use token
- Secure random generation

### Email Spoofing Protection

**SPF, DKIM, DMARC:**
```
# DNS Records (Example)
v=spf1 include:_spf.google.com ~all
default._domainkey.stackinsight.app IN TXT "v=DKIM1; k=rsa; p=..."
_dmarc.stackinsight.app IN TXT "v=DMARC1; p=quarantine; rua=mailto:..."
```

## Database Security

### Connection Security

**Environment Variables:**
```env
# Never commit this file
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

**SSL/TLS:**
- Production databases use SSL
- Certificate verification enabled
- Encrypted data in transit

### Data Encryption

**Sensitive Fields:**
- Passwords: bcrypt hashed
- Tokens: Stored hashed
- PII: Consider encryption at rest for sensitive data

**Database Backups:**
- Automated daily backups
- Encrypted backup storage
- Regular restore testing

## Frontend Security

### XSS Protection

**Angular Built-in:**
- Automatic sanitization of user input
- Template binding escapes HTML
- DomSanitizer for trusted content only

```typescript
// Bad - vulnerable to XSS
innerHTML = userInput;

// Good - sanitized
<div>{{ userInput }}</div>
```

### CSRF Protection

**SameSite Cookies:**
```typescript
sameSite: 'strict' // Prevents cross-site cookie sending
```

**Origin Validation:**
- Backend checks Origin header
- CORS configured for specific domains only

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

## Environment Security

### Environment Variables

**Never commit:**
- `.env` files
- API keys
- Database credentials
- JWT secrets

**Use Strong Secrets:**
```bash
# Generate strong JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Docker Security

**Non-root User:**
```dockerfile
USER node
```

**Minimal Base Images:**
```dockerfile
FROM node:20-alpine
```

**Security Scanning:**
```bash
docker scan your-image:tag
```

## Monitoring & Logging

### Security Logging

**Log Security Events:**
- Failed login attempts
- Password reset requests
- Email verification attempts
- Token refresh operations

```typescript
logger.warn('Failed login attempt', {
  email: email,
  ip: req.ip,
  timestamp: new Date()
});
```

### Audit Trail

**Track User Actions:**
- Login/logout times
- Password changes
- Email changes
- Account deletion

## Security Checklist

### Production Deployment

- [ ] Environment variables configured
- [ ] HTTPS enabled (SSL/TLS certificates)
- [ ] Database SSL enabled
- [ ] CORS restricted to production domains
- [ ] Rate limiting enabled
- [ ] Helmet.js configured
- [ ] Strong JWT secrets generated
- [ ] Email SPF/DKIM/DMARC configured
- [ ] Database backups automated
- [ ] Error messages don't leak sensitive info
- [ ] Security headers verified
- [ ] Dependencies updated (no vulnerabilities)
- [ ] Logging and monitoring configured

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Review security logs weekly
- [ ] Rotate JWT secrets quarterly
- [ ] Audit user permissions
- [ ] Test backup restoration
- [ ] Review and update CORS policies
- [ ] Scan for vulnerabilities
- [ ] Update security documentation

## Vulnerability Reporting

If you discover a security vulnerability:

1. **Do not** open a public GitHub issue
2. Email security@stackinsight.app
3. Include detailed description
4. Provide steps to reproduce
5. Wait for confirmation before disclosure

## Security Resources

### Tools
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing
- [Snyk](https://snyk.io/) - Dependency scanning
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Vulnerability checking

### Standards
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE Top 25](https://cwe.mitre.org/top25/)

### Best Practices
- [Auth0 Security Best Practices](https://auth0.com/docs/security)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
