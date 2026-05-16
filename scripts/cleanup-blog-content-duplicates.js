#!/usr/bin/env node

/**
 * Cleanup: remove RSS-syndication duplicate entries from blog-content.json.
 *
 * Background: fetch-blog-posts.js previously wrote RSS posts to
 * blog-content.json keyed by their Medium hashId, even when the slug already
 * belonged to a blog-first canonical entry under a different hashId. Result:
 * 23 duplicate-title pairs and ~31 "fat" RSS-style entries that are never
 * looked up by the site (medium-posts.json points to the blog-first hashId).
 *
 * This script removes any fat entry (has canonicalLink) whose slug — extracted
 * from canonicalLink — matches the slug of a blog-first post in
 * medium-posts.json. Standalone RSS-only fat entries (no blog-first
 * counterpart) are preserved; they're the canonical content for RSS-only
 * posts.
 *
 * Idempotent. Safe to re-run.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_CONTENT_PATH = path.join(__dirname, '..', 'src/data/blog-content.json');
const MEDIUM_POSTS_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');

function extractSlugFromMediumUrl(url) {
  if (!url) return null;
  // Match the slug portion of canonical Medium URLs:
  //   https://medium.com/building-piper-morgan/{slug}-{12-hex}?source=...
  const m = url.match(/\/([a-z0-9-]+)-[a-f0-9]{12}(?:[?#/]|$)/i);
  return m ? m[1] : null;
}

console.log('🧹 BLOG-CONTENT.JSON DUPLICATE CLEANUP\n');
console.log('======================================\n');

const blogContent = JSON.parse(fs.readFileSync(BLOG_CONTENT_PATH, 'utf-8'));
const mediumPosts = JSON.parse(fs.readFileSync(MEDIUM_POSTS_PATH, 'utf-8'));

console.log(`📊 blog-content.json: ${Object.keys(blogContent).length} entries`);
console.log(`📊 medium-posts.json: ${mediumPosts.length} posts\n`);

// Build set of slugs claimed by blog-first canonical posts
const blogFirstSlugs = new Set();
mediumPosts.forEach(p => {
  if (p.guid && p.guid.startsWith('blog-first-') && p.slug) {
    blogFirstSlugs.add(p.slug);
  }
});
console.log(`🌐 Blog-first canonical slugs: ${blogFirstSlugs.size}\n`);

// Classify entries
const toRemove = [];
const toKeep = {};
let fatCount = 0;
let minimalCount = 0;
let fatStandaloneCount = 0;

for (const [hashId, entry] of Object.entries(blogContent)) {
  // Minimal blog-first-style entries: {title, content} (or +subtitle). Always keep.
  const isFat = entry && typeof entry === 'object' && 'canonicalLink' in entry;
  if (!isFat) {
    minimalCount++;
    toKeep[hashId] = entry;
    continue;
  }

  fatCount++;
  const slug = extractSlugFromMediumUrl(entry.canonicalLink);

  if (slug && blogFirstSlugs.has(slug)) {
    // Fat entry is a syndication duplicate of a blog-first canonical
    toRemove.push({ hashId, slug, title: entry.title || '(untitled)' });
  } else {
    // Fat entry is standalone (no blog-first counterpart) — preserve
    fatStandaloneCount++;
    toKeep[hashId] = entry;
  }
}

console.log('📋 Entry classification:');
console.log(`   - Minimal (blog-first style): ${minimalCount}  → keep all`);
console.log(`   - Fat (RSS-style with canonicalLink): ${fatCount}`);
console.log(`     - Syndication duplicates of blog-first: ${toRemove.length}  → remove`);
console.log(`     - Standalone (no blog-first counterpart): ${fatStandaloneCount}  → keep\n`);

if (toRemove.length === 0) {
  console.log('✨ Nothing to remove. blog-content.json is already clean.\n');
  process.exit(0);
}

console.log('🗑️  Removing:');
toRemove.forEach(r => {
  console.log(`   - ${r.hashId}  slug="${r.slug}"  "${r.title.substring(0, 50)}..."`);
});
console.log();

fs.writeFileSync(BLOG_CONTENT_PATH, JSON.stringify(toKeep, null, 2), 'utf-8');

console.log('📊 Summary:');
console.log(`   - Before: ${Object.keys(blogContent).length} entries`);
console.log(`   - After:  ${Object.keys(toKeep).length} entries`);
console.log(`   - Removed: ${toRemove.length} syndication duplicates\n`);
console.log('✅ Saved cleaned blog-content.json\n');
