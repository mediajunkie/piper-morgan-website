/**
 * GET /api/admin/me — session check for the admin page gate.
 *
 * 200 { ok: true, mode } → signed in (or dev with auth not configured)
 * 401 → not signed in; 503 → auth not configured in production
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuthMode, requireAdmin } from '@/lib/admin-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const check = await requireAdmin(req);
  if (!check.ok) return res.status(check.status).json({ error: check.message });
  return res.status(200).json({ ok: true, mode: adminAuthMode() });
}
