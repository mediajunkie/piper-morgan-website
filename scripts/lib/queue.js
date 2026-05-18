/**
 * queue.js — engine-layer reader for the publish queue.
 *
 * Reads the editorial-calendar.csv from the product repo (the live source,
 * not the build-time snapshot in data/) and returns the entries that are
 * candidates for publishing: status ∈ {queued, drafted, ready}, sorted by
 * pubDate ascending (entries with no pubDate sort to the end).
 *
 * Engine module — called by CLI B (scripts/publish-cli.js), and reusable by
 * future Web GUI v2. Reads only; mutations live in calendar-mutations.js.
 *
 * Per the three-layer architecture: keep shells thin, engine grows. Don't
 * inline-parse the calendar inside CLI B; route through this module.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');
// Live calendar (not the build-time snapshot in data/) — CLI B reads from
// the product repo directly so the picker reflects the actual current state,
// not the last website-build state.
const LIVE_CALENDAR = path.resolve(REPO_ROOT, '..', 'piper-morgan-product', 'docs', 'internal', 'planning', 'comms', 'editorial-calendar.csv');

function parseCsvRow(row) {
  const fields = [];
  let cur = '', inQ = false;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (c === '"' && inQ && row[i + 1] === '"') { cur += '"'; i++; continue; }
    if (c === '"') { inQ = !inQ; continue; }
    if (c === ',' && !inQ) { fields.push(cur); cur = ''; continue; }
    cur += c;
  }
  fields.push(cur);
  return fields;
}

/**
 * Read all calendar rows as plain objects keyed by header name.
 */
export function readCalendar() {
  if (!fs.existsSync(LIVE_CALENDAR)) {
    throw new Error(`Calendar not found at ${LIVE_CALENDAR}. Expected sibling product-repo checkout.`);
  }
  const text = fs.readFileSync(LIVE_CALENDAR, 'utf-8');
  const lines = text.split('\n');
  const headers = parseCsvRow(lines[0]).map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const fields = parseCsvRow(lines[i]);
    const row = {};
    headers.forEach((h, j) => { row[h] = (fields[j] ?? '').trim(); });
    rows.push(row);
  }
  return rows;
}

/**
 * Publish-queue: status ∈ {queued, drafted, ready}, sorted by pubDate asc
 * (entries with no pubDate sort to the end).
 */
export function getQueue() {
  const rows = readCalendar();
  const qd = rows.filter(r => ['queued', 'drafted', 'ready'].includes(r.status));
  qd.sort((a, b) => {
    const ad = a.pubDate || '9999-99-99';
    const bd = b.pubDate || '9999-99-99';
    return ad.localeCompare(bd);
  });
  return qd;
}

/**
 * Slugify a title the way blog-first posts conventionally do: lowercase,
 * hyphens for spaces, strip non-alphanumeric (preserve hyphens), collapse
 * consecutive hyphens.
 */
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')             // strip apostrophes (curly + straight)
    .replace(/[^a-z0-9]+/g, '-')      // anything else → hyphen
    .replace(/^-+|-+$/g, '')          // strip leading/trailing hyphens
    .replace(/-{2,}/g, '-');          // collapse consecutive hyphens
}

/**
 * Locate the canonical draft markdown file for a given slug, scanning the
 * product repo's drafts dir. Returns absolute path or null. Per the skill
 * v0.12 filename-convention discipline: prefer {slug}.md (PM's working
 * copy) over draft-{slug}.md (Comms's earlier draft).
 */
export function findDraftFile(slug) {
  const draftsDir = path.resolve(REPO_ROOT, '..', 'piper-morgan-product', 'docs', 'public', 'comms', 'drafts');
  if (!fs.existsSync(draftsDir)) return null;
  const candidates = [
    `${slug}.md`,
    `draft-${slug}.md`,
    `draft-${slug}-insight.md`,
    `draft-${slug}-building.md`,
  ];
  for (const c of candidates) {
    const full = path.join(draftsDir, c);
    if (fs.existsSync(full)) return full;
  }
  // Fallback: scan dir for any file matching {slug} or draft-{slug} pattern
  const files = fs.readdirSync(draftsDir);
  const match = files.find(f =>
    f.endsWith('.md') &&
    (f === `${slug}.md` ||
     f.startsWith(`draft-${slug}`) ||
     f.includes(slug))
  );
  return match ? path.join(draftsDir, match) : null;
}

/**
 * Find the image file most likely associated with a draft. Looks in the same
 * directory as the draft for PNG/JPG/JPEG files whose name contains the slug
 * or matches the draft's basename. Returns absolute path or null.
 */
export function findImageForDraft(draftPath, slug) {
  if (!draftPath) return null;
  const dir = path.dirname(draftPath);
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
  // Heuristics in order of preference
  const heuristics = [
    f => f.toLowerCase() === `${slug}.png`,
    f => f.toLowerCase() === `${slug}.jpg` || f.toLowerCase() === `${slug}.jpeg`,
    f => f.toLowerCase().startsWith(slug.toLowerCase()),
    f => f.toLowerCase().includes(slug.toLowerCase()),
  ];
  for (const h of heuristics) {
    const match = files.find(h);
    if (match) return path.join(dir, match);
  }
  return null;
}

/**
 * Map calendar theme to publish-post.js category. They're the same vocabulary
 * (building / insight / ship) but the mapping is centralized here in case
 * they ever diverge.
 */
export function themeToCategory(theme) {
  if (!['building', 'insight', 'ship'].includes(theme)) {
    throw new Error(`Unknown calendar theme: "${theme}". Expected building, insight, or ship.`);
  }
  return theme;
}
