#!/usr/bin/env node

/**
 * test-publish-post-corpus.js — regression test runner for publish-post.js
 * markdown→HTML conversion.
 *
 * Per Docs's 2026-05-17 "CLI feature corpus" proposal. Iterates over
 * scripts/publish-post-corpus/NN-name/ subdirs, each containing:
 *   - source.md       — a complete draft (frontmatter + H1 title + body)
 *   - expected.html   — the dry-run HTML preview the converter should produce
 *
 * For each entry, runs `node scripts/publish-post.js --dry-run --force …`
 * against source.md, extracts the HTML preview block from stderr, and diffs
 * against expected.html. Reports per-entry pass/fail; exits non-zero if any
 * entry fails.
 *
 * The --force flag suppresses Gap 3's empty-frontmatter warnings — corpus
 * entries should have populated frontmatter, but --force is belt-and-suspenders
 * so the test never depends on warning behavior.
 *
 * Usage:
 *   node scripts/test-publish-post-corpus.js          # run all entries
 *   node scripts/test-publish-post-corpus.js NN-name  # run a single entry
 *
 * Exit codes:
 *   0 = all pass
 *   1 = one or more fail
 *   2 = harness / setup error
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CORPUS_DIR = path.join(__dirname, 'publish-post-corpus');
const PUBLISH_POST = path.join(__dirname, 'publish-post.js');
const FAKE_IMAGE = '/tmp/__corpus_nope.png';  // must not exist; --dry-run skips image prep anyway

function extractHtmlFromOutput(stderr) {
  const m = stderr.match(/--- converted HTML \(dry-run preview\) ---\n([\s\S]*?)\n--- end preview ---/);
  return m ? m[1] : null;
}

function runEntry(entryDir) {
  const name = path.basename(entryDir);
  const sourcePath = path.join(entryDir, 'source.md');
  const expectedPath = path.join(entryDir, 'expected.html');
  if (!fs.existsSync(sourcePath)) return { name, status: 'error', reason: 'missing source.md' };
  if (!fs.existsSync(expectedPath)) return { name, status: 'error', reason: 'missing expected.html' };

  const expected = fs.readFileSync(expectedPath, 'utf-8').replace(/\n+$/, '');
  const r = spawnSync('node', [
    PUBLISH_POST,
    '--draft', sourcePath,
    '--slug', 'corpus-test',
    '--category', 'insight',
    '--image', FAKE_IMAGE,
    '--dry-run',
    '--force',
  ], { encoding: 'utf-8' });

  const actual = extractHtmlFromOutput(r.stderr || '');
  if (actual == null) {
    return {
      name,
      status: 'error',
      reason: `dry-run produced no HTML preview block (exit ${r.status})`,
      stderr: (r.stderr || '').slice(-500),
    };
  }
  if (actual.replace(/\n+$/, '') === expected) {
    return { name, status: 'pass' };
  }
  return { name, status: 'fail', expected, actual };
}

function discoverEntries(filterName = null) {
  if (!fs.existsSync(CORPUS_DIR)) {
    console.error(`❌ Corpus dir not found: ${CORPUS_DIR}`);
    process.exit(2);
  }
  const all = fs.readdirSync(CORPUS_DIR)
    .filter(name => {
      const full = path.join(CORPUS_DIR, name);
      return fs.statSync(full).isDirectory();
    })
    .sort();
  return filterName ? all.filter(n => n === filterName) : all;
}

function formatDiff(expected, actual) {
  const exp = expected.split('\n');
  const act = actual.split('\n');
  const max = Math.max(exp.length, act.length);
  const lines = [];
  for (let i = 0; i < max; i++) {
    if (exp[i] === act[i]) continue;
    lines.push(`    line ${i + 1}:`);
    if (exp[i] != null) lines.push(`      expected: ${JSON.stringify(exp[i])}`);
    if (act[i] != null) lines.push(`      actual:   ${JSON.stringify(act[i])}`);
  }
  return lines.join('\n');
}

const filter = process.argv[2] || null;
const entries = discoverEntries(filter);
if (entries.length === 0) {
  console.error(filter ? `❌ No entry matching: ${filter}` : '❌ No corpus entries found');
  process.exit(2);
}

console.log(`📋 publish-post conversion corpus — ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}\n`);

let pass = 0, fail = 0, error = 0;
for (const name of entries) {
  const result = runEntry(path.join(CORPUS_DIR, name));
  if (result.status === 'pass') {
    console.log(`  ✅ ${name}`);
    pass++;
  } else if (result.status === 'fail') {
    console.log(`  ❌ ${name}`);
    console.log(formatDiff(result.expected, result.actual));
    fail++;
  } else {
    console.log(`  ⚠️  ${name}: ${result.reason}`);
    if (result.stderr) console.log(`     stderr: ${result.stderr}`);
    error++;
  }
}

console.log(`\n${pass} pass, ${fail} fail, ${error} error`);
process.exit(fail + error > 0 ? 1 : 0);
