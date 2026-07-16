'use client';

/**
 * Client-side gate for /admin/* pages: checks the session via /api/admin/me
 * and redirects to /admin/login when signed out.
 *
 * The real security boundary is the API layer (every admin API verifies the
 * session server-side); this gate is UX. Admin page HTML contains no secrets —
 * it ships in the public repo and the static export regardless.
 */

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type GateState = 'checking' | 'allowed' | 'unconfigured' | 'static-fallback';

const IS_STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

export function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = (pathname ?? '').startsWith('/admin/login');
  const [state, setState] = useState<GateState>(
    IS_STATIC_EXPORT ? 'static-fallback' : isLoginPage ? 'allowed' : 'checking',
  );

  useEffect(() => {
    if (IS_STATIC_EXPORT || isLoginPage) return;
    let cancelled = false;
    fetch('/api/admin/me')
      .then(res => {
        if (cancelled) return;
        if (res.ok) { setState('allowed'); return; }
        if (res.status === 503) { setState('unconfigured'); return; }
        // 401 (signed out) or 404 (static deployment without APIs) → login
        router.replace(`/admin/login?next=${encodeURIComponent(pathname ?? '/admin/calendar')}`);
      })
      .catch(() => {
        if (!cancelled) {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname ?? '/admin/calendar')}`);
        }
      });
    return () => { cancelled = true; };
  }, [isLoginPage, pathname, router]);

  if (state === 'allowed') return <>{children}</>;

  if (state === 'static-fallback') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-start justify-center pt-24 px-4">
        <div className="max-w-md p-4 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-sm">
          This is the static emergency-fallback build — it has no server, so admin editing
          isn&apos;t available here. Use <a href="https://pipermorgan.ai/admin/" className="underline font-medium">pipermorgan.ai/admin/</a>{' '}
          instead.
        </div>
      </div>
    );
  }

  if (state === 'unconfigured') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-start justify-center pt-24 px-4">
        <div className="max-w-md p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          Admin auth is not configured on this deployment — set <code>ADMIN_PASSWORD_HASH</code> and{' '}
          <code>ADMIN_SESSION_SECRET</code> in the environment.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-start justify-center pt-24">
      <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Checking session…</p>
    </div>
  );
}
