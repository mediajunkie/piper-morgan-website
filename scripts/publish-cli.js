#!/usr/bin/env node

/**
 * publish-cli.js — interactive publishing CLI (CLI B).
 *
 * Walking-skeleton (2026-05-18 AM, commit bdee28bbf) plus enrichment pass
 * (same day) per yesterday's resolved design decisions + today's Docs
 * feedback memo signals. Wraps publish-post.js with operator-facing
 * interaction: queue picker, frontmatter read + open-in-$EDITOR handoff,
 * image pre-flight check, P]ublish/R]eady branching, dry-run preview,
 * confirm-before-real-publish, git diff, commit + push with default-N,
 * auto-drop post-publish memo to Docs.
 *
 * Architecture: thin shell over engine modules in scripts/lib/. CLI B is
 * the human-interactive layer; publish-post.js stays non-interactive and
 * agent-callable. Per the three-layer architecture (Engine / CLI / Web GUI),
 * the same engine modules will back the eventual Web GUI v2.
 *
 * Usage:
 *   npm run publish                      # standard publish-from-queue flow
 *   node scripts/publish-cli.js          # same
 *   node scripts/publish-cli.js --edit-pass    # edit-pass mode (slug picker over published entries)
 */

import { select, input, confirm } from '@inquirer/prompts';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getQueue, slugify, findDraftFile, findImageForDraft, themeToCategory, readCalendar } from './lib/queue.js';
import { readDraftFrontmatter, isEmptyMetaValue } from './lib/draft-metadata.js';
import { checkImagePath, checkDraftPath } from './lib/preflight.js';
import { markReady } from './lib/calendar-mutations.js';
import { dropPublishHandoffMemo } from './lib/docs-notify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const PUBLISH_POST = path.join(__dirname, 'publish-post.js');

const EDIT_PASS_MODE = process.argv.includes('--edit-pass');

// ────────────────────────────────────────────────────────────────────────────
// Phase 1: pick a draft from the queue
// ────────────────────────────────────────────────────────────────────────────

async function pickFromQueue() {
  const queue = getQueue();
  if (queue.length === 0) {
    console.log('📭 Editorial queue is empty (no queued/drafted/ready entries).');
    process.exit(0);
  }
  const choices = queue.map((r, i) => ({
    name: `${r.title}  ─  ${r.status} · ${r.theme} · pubDate=${r.pubDate || '(unset)'}`,
    value: i,
  }));
  choices.push({ name: '[ Quit ]', value: -1 });
  const pick = await select({
    message: `Editorial queue (${queue.length} entries):`,
    choices,
    pageSize: 15,
  });
  if (pick === -1) process.exit(0);
  return queue[pick];
}

async function pickPublishedEntry() {
  const all = readCalendar();
  const published = all.filter(r => r.status === 'published' && r.blogPath);
  // Sort by pubDate desc, most-recent first
  published.sort((a, b) => (b.pubDate || '').localeCompare(a.pubDate || ''));
  if (published.length === 0) {
    console.log('📭 No published entries found in calendar.');
    process.exit(0);
  }
  const choices = published.slice(0, 30).map((r, i) => ({
    name: `${r.title}  ─  published ${r.pubDate} · ${r.theme}`,
    value: i,
  }));
  choices.push({ name: '[ Quit ]', value: -1 });
  const pick = await select({
    message: `Pick a published post to edit-pass (most-recent 30):`,
    choices,
    pageSize: 15,
  });
  if (pick === -1) process.exit(0);
  return published[pick];
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 2: confirm slug, draft path, image path; display + (optionally) edit
//           frontmatter via $EDITOR.
// ────────────────────────────────────────────────────────────────────────────

function openInEditor(filePath) {
  const editor = process.env.EDITOR || process.env.VISUAL || 'vi';
  console.log(`\n→ opening ${path.basename(filePath)} in ${editor} (save + quit to return)…`);
  const r = spawnSync(editor, [filePath], { stdio: 'inherit' });
  if (r.status !== 0) console.log(`(${editor} exited with status ${r.status})`);
}

function displayFrontmatter(meta) {
  console.log('\n📝 Current frontmatter:');
  const display = (k, v) => {
    const flag = isEmptyMetaValue(v) ? ' ⚠️  empty' : '';
    console.log(`   ${k.padEnd(8)} ${v ? `"${v.length > 70 ? v.slice(0, 70) + '…' : v}"` : '(empty)'}${flag}`);
  };
  display('image', meta.image);
  display('alt', meta.alt);
  display('caption', meta.caption);
}

async function confirmPathsAndMeta(entry) {
  const inferredSlug = slugify(entry.title);
  const slug = await input({ message: 'Slug:', default: inferredSlug });

  const inferredDraft = findDraftFile(slug) || '';
  const draftPath = await input({
    message: 'Draft file path:',
    default: inferredDraft,
    validate: v => v.trim().length > 0 || 'required',
  });

  // Pre-flight: check draft exists
  const draftCheck = checkDraftPath(draftPath);
  if (!draftCheck.ok) {
    console.error(`❌ Draft not accessible: ${draftCheck.reason}`);
    process.exit(2);
  }

  // Read + display frontmatter
  let { meta } = readDraftFrontmatter(draftPath);
  displayFrontmatter(meta);

  // Offer to edit if any frontmatter field is empty (or always offer)
  const anyEmpty = isEmptyMetaValue(meta.image) || isEmptyMetaValue(meta.alt) || isEmptyMetaValue(meta.caption);
  if (anyEmpty) {
    const editChoice = await select({
      message: '⚠️  Frontmatter has empty fields. Open in $EDITOR to fix?',
      choices: [
        { name: 'Yes — open in editor', value: 'edit' },
        { name: 'No — continue (will trigger publish-post.js --force or block)', value: 'skip' },
        { name: 'Abort', value: 'abort' },
      ],
      default: 'edit',
    });
    if (editChoice === 'abort') process.exit(0);
    if (editChoice === 'edit') {
      openInEditor(draftPath);
      // Re-read after edit
      const reread = readDraftFrontmatter(draftPath);
      meta = reread.meta;
      displayFrontmatter(meta);
    }
  } else {
    const editAnyway = await confirm({ message: 'Frontmatter looks populated. Open in $EDITOR anyway?', default: false });
    if (editAnyway) {
      openInEditor(draftPath);
      const reread = readDraftFrontmatter(draftPath);
      meta = reread.meta;
      displayFrontmatter(meta);
    }
  }

  // Image path (ship category skips)
  const category = themeToCategory(entry.theme);
  let imagePath = '';
  if (category !== 'ship') {
    // Try frontmatter image as a hint; fall back to slug-heuristic search
    const draftDir = path.dirname(draftPath);
    let inferredImage = '';
    if (meta.image) {
      const fmImagePath = path.join(draftDir, meta.image);
      if (fs.existsSync(fmImagePath)) inferredImage = fmImagePath;
    }
    if (!inferredImage) inferredImage = findImageForDraft(draftPath, slug) || '';

    imagePath = await input({
      message: 'Image file path:',
      default: inferredImage,
      validate: v => v.trim().length > 0 || 'required for non-ship posts',
    });

    // Pre-flight: image-not-at-path with Downloads/Desktop fallback search
    const imgCheck = checkImagePath(imagePath);
    if (!imgCheck.ok) {
      console.log(`\n⚠️  Image '${path.basename(imagePath)}' not found at expected path.`);
      if (imgCheck.alternatives && imgCheck.alternatives.length > 0) {
        console.log(`   Found in: ${imgCheck.alternatives.join(', ')}`);
        const useAlt = await select({
          message: 'Use one of the alternatives, or abort?',
          choices: [
            ...imgCheck.alternatives.map(a => ({ name: `Use ${a}`, value: a })),
            { name: 'Abort', value: '__abort__' },
          ],
        });
        if (useAlt === '__abort__') process.exit(0);
        imagePath = useAlt;
      } else {
        console.error(`   No alternatives found in ~/Downloads or ~/Desktop. Aborting.`);
        process.exit(2);
      }
    }
  }

  return { slug, draftPath, imagePath, category, pubDate: entry.pubDate, meta };
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 3: P]ublish now / R]eady for later branching (decision #3)
// ────────────────────────────────────────────────────────────────────────────

async function publishOrReadyBranch(opts, entry) {
  console.log('\n✅ Metadata confirmed.');
  const action = await select({
    message: 'How do you want to proceed?',
    choices: [
      { name: '[P] Publish now (runs publish-post.js, commit + push)', value: 'publish' },
      { name: '[R] Mark Ready for later (status → ready, no publish; come back when pubDate hits)', value: 'ready' },
      { name: '[c] Cancel', value: 'cancel' },
    ],
    default: 'publish',
  });
  if (action === 'cancel') process.exit(0);
  if (action === 'ready') {
    const result = markReady(entry.title, { pubDate: opts.pubDate });
    if (!result.ok) {
      console.error(`❌ markReady failed: ${result.reason}`);
      process.exit(1);
    }
    if (result.noop) {
      console.log(`ℹ️  Already ready. No calendar changes.`);
    } else {
      console.log(`✅ Calendar updated: ${result.changes.join('; ')}`);
    }
    console.log(`\nℹ️  Draft is now marked ready. Re-invoke when ready to publish.`);
    process.exit(0);
  }
  return; // continues to publish phase
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 4: invoke publish-post.js (dry-run first, then real)
// ────────────────────────────────────────────────────────────────────────────

function runPublishPost(opts, { dryRun }) {
  const args = [
    PUBLISH_POST,
    '--draft', opts.draftPath,
    '--slug', opts.slug,
    '--category', opts.category,
    '--report', 'json',
  ];
  if (opts.imagePath) args.push('--image', opts.imagePath);
  if (opts.pubDate) args.push('--pub-date', opts.pubDate);
  if (dryRun) args.push('--dry-run');
  if (opts.editPassHashId) args.push('--mode', 'edit-pass', '--hash-id', opts.editPassHashId);
  const r = spawnSync('node', args, {
    cwd: REPO_ROOT,
    encoding: 'utf-8',
    stdio: ['inherit', 'pipe', 'inherit'],
  });
  let report = null;
  if (r.stdout) {
    const lines = r.stdout.trim().split('\n').filter(Boolean);
    const last = lines[lines.length - 1];
    try { report = JSON.parse(last); } catch { /* not JSON */ }
  }
  return { status: r.status ?? 1, report };
}

function showGitDiff() {
  console.log('\n📋 Website repo diff:\n');
  spawnSync('git', ['diff', '--stat', 'HEAD'], { cwd: REPO_ROOT, stdio: 'inherit' });
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 5: commit + push with default-N confirm
// ────────────────────────────────────────────────────────────────────────────

async function commitAndPush(title, isEditPass = false) {
  const defaultMsg = isEditPass ? `Update blog post: ${title}` : `Add blog post: ${title}`;
  const action = await select({
    message: 'Commit + push?',
    choices: [
      { name: `Yes — commit with message: "${defaultMsg}"`, value: 'y' },
      { name: 'Edit message, then commit + push', value: 'e' },
      { name: 'No — leave diff for manual review', value: 'N' },
    ],
    default: 'N',
  });
  if (action === 'N') {
    console.log('\nℹ️  Skipping commit. Diff is left in place. Review and commit when ready.');
    return { committed: false };
  }
  let message = defaultMsg;
  if (action === 'e') {
    message = await input({
      message: 'Commit message:',
      default: defaultMsg,
      validate: v => v.trim().length > 0 || 'required',
    });
  }
  console.log('\n→ git add .');
  spawnSync('git', ['add', '.'], { cwd: REPO_ROOT, stdio: 'inherit' });
  console.log('→ git commit');
  const commit = spawnSync('git', ['commit', '-m', message], { cwd: REPO_ROOT, stdio: 'inherit' });
  if (commit.status !== 0) {
    console.error('❌ commit failed');
    process.exit(1);
  }
  // Get the commit SHA we just created
  const shaR = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf-8' });
  const sha = (shaR.stdout || '').trim();
  console.log('→ git push origin main');
  const push = spawnSync('git', ['push', 'origin', 'main'], { cwd: REPO_ROOT, stdio: 'inherit' });
  if (push.status !== 0) {
    console.error('❌ push failed');
    process.exit(1);
  }
  console.log(`\n✅ Published. Commit: ${sha}`);
  return { committed: true, sha };
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 6: drop the Docs-notify memo (decision #2 + today's JSON-in-memo signal)
// ────────────────────────────────────────────────────────────────────────────

async function notifyDocs(report, sha) {
  if (!report) {
    console.log('⚠️  No publish report available; skipping Docs-notify memo.');
    return;
  }
  const drop = await confirm({ message: 'Drop publish-handoff memo to Docs inbox?', default: true });
  if (!drop) return;
  const result = dropPublishHandoffMemo({
    title: report.title,
    slug: report.slug,
    hashId: report.hashId,
    url: report.url,
    category: report.category,
    pubDate: report.pubDate || '',
    websiteCommit: sha,
    imageAlt: report.imageAlt,
    imageCaption: report.imageCaption,
  });
  if (result.ok) {
    console.log(`✅ Memo dropped: ${path.relative(process.cwd(), result.path)}`);
  } else {
    console.log(`⚠️  Memo not dropped: ${result.reason}`);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Main flows
// ────────────────────────────────────────────────────────────────────────────

async function publishFlow() {
  const entry = await pickFromQueue();
  console.log(`\n→ Selected: "${entry.title}" (${entry.status}, ${entry.theme})`);
  const opts = await confirmPathsAndMeta(entry);
  await publishOrReadyBranch(opts, entry);

  console.log('\n→ Dry-run preview…\n');
  const dry = runPublishPost(opts, { dryRun: true });
  if (dry.status !== 0) {
    console.error(`\n❌ Dry-run failed (exit ${dry.status}). Aborting.`);
    process.exit(dry.status);
  }
  console.log('\n✅ Dry-run clean.');

  const proceed = await confirm({ message: 'Proceed with real publish?', default: true });
  if (!proceed) { console.log('Aborted.'); process.exit(0); }

  console.log('\n→ Real publish…\n');
  const real = runPublishPost(opts, { dryRun: false });
  if (real.status !== 0) {
    console.error(`\n❌ Publish failed (exit ${real.status}). No commit attempted.`);
    process.exit(real.status);
  }
  console.log(`\n✅ Publish complete. hashId=${real.report?.hashId}, url=${real.report?.url}`);

  showGitDiff();
  const commit = await commitAndPush(real.report?.title || entry.title);
  if (commit.committed) await notifyDocs(real.report, commit.sha);
}

async function editPassFlow() {
  console.log('✏️  Edit-pass mode — re-publish an existing post with updated draft content.\n');
  const entry = await pickPublishedEntry();
  // Calendar entry for a published post may have blogPath but no draft path —
  // derive slug from blogPath, prompt for draft path (search same as publish flow).
  const slug = entry.blogPath.replace(/^\/(?:blog|shipping-news)\//, '');
  console.log(`\n→ Selected: "${entry.title}" (slug=${slug}, pubDate=${entry.pubDate})`);

  // Find the draft — may be in drafts/ (if PM re-editing) or drafts/published/ (already archived)
  let draftPath = findDraftFile(slug);
  if (!draftPath) {
    // Search drafts/published/
    const publishedDir = path.resolve(REPO_ROOT, '..', 'piper-morgan-product', 'docs', 'public', 'comms', 'drafts', 'published');
    if (fs.existsSync(publishedDir)) {
      const files = fs.readdirSync(publishedDir);
      const match = files.find(f => f === `${slug}.md` || f.includes(slug));
      if (match) draftPath = path.join(publishedDir, match);
    }
  }
  draftPath = await input({
    message: 'Draft file path (edit-pass source):',
    default: draftPath || '',
    validate: v => v.trim().length > 0 || 'required',
  });

  // Look up the existing hashId from the medium-posts.json for this slug.
  // (We need it because edit-pass mode writes to that specific entry in blog-content.json.)
  const postsPath = path.join(REPO_ROOT, 'src/data/medium-posts.json');
  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
  const post = posts.find(p => p.slug === slug);
  if (!post || !post.guid) {
    console.error(`❌ Could not find existing post in medium-posts.json with slug=${slug}`);
    process.exit(2);
  }
  const hashIdMatch = post.guid.match(/([a-f0-9]{12})/);
  if (!hashIdMatch) {
    console.error(`❌ Could not extract hashId from guid: ${post.guid}`);
    process.exit(2);
  }
  const hashId = hashIdMatch[1];
  console.log(`→ Existing hashId: ${hashId}`);

  const opts = {
    slug,
    draftPath,
    category: themeToCategory(entry.theme),
    editPassHashId: hashId,
  };

  console.log('\n→ Edit-pass dry-run…\n');
  const dry = runPublishPost(opts, { dryRun: true });
  if (dry.status !== 0) {
    console.error(`\n❌ Dry-run failed (exit ${dry.status}). Aborting.`);
    process.exit(dry.status);
  }

  const proceed = await confirm({ message: 'Proceed with edit-pass?', default: true });
  if (!proceed) { console.log('Aborted.'); process.exit(0); }

  console.log('\n→ Real edit-pass…\n');
  const real = runPublishPost(opts, { dryRun: false });
  if (real.status !== 0) {
    console.error(`\n❌ Edit-pass failed (exit ${real.status}). No commit attempted.`);
    process.exit(real.status);
  }
  console.log(`\n✅ Edit-pass complete.`);

  showGitDiff();
  await commitAndPush(real.report?.title || entry.title, true);
  // No Docs notify for edit-pass — calendar fields don't change; no /update-calendar needed
}

async function main() {
  console.log(`📝 publish-cli — ${EDIT_PASS_MODE ? 'edit-pass mode' : 'interactive publish flow'}\n`);
  if (EDIT_PASS_MODE) {
    await editPassFlow();
  } else {
    await publishFlow();
  }
}

main().catch(err => {
  if (err && err.name === 'ExitPromptError') {
    console.log('\nCanceled.');
    process.exit(0);
  }
  console.error('❌', err.message || err);
  process.exit(1);
});
