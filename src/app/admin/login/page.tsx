'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get('next') || '/admin/calendar';

  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => null) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error || `Sign-in failed (HTTP ${res.status}).`);
        return;
      }
      router.replace(next.startsWith('/') ? next : '/admin/calendar');
    } catch {
      setError('Could not reach the sign-in API. This admin only works on the server deployment, not the static site.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-text-dark dark:text-dark-text mb-1">Admin sign-in</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">pipermorgan.ai editorial tools</p>

      <label htmlFor="admin-password" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        Password
      </label>
      <input
        id="admin-password"
        type="password"
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-text-dark dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-teal/50 focus:border-primary-teal text-sm"
      />

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">{error}</p>
      )}

      <button
        type="submit"
        disabled={busy || !password}
        className="mt-4 w-full px-4 py-2 rounded-md bg-primary-teal text-white text-sm font-semibold hover:bg-primary-teal/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-teal/50"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-start justify-center pt-24 px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
