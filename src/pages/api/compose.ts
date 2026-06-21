/**
 * Compose UI API — list, read, and save editorial drafts.
 *
 * Pages Router API route: excluded from `next export` static output without
 * build errors. Works only in `next dev` (local editorial tool only).
 *
 * GET  /api/compose         → list non-published drafts
 * GET  /api/compose?slug=x  → read draft content + frontmatter
 * POST /api/compose?slug=x  → save draft (body: { image, alt, caption, body })
 *
 * Drafts live in piper-morgan-product/. Set PIPER_PRODUCT_ROOT to override
 * the default sibling-directory resolution.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { loadCalendar } from '@/lib/editorial-calendar';
import { parseDraft, writeDraft, stripCaptionQuotes, wrapCaptionQuotes, Frontmatter } from '@/lib/editorial/draft';

const PRODUCT_ROOT = process.env.PIPER_PRODUCT_ROOT
  || path.resolve(process.cwd(), '..', 'piper-morgan-product');

const DONE_STATUSES = new Set(['published']);

function slugFromDraftPath(draftPath: string): string {
  return path.basename(draftPath, '.md');
}

function resolveAbsPath(draftPath: string): string {
  return path.join(PRODUCT_ROOT, draftPath);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = typeof req.query.slug === 'string' ? req.query.slug : null;

  if (req.method === 'GET' && !slug) {
    const entries = loadCalendar().filter(
      e => e.draftPath && !DONE_STATUSES.has((e.status || '').toLowerCase()),
    );
    const drafts = entries.map(e => ({
      slug: slugFromDraftPath(e.draftPath),
      title: e.title,
      status: e.status,
      pubDate: e.pubDate,
      draftPath: e.draftPath,
    }));
    return res.status(200).json({ drafts });
  }

  if (req.method === 'GET' && slug) {
    const entry = loadCalendar().find(
      e => e.draftPath && slugFromDraftPath(e.draftPath) === slug,
    );
    if (!entry) return res.status(404).json({ error: `Draft not found: ${slug}` });

    const absPath = resolveAbsPath(entry.draftPath);
    if (!fs.existsSync(absPath)) {
      return res.status(404).json({ error: `Draft file missing on disk: ${entry.draftPath}` });
    }
    try {
      const { frontmatter, body } = parseDraft(absPath);
      return res.status(200).json({
        slug,
        title: entry.title,
        pubDate: entry.pubDate,
        frontmatter: { ...frontmatter, caption: stripCaptionQuotes(frontmatter.caption) },
        body,
      });
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  if (req.method === 'POST' && slug) {
    const { image = '', alt = '', caption = '', body = '' } = (req.body ?? {}) as {
      image?: string; alt?: string; caption?: string; body?: string;
    };
    const entry = loadCalendar().find(
      e => e.draftPath && slugFromDraftPath(e.draftPath) === slug,
    );
    if (!entry) return res.status(404).json({ error: `Draft not found: ${slug}` });

    const absPath = resolveAbsPath(entry.draftPath);
    if (!fs.existsSync(absPath)) {
      return res.status(404).json({ error: `Draft file missing on disk: ${entry.draftPath}` });
    }
    const frontmatter: Frontmatter = { image, alt, caption: wrapCaptionQuotes(caption) };
    try {
      writeDraft(absPath, frontmatter, body);
      return res.status(200).json({ saved: true, slug });
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
