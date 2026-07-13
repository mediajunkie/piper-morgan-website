/**
 * Edge middleware: server-side redirect for signed-out visits to /admin/*.
 *
 * Defense in depth on the server deployment — the security boundary is the
 * API layer (every admin API verifies the session itself); this just avoids
 * flashing the admin shell before the client gate kicks in. Uses `jose`
 * because the Edge runtime lacks the Node crypto APIs jsonwebtoken needs.
 *
 * Skipped entirely in static export builds (no server).
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_COOKIE = 'pm_admin_session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin/login')) return NextResponse.next();

  const secret = process.env.ADMIN_SESSION_SECRET;
  const configured = Boolean(secret && process.env.ADMIN_PASSWORD_HASH);

  // Not configured: dev stays open; production falls through to the page,
  // where the client gate shows the "auth not configured" notice (the APIs
  // fail closed regardless).
  if (!configured) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
      if (payload.role === 'admin') return NextResponse.next();
    } catch {
      // invalid/expired token → redirect below
    }
  }

  const login = req.nextUrl.clone();
  login.pathname = '/admin/login';
  login.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/admin/:path*'],
};
