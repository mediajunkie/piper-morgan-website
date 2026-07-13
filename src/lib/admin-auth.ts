/**
 * Admin session auth for /admin/* pages and their APIs.
 *
 * Single-password login → signed JWT in an httpOnly cookie. Modes:
 *  - enforced:     ADMIN_PASSWORD_HASH + ADMIN_SESSION_SECRET are set
 *  - open:         not configured, non-production (local dev convenience)
 *  - unconfigured: not configured, production → everything refuses (fail closed)
 *
 * Uses `jose` (not jsonwebtoken) so the same verification also runs in Edge
 * middleware if we ever add it — jsonwebtoken needs Node crypto APIs that the
 * Edge runtime lacks.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { SignJWT, jwtVerify } from 'jose';

export const ADMIN_COOKIE = 'pm_admin_session';
export const SESSION_DAYS = 7;

export type AdminAuthMode = 'enforced' | 'open' | 'unconfigured';

export function adminAuthMode(): AdminAuthMode {
  const configured = Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET);
  if (configured) return 'enforced';
  return process.env.NODE_ENV === 'production' ? 'unconfigured' : 'open';
}

function secretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export function sessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}

export function clearedSessionCookie(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export interface AdminCheck {
  ok: boolean;
  status: number;
  message: string;
}

/** Gate an API request. Call at the top of every admin-only handler. */
export async function requireAdmin(req: NextApiRequest): Promise<AdminCheck> {
  const mode = adminAuthMode();
  if (mode === 'open') return { ok: true, status: 200, message: 'ok (dev, auth not configured)' };
  if (mode === 'unconfigured') {
    return {
      ok: false,
      status: 503,
      message: 'Admin auth is not configured on this deployment (ADMIN_PASSWORD_HASH / ADMIN_SESSION_SECRET missing).',
    };
  }
  const token = req.cookies[ADMIN_COOKIE];
  if (token && await verifySessionToken(token)) return { ok: true, status: 200, message: 'ok' };
  return { ok: false, status: 401, message: 'Not signed in.' };
}

/** Convenience: gate a handler, writing the error response on failure. */
export async function ensureAdmin(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const check = await requireAdmin(req);
  if (!check.ok) res.status(check.status).json({ error: check.message });
  return check.ok;
}
