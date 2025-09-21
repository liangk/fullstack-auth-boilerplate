import { mailer } from '../utils/mailer';

export async function sendVerificationEmail(to: string, token: string) {
  const url = `http://localhost:4200/verify-email?token=${token}`;
  
  await mailer.sendMail({
    from: '"Auth Boilerplate" <noreply@example.com>',
    to,
    subject: "Verify your email",
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `http://localhost:4200/reset-password?token=${token}`;
  
  await mailer.sendMail({
    from: '"Auth Boilerplate" <noreply@example.com>',
    to,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`
  });
}
