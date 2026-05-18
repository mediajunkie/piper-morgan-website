#!/usr/bin/env node

/**
 * cleanup-medium-posts-duplicates.js — One-shot audit-and-remove for
 * syndication duplicates in medium-posts.json.
 *
 * Background: fetch-blog-posts.js's slug-skip logic relied on exact-match
 * slug equality, but blog-first uses short hand-chosen slugs while Medium
 * auto-derives long title-slugs. Result: each blog-first post's Medium-
 * syndicated RSS copy slipped past the skip and became a parallel card on
 * /blog/. Today's fetch fix (calendar-hashId match) prevents future
 * accumulation; this script cleans up the historical ones.
 *
 * Algorithm (mirrors the fetch fix):
 *   1. Parse data/editorial-calendar.csv for rows where both blogPath and
 *      mediumURL are populated. Extract the Medium hashId from each
 *      mediumURL — that's a "known syndicated" hashId.
 *   2. Load medium-posts.json. For each post whose hashId is in the
 *      known-syndicated set AND that is NOT itself a blog-first entry,
 *      mark for removal.
 *   3. Default: print the audit and exit (audit-before-delete).
 *   4. With --apply: remove the marked entries, quarantine them to
 *      medium-posts.json.quarantine.json, save the cleaned medium-posts.json.
 *
 * Idempotent. Safe to re-run after --apply.
 *
 * Usage:
 *   node scripts/cleanup-medium-posts-duplicates.js          # audit only
 *   node scripts/cleanup-medium-posts-duplicates.js --apply  # remove + quarantine
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const POSTS_PATH = path.join(REPO_ROOT, 'src/data/medium-posts.json');
const CALENDAR_PATH = path.join(REPO_ROOT, 'data/editorial-calendar.csv');
const QUARANTINE_PATH = path.join(REPO_ROOT, 'src/data/medium-posts.json.quarantine.json');

const apply = process.argv.includes('--apply');

function parseCsvRow(row) {
  const fields = [];
  let cur = '', inQ = false;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (c === '"') inQ = !inQ;
    else if (c === ',' && !inQ) { fields.push(cur); cur = ''; }
    else cur += c;
  }
  fields.push(cur);
  return fields;
}

function extractPostId(s) {
  if (!s) return null;
  const m = s.match(/([a-f0-9]{12})/i);
  return m ? m[1].toLowerCase() : null;
}

console.log('🧹 MEDIUM-POSTS.JSON SYNDICATION-DUPLICATE CLEANUP\n');
console.log('==================================================\n');

// Load calendar
if (!fs.existsSync(CALENDAR_PATH)) {
  console.error(`❌ ${CALENDAR_PATH} not found. Run prebuild first (copies calendar from product repo).`);
  process.exit(2);
}
const calText = fs.readFileSync(CALENDAR_PATH, 'utf-8');
const calLines = calText.split('\n');
const headers = calLines[0].split(',').map(h => h.trim());
const blogPathCol = headers.indexOf('blogPath');
const mediumUrlCol = headers.indexOf('mediumURL');
const titleCol = headers.indexOf('title');
if (blogPathCol < 0 || mediumUrlCol < 0) {
  console.error('❌ editorial-calendar.csv missing blogPath or mediumURL column');
  process.exit(2);
}

// Calendar map: mediumHashId → { blogPath, title } for rows with BOTH populated.
// These are the candidates for "this Medium post might be a syndication
// duplicate of a blog-first canonical at blogPath."
const calendarMap = new Map();
for (let i = 1; i < calLines.length; i++) {
  const row = calLines[i];
  if (!row.trim()) continue;
  const fields = parseCsvRow(row);
  const blogPath = (fields[blogPathCol] || '').trim();
  const mediumURL = (fields[mediumUrlCol] || '').trim();
  if (!blogPath || !mediumURL) continue;
  const hashId = extractPostId(mediumURL);
  if (hashId) calendarMap.set(hashId, { blogPath, title: (fields[titleCol] || '').trim() });
}

console.log(`📅 Calendar reports ${calendarMap.size} entries with both blogPath + mediumURL\n`);

// Load posts
const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf-8'));
console.log(`📊 medium-posts.json: ${posts.length} posts\n`);

// Build set of blog-first slugs that actually exist in medium-posts.json.
// A Medium-origin entry is only a duplicate if there's a SEPARATE
// blog-first entry already serving the same slug. Pre-blog-first posts
// have a calendar row with both blogPath + mediumURL but no separate
// blog-first entry — those stay (the Medium-imported entry IS the canonical).
const blogFirstSlugs = new Set();
for (const post of posts) {
  if (post.guid && post.guid.startsWith('blog-first-') && post.slug) {
    blogFirstSlugs.add(post.slug);
  }
}
console.log(`🌐 Blog-first canonical slugs in medium-posts.json: ${blogFirstSlugs.size}\n`);

const toRemove = [];
const toKeep = [];

for (const post of posts) {
  const isBlogFirst = post.guid && post.guid.startsWith('blog-first-');
  const hashId = extractPostId(post.guid || post.link || '');
  // A post is a syndication duplicate if ALL of:
  //  - It is NOT a blog-first entry (blog-first stays — they ARE the canonicals)
  //  - Its hashId is in the calendar's blogPath+mediumURL set
  //  - The calendar's blogPath derives to a slug that IS in the blog-first
  //    slug set — i.e., a separate blog-first entry already exists for this post
  let isDup = false;
  let calEntry = null;
  if (!isBlogFirst && hashId && calendarMap.has(hashId)) {
    calEntry = calendarMap.get(hashId);
    // Derive expected slug from blogPath like "/blog/archaeological-debugging"
    const m = calEntry.blogPath.match(/^\/(?:blog|shipping-news)\/([^/?#]+)/);
    const derivedSlug = m ? m[1] : null;
    if (derivedSlug && blogFirstSlugs.has(derivedSlug)) {
      isDup = true;
    }
  }
  if (isDup) {
    toRemove.push({ post, hashId, calendarTitle: calEntry.title, blogPath: calEntry.blogPath });
  } else {
    toKeep.push(post);
  }
}

if (toRemove.length === 0) {
  console.log('✨ No syndication duplicates found in medium-posts.json. Clean.\n');
  process.exit(0);
}

console.log(`🔍 Found ${toRemove.length} syndication-duplicate entries to remove:\n`);
toRemove.forEach((r, i) => {
  console.log(`  [${i + 1}] hashId: ${r.hashId}`);
  console.log(`      title (from cache):    "${(r.post.title || '').substring(0, 70)}"`);
  console.log(`      title (from calendar): "${(r.calendarTitle || '').substring(0, 70)}"`);
  console.log(`      cached slug:           ${JSON.stringify(r.post.slug)}`);
  console.log(`      cached url:            ${(r.post.url || '').substring(0, 80)}`);
  console.log();
});

if (!apply) {
  console.log('────────────────────────────────────────────────────');
  console.log(`📋 AUDIT ONLY — no files modified.`);
  console.log(`   To apply: node scripts/cleanup-medium-posts-duplicates.js --apply`);
  console.log(`   Will quarantine removed entries to:`);
  console.log(`     ${path.relative(REPO_ROOT, QUARANTINE_PATH)}`);
  console.log('────────────────────────────────────────────────────\n');
  process.exit(0);
}

// Apply: quarantine + save
const quarantine = {
  removedAt: new Date().toISOString(),
  reason: 'Syndication duplicate of a blog-first canonical, per editorial-calendar.csv blog-first→Medium correspondence. Removed by scripts/cleanup-medium-posts-duplicates.js.',
  entries: toRemove.map(r => ({ ...r.post, _quarantine_hashId: r.hashId, _quarantine_calendar_title: r.calendarTitle })),
};

// Append-or-create quarantine (preserve prior quarantines if re-run after the same cleanup elsewhere)
let priorQuarantine = { batches: [] };
if (fs.existsSync(QUARANTINE_PATH)) {
  try {
    const prior = JSON.parse(fs.readFileSync(QUARANTINE_PATH, 'utf-8'));
    if (prior && Array.isArray(prior.batches)) priorQuarantine = prior;
  } catch (e) {
    console.warn(`  ⚠️  Could not parse existing quarantine file; starting fresh: ${e.message}`);
  }
}
priorQuarantine.batches.push(quarantine);

fs.writeFileSync(QUARANTINE_PATH, JSON.stringify(priorQuarantine, null, 2), 'utf-8');
fs.writeFileSync(POSTS_PATH, JSON.stringify(toKeep, null, 2), 'utf-8');

console.log(`✅ Quarantined ${toRemove.length} entries to ${path.relative(REPO_ROOT, QUARANTINE_PATH)}`);
console.log(`✅ Wrote cleaned medium-posts.json: ${toKeep.length} posts (was ${posts.length})`);
console.log(`\n✨ Done.\n`);
