#!/usr/bin/env node

/**
 * copy-editorial-calendar.js — Prebuild step.
 *
 * Copies the canonical editorial-calendar.csv from the product repo into the
 * website repo's data/ directory so build-time pages (e.g. /admin/publish-queue,
 * /admin/calendar) can read it.
 *
 * Two source strategies, tried in order:
 *  1. Local sibling checkout (../piper-morgan-product/...) — used in dev, where
 *     a developer/agent has both repos checked out side by side.
 *  2. GitHub Contents API (GITHUB_DRAFT_TOKEN) — used on Vercel and CI, which
 *     have no sibling checkout. Without this, deploys would silently keep
 *     whatever data/editorial-calendar.csv was last committed — stale until
 *     someone happened to rebuild locally and commit the result (discovered
 *     2026-07-16: a full day of published posts/ships missing from the admin
 *     UI because of exactly this).
 *
 * Skips with warning (does not fail) only if BOTH are unavailable — deploys
 * without either a sibling checkout or the token still succeed; the admin
 * pages just show "(source unavailable)" rows.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const CALENDAR_REL_PATH = 'docs/internal/planning/comms/editorial-calendar.csv';
const SRC = path.resolve(REPO_ROOT, '..', 'piper-morgan-product', ...CALENDAR_REL_PATH.split('/'));
const DEST_DIR = path.join(REPO_ROOT, 'data');
const DEST = path.join(DEST_DIR, 'editorial-calendar.csv');

async function fetchViaGitHubApi() {
  const token = process.env.GITHUB_DRAFT_TOKEN;
  if (!token) return null;

  const owner = process.env.GITHUB_DRAFT_OWNER || 'mediajunkie';
  const repo = process.env.GITHUB_DRAFT_REPO || 'piper-morgan-product';
  const branch = process.env.GITHUB_DRAFT_BRANCH || 'main';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${CALENDAR_REL_PATH}?ref=${encodeURIComponent(branch)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!res.ok) {
    console.warn(`⚠️  GitHub API fetch for editorial-calendar.csv failed (HTTP ${res.status}) — falling back.`);
    return null;
  }
  const data = await res.json();
  if (typeof data.content !== 'string' || data.encoding !== 'base64') {
    console.warn('⚠️  Unexpected GitHub contents response shape for editorial-calendar.csv — falling back.');
    return null;
  }
  return Buffer.from(data.content, 'base64').toString('utf-8');
}

async function main() {
  fs.mkdirSync(DEST_DIR, { recursive: true });

  if (fs.existsSync(SRC)) {
    fs.copyFileSync(SRC, DEST);
    const stat = fs.statSync(DEST);
    console.log(`✅ Copied editorial-calendar.csv (${stat.size} bytes, local sibling checkout) → ${path.relative(REPO_ROOT, DEST)}`);
    return;
  }

  const remote = await fetchViaGitHubApi();
  if (remote !== null) {
    fs.writeFileSync(DEST, remote, 'utf-8');
    console.log(`✅ Copied editorial-calendar.csv (${remote.length} bytes, GitHub API) → ${path.relative(REPO_ROOT, DEST)}`);
    return;
  }

  console.warn(`⚠️  editorial-calendar.csv unavailable (no sibling checkout at ${SRC}, no GITHUB_DRAFT_TOKEN, or fetch failed) — skipping copy.`);
  console.warn(`   Admin pages will render with placeholder or stale data.`);
  if (!fs.existsSync(DEST)) {
    fs.writeFileSync(DEST, 'title,theme,status,workDate,endWorkDate,pubDate,mediumURL,liPubDate,linkedinURL,canonicalSite,blogURL,blogPath,cartoon,chatDate,draftPath,notes,altText,caption\n', 'utf-8');
    console.warn(`   Wrote empty header-only placeholder to ${path.relative(REPO_ROOT, DEST)}`);
  }
}

main().catch(err => {
  console.error('❌ copy-editorial-calendar.js failed:', err);
  process.exit(1);
});
