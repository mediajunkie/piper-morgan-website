#!/usr/bin/env node

/**
 * publish-cli.js — CLI B walking-skeleton.
 *
 * Interactive wrapper around publish-post.js. Walks PM through:
 *   1. Pick a draft from the calendar queue (queued/drafted/ready)
 *   2. Confirm/correct slug, draft path, image path
 *   3. Dry-run preview via publish-post.js --dry-run
 *   4. Confirm proceed to real publish
 *   5. Run publish-post.js --report=json, capture report
 *   6. Show git diff in the website repo
 *   7. Prompt: commit + push? (y / e / N — default N)
 *      - y: commit with auto-generated message + push
 *      - e: edit the message inline, then commit + push
 *      - N: stop, leave the diff for PM to handle
 *
 * Walking-skeleton scope per the post-discussion sketch
 * (dev/2026/05/17/2026-05-17-0747-cli-b-design-sketch.md, "Resolved design
 * decisions" section). Enrichment lands in a second pass: gray-matter
 * metadata editor + P]ublish/R]eady branching + open-in-$EDITOR + edit-pass
 * mode + Docs-notification memo.
 *
 * Usage:
 *   node scripts/publish-cli.js   (or)   npm run publish
 */

import { select, input, confirm } from '@inquirer/prompts';
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { getQueue, slugify, findDraftFile, findImageForDraft, themeToCategory } from './lib/queue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const PUBLISH_POST = path.join(__dirname, 'publish-post.js');

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

async function confirmPaths(entry) {
  const inferredSlug = slugify(entry.title);
  const slug = await input({
    message: 'Slug:',
    default: inferredSlug,
  });
  const inferredDraft = findDraftFile(slug) || '';
  const draftPath = await input({
    message: 'Draft file path:',
    default: inferredDraft,
    validate: (v) => v.trim().length > 0 || 'required',
  });
  let imagePath = '';
  if (entry.theme !== 'ship') {
    const inferredImage = findImageForDraft(draftPath, slug) || '';
    imagePath = await input({
      message: 'Image file path:',
      default: inferredImage,
      validate: (v) => v.trim().length > 0 || 'required for non-ship posts',
    });
  }
  return { slug, draftPath, imagePath, category: themeToCategory(entry.theme), pubDate: entry.pubDate };
}

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
  // Stream the script's stderr (log lines) live; capture stdout (JSON report)
  const r = spawnSync('node', args, {
    cwd: REPO_ROOT,
    encoding: 'utf-8',
    stdio: ['inherit', 'pipe', 'inherit'],
  });
  let report = null;
  if (r.stdout) {
    // The JSON report is the last line of stdout
    const lines = r.stdout.trim().split('\n').filter(Boolean);
    const last = lines[lines.length - 1];
    try { report = JSON.parse(last); } catch { /* not JSON */ }
  }
  return { status: r.status ?? 1, report };
}

function showGitDiff() {
  console.log('\n📋 Website repo diff:\n');
  const r = spawnSync('git', ['diff', '--stat', 'HEAD'], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
  if (r.status !== 0) {
    console.log('(git diff failed or no changes)');
  }
}

async function commitAndPush(title) {
  const defaultMsg = `Add blog post: ${title}`;
  // Inquirer: y/e/N prompt — use select to get clean choices rather than confirm
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
    console.log('\nℹ️  Skipping commit. Diff is left in place. Review and commit when ready:');
    console.log('   git -C ' + REPO_ROOT + ' status');
    return;
  }
  let message = defaultMsg;
  if (action === 'e') {
    message = await input({
      message: 'Commit message:',
      default: defaultMsg,
      validate: (v) => v.trim().length > 0 || 'required',
    });
  }
  // git add (specific files mutated by publish-post — its JSON report lists them, but
  // for walking-skeleton just `git add -A` within the changed paths set is fine; we
  // use git add . scoped via the report's filesMutated list. For now use git add -u
  // for tracked + git add for the new image file separately.)
  // Simplest robust approach: git add . — the only changes should be from publish-post.js
  console.log('\n→ git add .');
  spawnSync('git', ['add', '.'], { cwd: REPO_ROOT, stdio: 'inherit' });
  console.log('→ git commit -m "' + message + '"');
  const commit = spawnSync('git', ['commit', '-m', message], { cwd: REPO_ROOT, stdio: 'inherit' });
  if (commit.status !== 0) {
    console.error('❌ commit failed');
    process.exit(1);
  }
  console.log('→ git push origin main');
  const push = spawnSync('git', ['push', 'origin', 'main'], { cwd: REPO_ROOT, stdio: 'inherit' });
  if (push.status !== 0) {
    console.error('❌ push failed');
    process.exit(1);
  }
  console.log('\n✅ Published.');
}

async function main() {
  console.log('📝 publish-cli — interactive publish flow\n');

  const entry = await pickFromQueue();
  console.log(`\n→ Selected: "${entry.title}" (${entry.status}, ${entry.theme})`);

  const opts = await confirmPaths(entry);

  console.log('\n→ Dry-run preview (publish-post.js --dry-run)…\n');
  const dryReport = runPublishPost(opts, { dryRun: true });
  if (dryReport.status !== 0) {
    console.error(`\n❌ Dry-run failed (exit ${dryReport.status}). Aborting.`);
    process.exit(dryReport.status);
  }
  console.log(`\n✅ Dry-run clean.`);

  const proceed = await confirm({ message: 'Proceed with real publish?', default: true });
  if (!proceed) {
    console.log('Aborted by user.');
    process.exit(0);
  }

  console.log('\n→ Real publish…\n');
  const realReport = runPublishPost(opts, { dryRun: false });
  if (realReport.status !== 0) {
    console.error(`\n❌ Publish failed (exit ${realReport.status}). No commit attempted.`);
    process.exit(realReport.status);
  }
  console.log(`\n✅ Publish complete. hashId=${realReport.report?.hashId}, url=${realReport.report?.url}`);

  showGitDiff();

  await commitAndPush(realReport.report?.title || entry.title);
}

main().catch(err => {
  // Inquirer cancels (Ctrl+C) throw an ExitPromptError — silent exit per convention
  if (err && err.name === 'ExitPromptError') {
    console.log('\nCanceled.');
    process.exit(0);
  }
  console.error('❌', err.message || err);
  process.exit(1);
});
