import { NextResponse } from 'next/server';
import { getSubscriberStats } from '@/lib/database';

export async function GET() {
  try {
    const stats = await getSubscriberStats();
    
    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching subscriber stats:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subscriber statistics',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}