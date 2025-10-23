# Email Service

Email setup and templates for StackInsight Auth Lite.

## Overview

- **Provider**: Any SMTP (Resend, Sendgrid, SES, Mailgun)
- **Library**: Nodemailer
- **Templates**: Handlebars (recommended)

## Environment Variables

```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=apikey_or_username
SMTP_PASSWORD=your_password
SMTP_FROM=noreply@stackinsight.app
FRONTEND_URL=https://your-frontend-domain
```

## Transport

```ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  } : undefined
});
```

## Templates

Use Handlebars for HTML templates; see `tutorial-email-templates.md`.

```ts
export async function sendVerificationEmail(user: User, token: string) {
  const html = renderTemplate('verification', {
    name: user.name || 'there',
    verifyUrl: `${process.env.FRONTEND_URL}/verify-email/${token}`,
    year: new Date().getFullYear()
  });
  await transporter.sendMail({ to: user.email, from: process.env.SMTP_FROM!, subject: 'Verify your email', html });
}
```

## Local Testing

- Run MailDev (Docker Compose provides `maildev` on port 1080)
- Open http://localhost:1080 to preview emails

## Deliverability

- Configure SPF, DKIM, DMARC
- Use branded sender domain
- Avoid spam words and large images

## Common Errors

- 535 Authentication failed → bad SMTP creds
- ETIMEDOUT → host/port/firewall issue
- Invalid login link → ensure `FRONTEND_URL` is correct
