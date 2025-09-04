import { sql } from '@vercel/postgres';

export interface Subscriber {
  id: number;
  email: string;
  status: 'pending' | 'confirmed' | 'unsubscribed';
  source: string;
  signup_date: Date;
  confirmed_date?: Date;
  verification_token?: string;
  metadata?: string; // JSON string for additional data
}

export async function initializeDatabase() {
  try {
    // Create subscribers table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' NOT NULL,
        source VARCHAR(100) NOT NULL,
        signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        confirmed_date TIMESTAMP NULL,
        verification_token VARCHAR(255) NULL,
        metadata TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create index on email for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
    `;

    // Create index on verification token
    await sql`
      CREATE INDEX IF NOT EXISTS idx_subscribers_token ON subscribers(verification_token);
    `;

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export async function addSubscriber(
  email: string,
  source: string,
  verificationToken: string,
  metadata?: Record<string, any>
): Promise<Subscriber> {
  try {
    const result = await sql`
      INSERT INTO subscribers (email, source, verification_token, metadata, status)
      VALUES (${email}, ${source}, ${verificationToken}, ${JSON.stringify(metadata || {})}, 'pending')
      ON CONFLICT (email) 
      DO UPDATE SET 
        source = EXCLUDED.source,
        verification_token = EXCLUDED.verification_token,
        metadata = EXCLUDED.metadata,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    return result.rows[0] as Subscriber;
  } catch (error) {
    console.error('❌ Failed to add subscriber:', error);
    throw error;
  }
}

export async function confirmSubscriber(token: string): Promise<Subscriber | null> {
  try {
    const result = await sql`
      UPDATE subscribers 
      SET status = 'confirmed', 
          confirmed_date = CURRENT_TIMESTAMP,
          verification_token = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE verification_token = ${token} 
      AND status = 'pending'
      RETURNING *;
    `;

    return result.rows[0] as Subscriber || null;
  } catch (error) {
    console.error('❌ Failed to confirm subscriber:', error);
    throw error;
  }
}

export async function unsubscribeSubscriber(email: string): Promise<Subscriber | null> {
  try {
    const result = await sql`
      UPDATE subscribers 
      SET status = 'unsubscribed',
          updated_at = CURRENT_TIMESTAMP
      WHERE email = ${email}
      RETURNING *;
    `;

    return result.rows[0] as Subscriber || null;
  } catch (error) {
    console.error('❌ Failed to unsubscribe:', error);
    throw error;
  }
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  try {
    const result = await sql`
      SELECT * FROM subscribers WHERE email = ${email} LIMIT 1;
    `;

    return result.rows[0] as Subscriber || null;
  } catch (error) {
    console.error('❌ Failed to get subscriber:', error);
    throw error;
  }
}

export async function getSubscriberStats() {
  try {
    const result = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM subscribers 
      GROUP BY status;
    `;

    return result.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('❌ Failed to get subscriber stats:', error);
    throw error;
  }
}