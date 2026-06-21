import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ComposeApp } from './ComposeApp';

export const metadata: Metadata = {
  title: 'Compose — pipermorgan.ai admin',
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function ComposePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
            Admin · <a href="/admin/calendar/" className="hover:text-primary-teal-text dark:hover:text-primary-teal">Editorial Calendar</a>
          </p>
          <h1 className="text-3xl font-bold text-text-dark dark:text-dark-text mt-1">Compose</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Local editorial tool — works only in dev mode. Autosaves 30 s after last change, and on focus-out.
          </p>
        </header>

        <Suspense fallback={<p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading…</p>}>
          <ComposeApp />
        </Suspense>
      </main>
    </div>
  );
}
