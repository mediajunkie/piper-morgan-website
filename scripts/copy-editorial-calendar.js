#!/usr/bin/env node

/**
 * copy-editorial-calendar.js — Prebuild step.
 *
 * Copies the canonical editorial-calendar.csv from the product repo into the
 * website repo's data/ directory so build-time pages (e.g. /admin/publish-queue)
 * can read it.
 *
 * Cross-repo path: ../piper-morgan-product/docs/internal/planning/comms/editorial-calendar.csv
 * → data/editorial-calendar.csv
 *
 * Skips with warning (does not fail) if the source isn't present — deploys
 * without a sibling product-repo checkout still succeed; the admin page just
 * shows "(source unavailable)" rows.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(REPO_ROOT, '..', 'piper-morgan-product', 'docs', 'internal', 'planning', 'comms', 'editorial-calendar.csv');
const DEST_DIR = path.join(REPO_ROOT, 'data');
const DEST = path.join(DEST_DIR, 'editorial-calendar.csv');

if (!fs.existsSync(SRC)) {
  console.warn(`⚠️  editorial-calendar.csv not found at ${SRC} — skipping copy.`);
  console.warn(`   The /admin/publish-queue page will render with placeholder data.`);
  // Touch an empty placeholder so the page builds without import errors
  if (!fs.existsSync(DEST)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
    fs.writeFileSync(DEST, 'title,theme,status,workDate,endWorkDate,pubDate,mediumURL,liPubDate,linkedinURL,canonicalSite,blogURL,blogPath,cartoon,chatDate,draftPath,notes,altText,caption\n', 'utf-8');
    console.warn(`   Wrote empty header-only placeholder to ${path.relative(REPO_ROOT, DEST)}`);
  }
  process.exit(0);
}

fs.mkdirSync(DEST_DIR, { recursive: true });
fs.copyFileSync(SRC, DEST);
const stat = fs.statSync(DEST);
console.log(`✅ Copied editorial-calendar.csv (${stat.size} bytes) → ${path.relative(REPO_ROOT, DEST)}`);
