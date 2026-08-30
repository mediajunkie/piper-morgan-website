#!/usr/bin/env node

/**
 * check-hero-image-refs.js — #1669
 *
 * Catches the exact drift class that produced two live 404 hero images
 * (Ship #054, #056 — fixed 2026-08-19, `8801bfb`): a frontmatter/content
 * image reference pointing at the source draft's pre-conversion filename
 * (.png) instead of the deployed ${slug}.webp file publish-post.js
 * actually produces. Nothing else in the build/publish pipeline validates
 * that a referenced image path resolves to a real deployed file, so this
 * class of bug ships silently and is only caught by someone hitting the
 * live 404.
 *
 * Checks BOTH places a hero-image reference can live (confirmed by
 * tracing the actual historical bug, not guessed):
 *   1. src/data/medium-posts.json — structured `featuredImage`/`thumbnail`
 *      fields, consumed directly by page templates (e.g. blog/page.tsx).
 *   2. src/data/blog-content.json — the historical bug's real location:
 *      an <img src="/assets/blog-images/...."> embedded directly in a
 *      post's rendered HTML `content` string, keyed by hashId.
 *
 * External URLs (http/https — legitimate for older Medium-hosted images
 * that predate the local hero-image pipeline) are deliberately skipped;
 * only local /assets/blog-images/ references are checked against what's
 * actually deployed in public/assets/blog-images/.
 *
 * Exit 0 = every local reference resolves. Exit 1 = at least one doesn't,
 * printed with enough context (post/hashId, field, path) to fix directly.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const POSTS_PATH = path.join(ROOT, 'src/data/medium-posts.json');
const CONTENT_PATH = path.join(ROOT, 'src/data/blog-content.json');
const IMAGES_DIR = path.join(ROOT, 'public/assets/blog-images');

const LOCAL_PREFIX = '/assets/blog-images/';
const IMG_TAG_PATTERN = /blog-images\/([a-zA-Z0-9_.-]+\.(?:png|webp|jpe?g|gif|svg))/g;

function isExternal(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url);
}

function localFilename(refPath) {
  if (refPath.startsWith(LOCAL_PREFIX)) return refPath.slice(LOCAL_PREFIX.length);
  return path.basename(refPath);
}

function main() {
  const existing = new Set(fs.readdirSync(IMAGES_DIR));
  const broken = [];
  let localChecked = 0;
  let externalSkipped = 0;

  // 1. medium-posts.json structured fields
  const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf-8'));
  for (const post of posts) {
    for (const field of ['featuredImage', 'thumbnail']) {
      const val = post[field];
      if (!val) continue;
      if (isExternal(val)) { externalSkipped++; continue; }
      localChecked++;
      const fname = localFilename(val);
      if (!existing.has(fname)) {
        broken.push({
          source: 'medium-posts.json',
          id: post.slug || post.guid || post.title,
          field,
          ref: val,
        });
      }
    }
  }

  // 2. blog-content.json embedded <img> references
  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8'));
  for (const [hashId, entry] of Object.entries(content)) {
    const html = entry?.content || '';
    for (const match of html.matchAll(IMG_TAG_PATTERN)) {
      const fname = match[1];
      localChecked++;
      if (!existing.has(fname)) {
        broken.push({
          source: 'blog-content.json',
          id: `${hashId} (${(entry.title || '').slice(0, 50)})`,
          field: 'content (embedded <img>)',
          ref: fname,
        });
      }
    }
  }

  console.log(`check-hero-image-refs: ${localChecked} local reference(s) checked, ${externalSkipped} external URL(s) skipped, ${existing.size} file(s) in ${path.relative(ROOT, IMAGES_DIR)}`);

  if (broken.length === 0) {
    console.log('check-hero-image-refs: OK — every local hero-image reference resolves to a deployed file.');
    process.exit(0);
  }

  console.error(`\ncheck-hero-image-refs: ${broken.length} BROKEN reference(s) — would 404 live:\n`);
  for (const b of broken) {
    console.error(`  [${b.source}] ${b.id}\n    ${b.field}: "${b.ref}" — no matching file in ${path.relative(ROOT, IMAGES_DIR)}\n`);
  }
  process.exit(1);
}

main();
