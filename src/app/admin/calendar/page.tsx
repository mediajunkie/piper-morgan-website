import type { Metadata } from 'next';
import { loadCalendar, CalendarEntry } from '@/lib/editorial-calendar';
import { CalendarView } from './CalendarView';

export const metadata: Metadata = {
  title: 'Editorial Calendar — pipermorgan.ai admin',
  description: 'Always-current admin view of the editorial calendar (build-time). Not for public consumption.',
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function EditorialCalendarPage() {
  const all = loadCalendar();
  const buildTime = new Date().toISOString();

  // Partition: entries with a pubDate go on the grid; the rest are "unscheduled"
  const scheduled: CalendarEntry[] = [];
  const unscheduled: CalendarEntry[] = [];
  for (const e of all) {
    if (e.pubDate) scheduled.push(e); else unscheduled.push(e);
  }

  // Group scheduled by pubDate (YYYY-MM-DD → entries)
  const byDate: Record<string, CalendarEntry[]> = {};
  for (const e of scheduled) {
    if (!byDate[e.pubDate]) byDate[e.pubDate] = [];
    byDate[e.pubDate].push(e);
  }

  // Available months (YYYY-MM), sorted
  const months = Array.from(new Set(scheduled.map(e => e.pubDate.slice(0, 7)))).sort();

  // Default month: current month if present in data, else most recent data month
  const todayKey = new Date().toISOString().slice(0, 7);
  const defaultMonth = months.includes(todayKey)
    ? todayKey
    : (months[months.length - 1] || todayKey);

  const counts = {
    total: all.length,
    scheduled: scheduled.length,
    unscheduled: unscheduled.length,
    published: scheduled.filter(e => e.status === 'published' || e.status === 'distributed').length,
    queued: scheduled.filter(e => e.status === 'queued').length,
    drafted: scheduled.filter(e => ['drafted', 'ready'].includes(e.status)).length,
  };

  const structuredData = { buildTime, counts, months, byDate, unscheduled };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">Admin</p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-dark-text mt-1">Editorial Calendar</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Build-time snapshot of the editorial calendar.
            {' '}
            Built <time dateTime={buildTime} suppressHydrationWarning>{buildTime}</time>
            {' • '}
            {counts.total} total entries ({counts.scheduled} scheduled, {counts.unscheduled} unscheduled)
            {' • '}
            <a href="#raw-data" className="text-primary-teal-text dark:text-primary-teal hover:underline">raw data ↓</a>
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            {counts.published} published
            {' • '}
            {counts.queued} queued
            {' • '}
            {counts.drafted} drafted/ready
          </p>
        </header>

        <CalendarView
          byDate={byDate}
          unscheduled={unscheduled}
          months={months}
          defaultMonth={defaultMonth}
        />

        <section id="raw-data" aria-label="Raw structured data" className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-text-dark dark:text-dark-text mb-2">Raw data</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            In-page selector (after hydration):{' '}
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">document.getElementById(&apos;editorial-calendar-data&apos;).textContent</code>
          </p>
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Show JSON (collapsed by default)</summary>
            <pre className="mt-2 p-4 bg-gray-900 text-gray-100 rounded overflow-x-auto"><code>{JSON.stringify(structuredData, null, 2)}</code></pre>
          </details>
          <script
            type="application/json"
            id="editorial-calendar-data"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </section>
      </main>
    </div>
  );
}
