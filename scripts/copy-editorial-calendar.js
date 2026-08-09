#!/usr/bin/env node

/**
 * copy-editorial-calendar.js — Prebuild step.
 *
 * Copies the canonical editorial-calendar.csv from the product repo into the
 * website repo's data/ directory so build-time pages (e.g. /admin/publish-queue,
 * /admin/calendar) can read it.
 *
 * Two source strategies, tried in order:
 *  1. GitHub Contents API (GITHUB_DRAFT_TOKEN) — preferred. This is the same
 *     mechanism already proven in production by the /admin/calendar
 *     runtime-read fix (2026-07-29); it doesn't depend on any assumption
 *     about the on-disk layout around this checkout.
 *  2. Local sibling checkout (../piper-morgan-product/...) — fallback for
 *     the classic side-by-side dev layout, when no token is configured.
 *
 * Why the API is preferred over the sibling path-walk (2026-08-09, per Docs
 * ruling on #web-jul29-worktree-sibling-path-bug): Model A worktrees
 * (../piper-morgan-website-worktrees/{role}, ../piper-morgan-worktrees/{role})
 * are stable per-agent paths, not a fixed relative layout — a path-walk that
 * happens to resolve today breaks silently the next time worktree
 * provisioning changes shape, and nobody would notice until a publish hit it
 * mid-flow. It previously ran first, so a worktree checkout with no sibling
 * directory fell through to the API anyway, but only by accident of
 * fs.existsSync() returning false — any on-disk coincidence at that path
 * (e.g. a differently-shaped clone) would have shadowed the API silently.
 * Trying the already-battle-tested mechanism first removes that dependency
 * entirely instead of relying on the fallback to fail correctly.
 *
 * Skips with warning (does not fail) only if BOTH are unavailable — deploys
 * without either the token or a sibling checkout still succeed; the admin
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

  const remote = await fetchViaGitHubApi();
  if (remote !== null) {
    fs.writeFileSync(DEST, remote, 'utf-8');
    console.log(`✅ Copied editorial-calendar.csv (${remote.length} bytes, GitHub API) → ${path.relative(REPO_ROOT, DEST)}`);
    return;
  }

  if (fs.existsSync(SRC)) {
    fs.copyFileSync(SRC, DEST);
    const stat = fs.statSync(DEST);
    console.log(`✅ Copied editorial-calendar.csv (${stat.size} bytes, local sibling checkout fallback — no GITHUB_DRAFT_TOKEN) → ${path.relative(REPO_ROOT, DEST)}`);
    return;
  }

  console.warn(`⚠️  editorial-calendar.csv unavailable (no GITHUB_DRAFT_TOKEN or fetch failed, and no sibling checkout at ${SRC}) — skipping copy.`);
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
