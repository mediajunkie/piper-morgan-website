#!/usr/bin/env node

/**
 * publish-post.js — Single-command publish pipeline for pipermorgan.ai blog posts.
 *
 * Codifies the mechanical first half of the publish-to-blog skill (v0.9+):
 * parse draft, generate hashId, prep image, append CSV row, write blog-content
 * entry, sync, fetch. Stops before commit/push so PM can review.
 *
 * The higher-judgment work (voice-pass, syndication, footer teaser selection,
 * cross-post) stays in the skill.
 *
 * Usage:
 *   node scripts/publish-post.js --draft <path> --slug <slug> --category <cat> [options]
 *
 * Required:
 *   --draft <path>       Path to markdown draft (YAML frontmatter or HTML
 *                        comment metadata for image/alt/caption)
 *   --slug <slug>        Slug for the post (URL path segment)
 *   --category <cat>     One of: building, insight, ship
 *
 * Required unless --category=ship:
 *   --image <path>       Path to source image (converted to WEBP)
 *
 * Optional:
 *   --mode <mode>        publish (default) | edit-pass
 *   --hash-id <hex12>    Required for --mode=edit-pass; auto-generated otherwise
 *   --work-date <date>   YYYY-MM-DD; defaults to today
 *   --pub-date <date>    YYYY-MM-DD; defaults to today
 *   --cluster <slug>     Era cluster slug; defaults to empty. Clusters are
 *                        assigned during a periodic manual review, not at
 *                        publish time — leaving this empty is normal.
 *   --featured           Mark as featured (default false)
 *   --report <fmt>       text (default) | json (single-line JSON on stdout)
 *   --dry-run            Log intended mutations without writing
 *   --force              Suppress empty-frontmatter alt/caption warnings
 *   --help               Show this help
 *
 * Exit codes:
 *   0 = success
 *   1 = invalid args
 *   2 = draft parse error
 *   3 = image prep error
 *   4 = file mutation error
 *   5 = sync/fetch error
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { parseArgs } from 'node:util';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const CSV_PATH = path.join(REPO_ROOT, 'data', 'blog-metadata.csv');
const BLOG_CONTENT_PATH = path.join(REPO_ROOT, 'src/data/blog-content.json');
const BLOG_IMAGES_DIR = path.join(REPO_ROOT, 'public/assets/blog-images');
const SHIP_IMAGE_SLUG = 'piper-ship.webp';
const CSV_COLUMNS = ['slug','hashId','title','chatDate','imageSlug','imageAlt','imageCaption','workDate','pubDate','category','cluster','featured','notes'];

// ─── Arg parsing ────────────────────────────────────────────────────────────

function showHelpAndExit(code = 0) {
  // Print the file's leading JSDoc as usage
  const src = fs.readFileSync(__filename, 'utf-8');
  const m = src.match(/\/\*\*([\s\S]*?)\*\//);
  if (m) {
    const usage = m[1].replace(/^\s*\*\s?/gm, '').trim();
    process.stdout.write(usage + '\n');
  }
  process.exit(code);
}

let parsed;
try {
  parsed = parseArgs({
    options: {
      draft:     { type: 'string' },
      image:     { type: 'string' },
      slug:      { type: 'string' },
      category:  { type: 'string' },
      mode:      { type: 'string', default: 'publish' },
      'hash-id': { type: 'string' },
      'work-date': { type: 'string' },
      'pub-date':  { type: 'string' },
      cluster:   { type: 'string', default: '' },
      featured:  { type: 'boolean', default: false },
      report:    { type: 'string', default: 'text' },
      'dry-run': { type: 'boolean', default: false },
      force:     { type: 'boolean', default: false },
      help:      { type: 'boolean', default: false },
    },
    strict: true,
    allowPositionals: false,
  });
} catch (err) {
  process.stderr.write(`error: ${err.message}\n\n`);
  showHelpAndExit(1);
}

const args = parsed.values;
if (args.help) showHelpAndExit(0);

// Auto-detect edit-pass: re-publishing an already-published slug must reuse the
// existing hashId. Generating a fresh one orphans the new content in
// blog-content.json while the live CSV mapping still points at the old hashId,
// so the site keeps serving stale content. (Docs memo 2026-05-26.)
const existingHashId =
  args.mode === 'publish' && !args['hash-id'] && args.slug
    ? lookupHashIdBySlug(args.slug)
    : null;
const autoEditPass = existingHashId != null;

const errors = [];
if (!args.draft) errors.push('--draft is required');
if (!args.slug) errors.push('--slug is required');
if (!args.category) errors.push('--category is required');
if (args.category && !['building', 'insight', 'ship'].includes(args.category)) {
  errors.push(`--category must be one of: building, insight, ship (got: ${args.category})`);
}
if (args.category !== 'ship' && !args.image && args.mode !== 'edit-pass' && !autoEditPass) {
  errors.push('--image is required for non-ship posts (publish mode)');
}
if (args.mode === 'edit-pass' && !args['hash-id']) {
  errors.push('--hash-id is required for --mode=edit-pass');
}
if (!['publish', 'edit-pass'].includes(args.mode)) {
  errors.push(`--mode must be publish or edit-pass (got: ${args.mode})`);
}
if (!['text', 'json'].includes(args.report)) {
  errors.push(`--report must be text or json (got: ${args.report})`);
}
if (errors.length) {
  errors.forEach(e => process.stderr.write(`error: ${e}\n`));
  process.stderr.write('\nRun with --help for usage.\n');
  process.exit(1);
}

const todayIso = () => new Date().toISOString().slice(0, 10);
const cfg = {
  draftPath: path.resolve(args.draft),
  imagePath: args.image ? path.resolve(args.image) : null,
  slug: args.slug,
  category: args.category,
  mode: autoEditPass ? 'edit-pass' : args.mode,
  hashId: args['hash-id'] || existingHashId || null,
  autoEditPass,
  workDate: args['work-date'] || todayIso(),
  pubDate: args['pub-date'] || todayIso(),
  cluster: args.cluster,
  featured: args.featured,
  reportFmt: args.report,
  dryRun: args['dry-run'],
  force: args.force,
};

// ─── Empty-meta check (Gap 3 fix; surfaced 2026-05-17) ──────────────────────
// Empty alt/caption silently propagated to medium-posts.json on the Protocol
// publish, causing PM hand-edit recovery. Warn loudly and exit unless --force.
// Skipped in edit-pass mode (no CSV write happens there) and for ship category
// (no per-post image).
function isEmptyMetaValue(v) {
  if (v == null) return true;
  // After YAML strip, placeholder values like '""' become '""' (literal two
  // quote chars). Treat values that are only quote chars + whitespace as empty.
  return v.replace(/['"]/g, '').trim().length === 0;
}

// ─── Logging helpers ────────────────────────────────────────────────────────

const log = (msg) => { if (cfg.reportFmt !== 'json') process.stderr.write(msg + '\n'); };
const filesMutated = [];
const skipped = [];

// ─── Step 1: parse draft ────────────────────────────────────────────────────

function parseDraft(draftPath) {
  if (!fs.existsSync(draftPath)) {
    throw Object.assign(new Error(`draft not found: ${draftPath}`), { exitCode: 2 });
  }
  const text = fs.readFileSync(draftPath, 'utf-8');
  const meta = { image: '', alt: '', caption: '' };
  let body = text;

  // YAML frontmatter: starts with --- on line 1, ends at next --- line
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (fm) {
    const block = fm[1];
    for (const line of block.split(/\r?\n/)) {
      const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:\s*(.*)$/);
      if (m) {
        const key = m[1].trim();
        let val = m[2].trim();
        // Strip surrounding quotes (single or double)
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (key in meta) meta[key] = val;
      }
    }
    body = text.slice(fm[0].length);
  }

  // HTML comment fallback for any missing meta fields
  for (const key of ['image', 'alt', 'caption']) {
    if (!meta[key]) {
      const cm = body.match(new RegExp(`<!--\\s*${key}:\\s*(.+?)\\s*-->`));
      if (cm) {
        let v = cm[1].trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        meta[key] = v;
      }
    }
  }

  // Strip metadata comment lines (image / alt / caption / no caption) — only at top
  const metaCommentRe = /^<!--\s*(image|alt|caption|no caption)(?::\s*[^]*?)?\s*-->\s*\n?/gm;
  body = body.replace(metaCommentRe, '');

  // Extract title (first H1)
  const titleMatch = body.match(/^#\s+(.+?)\s*$/m);
  if (!titleMatch) {
    throw Object.assign(new Error('draft has no H1 title'), { exitCode: 2 });
  }
  const title = titleMatch[1].trim();

  return { title, meta, body };
}

// ─── Step 2: markdown → HTML ────────────────────────────────────────────────
// Implements the publish-to-blog skill's conversion rules (v0.9):
//  - Strip ONLY the first H1 (post title; rendered separately by template)
//  - `# Section` → `<h1>`, `## Subsection` → `<h2>`, `### …` → `<h3>`
//  - `---` → `<hr>`
//  - Em dashes: ` -- ` → ` — `
//  - Inline: **bold**, *italic*, [text](url)
//  - `_standalone italic line_` / `*standalone italic line*` → `<p><em>…</em></p>`
//  - Unordered lists: `- item` → <ul><li>…</li></ul>
//  - Blockquotes: consecutive `> text` lines → <blockquote><p>…</p></blockquote>
//  - Markdown tables: `| col | col |` + `| --- | --- |` separator → <table>…</table>
//  - Multi-line paragraph blocks (no blank-line separator) → join with <br /> inside one <p>
//  - Preserve all non-metadata HTML comments through to output

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInline(text) {
  // Order matters: backticks first (raw — protect from other rules), then links,
  // then bold (**), then italic (*).
  let out = text;
  // Em-dash
  out = out.replace(/ -- /g, ' — ');
  // Inline code `text` → <code>text</code> (skill spec gap; observed convention
  // in 122/126 existing blog-first posts uses <code> tags, not literal backticks)
  out = out.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  // Linked image (Gap 4, surfaced 2026-05-20 from Ship #043 publish):
  // [![alt](img-url)](link-url) → <a href="link"><img src="img" alt="alt" /></a>
  // MUST run before the regular link rule (otherwise the inner [alt](img) part
  // matches first and the linked-image structure breaks).
  out = out.replace(/\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g,
    (_, alt, img, link) => `<a href="${link}"><img src="${img}" alt="${alt}" /></a>`);
  // Inline image ![alt](url) → <img src="url" alt="alt" /> (surfaced 2026-05-27 from
  // Ship #044). MUST run after linked-image (more specific) and before the link rule —
  // otherwise the link rule matches the [alt](url) part and leaves a literal leading `!`.
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt, src) => `<img src="${src}" alt="${alt}" />`);
  // Links [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u}">${t}</a>`);
  // Bold **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic *text* (single asterisks, non-greedy, not crossing tags)
  out = out.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
  return out;
}

function convertToHtml(body) {
  // Tokenize line-by-line. Track block state.
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let titleStripped = false;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Preserve standalone HTML comments (already-metadata-stripped at parseDraft)
    if (/^<!--[\s\S]*?-->$/.test(trimmed)) {
      out.push(trimmed);
      i++;
      continue;
    }

    // Block-level inline HTML: lines starting with a block-level opening or
    // closing tag pass through as raw HTML — NOT wrapped in <p> (which would
    // be invalid since block elements can't be inside <p>) and NOT joined
    // with <br />. Collect consecutive non-blank lines as one HTML run; blank
    // line terminates per markdown convention for HTML blocks. Surfaced
    // 2026-05-17 in the Protocol publish (Gap 2 in Docs's feature-corpus memo).
    if (/^<\/?(?:ol|ul|table|blockquote|pre|details|figure|aside|div|section|article|header|footer|nav|hr|p)\b/i.test(trimmed)) {
      const raw = [];
      while (i < lines.length && lines[i].trim() !== '') {
        raw.push(lines[i]);
        i++;
      }
      out.push(raw.join('\n'));
      continue;
    }

    // Skip blank lines (block separator)
    if (trimmed === '') { i++; continue; }

    // Horizontal rule
    if (trimmed === '---') { out.push('<hr>'); i++; continue; }

    // Fenced code block: opening ``` (with optional language tag); content
    // collected verbatim through the closing ``` line; emit <pre><code>.
    // (Docs memo 2026-06-01. CommonMark accepts three+ backticks; we accept three.)
    const fenceOpen = trimmed.match(/^```\s*([^\s`]*)\s*$/);
    if (fenceOpen) {
      const lang = fenceOpen[1] || '';
      const codeLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '```') {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // consume closing fence (if any)
      const codeAttr = lang ? ` class="language-${lang}"` : '';
      out.push(`<pre><code${codeAttr}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    // Headings — strip ONLY the first H1 (the title)
    const h1 = trimmed.match(/^#\s+(.+)$/);
    const h2 = trimmed.match(/^##\s+(.+)$/);
    const h3 = trimmed.match(/^###\s+(.+)$/);
    if (h3) { out.push(`<h3>${renderInline(h3[1].trim())}</h3>`); i++; continue; }
    if (h2) { out.push(`<h2>${renderInline(h2[1].trim())}</h2>`); i++; continue; }
    if (h1) {
      if (!titleStripped) { titleStripped = true; i++; continue; }
      out.push(`<h1>${renderInline(h1[1].trim())}</h1>`);
      i++;
      continue;
    }

    // Blockquotes: consecutive `> text` lines, join with space inside one <p> inside one <blockquote>
    if (/^>\s?/.test(trimmed)) {
      const parts = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        parts.push(lines[i].trim().replace(/^>\s?/, '').trim());
        i++;
      }
      out.push(`<blockquote><p>${renderInline(parts.join(' '))}</p></blockquote>`);
      continue;
    }

    // Markdown tables: `| ... |` followed by `| --- | --- |` separator
    if (/^\|.*\|\s*$/.test(trimmed) && i + 1 < lines.length && /^\|[\s|:-]+\|\s*$/.test(lines[i + 1].trim())) {
      const headerCells = trimmed.slice(1, -1).split('|').map(c => c.trim());
      i += 2; // skip header + separator
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i].trim())) {
        const cells = lines[i].trim().slice(1, -1).split('|').map(c => c.trim());
        rows.push(cells);
        i++;
      }
      const thead = `<thead><tr>${headerCells.map(c => `<th>${renderInline(c)}</th>`).join('')}</tr></thead>`;
      const tbody = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${renderInline(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
      out.push(`<table>${thead}${tbody}</table>`);
      continue;
    }

    // Unordered list: consecutive `- item` / `* item` / `+ item` lines → <ul><li>…</li></ul>.
    // CommonMark accepts -, *, and + as equivalent unordered-list markers. (Docs memo 2026-06-01.)
    if (/^[-*+]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ''));
        i++;
      }
      out.push(`<ul>${items.map(it => `<li>${renderInline(it)}</li>`).join('')}</ul>`);
      continue;
    }

    // Ordered list: consecutive `1.` / `2.` / `N.` lines → <ol><li>…</li></ol>
    // (Surfaced 2026-05-17 from the From Protocol to Infrastructure publish —
    // previously these conflated into a multi-line paragraph block with <br />)
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      out.push(`<ol>${items.map(it => `<li>${renderInline(it)}</li>`).join('')}</ol>`);
      continue;
    }

    // Standalone italic line: `_…_` or `*…*` on its own line → <p><em>…</em></p>
    const it1 = trimmed.match(/^_(.+)_$/);
    const it2 = trimmed.match(/^\*(.+)\*$/);
    if (it1) { out.push(`<p><em>${renderInline(it1[1])}</em></p>`); i++; continue; }
    if (it2) { out.push(`<p><em>${renderInline(it2[1])}</em></p>`); i++; continue; }

    // Multi-line paragraph block: collect consecutive non-blank, non-block-starting lines.
    // Join with <br /> inside one <p> if >1 line; else just a <p>.
    const paraLines = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (t === '') break;
      // Stop if this line starts a new block type
      if (/^#{1,3}\s+/.test(t)) break;
      if (/^>\s?/.test(t)) break;
      if (/^[-*+]\s+/.test(t)) break;
      if (/^\d+\.\s+/.test(t)) break;
      if (/^\|.*\|\s*$/.test(t)) break;
      if (t === '---') break;
      if (/^```/.test(t)) break;
      paraLines.push(t);
      i++;
    }
    if (paraLines.length === 1) {
      out.push(`<p>${renderInline(paraLines[0])}</p>`);
    } else if (paraLines.length > 1) {
      out.push(`<p>${paraLines.map(renderInline).join('<br />')}</p>`);
    }
  }

  return out.join('\n');
}

// ─── Step 3: hashId ─────────────────────────────────────────────────────────

function generateHashId() {
  // 12 hex chars; matches Medium's hashId shape so existing regex extractors work
  return crypto.randomBytes(6).toString('hex');
}

// ─── Step 4: image prep ─────────────────────────────────────────────────────

function which(cmd) {
  const r = spawnSync('which', [cmd], { encoding: 'utf-8' });
  return r.status === 0 ? r.stdout.trim() : null;
}

function prepImage(srcPath, destSlug) {
  const dest = path.join(BLOG_IMAGES_DIR, `${destSlug}.webp`);
  if (cfg.dryRun) { log(`[dry-run] would prep image: ${srcPath} → ${dest}`); return dest; }
  if (!fs.existsSync(srcPath)) {
    throw Object.assign(new Error(`image not found: ${srcPath}`), { exitCode: 3 });
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  // Try cwebp first (preferred per skill)
  if (which('cwebp')) {
    // Optional pre-resize via sips (macOS) — skill suggests sips -Z 1200 before cwebp -q 80.
    // Use a temp copy so we don't mutate the source.
    const tmp = path.join(path.dirname(srcPath), `.publish-tmp-${path.basename(srcPath)}`);
    fs.copyFileSync(srcPath, tmp);
    try {
      if (which('sips')) spawnSync('sips', ['-Z', '1200', tmp], { stdio: 'ignore' });
      const r = spawnSync('cwebp', ['-q', '80', tmp, '-o', dest], { stdio: 'inherit' });
      if (r.status !== 0) throw new Error('cwebp failed');
      log(`✅ image prepared (cwebp): ${dest}`);
      filesMutated.push(path.relative(REPO_ROOT, dest));
      return dest;
    } finally {
      try { fs.unlinkSync(tmp); } catch {}
    }
  }

  // Fallback: Python Pillow (skill v0.9 confirms this is the established fallback)
  if (which('python3')) {
    const py = [
      'from PIL import Image',
      `img = Image.open(${JSON.stringify(srcPath)})`,
      'img.thumbnail((1200, 1200), Image.LANCZOS)',
      `img.save(${JSON.stringify(dest)}, "WEBP", quality=80)`,
    ].join('\n');
    const r = spawnSync('python3', ['-c', py], { stdio: 'inherit' });
    if (r.status !== 0) {
      throw Object.assign(new Error('Pillow image prep failed (install with: pip3 install Pillow)'), { exitCode: 3 });
    }
    log(`✅ image prepared (Pillow): ${dest}`);
    filesMutated.push(path.relative(REPO_ROOT, dest));
    return dest;
  }

  throw Object.assign(new Error('no image processor available (need cwebp or python3+Pillow)'), { exitCode: 3 });
}

// ─── Step 5: CSV append ─────────────────────────────────────────────────────

function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function lookupHashIdBySlug(slug) {
  // Returns the hashId already mapped to this slug in blog-metadata.csv, or null.
  // slug is field 0, hashId is field 1; slugs are URL segments (no commas/quotes).
  if (!fs.existsSync(CSV_PATH)) return null;
  const lines = fs.readFileSync(CSV_PATH, 'utf-8').split('\n');
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const firstComma = line.indexOf(',');
    if (firstComma === -1) continue;
    if (line.slice(0, firstComma) !== slug) continue;
    const rest = line.slice(firstComma + 1);
    const secondComma = rest.indexOf(',');
    return (secondComma === -1 ? rest : rest.slice(0, secondComma)).trim();
  }
  return null;
}

function csvRowExists(csvText, hashId, slug) {
  const lines = csvText.split('\n');
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    // Cheap prefix check: slug is field 0, hashId is field 1
    if (line.startsWith(slug + ',') || line.includes(',' + hashId + ',')) return true;
  }
  return false;
}

function appendCsvRow({ slug, hashId, title, imageSlug, imageAlt, imageCaption, workDate, pubDate, category, cluster, featured }) {
  if (cfg.dryRun) { log(`[dry-run] would append CSV row for slug=${slug} hashId=${hashId}`); return; }
  if (!fs.existsSync(CSV_PATH)) {
    throw Object.assign(new Error(`CSV not found: ${CSV_PATH}`), { exitCode: 4 });
  }
  let csv = fs.readFileSync(CSV_PATH, 'utf-8');
  if (csvRowExists(csv, hashId, slug)) {
    skipped.push(`CSV row for slug=${slug} or hashId=${hashId} already exists`);
    log(`⏭️  CSV: row already exists for slug=${slug} or hashId=${hashId}; skipping`);
    return;
  }
  const row = [
    slug, hashId, title, '', /* chatDate */ imageSlug, imageAlt, imageCaption,
    workDate, pubDate, category, cluster, featured ? 'true' : 'false', '',
  ].map(csvEscape).join(',');
  if (!csv.endsWith('\n')) csv += '\n';
  fs.writeFileSync(CSV_PATH, csv + row + '\n', 'utf-8');
  log(`✅ CSV row appended: ${slug}`);
  filesMutated.push(path.relative(REPO_ROOT, CSV_PATH));
}

// ─── Step 6: blog-content.json write ────────────────────────────────────────

function writeBlogContent(hashId, title, html) {
  if (cfg.dryRun) { log(`[dry-run] would write blog-content.json entry for hashId=${hashId}`); return; }
  let bc = {};
  if (fs.existsSync(BLOG_CONTENT_PATH)) {
    bc = JSON.parse(fs.readFileSync(BLOG_CONTENT_PATH, 'utf-8'));
  }
  bc[hashId] = { title, content: html };
  fs.writeFileSync(BLOG_CONTENT_PATH, JSON.stringify(bc, null, 2), 'utf-8');
  log(`✅ blog-content.json updated: hashId=${hashId}`);
  filesMutated.push(path.relative(REPO_ROOT, BLOG_CONTENT_PATH));
}

// ─── Step 7: sync + fetch ───────────────────────────────────────────────────

function runSyncAndFetch() {
  if (cfg.dryRun) { log('[dry-run] would run sync-csv-to-json.js + fetch-blog-posts.js'); return; }
  for (const script of ['sync-csv-to-json.js', 'fetch-blog-posts.js']) {
    log(`▶  running scripts/${script} …`);
    const r = spawnSync('node', [path.join(__dirname, script)], {
      cwd: REPO_ROOT,
      stdio: cfg.reportFmt === 'json' ? 'ignore' : 'inherit',
    });
    if (r.status !== 0) {
      throw Object.assign(new Error(`${script} exited with status ${r.status}`), { exitCode: 5 });
    }
  }
  // sync writes its backup; fetch writes medium-posts.json; both are tracked
  filesMutated.push('src/data/medium-posts.json');
  filesMutated.push('src/data/medium-posts.json.backup-sync');
}

// ─── Main ───────────────────────────────────────────────────────────────────

const startMs = Date.now();
try {
  log(`📝 publish-post.js — mode=${cfg.mode} category=${cfg.category} slug=${cfg.slug}${cfg.dryRun ? ' [DRY-RUN]' : ''}`);
  if (cfg.autoEditPass) {
    log(`🔁 slug "${cfg.slug}" already published (hashId=${cfg.hashId}); auto-detected edit-pass — updating blog-content.json in place, CSV + image untouched`);
  }

  // Parse the draft
  log(`📄 parsing draft: ${cfg.draftPath}`);
  const { title, meta, body } = parseDraft(cfg.draftPath);
  log(`   title: "${title}"`);

  // Empty-meta check (Gap 3) — only for full publish on non-ship posts
  if (cfg.mode === 'publish' && cfg.category !== 'ship') {
    const emptyFields = [];
    if (isEmptyMetaValue(meta.alt)) emptyFields.push('alt');
    if (isEmptyMetaValue(meta.caption)) emptyFields.push('caption');
    if (emptyFields.length > 0) {
      if (cfg.force) {
        log(`⚠️  proceeding with empty frontmatter ${emptyFields.join(' + ')} (--force in effect)`);
      } else {
        const err = new Error(
          `frontmatter ${emptyFields.join(' + ')} ${emptyFields.length === 1 ? 'is' : 'are'} empty in ${cfg.draftPath}\n` +
          `   This is almost certainly user error — empty values would land in production.\n` +
          `   Fix the frontmatter and re-run, OR pass --force to publish with empty value(s) anyway.`
        );
        err.exitCode = 2;
        throw err;
      }
    }
  }

  // Convert body to HTML
  const html = convertToHtml(body);
  log(`   converted body to HTML (${html.length} chars)`);
  if (cfg.dryRun) {
    log(`\n--- converted HTML (dry-run preview) ---`);
    log(html);
    log(`--- end preview ---\n`);
  }

  // hashId
  const hashId = cfg.hashId || generateHashId();
  if (!/^[a-f0-9]{12}$/.test(hashId)) {
    throw Object.assign(new Error(`hashId must be 12 hex chars (got: ${hashId})`), { exitCode: 1 });
  }

  if (cfg.mode === 'edit-pass') {
    // Edit-pass: only re-run HTML conversion + blog-content.json update
    log(`✏️  edit-pass mode: updating blog-content.json for existing hashId=${hashId}`);
    writeBlogContent(hashId, title, html);
  } else {
    // Full publish
    // Image
    let imageSlug;
    if (cfg.category === 'ship') {
      imageSlug = SHIP_IMAGE_SLUG;
      log(`🚢 ship category: reusing ${SHIP_IMAGE_SLUG} (no per-post image prep)`);
    } else {
      prepImage(cfg.imagePath, cfg.slug);
      imageSlug = `${cfg.slug}.webp`;
    }

    // CSV
    appendCsvRow({
      slug: cfg.slug,
      hashId,
      title,
      imageSlug,
      imageAlt: meta.alt || '',
      imageCaption: meta.caption || '',
      workDate: cfg.workDate,
      pubDate: cfg.pubDate,
      category: cfg.category,
      cluster: cfg.cluster,
      featured: cfg.featured,
    });

    // blog-content.json
    writeBlogContent(hashId, title, html);

    // Sync + fetch
    runSyncAndFetch();
  }

  const urlPrefix = cfg.category === 'ship' ? '/shipping-news' : '/blog';
  const url = `${urlPrefix}/${cfg.slug}`;
  const elapsed = Date.now() - startMs;
  log(`\n✨ done in ${elapsed}ms — ${url}`);
  log(`   files mutated: ${filesMutated.length}`);
  log(`   next: review diff, commit + push from ${REPO_ROOT}`);

  if (cfg.reportFmt === 'json') {
    const report = {
      ok: true,
      mode: cfg.mode,
      slug: cfg.slug,
      hashId,
      url,
      title,
      category: cfg.category,
      pubDate: cfg.pubDate,
      imageAlt: meta.alt || '',
      imageCaption: meta.caption || '',
      filesMutated,
      skipped,
      durationMs: elapsed,
      dryRun: cfg.dryRun,
    };
    process.stdout.write(JSON.stringify(report) + '\n');
  }
  process.exit(0);
} catch (err) {
  const exitCode = err.exitCode || 1;
  log(`\n❌ error: ${err.message}`);
  if (cfg.reportFmt === 'json') {
    const report = { ok: false, error: err.message, exitCode, filesMutated, skipped, dryRun: cfg.dryRun };
    process.stdout.write(JSON.stringify(report) + '\n');
  }
  process.exit(exitCode);
}
