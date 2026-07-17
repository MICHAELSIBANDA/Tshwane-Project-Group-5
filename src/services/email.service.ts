import formData from 'form-data';
import Mailgun from 'mailgun.js';

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || '';
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || '';

let mg: ReturnType<Mailgun['client']> | null = null;

function getMailgunClient() {
  if (!mg) {
    const mailgun = new Mailgun(formData);
    mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });
  }
  return mg;
}

/**
 * Send password reset email with 6-digit verification code
 * Uses Mailgun API to send actual emails
 * @param email - User's email address
 * @param verificationCode - 6-digit verification code
 */
export async function sendPasswordResetEmail(email: string, verificationCode: string): Promise<void> {
  // Check if Mailgun credentials are configured
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    // Development mode: log the code to console for testing
    console.log('========================================');
    console.log('PASSWORD RESET VERIFICATION CODE');
    console.log('========================================');
    console.log(`Email: ${email}`);
    console.log(`Verification Code: ${verificationCode}`);
    console.log('This code will expire in 10 minutes');
    console.log('========================================');
    return;
  }

  // Production mode: send actual email via Mailgun
  try {
    await getMailgunClient().messages.create(MAILGUN_DOMAIN, {
      from: `Auth Service <noreply@${MAILGUN_DOMAIN}>`,
      to: [email],
      subject: 'Password Reset Verification Code',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your account.</p>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #4CAF50; text-align: center;">${verificationCode}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
      `,
    });
    console.log(`Password reset email sent to ${email} with code: ${verificationCode}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}
