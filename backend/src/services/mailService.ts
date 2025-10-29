import { mailer } from '../utils/mailer';
import { Resend } from 'resend';

// Environment flag to choose provider. Supported values: 'resend' or 'nodemailer'.
// Default: nodemailer
const MAIL_PROVIDER = (process.env.MAIL_PROVIDER || 'nodemailer').toLowerCase();


async function sendViaResend(opts: { to: string; subject: string; html: string; from: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set but MAIL_PROVIDER=resend');
  }
  console.log('user:', opts.to);
  const resend = new Resend(apiKey);
  return resend.emails.send({
    from: opts.from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}

async function sendViaNodemailer(opts: { to: string; subject: string; html: string; from: string }) {
  return mailer.sendMail({
    from: opts.from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}

async function sendMail(opts: {to: string; subject: string; html: string; from: string }) {
  if (MAIL_PROVIDER === 'resend') {
    try {
      return await sendViaResend(opts);
    } catch (err) {
      // If resend fails or is misconfigured, fall back to nodemailer and log a warning
      // eslint-disable-next-line no-console
      console.warn('Resend provider failed — falling back to nodemailer:', err);
      return sendViaNodemailer(opts);
    }
  }

  return sendViaNodemailer(opts);
}

export async function sendVerificationEmail(to: string, token: string) {
  // Use CORS_ORIGIN for the base URL, fallback to localhost if not set
  const baseUrl = process.env.CORS_ORIGIN || 'http://localhost:4205';
  const url = `${baseUrl}/verify-email?token=${token}`;
  const from = process.env.SMTP_USER || '"StackInsight Auth Lite" <noreply@stackinsight.app>';

  return sendMail({
    from,
    to,
    subject: 'Verify your email',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  // Use CORS_ORIGIN for the base URL, fallback to localhost if not set
  const baseUrl = process.env.CORS_ORIGIN || 'http://localhost:4205';
  const url = `${baseUrl}/reset-password?token=${token}`;
  const from = process.env.SMTP_USER || '"StackInsight Auth Lite" <noreply@stackinsight.app>';

  return sendMail({
    from,
    to,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click <a href="${url}">here</a> to reset your password.</p>
           <p>This link will expire in 1 hour.</p>
           <p>If you didn't request this, please ignore this email.</p>`,
  });
}