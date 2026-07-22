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

export function loadCalendar(): CalendarEntry[] {
  if (cached) return cached;
  if (!fs.existsSync(CSV_PATH)) return [];
  const text = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as CalendarEntry[];
  cached = rows;
  return rows;
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
