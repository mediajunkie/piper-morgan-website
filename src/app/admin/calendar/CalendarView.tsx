'use client';

import { useMemo, useState } from 'react';
import type { CalendarEntry } from '@/lib/editorial-calendar';

interface CalendarViewProps {
  byDate: Record<string, CalendarEntry[]>;
  unscheduled: CalendarEntry[];
  months: string[];           // YYYY-MM strings, sorted
  defaultMonth: string;       // YYYY-MM
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ymd(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseMonth(s: string): { year: number; month: number } {
  return { year: parseInt(s.slice(0, 4), 10), month: parseInt(s.slice(5, 7), 10) - 1 };
}

function statusOf(e: CalendarEntry): 'published' | 'queued' | 'drafted' | 'ready' {
  const s = (e.status || '').toLowerCase();
  if (s === 'published' || s === 'queued' || s === 'ready') return s;
  return 'drafted';
}

function fmtDate(s: string): string {
  if (!s) return s;
  const d = new Date(s + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
}

export function CalendarView({ byDate, unscheduled, months, defaultMonth }: CalendarViewProps) {
  const [current, setCurrent] = useState<{ year: number; month: number }>(parseMonth(defaultMonth));
  const [selected, setSelected] = useState<string | null>(null);

  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function prevMonth() {
    setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 });
  }
  function nextMonth() {
    setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 });
  }
  function goToday() {
    const t = new Date();
    setCurrent({ year: t.getFullYear(), month: t.getMonth() });
    setSelected(todayKey);
  }

  // Build the month grid
  const firstDay = new Date(current.year, current.month, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const cells: { key: string; day: number | null }[] = [];
  for (let i = 0; i < startDow; i++) cells.push({ key: `e${i}`, day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ key: ymd(current.year, current.month, d), day: d });
  while (cells.length % 7 !== 0) cells.push({ key: `e-tail-${cells.length}`, day: null });

  const monthHasData = months.includes(`${current.year}-${String(current.month + 1).padStart(2, '0')}`);
  const detailEntries = selected ? (byDate[selected] || []) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-10">
      {/* Calendar */}
      <section aria-label="Editorial calendar month grid" className="flex-1 min-w-0 bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              aria-label="Previous month"
            >‹</button>
            <button
              onClick={goToday}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
            >Today</button>
            <button
              onClick={nextMonth}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              aria-label="Next month"
            >›</button>
            <span className="ml-2 text-base font-semibold text-text-dark dark:text-dark-text">
              {MONTH_NAMES[current.month]} {current.year}
            </span>
            {!monthHasData && (
              <span className="ml-2 text-xs text-gray-400 italic">no entries this month</span>
            )}
          </div>
          <Legend />
        </div>

        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              {DOW.map(d => (
                <th key={d} scope="col" className="py-1 px-1 text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cells.length / 7 }).map((_, row) => (
              <tr key={`row-${row}`}>
                {cells.slice(row * 7, row * 7 + 7).map(cell => {
                  if (cell.day === null) {
                    return <td key={cell.key} className="h-20 border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30" />;
                  }
                  const entries = byDate[cell.key] || [];
                  const isToday = cell.key === todayKey;
                  const isSelected = cell.key === selected;
                  return (
                    <td
                      key={cell.key}
                      onClick={() => setSelected(cell.key)}
                      className={[
                        'h-20 align-top p-1 border cursor-pointer transition-colors',
                        isSelected
                          ? 'border-primary-teal ring-2 ring-primary-teal/40'
                          : 'border-gray-200 dark:border-gray-800',
                        isToday ? 'bg-primary-teal/5 dark:bg-primary-teal/10' : 'bg-white dark:bg-dark-surface',
                        'hover:bg-gray-50 dark:hover:bg-gray-800/60',
                      ].join(' ')}
                      data-key={cell.key}
                    >
                      <div className={`text-[11px] font-medium ${isToday ? 'text-primary-teal-text dark:text-primary-teal' : 'text-gray-500 dark:text-gray-400'}`}>
                        {cell.day}
                      </div>
                      <div className="mt-0.5 space-y-0.5">
                        {entries.slice(0, 3).map((e, i) => (
                          <DayChip key={i} entry={e} />
                        ))}
                        {entries.length > 3 && (
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 pl-1">+{entries.length - 3} more</div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {unscheduled.length > 0 && (
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              {unscheduled.length} entries with no pubDate (unscheduled / drafts)
            </summary>
            <ul className="mt-2 space-y-1 ml-4 text-xs">
              {unscheduled.map((e, i) => (
                <li key={i} className="flex items-center gap-2">
                  <StatusBadge status={statusOf(e)} />
                  <span className="font-medium text-text-dark dark:text-dark-text">{e.title || '(untitled)'}</span>
                  {e.theme && <span className="text-gray-500 dark:text-gray-400">· {e.theme}</span>}
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {/* Detail panel */}
      <aside aria-label="Day details" className="lg:w-96 lg:flex-shrink-0">
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 lg:sticky lg:top-4">
          {selected ? (
            <>
              <h2 className="text-base font-semibold text-text-dark dark:text-dark-text mb-3">{fmtDate(selected)}</h2>
              {detailEntries.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nothing scheduled or published this day.</p>
              ) : (
                <div className="space-y-4">
                  {detailEntries.map((e, i) => <DetailCard key={i} entry={e} />)}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">Click any day in the calendar to see details.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function DayChip({ entry }: { entry: CalendarEntry }) {
  const s = statusOf(entry);
  const color =
    s === 'published' ? 'bg-primary-teal/15 text-primary-teal-text dark:bg-primary-teal/25 dark:text-primary-teal border-primary-teal/30' :
    s === 'queued'    ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
    s === 'ready'     ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800' :
                        'bg-primary-orange/15 text-primary-orange dark:bg-primary-orange/25 dark:text-primary-orange border-primary-orange/30';
  return (
    <div
      title={entry.title}
      className={`text-[10px] leading-tight px-1 py-0.5 rounded border truncate ${color}`}
    >
      {entry.title || '(untitled)'}
    </div>
  );
}

function StatusBadge({ status }: { status: ReturnType<typeof statusOf> }) {
  const color =
    status === 'published' ? 'bg-primary-teal/15 text-primary-teal-text dark:bg-primary-teal/25 dark:text-primary-teal' :
    status === 'queued'    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
    status === 'ready'     ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                             'bg-primary-orange/15 text-primary-orange dark:bg-primary-orange/25 dark:text-primary-orange';
  return <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${color}`}>{status}</span>;
}

function ThemeBadge({ theme }: { theme: string }) {
  if (!theme) return null;
  const color =
    theme === 'building' ? 'bg-primary-teal/10 text-primary-teal-text dark:bg-primary-teal/20 dark:text-primary-teal' :
    theme === 'insight'  ? 'bg-primary-orange/10 text-primary-orange dark:bg-primary-orange/20' :
    theme === 'ship'     ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                           'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  return <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${color}`}>{theme}</span>;
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 flex-wrap">
      <LegendDot color="bg-primary-teal" label="published" />
      <LegendDot color="bg-blue-400" label="queued" />
      <LegendDot color="bg-green-400" label="ready" />
      <LegendDot color="bg-primary-orange" label="drafted" />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function DetailCard({ entry }: { entry: CalendarEntry }) {
  const s = statusOf(entry);
  return (
    <article className="border-t border-gray-100 dark:border-gray-800 pt-3 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold text-text-dark dark:text-dark-text mb-2 leading-snug">{entry.title || '(untitled)'}</h3>
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <StatusBadge status={s} />
        <ThemeBadge theme={entry.theme} />
      </div>
      <dl className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
        {entry.workDate && (
          <KV label="work">
            {entry.workDate}{entry.endWorkDate ? ` – ${entry.endWorkDate}` : ''}
          </KV>
        )}
        {entry.canonicalSite && <KV label="canonical">{entry.canonicalSite}</KV>}
        {entry.draftPath && <KV label="draft"><code className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1 rounded">{entry.draftPath}</code></KV>}
        {entry.notes && <KV label="notes">{entry.notes}</KV>}
      </dl>
      <DetailLinks entry={entry} />
    </article>
  );
}

function KV({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-1.5">
      <dt className="font-semibold text-gray-500 dark:text-gray-400">{label}:</dt>
      <dd className="flex-1">{children}</dd>
    </div>
  );
}

function composeSlug(draftPath: string): string {
  const base = draftPath.split('/').pop() ?? '';
  return base.endsWith('.md') ? base.slice(0, -3) : base;
}

function DetailLinks({ entry }: { entry: CalendarEntry }) {
  const links: { href: string; label: string; external?: boolean }[] = [];
  if (entry.draftPath && entry.status !== 'published') {
    links.push({ href: `/admin/calendar/compose?slug=${encodeURIComponent(composeSlug(entry.draftPath))}`, label: 'Edit draft' });
  }
  if (entry.blogURL) links.push({ href: entry.blogURL, label: 'blog', external: true });
  if (entry.mediumURL) links.push({ href: entry.mediumURL, label: 'Medium', external: true });
  if (entry.linkedinURL) links.push({ href: entry.linkedinURL, label: 'LinkedIn', external: true });
  if (links.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2 text-xs">
      {links.map(l => (
        <a
          key={l.label}
          href={l.href}
          {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-primary-teal-text dark:text-primary-teal hover:underline"
        >{l.label}{l.external ? ' ↗' : ' →'}</a>
      ))}
    </div>
  );
}
