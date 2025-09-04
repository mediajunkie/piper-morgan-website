import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create reusable transporter object using environment variables
export function createEmailTransporter() {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  if (!config.auth.user || !config.auth.pass) {
    throw new Error('SMTP credentials not configured');
  }

  return nodemailer.createTransport(config);
}

export async function sendVerificationEmail(
  email: string,
  verificationToken: string,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
) {
  const transporter = createEmailTransporter();
  const verificationUrl = `${baseUrl}/api/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"Piper Morgan" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to: email,
    subject: 'Please confirm your subscription to Building Piper Morgan',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Confirm Your Subscription</title>
      </head>
      <body style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1F2937; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="${baseUrl}/assets/pm-logo.png" alt="Piper Morgan" style="max-width: 200px; height: auto;">
        </div>

        <div style="background: #F9FAFB; padding: 32px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: #0F766E; margin: 0 0 16px 0; font-size: 24px; font-weight: bold;">
            Welcome to Building Piper Morgan!
          </h1>
          
          <p style="margin: 16px 0; font-size: 16px;">
            Thanks for subscribing to follow our AI product management journey. To complete your subscription and start receiving updates, please confirm your email address.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationUrl}" 
               style="background: #0F766E; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
              Confirm Subscription
            </a>
          </div>

          <p style="margin: 16px 0; font-size: 14px; color: #6B7280;">
            If the button doesn't work, copy and paste this link in your browser:<br>
            <a href="${verificationUrl}" style="color: #0F766E; word-break: break-all;">${verificationUrl}</a>
          </p>
        </div>

        <div style="border-top: 1px solid #E5E7EB; padding-top: 24px; font-size: 14px; color: #6B7280;">
          <p><strong>What you'll receive:</strong></p>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>Real discoveries from ongoing AI development work</li>
            <li>Patterns you can adapt to your own AI experiments</li>
            <li>Honest assessments of what works and what doesn't</li>
            <li>Systematic methodology insights for human-AI collaboration</li>
          </ul>

          <p style="margin-top: 24px; font-size: 12px;">
            This confirmation link expires in 24 hours. If you didn't sign up for this newsletter, you can safely ignore this email.
          </p>

          <p style="margin-top: 16px; font-size: 12px;">
            <a href="${baseUrl}/privacy" style="color: #0F766E;">Privacy Policy</a> | 
            Built with systematic kindness ✨
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to Building Piper Morgan!

Thanks for subscribing to follow our AI product management journey. To complete your subscription and start receiving updates, please confirm your email address by clicking this link:

${verificationUrl}

What you'll receive:
- Real discoveries from ongoing AI development work
- Patterns you can adapt to your own AI experiments  
- Honest assessments of what works and what doesn't
- Systematic methodology insights for human-AI collaboration

This confirmation link expires in 24 hours. If you didn't sign up for this newsletter, you can safely ignore this email.

Privacy Policy: ${baseUrl}/privacy
Built with systematic kindness ✨
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string) {
  const transporter = createEmailTransporter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const mailOptions = {
    from: `"Christian from Piper Morgan" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to: email,
    subject: 'Welcome! Your journey into systematic AI collaboration begins',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Welcome to Building Piper Morgan</title>
      </head>
      <body style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1F2937; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="${baseUrl}/assets/pm-logo.png" alt="Piper Morgan" style="max-width: 200px; height: auto;">
        </div>

        <div style="background: linear-gradient(135deg, #0F766E08, #FB923C08); padding: 32px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: #0F766E; margin: 0 0 16px 0; font-size: 24px; font-weight: bold;">
            🎉 Welcome to the Building Piper Morgan community!
          </h1>
          
          <p style="margin: 16px 0; font-size: 16px;">
            You're now part of a learning journey that's documenting every breakthrough, failure, and "streamlist command not found" moment of building an AI assistant that amplifies rather than replaces PM judgment.
          </p>

          <h3 style="color: #1F2937; margin: 24px 0 12px 0;">What happens next?</h3>
          <ul style="margin: 12px 0; padding-left: 20px;">
            <li><strong>Weekly insights</strong> from systematic AI-human collaboration development</li>
            <li><strong>Real patterns</strong> you can adapt to your own context (no hype, just what works)</li>  
            <li><strong>Transparent process documentation</strong> with decision frameworks and failure analysis</li>
            <li><strong>Early access</strong> to methodology documentation and breakthrough discoveries</li>
          </ul>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #0F766E;">
            <p style="margin: 0; font-size: 14px; font-style: italic;">
              "This isn't another AI tool promising to automate your job away. It's a learning journey shared in real-time, with all the technical debt and environment setup comedy included."
            </p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #6B7280;">— Christian Crumlish</p>
          </div>
        </div>

        <div style="border-top: 1px solid #E5E7EB; padding-top: 24px;">
          <h3 style="color: #1F2937; margin: 0 0 16px 0;">Explore the methodology:</h3>
          
          <div style="margin: 16px 0;">
            <a href="${baseUrl}/how-it-works" 
               style="color: #0F766E; text-decoration: none; font-weight: 600;">
              📚 How It Works
            </a>
            <p style="margin: 4px 0; font-size: 14px; color: #6B7280;">
              The five patterns that make AI-human collaboration actually work
            </p>
          </div>

          <div style="margin: 16px 0;">
            <a href="${baseUrl}/what-weve-learned" 
               style="color: #0F766E; text-decoration: none; font-weight: 600;">
              💡 What We've Learned
            </a>
            <p style="margin: 4px 0; font-size: 14px; color: #6B7280;">
              Counter-intuitive discoveries from systematic AI development
            </p>
          </div>

          <div style="margin: 16px 0;">
            <a href="https://medium.com/building-piper-morgan" 
               style="color: #0F766E; text-decoration: none; font-weight: 600;">
              📖 Latest Blog Posts
            </a>
            <p style="margin: 4px 0; font-size: 14px; color: #6B7280;">
              Daily development insights and architectural decisions
            </p>
          </div>
        </div>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280; text-align: center;">
          <p>Questions? Just reply to this email.</p>
          <p>
            <a href="${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}" style="color: #0F766E;">Unsubscribe</a> | 
            <a href="${baseUrl}/privacy" style="color: #0F766E;">Privacy Policy</a>
          </p>
          <p style="margin-top: 16px;">Made with systematic kindness ✨</p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw error;
  }
}