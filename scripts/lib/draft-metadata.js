/**
 * draft-metadata.js — engine module for frontmatter read/write on draft files.
 *
 * Wraps gray-matter so callers (CLI B, future Web GUI v2) don't have to
 * re-implement frontmatter parsing or YAML-quote handling. Returns the
 * three meta fields publish-post.js cares about (image, alt, caption) plus
 * the raw frontmatter object for any caller that needs more.
 *
 * Per the three-layer architecture: keep shells thin, engine grows.
 */

import fs from 'fs';
import matter from 'gray-matter';

/**
 * Read frontmatter + body from a draft .md file.
 *
 * Returns: { meta: { image, alt, caption, raw }, body: string, original: string }
 * - meta.image / meta.alt / meta.caption: trimmed strings (empty if missing)
 * - meta.raw: the full parsed-frontmatter object (for callers that need more)
 * - body: the post body (everything after the frontmatter block)
 * - original: the full original file contents
 */
export function readDraftFrontmatter(draftPath) {
  if (!fs.existsSync(draftPath)) {
    throw new Error(`Draft not found: ${draftPath}`);
  }
  const original = fs.readFileSync(draftPath, 'utf-8');
  const parsed = matter(original);
  const fm = parsed.data || {};
  return {
    meta: {
      image: String(fm.image ?? '').trim(),
      alt: String(fm.alt ?? '').trim(),
      caption: String(fm.caption ?? '').trim(),
      raw: fm,
    },
    body: parsed.content,
    original,
  };
}

/**
 * Write updated frontmatter to a draft file. Preserves body unchanged.
 * Merges into existing frontmatter — only keys in `updates` get touched;
 * other fields (e.g., custom keys the draft uses) survive.
 *
 * Returns: { changed: boolean, newContents: string }
 */
export function writeDraftFrontmatter(draftPath, updates) {
  const { meta, body } = readDraftFrontmatter(draftPath);
  const merged = { ...meta.raw, ...updates };
  // Skip write if nothing actually changed
  const before = JSON.stringify(meta.raw, Object.keys(meta.raw).sort());
  const after = JSON.stringify(merged, Object.keys(merged).sort());
  if (before === after) return { changed: false, newContents: fs.readFileSync(draftPath, 'utf-8') };
  const newContents = matter.stringify(body, merged);
  fs.writeFileSync(draftPath, newContents, 'utf-8');
  return { changed: true, newContents };
}

/**
 * Helper: check if a meta value should be treated as "empty" for the purposes
 * of warn-before-mutate. Mirrors publish-post.js's isEmptyMetaValue so CLI B
 * can pre-warn without invoking the script first. A value that is null,
 * undefined, empty, or contains only quote chars + whitespace is empty.
 */
export function isEmptyMetaValue(v) {
  if (v == null) return true;
  return String(v).replace(/['"]/g, '').trim().length === 0;
}
