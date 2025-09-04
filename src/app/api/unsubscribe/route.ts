import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeSubscriber, getSubscriberByEmail, initializeDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Initialize database if needed
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Unsubscribe - Piper Morgan</title>
          <style>
            body { font-family: Inter, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; }
            .logo { max-width: 200px; margin-bottom: 32px; display: block; margin-left: auto; margin-right: auto; }
            .card { background: #F9FAFB; padding: 32px; border-radius: 12px; text-align: center; }
            input { width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #D1D5DB; border-radius: 8px; }
            button { background: #DC2626; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; }
            button:hover { background: #B91C1C; }
            a { color: #0F766E; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <img src="/assets/pm-logo.png" alt="Piper Morgan" class="logo">
          <div class="card">
            <h1>Unsubscribe from Newsletter</h1>
            <p>Enter your email address to unsubscribe from Building Piper Morgan updates:</p>
            
            <form method="POST" action="/api/unsubscribe">
              <input type="email" name="email" placeholder="your@email.com" required>
              <br>
              <button type="submit">Unsubscribe</button>
            </form>
            
            <p style="margin-top: 24px;">
              <a href="/">Return to homepage</a>
            </p>
          </div>
        </body>
        </html>
      `, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Process unsubscribe
    const subscriber = await unsubscribeSubscriber(email);

    if (!subscriber) {
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Email Not Found</title>
          <style>
            body { font-family: Inter, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
            .logo { max-width: 200px; margin-bottom: 32px; }
            .warning { color: #D97706; }
            a { color: #0F766E; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <img src="/assets/pm-logo.png" alt="Piper Morgan" class="logo">
          <h1 class="warning">Email Not Found</h1>
          <p>The email address <strong>${email}</strong> was not found in our newsletter list.</p>
          <p>You may have already unsubscribed, or the email address may be incorrect.</p>
          <p><a href="/">Return to homepage</a></p>
        </body>
        </html>
      `, {
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Successfully Unsubscribed</title>
        <style>
          body { font-family: Inter, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
          .logo { max-width: 200px; margin-bottom: 32px; }
          .success { color: #059669; }
          .card { background: #F9FAFB; padding: 32px; border-radius: 12px; margin: 24px 0; }
          a { color: #0F766E; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <img src="/assets/pm-logo.png" alt="Piper Morgan" class="logo">
        <div class="card">
          <h1 class="success">Successfully Unsubscribed</h1>
          <p>You have been unsubscribed from the Building Piper Morgan newsletter.</p>
          <p>We're sorry to see you go! If you change your mind, you can always subscribe again from our homepage.</p>
        </div>
        
        <p>
          <a href="/">Return to homepage</a> | 
          <a href="/get-involved">Subscribe again</a>
        </p>
        
        <p style="margin-top: 32px; font-size: 14px; color: #6B7280;">
          Thank you for being part of our journey ✨
        </p>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribe Error</title>
        <style>body { font-family: Inter, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }</style>
      </head>
      <body>
        <h1>Error</h1>
        <p>Sorry, there was an error processing your unsubscribe request.</p>
        <p><a href="/">Return to homepage</a></p>
      </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle POST requests from the unsubscribe form
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;

    if (!email) {
      return NextResponse.redirect(new URL('/api/unsubscribe', request.url));
    }

    // Redirect to GET with email parameter
    const redirectUrl = new URL('/api/unsubscribe', request.url);
    redirectUrl.searchParams.set('email', email);
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Unsubscribe POST error:', error);
    return NextResponse.redirect(new URL('/api/unsubscribe', request.url));
  }
}