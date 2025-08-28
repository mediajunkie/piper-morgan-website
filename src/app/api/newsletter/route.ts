import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
    const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

    if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
      console.error('ConvertKit configuration missing');
      return NextResponse.json(
        { error: 'Newsletter service is not configured. Please try again later.' },
        { status: 503 }
      );
    }

    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email,
          tags: ['piper-morgan-website'],
        }),
      }
    );

    const data = await response.json();
    
    console.log('ConvertKit API Response:', {
      status: response.status,
      data: data
    });

    if (!response.ok) {
      console.error('ConvertKit API error:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to subscribe. Please try again.' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriber: {
        id: data.subscription.subscriber.id,
        email: data.subscription.subscriber.email_address,
      }
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}