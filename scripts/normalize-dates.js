#!/usr/bin/env node

/**
 * Normalize all dates in medium-posts.json to consistent formats:
 * - publishedAtISO → ISO 8601 (e.g., "2026-03-30T00:00:00.000Z")
 * - publishedAt → display string (e.g., "Mar 30, 2026")
 *
 * Handles: empty strings, "Invalid Date", RFC 2822, ISO 8601, plain date strings.
 * Falls back to workDateISO when publishedAtISO is missing/invalid.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');

function tryParseDate(value) {
  if (!value || value === 'Invalid Date') return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function formatDisplay(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const posts = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

let fixed = 0;
let alreadyGood = 0;
let usedFallback = 0;
let noDate = 0;

for (const post of posts) {
  // Try to parse the existing publishedAtISO
  let date = tryParseDate(post.publishedAtISO);

  // If that failed, try fallbacks
  if (!date) {
    date = tryParseDate(post.workDateISO) ||
           tryParseDate(post.isoDate) ||
           tryParseDate(post.pubDate) ||
           tryParseDate(post.workDate);
    if (date) usedFallback++;
  }

  if (!date) {
    noDate++;
    // Ensure display field says something rather than "Invalid Date"
    post.publishedAt = '';
    post.publishedAtISO = '';
    console.log(`  NO DATE: "${post.title}"`);
    continue;
  }

  const iso = date.toISOString();
  const display = formatDisplay(date);

  // Check if anything changed
  if (post.publishedAtISO === iso && post.publishedAt === display) {
    alreadyGood++;
  } else {
    fixed++;
  }

  post.publishedAtISO = iso;
  post.publishedAt = display;
}

// Write back
fs.writeFileSync(DATA_PATH, JSON.stringify(posts, null, 2) + '\n', 'utf-8');

console.log(`\nDate normalization complete:`);
console.log(`  Total posts: ${posts.length}`);
console.log(`  Fixed: ${fixed}`);
console.log(`  Already good: ${alreadyGood}`);
console.log(`  Used fallback (workDateISO etc.): ${usedFallback}`);
console.log(`  No date available: ${noDate}`);
