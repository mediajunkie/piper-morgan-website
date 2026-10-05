/**
 * Compose UI API — list, read, and save editorial drafts.
 *
 * Two storage modes, selected by environment:
 *  - GitHub mode (GITHUB_DRAFT_TOKEN set — the deployed/Vercel path): drafts
 *    are read from and committed to piper-morgan-product via the GitHub
 *    Contents API. Saves use the file SHA for optimistic concurrency.
 *  - Filesystem mode (no token — local dev): drafts live in the sibling
 *    piper-morgan-product checkout; saves write the file and best-effort
 *    git-commit it. Set PIPER_PRODUCT_ROOT to override sibling resolution.
 *
 * GET  /api/compose         → list non-published drafts
 * GET  /api/compose?slug=x  → read draft content + frontmatter (+ sha in GitHub mode)
 * POST /api/compose?slug=x  → save draft (body: { image, alt, caption, body, sha? })
 * POST /api/compose?slug=x&action=title → rename the calendar row's title (body: { title })
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { loadCalendarLive, invalidateLiveCalendar, CALENDAR_REL_PATH, CalendarEntry } from '@/lib/editorial-calendar';
import { setCalendarTitle } from '@/lib/editorial/calendar-title';
import {
  parseDraftContent, writeDraft, serializeDraft,
  stripCaptionQuotes, wrapCaptionQuotes, Frontmatter,
} from '@/lib/editorial/draft';
import {
  githubDraftsEnabled, fetchDraft, saveDraft,
  DraftNotFoundError, DraftConflictError,
} from '@/lib/github-drafts';
import { ensureAdmin } from '@/lib/admin-auth';

const PRODUCT_ROOT = process.env.PIPER_PRODUCT_ROOT
  || path.resolve(process.cwd(), '..', 'piper-morgan-product');

const DONE_STATUSES = new Set(['published']);

function slugFromDraftPath(draftPath: string): string {
  return path.basename(draftPath, '.md');
}

function resolveAbsPath(draftPath: string): string {
  return path.join(PRODUCT_ROOT, draftPath);
}

function findEntry(rows: CalendarEntry[], slug: string) {
  return rows.find(
    e => e.draftPath && slugFromDraftPath(e.draftPath) === slug,
  );
}

const MAX_TITLE_LEN = 300;

/** Rename a queued post's calendar-row title. Slug/filename are deliberately untouched (website#44). */
async function renameTitle(
  req: NextApiRequest, res: NextApiResponse, slug: string, entry: CalendarEntry,
) {
  const raw = (req.body ?? {}).title;
  const title = typeof raw === 'string' ? raw.trim() : '';
  if (!title) return res.status(400).json({ error: 'Title cannot be empty.' });
  if (/[\r\n]/.test(title)) return res.status(400).json({ error: 'Title must be a single line.' });
  if (title.length > MAX_TITLE_LEN) {
    return res.status(400).json({ error: `Title is too long (max ${MAX_TITLE_LEN} characters).` });
  }

  const message = `content(${slug}): rename calendar title via admin UI`;
  const failure = (kind: 'not-found' | 'ambiguous' | 'bad-header') => {
    if (kind === 'not-found') {
      return res.status(404).json({ error: `No calendar row has draftPath ${entry.draftPath} anymore.` });
    }
    return res.status(409).json({
      error: kind === 'ambiguous'
        ? `More than one calendar row has draftPath ${entry.draftPath}; fix the calendar by hand first.`
        : 'The calendar CSV is missing its title or draftPath column; fix it by hand first.',
    });
  };

  try {
    if (githubDraftsEnabled()) {
      // Read-modify-write on a FRESH read, matched by draftPath, so a concurrent edit to any
      // other row is preserved. The PUT is sha-checked; on a race we re-read once, then 409.
      for (let attempt = 0; attempt < 2; attempt++) {
        const { content, sha } = await fetchDraft(CALENDAR_REL_PATH);
        const r = setCalendarTitle(content, entry.draftPath, title);
        if (r.kind === 'unchanged') return res.status(200).json({ saved: true, changed: false, title });
        if (r.kind !== 'updated') return failure(r.kind);
        try {
          await saveDraft(CALENDAR_REL_PATH, r.text, sha, message);
          invalidateLiveCalendar();
          return res.status(200).json({ saved: true, changed: true, committed: true, title });
        } catch (e) {
          if (!(e instanceof DraftConflictError) || attempt === 1) throw e;
        }
      }
    }

    const absCsv = path.join(PRODUCT_ROOT, CALENDAR_REL_PATH);
    if (!fs.existsSync(absCsv)) {
      return res.status(404).json({ error: `Calendar file missing on disk: ${CALENDAR_REL_PATH}` });
    }
    const r = setCalendarTitle(fs.readFileSync(absCsv, 'utf-8'), entry.draftPath, title);
    if (r.kind === 'unchanged') return res.status(200).json({ saved: true, changed: false, title });
    if (r.kind !== 'updated') return failure(r.kind);
    fs.writeFileSync(absCsv, r.text, 'utf-8');
    invalidateLiveCalendar();
    let committed = false;
    try {
      execSync(`git -C "${PRODUCT_ROOT}" commit -m "${message}" -- "${CALENDAR_REL_PATH}"`, { stdio: 'pipe' });
      committed = true;
    } catch {
      // git unavailable or nothing to commit — the file write succeeded
    }
    return res.status(200).json({ saved: true, changed: true, committed, title });
  } catch (e) {
    if (e instanceof DraftConflictError) return res.status(409).json({ error: e.message });
    if (e instanceof DraftNotFoundError) return res.status(404).json({ error: e.message });
    return res.status(500).json({ error: String(e) });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!await ensureAdmin(req, res)) return;

  const slug = typeof req.query.slug === 'string' ? req.query.slug : null;

  // Live, not the build-time snapshot: this is an authoring surface whose whole
  // job is opening things that were just created (a fresh calendar row is
  // invisible to the bundled CSV until the next deploy). Same token the draft
  // body already reads with; falls back to the snapshot on any failure and
  // reports which source it used, never silently.
  const { rows: entries, source } = await loadCalendarLive();

  if (req.method === 'GET' && !slug) {
    const openEntries = entries.filter(
      e => e.draftPath && !DONE_STATUSES.has((e.status || '').toLowerCase()),
    );
    const drafts = openEntries.map(e => ({
      slug: slugFromDraftPath(e.draftPath),
      title: e.title,
      status: e.status,
      pubDate: e.pubDate,
      draftPath: e.draftPath,
    }));
    return res.status(200).json({ drafts, source });
  }

  if (req.method === 'GET' && slug) {
    const entry = findEntry(entries, slug);
    if (!entry) return res.status(404).json({ error: `Draft not found: ${slug}` });

    try {
      let raw: string;
      let sha: string | null = null;

      if (githubDraftsEnabled()) {
        ({ content: raw, sha } = await fetchDraft(entry.draftPath));
      } else {
        const absPath = resolveAbsPath(entry.draftPath);
        if (!fs.existsSync(absPath)) {
          return res.status(404).json({ error: `Draft file missing on disk: ${entry.draftPath}` });
        }
        raw = fs.readFileSync(absPath, 'utf-8');
      }

      const { frontmatter, body } = parseDraftContent(raw);
      return res.status(200).json({
        slug,
        title: entry.title,
        pubDate: entry.pubDate,
        frontmatter: { ...frontmatter, caption: stripCaptionQuotes(frontmatter.caption) },
        body,
        sha,
        source,
      });
    } catch (e) {
      if (e instanceof DraftNotFoundError) return res.status(404).json({ error: e.message });
      return res.status(500).json({ error: String(e) });
    }
  }

  if (req.method === 'POST' && slug && req.query.action === 'title') {
    const entry = findEntry(entries, slug);
    if (!entry) return res.status(404).json({ error: `Draft not found: ${slug}` });
    return renameTitle(req, res, slug, entry);
  }

  if (req.method === 'POST' && slug) {
    const { image = '', alt = '', caption = '', body = '', sha = null } = (req.body ?? {}) as {
      image?: string; alt?: string; caption?: string; body?: string; sha?: string | null;
    };
    const entry = findEntry(entries, slug);
    if (!entry) return res.status(404).json({ error: `Draft not found: ${slug}` });

    const frontmatter: Frontmatter = { image, alt, caption: wrapCaptionQuotes(caption) };

    if (githubDraftsEnabled()) {
      if (!sha) {
        return res.status(400).json({ error: 'Missing file SHA — reload the draft before saving.' });
      }
      try {
        const { sha: newSha } = await saveDraft(
          entry.draftPath,
          serializeDraft(frontmatter, body),
          sha,
          `content(${slug}): edit via admin UI`,
        );
        return res.status(200).json({ saved: true, committed: true, slug, sha: newSha });
      } catch (e) {
        if (e instanceof DraftConflictError) return res.status(409).json({ error: e.message });
        if (e instanceof DraftNotFoundError) return res.status(404).json({ error: e.message });
        return res.status(500).json({ error: String(e) });
      }
    }

    // Filesystem mode (local dev)
    const absPath = resolveAbsPath(entry.draftPath);
    if (!fs.existsSync(absPath)) {
      return res.status(404).json({ error: `Draft file missing on disk: ${entry.draftPath}` });
    }
    try {
      writeDraft(absPath, frontmatter, body);

      // Commit the saved file in the product repo so PM doesn't need to git manually.
      // Pathspec commit: commits ONLY this file's working-tree content, so anything
      // another agent left staged in the product repo's index can't be swept along.
      // Silently swallow "nothing to commit" — the save succeeded regardless.
      let committed = false;
      try {
        execSync(
          `git -C "${PRODUCT_ROOT}" commit -m "content(${slug}): edit via admin UI" -- "${entry.draftPath}"`,
          { stdio: 'pipe' },
        );
        committed = true;
      } catch {
        // nothing to commit, or git unavailable — save succeeded
      }

      return res.status(200).json({ saved: true, committed, slug, sha: null });
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
