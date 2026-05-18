/**
 * calendar-mutations.js — engine module for editorial-calendar.csv writes.
 *
 * IMPORTANT: this module is currently SCOPED NARROWLY to the
 * mark-ready-for-later flow (CLI B's R-path per yesterday's resolved
 * design decision #3). All canonical calendar updates at publish time and
 * after syndication still flow through the `/update-calendar` skill in the
 * product repo — per skill v0.11+'s explicit mandate that hand-editing
 * editorial-calendar.csv has produced field-count drift + unescaped-comma
 * bugs.
 *
 * What this module does:
 * - markReady(slug, pubDate?): flip a row's status to "ready", optionally
 *   stamp pubDate if not already set. Validates row exists; aborts on
 *   field-count drift (per Docs's 5/18 feedback signal — fail loud).
 *
 * What this module does NOT do:
 * - Status flips to "published" at publish time (use /update-calendar)
 * - Syndication URL backfill (use /update-calendar)
 * - Any multi-field mutation beyond mark-ready
 *
 * Per the three-layer architecture: keep shells thin, engine grows. CLI B
 * (and future Web GUI v2) call this; agents needing other calendar
 * mutations go through the skill.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const LIVE_CALENDAR = path.resolve(REPO_ROOT, '..', 'piper-morgan-product', 'docs', 'internal', 'planning', 'comms', 'editorial-calendar.csv');

const EXPECTED_COLS = 18;

/**
 * CSV field-aware split — respects quoted fields with embedded commas.
 * Mirrors the parser in queue.js (which see for reference).
 */
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
 * Serialize a single field for CSV: quote if it contains a comma, newline,
 * or quote char; escape internal quotes by doubling.
 */
function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/**
 * Mark a calendar row as ready for later publish. Used by CLI B's R-path
 * (per yesterday's resolved design decision #3): PM does final edits today,
 * but actual publish is later — mark ready, walk away, come back tomorrow.
 *
 * If pubDate is provided AND the row's pubDate is currently empty, also
 * stamp it (lets PM schedule when marking ready). If pubDate is provided
 * AND the row already has a different pubDate, the row's existing pubDate
 * is preserved — caller should warn in that case (or pass `--force-pubDate`,
 * which this module doesn't support — by design — to avoid silent overwrites).
 *
 * Returns: { ok: boolean, rowsFound: number, changes: string[] }
 *   - changes is a human-readable list of what got written (for prompt display)
 *
 * Throws: if the calendar isn't found, or if the row's field count drifts.
 */
export function markReady(titleOrSlug, opts = {}) {
  if (!fs.existsSync(LIVE_CALENDAR)) {
    throw new Error(`Calendar not found at ${LIVE_CALENDAR}`);
  }
  const text = fs.readFileSync(LIVE_CALENDAR, 'utf-8');
  const lines = text.split('\n');
  const headers = parseCsvRow(lines[0]).map(h => h.trim());
  const titleCol = headers.indexOf('title');
  const statusCol = headers.indexOf('status');
  const pubDateCol = headers.indexOf('pubDate');
  const blogPathCol = headers.indexOf('blogPath');
  if (titleCol < 0 || statusCol < 0) {
    throw new Error('Calendar missing required title / status columns');
  }

  // Match either by title (exact) or by deriving slug from title. Calendar
  // doesn't store slug as a column; we match on title.
  const matchTitle = (t) => t.trim() === titleOrSlug.trim();

  const newLines = [lines[0]];
  let rowsFound = 0;
  const changes = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) { newLines.push(line); continue; }
    const fields = parseCsvRow(line);
    if (fields.length !== EXPECTED_COLS) {
      throw new Error(`Calendar row ${i + 1} has ${fields.length} fields, expected ${EXPECTED_COLS}. Fail loud per Docs's 5/18 escape-precondition signal — manual fix needed.`);
    }
    if (!matchTitle(fields[titleCol])) { newLines.push(line); continue; }
    rowsFound++;
    // Apply mutations
    const oldStatus = fields[statusCol];
    if (oldStatus !== 'ready') {
      fields[statusCol] = 'ready';
      changes.push(`status: ${oldStatus} → ready`);
    }
    if (opts.pubDate && !fields[pubDateCol]) {
      fields[pubDateCol] = opts.pubDate;
      changes.push(`pubDate: (unset) → ${opts.pubDate}`);
    }
    newLines.push(fields.map(csvEscape).join(','));
  }

  if (rowsFound === 0) {
    return { ok: false, rowsFound: 0, changes: [], reason: `No calendar row found with title "${titleOrSlug}"` };
  }
  if (rowsFound > 1) {
    // Multiple matches — abort without writing, caller should disambiguate
    return { ok: false, rowsFound, changes: [], reason: `Multiple (${rowsFound}) calendar rows match title "${titleOrSlug}" — manual disambiguation needed` };
  }
  if (changes.length === 0) {
    return { ok: true, rowsFound: 1, changes: [], noop: true };
  }

  fs.writeFileSync(LIVE_CALENDAR, newLines.join('\n'), 'utf-8');
  return { ok: true, rowsFound: 1, changes };
}
