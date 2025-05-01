import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import VerificationEmail from './templates/verification';
import ResetPasswordEmail from './templates/reset-password';
import WelcomeEmail from './templates/welcome';

const isDevelopment = process.env.NODE_ENV === 'development';

// Email configuration based on environment
const emailConfig = {
  host: isDevelopment
    ? process.env.TEST_EMAIL_SERVER_HOST
    : process.env.EMAIL_SERVER_HOST,
  port: isDevelopment
    ? parseInt(process.env.TEST_EMAIL_SERVER_PORT || '587')
    : parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  auth: {
    user: isDevelopment
      ? process.env.TEST_EMAIL_SERVER_USER
      : process.env.EMAIL_SERVER_USER,
    pass: isDevelopment
      ? process.env.TEST_EMAIL_SERVER_PASSWORD
      : process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: !isDevelopment,
};

// Create reusable transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify transporter configuration
transporter.verify((error: Error | null) => {
  if (error) {
    console.error('Error with email configuration:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Generic send email function with retry logic
async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });
      return true;
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        console.error('Failed to send email after max retries:', error);
        return false;
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
  return false;
}

// Specific email sending functions
export async function sendVerificationEmail(to: string, url: string) {
  const html = await Promise.resolve(render(
    VerificationEmail({
      url,
      host: process.env.NEXT_PUBLIC_APP_NAME || 'AI Agents',
      userEmail: to,
    })
  ));

  return sendEmail({
    to,
    subject: 'Verify your email address',
    html,
  });
}

export async function sendPasswordResetEmail(to: string, url: string) {
  const html = await Promise.resolve(render(
    ResetPasswordEmail({
      url,
      host: process.env.NEXT_PUBLIC_APP_NAME || 'AI Agents',
      userEmail: to,
    })
  ));

  return sendEmail({
    to,
    subject: 'Reset your password',
    html,
  });
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;
  const html = await Promise.resolve(render(
    WelcomeEmail({
      url: dashboardUrl,
      host: process.env.NEXT_PUBLIC_APP_NAME || 'AI Agents',
      name,
    })
  ));

  return sendEmail({
    to,
    subject: 'Welcome to AI Agents!',
    html,
  });
} 