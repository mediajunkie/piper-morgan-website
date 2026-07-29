/**
 * Editorial calendar loader + types.
 *
 * Reads `data/editorial-calendar.csv` (copied from product repo at prebuild
 * via scripts/copy-editorial-calendar.js) and exposes typed accessors used by
 * the /admin/publish-queue page.
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export type CalendarStatus = 'published' | 'distributed' | 'queued' | 'drafted' | 'ready' | '' | string;
export type CalendarTheme = 'building' | 'insight' | 'ship' | '' | string;

export interface CalendarEntry {
  title: string;
  theme: CalendarTheme;
  status: CalendarStatus;
  workDate: string;
  endWorkDate: string;
  pubDate: string;
  mediumURL: string;
  liPubDate: string;
  linkedinURL: string;
  canonicalSite: string;
  blogURL: string;
  blogPath: string;
  cartoon: string;
  chatDate: string;
  draftPath: string;
  notes: string;
  altText: string;
  caption: string;
}

const CSV_PATH = path.join(process.cwd(), 'data', 'editorial-calendar.csv');

let cached: CalendarEntry[] | null = null;

function parseCalendarCsv(text: string): CalendarEntry[] {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as CalendarEntry[];
}

/**
 * Build-time read of the CSV baked into the deployment by the prebuild step.
 *
 * ⚠️ This is a BUILD-TIME SNAPSHOT and goes stale between deploys. It is the
 * right loader for the compose API routes (which key off draftPath, a field
 * that changes only when a draft is created) but the WRONG one for any view
 * whose whole job is showing current status — see loadCalendarLive() below.
 */
export function loadCalendar(): CalendarEntry[] {
  if (cached) return cached;
  if (!fs.existsSync(CSV_PATH)) return [];
  const rows = parseCalendarCsv(fs.readFileSync(CSV_PATH, 'utf-8'));
  cached = rows;
  return rows;
}

export type CalendarSource =
  | { kind: 'live'; fetchedAt: string }
  | { kind: 'snapshot'; reason: string };

export interface LiveCalendar {
  rows: CalendarEntry[];
  source: CalendarSource;
}

const LIVE_TTL_MS = 15_000;
let liveCache: { at: number; value: LiveCalendar } | null = null;

/**
 * Request-time read of the canonical CSV straight from the product repo via the
 * GitHub Contents API — the same source and token the prebuild step uses.
 *
 * Why this exists: the admin calendar was reported stale three times in ~10 days
 * (Comms 07-21, Docs 07-25 ×2). Root cause is structural — the page is a
 * build-time render of a build-time file, so a CSV commit is invisible until
 * something triggers a Vercel deploy.
 *
 * ⚠️ Note for anyone tempted by the one-line ISR fix: `export const revalidate`
 * on the page does NOT fix this. ISR re-runs the page render inside the deployed
 * lambda; it does NOT re-run `prebuild`. So it would re-render from the very same
 * stale `data/editorial-calendar.csv` and change nothing — while looking like a fix.
 * The data source has to move to request time, which is what this function does.
 *
 * Falls back to the build-time snapshot on any failure, and ALWAYS reports which
 * source it used so the page can say so out loud. Silent fallback to stale data
 * is the bug being fixed here, so it must never fail quietly.
 */
export async function loadCalendarLive(): Promise<LiveCalendar> {
  const now = Date.now();
  if (liveCache && now - liveCache.at < LIVE_TTL_MS) return liveCache.value;

  const result = await fetchLiveCalendar();
  liveCache = { at: now, value: result };
  return result;
}

async function fetchLiveCalendar(): Promise<LiveCalendar> {
  const token = process.env.GITHUB_DRAFT_TOKEN;
  const snapshot = (reason: string): LiveCalendar => ({
    rows: loadCalendar(),
    source: { kind: 'snapshot', reason },
  });

  if (!token) return snapshot('GITHUB_DRAFT_TOKEN not set');

  const owner = process.env.GITHUB_DRAFT_OWNER || 'mediajunkie';
  const repo = process.env.GITHUB_DRAFT_REPO || 'piper-morgan-product';
  const branch = process.env.GITHUB_DRAFT_BRANCH || 'main';
  const relPath = 'docs/internal/planning/comms/editorial-calendar.csv';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${relPath}?ref=${encodeURIComponent(branch)}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    });
    if (!res.ok) return snapshot(`GitHub API HTTP ${res.status}`);

    const data = await res.json();
    if (typeof data.content !== 'string' || data.encoding !== 'base64') {
      return snapshot('unexpected GitHub contents response shape');
    }
    const text = Buffer.from(data.content, 'base64').toString('utf-8');
    const rows = parseCalendarCsv(text);
    if (rows.length === 0) return snapshot('live CSV parsed to zero rows');

    return { rows, source: { kind: 'live', fetchedAt: new Date().toISOString() } };
  } catch (err) {
    return snapshot(`fetch threw: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** YYYY-MM-DD comparable string; '' sorts last via the helpers below. */
function dateKey(s: string): string { return s || '0000-00-00'; }

export function sortByPubDate(rows: CalendarEntry[], dir: 'asc' | 'desc' = 'desc'): CalendarEntry[] {
  const sign = dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => sign * dateKey(a.pubDate).localeCompare(dateKey(b.pubDate)));
}

export function readyToPublish(rows: CalendarEntry[]): CalendarEntry[] {
  const ready = rows.filter(r => ['ready', 'queued', 'drafted'].includes(r.status));
  return sortByPubDate(ready, 'asc');
}

export function recentlyPublished(rows: CalendarEntry[], days = 14, now = new Date()): CalendarEntry[] {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  const published = rows.filter(r => (r.status === 'published' || r.status === 'distributed') && r.pubDate >= cutoffKey);
  return sortByPubDate(published, 'desc');
}

export interface SyndicationGap {
  entry: CalendarEntry;
  missing: ('medium' | 'linkedin')[];
}

export function syndicationGaps(rows: CalendarEntry[]): SyndicationGap[] {
  const out: SyndicationGap[] = [];
  for (const r of rows) {
    if (r.status !== 'published') continue;
    if (r.canonicalSite !== 'distributed') continue;
    const missing: ('medium' | 'linkedin')[] = [];
    if (!r.mediumURL) missing.push('medium');
    if (!r.linkedinURL) missing.push('linkedin');
    if (missing.length > 0) out.push({ entry: r, missing });
  }
  // Most-recently published first
  out.sort((a, b) => dateKey(b.entry.pubDate).localeCompare(dateKey(a.entry.pubDate)));
  return out;
}

export function imageMetadataGaps(rows: CalendarEntry[], days = 30, now = new Date()): CalendarEntry[] {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  const gaps = rows.filter(r =>
    (r.status === 'published' || r.status === 'distributed') &&
    r.pubDate >= cutoffKey &&
    (!r.altText || !r.caption)
  );
  return sortByPubDate(gaps, 'desc');
}
