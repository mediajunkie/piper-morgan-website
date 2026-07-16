/**
 * POST /api/compose/upload?slug=x — upload a draft's source image.
 *
 * Places the file next to the draft markdown (same directory as draftPath),
 * matching how images are placed manually today. Does NOT do the webp
 * conversion publish-post.js does at actual publish time — that step needs
 * cwebp/Pillow, which don't exist in this serverless environment; it still
 * runs, unchanged, at publish. This endpoint only automates "drop a source
 * file next to the draft," same as compose automates editing the draft.
 *
 * Body: { filename: string, contentBase64: string }  (no data: URI prefix)
 * 200 { filename }  — the (possibly de-conflicted) filename to put in frontmatter
 * 413 — file too large (Vercel's platform request-body cap is ~4.5MB; this
 *       endpoint enforces a slightly lower limit so the error is legible
 *       rather than a raw platform 413 with no body)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { loadCalendar } from '@/lib/editorial-calendar';
import { githubDraftsEnabled, uploadBinaryFile, DraftConflictError } from '@/lib/github-drafts';
import { ensureAdmin } from '@/lib/admin-auth';

export const config = {
  api: { bodyParser: { sizeLimit: '4mb' } },
};

const PRODUCT_ROOT = process.env.PIPER_PRODUCT_ROOT
  || path.resolve(process.cwd(), '..', 'piper-morgan-product');

const ALLOWED_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

function slugFromDraftPath(draftPath: string): string {
  return path.basename(draftPath, '.md');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!await ensureAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const slug = typeof req.query.slug === 'string' ? req.query.slug : null;
  if (!slug) return res.status(400).json({ error: 'Missing slug' });

  const entry = loadCalendar().find(e => e.draftPath && slugFromDraftPath(e.draftPath) === slug);
  if (!entry) return res.status(404).json({ error: `Draft not found: ${slug}` });

  const { filename, contentBase64 } = (req.body ?? {}) as { filename?: string; contentBase64?: string };
  if (!filename || !contentBase64) {
    return res.status(400).json({ error: 'filename and contentBase64 are required' });
  }

  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return res.status(400).json({ error: `Unsupported file type "${ext}". Use PNG, JPEG, GIF, or WebP.` });
  }

  // Rough size check on the base64 payload (base64 is ~4/3 the binary size).
  const approxBytes = (contentBase64.length * 3) / 4;
  if (approxBytes > 4 * 1024 * 1024) {
    return res.status(413).json({
      error: 'Image is larger than 4MB. Resize or compress it before uploading (Vercel\'s upload limit is ~4.5MB).',
    });
  }

  const base = path.basename(filename, ext).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'image';
  const draftDir = path.dirname(entry.draftPath);
  const destName = `${slug}-${base}${ext}`;
  const destRelPath = path.join(draftDir, destName).replace(/\\/g, '/');

  try {
    if (githubDraftsEnabled()) {
      await uploadBinaryFile(destRelPath, contentBase64, `content(${slug}): upload image ${destName}`);
    } else {
      const absPath = path.join(PRODUCT_ROOT, destRelPath);
      if (fs.existsSync(absPath)) {
        return res.status(409).json({ error: `A file already exists at ${destRelPath} — choose a different name.` });
      }
      fs.writeFileSync(absPath, Buffer.from(contentBase64, 'base64'));
    }
    return res.status(200).json({ filename: destName });
  } catch (e) {
    if (e instanceof DraftConflictError) return res.status(409).json({ error: e.message });
    return res.status(500).json({ error: String(e) });
  }
}
