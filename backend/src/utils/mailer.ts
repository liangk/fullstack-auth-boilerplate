import nodemailer from 'nodemailer';

// Default to MailDev settings for local development
const isDevelopment = process.env.NODE_ENV === 'development';
const useMailDev = isDevelopment && !process.env.SMTP_HOST;

export const mailer = nodemailer.createTransport({
  host: useMailDev ? 'localhost' : process.env.SMTP_HOST || 'localhost',
  port: useMailDev ? 1025 : parseInt(process.env.SMTP_PORT || '587'),
  secure: !useMailDev && process.env.SMTP_PORT === '465', // true for 465, false for other ports
  ignoreTLS: useMailDev, // MailDev doesn't use TLS
  auth: useMailDev
    ? undefined
    : process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});
