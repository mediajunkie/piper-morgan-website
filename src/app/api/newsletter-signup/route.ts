import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { addSubscriber, getSubscriberByEmail, initializeDatabase } from '@/lib/database';
import { sendVerificationEmail } from '@/lib/email';
import { trackNewsletterSignup } from '@/lib/analytics';

// Rate limiting storage (in production, use Redis or external store)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  
  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return false;
  }
  
  if (limit.count >= 5) { // 5 requests per minute
    return true;
  }
  
  limit.count++;
  return false;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export async function POST(request: NextRequest) {
  try {
    // Initialize database if needed
    await initializeDatabase();

    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, source = 'website', metadata = {} } = body;

    // Validate input
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existingSubscriber = await getSubscriberByEmail(email);
    
    if (existingSubscriber && existingSubscriber.status === 'confirmed') {
      return NextResponse.json(
        { 
          message: 'You are already subscribed to our newsletter.',
          status: 'already_subscribed'
        },
        { status: 200 }
      );
    }

    // Generate verification token
    const verificationToken = jwt.sign(
      { email, timestamp: Date.now() },
      process.env.JWT_SECRET || 'fallback-secret-change-in-production',
      { expiresIn: '24h' }
    );

    // Add subscriber to database
    const subscriber = await addSubscriber(
      email,
      source,
      verificationToken,
      {
        ...metadata,
        ip: ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
        referrer: request.headers.get('referer') || 'direct',
      }
    );

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the whole request if email fails - we can retry later
    }

    // Track analytics event
    try {
      // Note: This is server-side, so we can't use client-side GA tracking
      // In a real implementation, you might use GA Measurement Protocol
      console.log('Newsletter signup:', { email, source, ip });
    } catch (analyticsError) {
      console.error('Analytics tracking failed:', analyticsError);
    }

    return NextResponse.json(
      { 
        message: 'Please check your email to confirm your subscription.',
        status: 'verification_sent',
        subscriber: {
          id: subscriber.id,
          email: subscriber.email,
          status: subscriber.status,
          source: subscriber.source
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Newsletter signup error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}