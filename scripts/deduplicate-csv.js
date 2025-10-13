#!/usr/bin/env node

/**
 * Step 1: Deduplicate CSV Entries
 * Keep CURRENT (2025) entries, remove LEGACY (2001) duplicates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv.backup');

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

function formatCsvRow(fields) {
  return fields.map(field => {
    // Quote fields that contain commas or quotes
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }).join(',');
}

console.log('📋 STEP 1: DEDUPLICATE CSV ENTRIES');
console.log('==================================\n');

// Backup original CSV
fs.copyFileSync(CSV_PATH, BACKUP_PATH);
console.log(`✅ Backed up original to: ${BACKUP_PATH}\n`);

// Read CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = csvContent.split('\n').filter(l => l.trim());
const header = lines[0];
const dataLines = lines.slice(1);

console.log(`📊 BEFORE: ${lines.length} lines (${dataLines.length} data + 1 header)\n`);

// Group by hashId
const byHashId = new Map();
dataLines.forEach((line, idx) => {
  const fields = parseCsvRow(line);
  const [slug, hashId, title, image, workDate, pubDate] = fields;

  if (!byHashId.has(hashId)) {
    byHashId.set(hashId, []);
  }

  byHashId.get(hashId).push({
    lineNum: idx + 2,
    line: line,
    fields: fields,
    slug,
    hashId,
    title: title.replace(/^\"|\"$/g, ''),
    pubDate,
    isCurrent: pubDate.startsWith('2025'),
    isLegacy: pubDate.startsWith('2001')
  });
});

console.log(`🔍 Found ${byHashId.size} unique hashIds\n`);

// Process duplicates
const duplicates = Array.from(byHashId.entries()).filter(([_, entries]) => entries.length > 1);
console.log(`🔁 DUPLICATES: ${duplicates.length} hashIds with multiple entries\n`);

let removedCount = 0;
const keptEntries = [];

duplicates.forEach(([hashId, entries]) => {
  const current = entries.filter(e => e.isCurrent);
  const legacy = entries.filter(e => e.isLegacy);

  console.log(`   ${hashId}:`);
  console.log(`      Current entries: ${current.length}`);
  console.log(`      Legacy entries: ${legacy.length}`);

  // Keep current entries, discard legacy
  if (current.length > 0) {
    console.log(`      ✅ Keeping ${current.length} current entry/entries`);
    current.forEach(e => console.log(`         [${e.lineNum}] ${e.title.substring(0, 60)}...`));
    keptEntries.push(...current);
  } else {
    // If no current entries, keep the first one (safety fallback)
    console.log(`      ⚠️  No current entries, keeping first one`);
    keptEntries.push(entries[0]);
  }

  if (legacy.length > 0) {
    console.log(`      ❌ Removing ${legacy.length} legacy entry/entries`);
    legacy.forEach(e => console.log(`         [${e.lineNum}] ${e.title.substring(0, 60)}...`));
    removedCount += legacy.length;
  }

  console.log();
});

// Build cleaned CSV
const cleanedLines = [header];

// Add all non-duplicate entries
byHashId.forEach((entries, hashId) => {
  if (entries.length === 1) {
    cleanedLines.push(entries[0].line);
  }
});

// Add kept entries from duplicates
keptEntries.forEach(entry => {
  cleanedLines.push(entry.line);
});

// Sort by hashId for consistency
const sortedData = cleanedLines.slice(1).sort((a, b) => {
  const hashA = parseCsvRow(a)[1];
  const hashB = parseCsvRow(b)[1];
  return hashA.localeCompare(hashB);
});

const finalCsv = [header, ...sortedData].join('\n') + '\n';

// Write cleaned CSV
fs.writeFileSync(CSV_PATH, finalCsv, 'utf-8');

console.log('📊 RESULTS:');
console.log(`   Before: ${dataLines.length} data rows`);
console.log(`   After: ${sortedData.length} data rows`);
console.log(`   Removed: ${removedCount} duplicate entries`);
console.log(`   Unique hashIds: ${byHashId.size}`);
console.log();

// Verification
console.log('✅ VERIFICATION:');
const verifyLines = fs.readFileSync(CSV_PATH, 'utf-8').split('\n').filter(l => l.trim());
const verifyData = verifyLines.slice(1);
const verifyHashIds = new Set();
let dupeCount = 0;

verifyData.forEach(line => {
  const fields = parseCsvRow(line);
  const hashId = fields[1];
  if (verifyHashIds.has(hashId)) {
    dupeCount++;
    console.log(`   ❌ DUPLICATE: ${hashId}`);
  }
  verifyHashIds.add(hashId);
});

console.log(`   Total lines: ${verifyLines.length} (${verifyData.length} data + 1 header) ✅`);
console.log(`   Unique hashIds: ${verifyHashIds.size} ✅`);
console.log(`   Duplicates found: ${dupeCount} ${dupeCount === 0 ? '✅' : '❌'}`);
console.log();

if (dupeCount === 0 && verifyData.length === byHashId.size) {
  console.log('🎉 SUCCESS! CSV deduplicated successfully.');
  console.log(`   Backup saved at: ${BACKUP_PATH}`);
} else {
  console.log('❌ VERIFICATION FAILED!');
  console.log('   Restoring from backup...');
  fs.copyFileSync(BACKUP_PATH, CSV_PATH);
  process.exit(1);
}
