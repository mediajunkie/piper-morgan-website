import type { Metadata } from 'next';
import {
  loadCalendar,
  readyToPublish,
  recentlyPublished,
  syndicationGaps,
  imageMetadataGaps,
  CalendarEntry,
  SyndicationGap,
} from '@/lib/editorial-calendar';

export const metadata: Metadata = {
  title: 'Publish Queue — pipermorgan.ai admin',
  description: 'Build-time admin view of the editorial calendar. Not for public consumption.',
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

function fmtDate(s: string): string {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function rowAttrs(e: CalendarEntry): Record<string, string> {
  return {
    'data-title': e.title,
    'data-theme': e.theme,
    'data-status': e.status,
    'data-pub-date': e.pubDate,
    'data-work-date': e.workDate,
    'data-blog-path': e.blogPath,
    'data-canonical-site': e.canonicalSite,
  };
}

export default function PublishQueuePage() {
  const all = loadCalendar();
  const buildTime = new Date().toISOString();
  const ready = readyToPublish(all);
  const recent = recentlyPublished(all);
  const gaps = syndicationGaps(all);
  const imgGaps = imageMetadataGaps(all);

  const structuredData = {
    buildTime,
    totalEntries: all.length,
    sections: {
      readyToPublish: ready,
      recentlyPublished: recent,
      syndicationGaps: gaps,
      imageMetadataGaps: imgGaps,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">Admin</p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-dark-text mt-1">Publish Queue</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Build-time snapshot of the editorial calendar.
            {' '}
            Built <time dateTime={buildTime} suppressHydrationWarning>{buildTime}</time>
            {' • '}
            {all.length} total entries
            {' • '}
            <a href="#raw-data" className="text-primary-teal-text dark:text-primary-teal hover:underline">raw data ↓</a>
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Section counts:
            {' '}<span data-count="ready">ready/queued/drafted: {ready.length}</span>
            {' • '}<span data-count="recent">recently published (14d): {recent.length}</span>
            {' • '}<span data-count="syndication-gaps">syndication gaps: {gaps.length}</span>
            {' • '}<span data-count="image-gaps">image-metadata gaps (30d): {imgGaps.length}</span>
          </p>
        </header>

        <Section id="ready-to-publish" title="Ready to publish" subtitle="status ∈ {ready, queued, drafted}, ordered by pubDate ascending" count={ready.length}>
          {ready.length === 0 ? (
            <Empty>No drafts queued.</Empty>
          ) : (
            <Table headers={['pubDate', 'status', 'theme', 'title', 'draft', 'notes']}>
              {ready.map((e, i) => (
                <tr key={`ready-${i}`} {...rowAttrs(e)} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4 whitespace-nowrap"><time dateTime={e.pubDate}>{fmtDate(e.pubDate)}</time></td>
                  <td className="py-2 pr-4"><Badge status={e.status} /></td>
                  <td className="py-2 pr-4"><ThemeBadge theme={e.theme} /></td>
                  <td className="py-2 pr-4 font-medium">{e.title}</td>
                  <td className="py-2 pr-4 text-xs text-gray-500 dark:text-gray-400">{e.draftPath || '—'}</td>
                  <td className="py-2 pr-4 text-xs text-gray-500 dark:text-gray-400">{e.notes || ''}</td>
                </tr>
              ))}
            </Table>
          )}
        </Section>

        <Section id="recently-published" title="Recently published" subtitle="status=published, pubDate within last 14 days" count={recent.length}>
          {recent.length === 0 ? (
            <Empty>No posts published in the last 14 days.</Empty>
          ) : (
            <Table headers={['pubDate', 'theme', 'title', 'blog', 'medium', 'linkedin']}>
              {recent.map((e, i) => (
                <tr key={`recent-${i}`} {...rowAttrs(e)} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4 whitespace-nowrap"><time dateTime={e.pubDate}>{fmtDate(e.pubDate)}</time></td>
                  <td className="py-2 pr-4"><ThemeBadge theme={e.theme} /></td>
                  <td className="py-2 pr-4 font-medium">{e.title}</td>
                  <td className="py-2 pr-4"><LinkCell href={e.blogURL} /></td>
                  <td className="py-2 pr-4"><LinkCell href={e.mediumURL} /></td>
                  <td className="py-2 pr-4"><LinkCell href={e.linkedinURL} /></td>
                </tr>
              ))}
            </Table>
          )}
        </Section>

        <Section id="syndication-gaps" title="Syndication gaps" subtitle="status=published, canonicalSite=distributed, missing one or both syndication URLs" count={gaps.length}>
          {gaps.length === 0 ? (
            <Empty>No syndication gaps. All distributed posts have both Medium and LinkedIn URLs.</Empty>
          ) : (
            <Table headers={['pubDate', 'theme', 'title', 'missing', 'blog']}>
              {gaps.map((g: SyndicationGap, i: number) => (
                <tr key={`gap-${i}`} {...rowAttrs(g.entry)} data-missing={g.missing.join(',')} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-4 whitespace-nowrap"><time dateTime={g.entry.pubDate}>{fmtDate(g.entry.pubDate)}</time></td>
                  <td className="py-2 pr-4"><ThemeBadge theme={g.entry.theme} /></td>
                  <td className="py-2 pr-4 font-medium">{g.entry.title}</td>
                  <td className="py-2 pr-4">
                    {g.missing.map((m) => (
                      <span key={m} className="inline-block px-2 py-0.5 mr-1 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">{m}</span>
                    ))}
                  </td>
                  <td className="py-2 pr-4"><LinkCell href={g.entry.blogURL} /></td>
                </tr>
              ))}
            </Table>
          )}
        </Section>

        <Section id="image-metadata-gaps" title="Image-metadata gaps" subtitle="status=published, last 30 days, missing altText or caption" count={imgGaps.length}>
          {imgGaps.length === 0 ? (
            <Empty>No image-metadata gaps in the last 30 days.</Empty>
          ) : (
            <Table headers={['pubDate', 'theme', 'title', 'missing']}>
              {imgGaps.map((e, i) => {
                const missing = [!e.altText && 'altText', !e.caption && 'caption'].filter(Boolean) as string[];
                return (
                  <tr key={`img-${i}`} {...rowAttrs(e)} data-missing={missing.join(',')} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-4 whitespace-nowrap"><time dateTime={e.pubDate}>{fmtDate(e.pubDate)}</time></td>
                    <td className="py-2 pr-4"><ThemeBadge theme={e.theme} /></td>
                    <td className="py-2 pr-4 font-medium">{e.title}</td>
                    <td className="py-2 pr-4">
                      {missing.map((m) => (
                        <span key={m} className="inline-block px-2 py-0.5 mr-1 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">{m}</span>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </Table>
          )}
        </Section>

        <section id="raw-data" aria-label="Raw structured data" className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-text-dark dark:text-dark-text mb-2">Raw data</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Static JSON endpoint (no JS required, no RSC parsing): <a href="/admin/publish-queue-data.json" className="text-primary-teal-text dark:text-primary-teal hover:underline font-mono text-xs">/admin/publish-queue-data.json</a>
            {' '}— regenerated on every build, mirrors the section computations on this page.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            In-page selector (after hydration): <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">document.getElementById(&apos;publish-queue-data&apos;).textContent</code>
          </p>
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Show JSON (collapsed by default)</summary>
            <pre className="mt-2 p-4 bg-gray-900 text-gray-100 rounded overflow-x-auto"><code>{JSON.stringify(structuredData, null, 2)}</code></pre>
          </details>
          <script
            type="application/json"
            id="publish-queue-data"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </section>
      </main>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function Section({ id, title, subtitle, count, children }: { id: string; title: string; subtitle?: string; count: number; children: React.ReactNode }) {
  return (
    <section id={id} aria-label={title} className="mb-10" data-section={id} data-count={count}>
      <div className="flex items-baseline gap-3 mb-1">
        <h2 className="text-xl font-bold text-text-dark dark:text-dark-text">{title}</h2>
        <span className="text-sm text-gray-500 dark:text-gray-500">({count})</span>
      </div>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{subtitle}</p>}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-x-auto">
        {children}
      </div>
    </section>
  );
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 dark:bg-gray-800/50">
        <tr>
          {headers.map((h) => (
            <th key={h} scope="col" className="text-left py-2 px-4 font-medium text-gray-700 dark:text-gray-300">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="p-6 text-sm text-gray-500 dark:text-gray-400 italic">{children}</div>;
}

function Badge({ status }: { status: string }) {
  const color = status === 'queued' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
    : status === 'drafted' ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    : status === 'ready' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
    : status === 'published' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>{status || '—'}</span>;
}

function ThemeBadge({ theme }: { theme: string }) {
  const color = theme === 'building' ? 'bg-primary-teal/10 dark:bg-primary-teal/20 text-primary-teal-text dark:text-primary-teal'
    : theme === 'insight' ? 'bg-primary-orange/10 dark:bg-primary-orange/20 text-primary-orange-text dark:text-primary-orange'
    : theme === 'ship' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>{theme || '—'}</span>;
}

function LinkCell({ href }: { href: string }) {
  if (!href) return <span className="text-gray-400 dark:text-gray-600 text-xs">—</span>;
  let label = href;
  try { label = new URL(href).hostname.replace(/^www\./, ''); } catch {}
  return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-teal-text dark:text-primary-teal hover:underline text-xs">{label} ↗</a>;
}
