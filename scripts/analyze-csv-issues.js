#!/usr/bin/env node

/**
 * READONLY analysis of CSV issues
 * NO modifications, just reporting
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');

function parseCsvRow(row) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = csvContent.split('\n').filter(l => l.trim());
const header = lines[0];
const dataLines = lines.slice(1);

console.log('📊 CSV ANALYSIS REPORT');
console.log('====================\n');

// Basic counts
console.log('📈 BASIC COUNTS:');
console.log(`   Total lines: ${lines.length} (${dataLines.length} data + 1 header)`);

// Group by hashId
const byHashId = new Map();
dataLines.forEach((line, idx) => {
  const fields = parseCsvRow(line);
  const [slug, hashId, title, , , pubDate] = fields;

  if (!byHashId.has(hashId)) {
    byHashId.set(hashId, []);
  }

  byHashId.get(hashId).push({
    lineNum: idx + 2,
    slug,
    title: title.replace(/^"|"$/g, ''),
    pubDate,
    isLegacy: pubDate.startsWith('2001'),
    isCurrent: pubDate.startsWith('2025'),
    isNumeric: /^[0-9]+$/.test(slug)
  });
});

console.log(`   Unique hashIds: ${byHashId.size}`);
console.log();

// Duplicates
const duplicates = Array.from(byHashId.entries())
  .filter(([_, entries]) => entries.length > 1);

console.log(`🔁 DUPLICATES: ${duplicates.length} hashIds with multiple entries`);
if (duplicates.length > 0) {
  console.log();
  duplicates.slice(0, 5).forEach(([hashId, entries]) => {
    console.log(`   ${hashId}: ${entries.length} entries`);
    entries.forEach(e => {
      const badge = e.isCurrent ? '✅ CURRENT' : e.isLegacy ? '📦 LEGACY' : '⚠️  UNKNOWN';
      console.log(`      [${e.lineNum}] ${badge} slug="${e.slug}" date=${e.pubDate}`);
      console.log(`           ${e.title.substring(0, 60)}...`);
    });
    console.log();
  });
  if (duplicates.length > 5) {
    console.log(`   ... and ${duplicates.length - 5} more\n`);
  }
}

// Numeric slugs
const numericSlugs = Array.from(byHashId.values())
  .flat()
  .filter(e => e.isNumeric);

console.log(`🔢 NUMERIC SLUGS: ${numericSlugs.length} entries`);
const uniqueNumeric = new Set(numericSlugs.map(e => e.slug));
console.log(`   Unique values: ${[...uniqueNumeric].sort().join(', ')}`);
console.log();

// Legacy entries
const legacyCount = dataLines.filter(l => l.includes(',2001-')).length;
const currentCount = dataLines.filter(l => l.includes(',2025-')).length;

console.log(`📅 DATE DISTRIBUTION:`);
console.log(`   Legacy (2001): ${legacyCount}`);
console.log(`   Current (2025): ${currentCount}`);
console.log();

// Strategy recommendation
console.log('💡 RECOMMENDED STRATEGY:');
console.log();
console.log('   1. DEDUPLICATE: Keep current (2025) entries, remove legacy (2001)');
console.log(`      Expected result: ${byHashId.size} unique posts`);
console.log();
console.log('   2. GENERATE SLUGS: Replace all numeric slugs with human-readable');
console.log(`      Will affect: ${numericSlugs.filter(e => e.isCurrent).length} current entries`);
console.log();
console.log('   3. VERIFY: Ensure all slugs are unique and readable');
console.log();
console.log('   4. REBUILD: Regenerate JSON from clean CSV');
console.log();

// Check if current entries have good slugs
const currentWithBadSlugs = Array.from(byHashId.values())
  .flat()
  .filter(e => e.isCurrent && e.isNumeric);

if (currentWithBadSlugs.length > 0) {
  console.log('⚠️  WARNING: Current entries with numeric slugs:');
  currentWithBadSlugs.slice(0, 10).forEach(e => {
    console.log(`   [${e.lineNum}] "${e.slug}" - ${e.title.substring(0, 50)}...`);
  });
  console.log();
}
