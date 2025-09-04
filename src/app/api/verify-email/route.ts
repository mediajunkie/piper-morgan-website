import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { confirmSubscriber, initializeDatabase } from '@/lib/database';
import { sendWelcomeEmail } from '@/lib/email';

interface TokenPayload {
  email: string;
  timestamp: number;
  iat?: number;
  exp?: number;
}

export async function GET(request: NextRequest) {
  try {
    // Initialize database if needed
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      // Return HTML page for missing token
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Invalid Confirmation Link</title>
          <style>
            body { font-family: Inter, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
            .error { color: #DC2626; }
            .logo { max-width: 200px; margin-bottom: 32px; }
            a { color: #0F766E; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <img src="/assets/pm-logo.png" alt="Piper Morgan" class="logo">
          <h1 class="error">Invalid Confirmation Link</h1>
          <p>This confirmation link is missing or invalid.</p>
          <p><a href="/">Return to homepage</a> to sign up again.</p>
        </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Verify and decode token
    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'fallback-secret-change-in-production'
      ) as TokenPayload;
    } catch (jwtError) {
      console.error('Token verification failed:', jwtError);
      
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Expired Confirmation Link</title>
          <style>
            body { font-family: Inter, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
            .error { color: #DC2626; }
            .logo { max-width: 200px; margin-bottom: 32px; }
            a { color: #0F766E; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <img src="/assets/pm-logo.png" alt="Piper Morgan" class="logo">
          <h1 class="error">Confirmation Link Expired</h1>
          <p>This confirmation link has expired or is invalid.</p>
          <p>Confirmation links are valid for 24 hours after signup.</p>
          <p><a href="/">Return to homepage</a> to sign up again.</p>
        </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Confirm subscriber in database
    const subscriber = await confirmSubscriber(token);

    if (!subscriber) {
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Already Confirmed</title>
          <style>
            body { font-family: Inter, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
            .success { color: #059669; }
            .logo { max-width: 200px; margin-bottom: 32px; }
            a { color: #0F766E; text-decoration: none; padding: 12px 24px; background: #0F766E; color: white; border-radius: 8px; display: inline-block; margin-top: 20px; }
            a:hover { background: #0D9488; text-decoration: none; }
          </style>
        </head>
        <body>
          <img src="/assets/pm-logo.png" alt="Piper Morgan" class="logo">
          <h1 class="success">Already Confirmed!</h1>
          <p>Your subscription has already been confirmed.</p>
          <p>You should start receiving our newsletter updates soon.</p>
          <a href="/">Explore the site</a>
        </body>
        </html>
      `, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(subscriber.email);
      console.log('✅ Welcome email sent to:', subscriber.email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the confirmation if welcome email fails
    }

    // Return success page
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Subscription Confirmed!</title>
        <style>
          body { font-family: Inter, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
          .success { color: #059669; }
          .logo { max-width: 200px; margin-bottom: 32px; }
          .card { background: #F9FAFB; padding: 32px; border-radius: 12px; margin: 24px 0; }
          a { color: #0F766E; text-decoration: none; padding: 12px 24px; background: #0F766E; color: white; border-radius: 8px; display: inline-block; margin: 8px; }
          a:hover { background: #0D9488; text-decoration: none; }
          .secondary { background: transparent; color: #0F766E; border: 2px solid #0F766E; }
          .secondary:hover { background: #0F766E; color: white; }
        </style>
      </head>
      <body>
        <img src="/assets/pm-logo.png" alt="Piper Morgan" class="logo">
        <div class="card">
          <h1 class="success">🎉 Welcome to Building Piper Morgan!</h1>
          <p>Your subscription has been confirmed successfully.</p>
          <p>You'll receive our newsletter with systematic AI collaboration insights, real development discoveries, and methodology updates.</p>
          <p><strong>What's next?</strong> Check out our methodology and recent discoveries:</p>
        </div>
        
        <a href="/how-it-works">How It Works</a>
        <a href="/what-weve-learned" class="secondary">What We've Learned</a>
        
        <p style="margin-top: 32px; font-size: 14px; color: #6B7280;">
          Made with systematic kindness ✨
        </p>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Verification Error</title>
        <style>
          body { font-family: Inter, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
          .error { color: #DC2626; }
          .logo { max-width: 200px; margin-bottom: 32px; }
          a { color: #0F766E; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <img src="/assets/pm-logo.png" alt="Piper Morgan" class="logo">
        <h1 class="error">Verification Error</h1>
        <p>Sorry, there was an error confirming your subscription.</p>
        <p>Please try again or <a href="/">sign up again</a>.</p>
      </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}