/**
 * preflight.js — engine module for pre-publish sanity checks.
 *
 * Catches the failure modes Docs surfaced in the 2026-05-17 publish (and
 * 2026-05-18 feedback memo) BEFORE publish-post.js gets invoked. Each check
 * returns a structured result; the CLI B caller decides how to present it
 * to the operator (typically a prompt to retry / continue / abort).
 *
 * Engine module — non-interactive; just returns facts. Interactive prompts
 * live at CLI B.
 */

import fs from 'fs';
import path from 'path';

/**
 * Check that the image file exists at the path the operator provided.
 * If not, attempt to locate a same-named file in common alternative
 * locations (~/Downloads, ~/Desktop) and report what was found.
 *
 * Returns: { ok: boolean, path: string, alternatives?: string[] }
 */
export function checkImagePath(imagePath) {
  if (!imagePath) return { ok: false, path: '', reason: 'empty image path' };
  if (fs.existsSync(imagePath)) return { ok: true, path: imagePath };

  const filename = path.basename(imagePath);
  const home = process.env.HOME || '';
  const candidates = [
    path.join(home, 'Downloads', filename),
    path.join(home, 'Desktop', filename),
  ].filter(Boolean);
  const alternatives = candidates.filter(fs.existsSync);
  return { ok: false, path: imagePath, reason: 'not found', alternatives };
}

/**
 * Check the draft file exists and is readable.
 */
export function checkDraftPath(draftPath) {
  if (!draftPath) return { ok: false, path: '', reason: 'empty draft path' };
  if (!fs.existsSync(draftPath)) return { ok: false, path: draftPath, reason: 'not found' };
  try {
    fs.accessSync(draftPath, fs.constants.R_OK);
    return { ok: true, path: draftPath };
  } catch (e) {
    return { ok: false, path: draftPath, reason: 'not readable' };
  }
}
