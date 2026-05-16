#!/usr/bin/env node

/**
 * generate-publish-queue-data.js — Prebuild step.
 *
 * Reads data/editorial-calendar.csv (copied by copy-editorial-calendar.js) and
 * writes public/admin/publish-queue-data.json — a static, agent-readable
 * snapshot of the same data the /admin/publish-queue dashboard renders.
 *
 * Why a separate file: the dashboard page lives behind a ClientLayout
 * boundary, so its rendered DOM (including data-attributes and embedded JSON
 * script tag) only exists after client-side hydration. This file is plain
 * static JSON, fetchable by anything that can do HTTP.
 *
 * Same data, same section computation as src/lib/editorial-calendar.ts.
 * Keep these two in sync if section logic changes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const CSV_PATH = path.join(REPO_ROOT, 'data', 'editorial-calendar.csv');
const OUT_DIR = path.join(REPO_ROOT, 'public', 'admin');
const OUT_PATH = path.join(OUT_DIR, 'publish-queue-data.json');

if (!fs.existsSync(CSV_PATH)) {
  console.warn(`⚠️  ${CSV_PATH} not found — writing empty publish-queue-data.json`);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify({ buildTime: new Date().toISOString(), totalEntries: 0, sections: { readyToPublish: [], recentlyPublished: [], syndicationGaps: [], imageMetadataGaps: [] } }, null, 2), 'utf-8');
  process.exit(0);
}

const text = fs.readFileSync(CSV_PATH, 'utf-8');
const rows = parse(text, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  relax_quotes: true,
  relax_column_count: true,
});

const dateKey = (s) => s || '0000-00-00';
const sortByPubDate = (rs, dir = 'desc') => {
  const sign = dir === 'asc' ? 1 : -1;
  return [...rs].sort((a, b) => sign * dateKey(a.pubDate).localeCompare(dateKey(b.pubDate)));
};

const ready = sortByPubDate(rows.filter(r => ['ready', 'queued', 'drafted'].includes(r.status)), 'asc');

const now = new Date();
const cutoff14 = new Date(now); cutoff14.setDate(cutoff14.getDate() - 14);
const cutoff14Key = cutoff14.toISOString().slice(0, 10);
const recent = sortByPubDate(rows.filter(r => r.status === 'published' && r.pubDate >= cutoff14Key), 'desc');

const gaps = [];
for (const r of rows) {
  if (r.status !== 'published') continue;
  if (r.canonicalSite !== 'distributed') continue;
  const missing = [];
  if (!r.mediumURL) missing.push('medium');
  if (!r.linkedinURL) missing.push('linkedin');
  if (missing.length > 0) gaps.push({ entry: r, missing });
}
gaps.sort((a, b) => dateKey(b.entry.pubDate).localeCompare(dateKey(a.entry.pubDate)));

const cutoff30 = new Date(now); cutoff30.setDate(cutoff30.getDate() - 30);
const cutoff30Key = cutoff30.toISOString().slice(0, 10);
const imgGaps = sortByPubDate(
  rows.filter(r => r.status === 'published' && r.pubDate >= cutoff30Key && (!r.altText || !r.caption)),
  'desc'
);

const data = {
  buildTime: now.toISOString(),
  totalEntries: rows.length,
  sections: {
    readyToPublish: ready,
    recentlyPublished: recent,
    syndicationGaps: gaps,
    imageMetadataGaps: imgGaps,
  },
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(data, null, 2), 'utf-8');
console.log(`✅ Wrote ${path.relative(REPO_ROOT, OUT_PATH)} (${rows.length} entries: ${ready.length} ready, ${recent.length} recent, ${gaps.length} gaps, ${imgGaps.length} img-gaps)`);
