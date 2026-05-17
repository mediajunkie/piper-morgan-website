#!/usr/bin/env node

/**
 * validate-blog-content.js — Invariant checks on blog-content.json.
 *
 * Catches regression of the syndication-duplicate class (fixed today in
 * 381ba0026) and adjacent shape issues. Exits non-zero if any invariant
 * fails. Safe to wire into prebuild later if we want hard CI gating.
 *
 * Checks:
 *  1. blog-content.json parses as JSON
 *  2. Every value is a dict with a non-empty title and non-empty content
 *     (no bare-string entries — the v0.8 schema requires the dict shape)
 *  3. No slug appears in two "fat" entries (entries with canonicalLink).
 *     This is the syndication-duplicate class from earlier today.
 *  4. No fat entry's slug (extracted from canonicalLink) matches a
 *     blog-first canonical slug in medium-posts.json. If this fails, a
 *     syndication duplicate has snuck back in and updateBlogContent's
 *     skip logic has regressed.
 *  5. Every blog-first slug in medium-posts.json has a blog-content.json
 *     entry under its hashId (otherwise the post page 404s).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const BLOG_CONTENT_PATH = path.join(REPO_ROOT, 'src/data/blog-content.json');
const MEDIUM_POSTS_PATH = path.join(REPO_ROOT, 'src/data/medium-posts.json');

const violations = [];
function fail(msg) { violations.push(msg); }

function extractSlugFromCanonical(url) {
  if (!url) return null;
  const m = url.match(/\/([a-z0-9-]+)-[a-f0-9]{12}(?:[?#/]|$)/i);
  return m ? m[1] : null;
}

// Check 1: parses
let bc, posts;
try {
  bc = JSON.parse(fs.readFileSync(BLOG_CONTENT_PATH, 'utf-8'));
} catch (e) {
  console.error(`❌ FATAL: blog-content.json failed to parse: ${e.message}`);
  process.exit(2);
}
try {
  posts = JSON.parse(fs.readFileSync(MEDIUM_POSTS_PATH, 'utf-8'));
} catch (e) {
  console.error(`❌ FATAL: medium-posts.json failed to parse: ${e.message}`);
  process.exit(2);
}

// Check 2: every entry is a dict with title + content
for (const [hashId, entry] of Object.entries(bc)) {
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
    fail(`entry ${hashId}: value must be a dict (got ${Array.isArray(entry) ? 'array' : typeof entry})`);
    continue;
  }
  if (typeof entry.title !== 'string' || entry.title.length === 0) {
    fail(`entry ${hashId}: missing or empty title`);
  }
  if (typeof entry.content !== 'string' || entry.content.length === 0) {
    fail(`entry ${hashId}: missing or empty content`);
  }
}

// Check 3: no slug appears in two fat entries
const fatSlugToHashIds = new Map();
for (const [hashId, entry] of Object.entries(bc)) {
  if (!entry || typeof entry !== 'object') continue;
  if (!('canonicalLink' in entry)) continue;
  const slug = extractSlugFromCanonical(entry.canonicalLink);
  if (!slug) continue;
  if (!fatSlugToHashIds.has(slug)) fatSlugToHashIds.set(slug, []);
  fatSlugToHashIds.get(slug).push(hashId);
}
for (const [slug, hashIds] of fatSlugToHashIds) {
  if (hashIds.length > 1) {
    fail(`fat-entry duplicate slug "${slug}" appears in ${hashIds.length} entries: ${hashIds.join(', ')}`);
  }
}

// Check 4: no fat entry's slug matches a blog-first canonical slug
const blogFirstSlugs = new Set();
const blogFirstHashIdBySlug = new Map();
for (const p of posts) {
  if (p.guid && p.guid.startsWith('blog-first-') && p.slug) {
    blogFirstSlugs.add(p.slug);
    const bfHash = p.guid.slice('blog-first-'.length);
    blogFirstHashIdBySlug.set(p.slug, bfHash);
  }
}
for (const [slug, hashIds] of fatSlugToHashIds) {
  if (blogFirstSlugs.has(slug)) {
    fail(`fat-entry syndication-duplicate: slug "${slug}" matches blog-first canonical (blog-first hashId: ${blogFirstHashIdBySlug.get(slug)}, fat hashId: ${hashIds.join(',')}). updateBlogContent skip logic may have regressed.`);
  }
}

// Check 5: every blog-first post has a blog-content.json entry
for (const p of posts) {
  if (!p.guid || !p.guid.startsWith('blog-first-')) continue;
  const bfHash = p.guid.slice('blog-first-'.length);
  // Ships may not have content; per skill, ship posts may publish without a blog-content.json entry
  if (p.category === 'ship') continue;
  if (!(bfHash in bc)) {
    fail(`blog-first post "${p.slug}" (hashId=${bfHash}) has no blog-content.json entry`);
  }
}

if (violations.length > 0) {
  console.error(`❌ ${violations.length} blog-content.json violation(s):`);
  violations.forEach(v => console.error(`   - ${v}`));
  process.exit(1);
}

console.log(`✅ blog-content.json: ${Object.keys(bc).length} entries, all invariants pass.`);
console.log(`   - blog-first canonicals: ${blogFirstSlugs.size}`);
console.log(`   - fat (RSS-style) entries: ${fatSlugToHashIds.size}`);
process.exit(0);
