/**
 * Parse and write editorial draft markdown files.
 *
 * TypeScript port of piper-morgan-product/services/editorial/draft.py.
 * Supports YAML frontmatter (preferred) and legacy HTML-comment metadata.
 *
 * Runs server-side only (Node.js file APIs — never imported in client bundles).
 */

import fs from 'fs';

export const FRONTMATTER_KEYS = ['image', 'alt', 'caption'] as const;
export type FrontmatterKey = typeof FRONTMATTER_KEYS[number];
export type Frontmatter = Record<FrontmatterKey, string>;

function emptyFrontmatter(): Frontmatter {
  return { image: '', alt: '', caption: '' };
}

function parseYamlBlock(text: string): { fm: Frontmatter; body: string } | null {
  if (!text.startsWith('---')) return null;
  const lines = text.split('\n');
  if (lines[0].trim() !== '---') return null;

  let closeIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') { closeIdx = i; break; }
  }
  if (closeIdx === -1) return null;

  const fm = emptyFrontmatter();
  for (const raw of lines.slice(1, closeIdx)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim().toLowerCase();
    let value = line.slice(colonIdx + 1).trim();
    if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) {
      value = value.slice(1, -1).replace(/''/g, "'");
    } else if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
      value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    if ((FRONTMATTER_KEYS as readonly string[]).includes(key)) {
      fm[key as FrontmatterKey] = value;
    }
  }

  let bodyLines = lines.slice(closeIdx + 1);
  if (bodyLines[0]?.trim() === '') bodyLines = bodyLines.slice(1);
  return { fm, body: bodyLines.join('\n') };
}

const LEGACY_PATTERNS: Record<FrontmatterKey, RegExp> = {
  image:   /<!--\s*image:\s*(.+?)\s*-->/i,
  alt:     /<!--\s*alt:\s*(.+?)\s*-->/i,
  caption: /<!--\s*caption:\s*(.+?)\s*-->/i,
};

function parseLegacyComments(text: string): Frontmatter {
  const fm = emptyFrontmatter();
  for (const key of FRONTMATTER_KEYS) {
    const m = text.match(LEGACY_PATTERNS[key]);
    if (m) {
      let v = m[1].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      fm[key] = v;
    }
  }
  return fm;
}

/** Parse draft text (YAML frontmatter preferred, legacy HTML comments fallback). */
export function parseDraftContent(text: string): { frontmatter: Frontmatter; body: string } {
  const yaml = parseYamlBlock(text);
  if (yaml) return { frontmatter: yaml.fm, body: yaml.body };
  return { frontmatter: parseLegacyComments(text), body: text };
}

export function parseDraft(filePath: string): { frontmatter: Frontmatter; body: string } {
  return parseDraftContent(fs.readFileSync(filePath, 'utf-8'));
}

function yamlSingleQuote(value: string): string {
  return "'" + value.replace(/'/g, "''") + "'";
}

/** Serialize frontmatter + body to draft file text. */
export function serializeDraft(frontmatter: Frontmatter, body: string): string {
  const lines = ['---'];
  for (const key of FRONTMATTER_KEYS) {
    lines.push(`${key}: ${yamlSingleQuote(frontmatter[key] ?? '')}`);
  }
  // Blank line between frontmatter and body — parseYamlBlock strips exactly one,
  // so parse → serialize round-trips hand-authored drafts without a diff.
  lines.push('---', '', '');
  let content = lines.join('\n') + body;
  if (!content.endsWith('\n')) content += '\n';
  return content;
}

export function writeDraft(filePath: string, frontmatter: Frontmatter, body: string): void {
  const content = serializeDraft(frontmatter, body);

  const tmp = filePath + '.tmp';
  try {
    fs.writeFileSync(tmp, content, 'utf-8');
    fs.renameSync(tmp, filePath);
  } catch (e) {
    try { fs.unlinkSync(tmp); } catch { /* ignore cleanup error */ }
    throw e;
  }
}

/** Strip the spoken-line `"..."` wrapper from a caption for UI display. */
export function stripCaptionQuotes(caption: string): string {
  const v = caption.trim();
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) return v.slice(1, -1);
  return v;
}

/** Add the spoken-line `"..."` wrapper to a caption before storage. */
export function wrapCaptionQuotes(caption: string): string {
  if (!caption) return caption;
  return `"${caption}"`;
}
