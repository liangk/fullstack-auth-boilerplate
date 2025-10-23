# Tutorial: Custom Email Templates

Customize verification and password reset emails in StackInsight Auth Lite.

## Email Types

- **Verification Email**: Sent after registration or email change
- **Password Reset Email**: Sent when user requests password reset
- **Welcome Email**: Optional email after verification

## 1) Template Structure

Recommended folder structure (backend):
```
backend/
  src/
    mail/
      templates/
        verification.hbs
        reset-password.hbs
        welcome.hbs
      mail.service.ts
```

Use Handlebars (or any engine you prefer):
```ts
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

function renderTemplate(name: string, data: any) {
  const file = fs.readFileSync(path.join(__dirname, 'templates', `${name}.hbs`), 'utf8');
  const template = Handlebars.compile(file);
  return template(data);
}
```

## 2) Verification Email Template (Handlebars)

```hbs
<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif;">
    <h2>Verify your email</h2>
    <p>Hi {{name}},</p>
    <p>Thanks for signing up for <strong>StackInsight Auth Lite</strong>. Please verify your email by clicking the button below:</p>
    <p>
      <a href="{{verifyUrl}}" style="background:#2563eb;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;">
        Verify Email
      </a>
    </p>
    <p>This link will expire in 24 hours. If you did not create this account, you can ignore this email.</p>
    <hr/>
    <p style="color:#888;">&copy; {{year}} StackInsight</p>
  </body>
</html>
```

Data passed:
```ts
const html = renderTemplate('verification', {
  name: user.name || 'there',
  verifyUrl: `${process.env.FRONTEND_URL}/verify-email/${token}`,
  year: new Date().getFullYear()
});
```

## 3) Reset Password Email Template

```hbs
<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif;">
    <h2>Reset your password</h2>
    <p>Hi {{name}},</p>
    <p>We received a request to reset your password. Click the button below to continue.</p>
    <p>
      <a href="{{resetUrl}}" style="background:#2563eb;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;">
        Reset Password
      </a>
    </p>
    <p>If you did not request a password reset, you can safely ignore this email.</p>
  </body>
</html>
```

Data passed:
```ts
const html = renderTemplate('reset-password', {
  name: user.name || user.email,
  resetUrl: `${process.env.FRONTEND_URL}/reset-password/${token}`
});
```

## 4) Mail Service Integration

```ts
// mail.service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  } : undefined
});

export async function sendVerificationEmail(user: User, token: string) {
  const html = renderTemplate('verification', {
    name: user.name || 'there',
    verifyUrl: `${process.env.FRONTEND_URL}/verify-email/${token}`,
    year: new Date().getFullYear()
  });

  await transporter.sendMail({
    to: user.email,
    from: process.env.SMTP_FROM!,
    subject: 'Verify your email',
    html
  });
}
```

## 5) Theming & Branding

- Replace colors with your brand palette
- Inline CSS (better for email clients)
- Use web-safe fonts (Arial, Helvetica, Georgia)
- Add alt text for buttons and images

## 6) Testing Emails Locally

Use MailDev in Docker (`http://localhost:1080`):
- Verify HTML rendering
- Check links and expiry
- Validate sender/subject

## 7) Production Deliverability

- Set SPF, DKIM, DMARC records
- Use a reputable provider (Resend, Sendgrid, SES)
- Warm up sending domain
- Avoid spammy wording

## 8) Internationalization (Optional)

- Parameterize strings
- Load locale-specific templates
- Keep templates short and simple

## 9) Accessibility

- Sufficient color contrast
- Descriptive link text
- Semantic headings

## 10) Common Pitfalls

- Broken links (use absolute URLs)
- Missing `SMTP_FROM`
- Unescaped user-generated content
- Large images (keep total < 100 KB)

## See Also
- [Security Best Practices](./security.md)
- [Authentication Flow](./authentication-flow.md)
- [Error Handling](./error-handling.md)
