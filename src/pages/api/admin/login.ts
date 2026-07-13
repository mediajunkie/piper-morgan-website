/**
 * POST /api/admin/login — exchange the admin password for a session cookie.
 *
 * Body: { password: string }
 * 200 → Set-Cookie pm_admin_session (httpOnly, 7 days)
 * 401 → wrong password (after a small constant delay)
 * 503 → auth not configured on this deployment
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { adminAuthMode, createSessionToken, sessionCookie } from '@/lib/admin-auth';

const FAILURE_DELAY_MS = 400;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const mode = adminAuthMode();
  if (mode === 'unconfigured') {
    return res.status(503).json({
      error: 'Admin auth is not configured on this deployment.',
    });
  }
  if (mode === 'open') {
    // Local dev without auth configured — nothing to log in to.
    return res.status(200).json({ ok: true, mode });
  }

  const { password } = (req.body ?? {}) as { password?: string };
  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Password required.' });
  }

  const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH as string);
  if (!valid) {
    await new Promise(r => setTimeout(r, FAILURE_DELAY_MS));
    return res.status(401).json({ error: 'Wrong password.' });
  }

  const token = await createSessionToken();
  res.setHeader('Set-Cookie', sessionCookie(token));
  return res.status(200).json({ ok: true, mode });
}
