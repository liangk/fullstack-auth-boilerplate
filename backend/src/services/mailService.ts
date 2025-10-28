import { mailer } from '../utils/mailer';

export async function sendVerificationEmail(to: string, token: string) {
  // Use CORS_ORIGIN for the base URL, fallback to localhost if not set
  const baseUrl = process.env.CORS_ORIGIN || 'http://localhost:4205';
  const url = `${baseUrl}/verify-email?token=${token}`;
  const fromEmail = process.env.SMTP_USER || '"Auth Boilerplate" <noreply@example.com>';

  await mailer.sendMail({
    from: fromEmail,
    to,
    subject: 'Verify your email',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  // Use CORS_ORIGIN for the base URL, fallback to localhost if not set
  const baseUrl = process.env.CORS_ORIGIN || 'http://localhost:4205';
  const url = `${baseUrl}/reset-password?token=${token}`;
  const fromEmail = process.env.SMTP_USER || '"Auth Boilerplate" <noreply@example.com>';

  await mailer.sendMail({
    from: fromEmail,
    to,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click <a href="${url}">here</a> to reset your password.</p>
           <p>This link will expire in 1 hour.</p>
           <p>If you didn't request this, please ignore this email.</p>`,
  });
}