#!/usr/bin/env node

/**
 * Add 4 missing posts to blog-metadata.csv from date-export.csv
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPORT_CSV_PATH = path.join(__dirname, '..', 'date-export.csv');
const METADATA_CSV_PATH = path.join(__dirname, '..', 'data/blog-metadata.csv');
const BACKUP_PATH = path.join(__dirname, '..', 'data/blog-metadata.csv.backup-before-adding-posts');

// The 4 missing hashIds
const MISSING_HASH_IDS = [
  'cb4864b0cfc6', // When 75% Turns Out to Mean 100%
  'aae61fe91f37', // The Agent That Saved Me From Shipping 69%
  'dbf652a9a5bd', // The Great Refactor: Six Weeks in Eighteen Days
  'bdbe24a41c13'  // The Calm After the Storm...
];

/**
 * Parse a CSV row, handling quoted fields
 */
function parseCsvRow(row) {
  const fields = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }
  fields.push(currentField);
  return fields;
}

/**
 * Extract hashId from Medium URL
 */
function extractHashIdFromUrl(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})/);
  return match ? match[1] : null;
}

/**
 * Convert title to slug
 */
function titleToSlug(title) {
  // Remove date prefixes like "10/4: "
  let cleanTitle = title.replace(/^\d{1,2}\/\d{1,2}:\s*/, '');

  return cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100); // Limit length
}

/**
 * Extract chatDate from title prefix
 */
function extractChatDate(title) {
  const match = title.match(/^(\d{1,2}\/\d{1,2}):/);
  return match ? `${match[1]}/2025` : '';
}

/**
 * Convert M/D/YYYY to YYYY-MM-DD
 */
function convertDateFormat(mdyDate) {
  if (!mdyDate || mdyDate.trim() === '') return '';
  const parts = mdyDate.split('/');
  if (parts.length !== 3) return mdyDate;
  const month = parts[0].padStart(2, '0');
  const day = parts[1].padStart(2, '0');
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

/**
 * Convert CSV row to string, quoting fields with commas
 */
function csvRowToString(fields) {
  return fields.map(field => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }).join(',');
}

console.log('📄 Reading date export CSV...');
const exportContent = fs.readFileSync(EXPORT_CSV_PATH, 'utf-8');
const exportLines = exportContent.split('\n');

// Find the 4 missing posts in export
const missingPosts = new Map();

for (let i = 1; i < exportLines.length; i++) {
  const line = exportLines[i].trim();
  if (!line) continue;

  const fields = parseCsvRow(line);
  if (fields.length < 4) continue;

  const title = fields[0];
  const mediumUrl = fields[1];
  const workDate = fields[2];
  const pubDate = fields[3];

  const hashId = extractHashIdFromUrl(mediumUrl);
  if (!hashId || !MISSING_HASH_IDS.includes(hashId)) continue;

  missingPosts.set(hashId, {
    title,
    workDate: convertDateFormat(workDate),
    pubDate: convertDateFormat(pubDate),
    chatDate: extractChatDate(title),
    slug: titleToSlug(title)
  });
}

console.log(`✅ Found ${missingPosts.size} missing posts in export`);
missingPosts.forEach((data, hashId) => {
  console.log(`   ${hashId}: ${data.title.substring(0, 60)}...`);
});

if (missingPosts.size < 3) {
  console.error(`❌ Expected at least 3 posts, found ${missingPosts.size}`);
  process.exit(1);
}

if (missingPosts.size === 3) {
  console.log(`\n⚠️  Note: Only 3 of 4 posts found in export.`);
  console.log(`   The 4th post (bdbe24a41c13) is too new and not yet in date-export.csv`);
  console.log(`   We'll add it with placeholder dates for you to fill in.`);

  // Add the 4th post with placeholders
  missingPosts.set('bdbe24a41c13', {
    title: '10/4: The Calm After the Storm: When Victory Means Stopping to Plan',
    workDate: '',  // You'll need to fill this
    pubDate: '2025-10-15',
    chatDate: '10/4/2025',
    slug: 'the-calm-after-the-storm-when-victory-means-stopping-to-plan'
  });
}

// Read metadata CSV
console.log('\n📄 Reading blog metadata CSV...');
const metadataContent = fs.readFileSync(METADATA_CSV_PATH, 'utf-8');
const metadataLines = metadataContent.split('\n');

console.log('💾 Creating backup...');
fs.writeFileSync(BACKUP_PATH, metadataContent, 'utf-8');
console.log(`   Backup saved to: ${BACKUP_PATH}`);

// Parse header
const header = metadataLines[0];
const headerFields = parseCsvRow(header);

// Expected fields: slug,hashId,title,chatDate,imageSlug,workDate,pubDate,category,cluster,featured,notes
console.log('\n➕ Adding 4 new posts...');

const newRows = [];

MISSING_HASH_IDS.forEach(hashId => {
  const data = missingPosts.get(hashId);
  if (!data) {
    console.error(`❌ Missing data for ${hashId}`);
    return;
  }

  // Clean title (remove date prefix)
  const cleanTitle = data.title.replace(/^\d{1,2}\/\d{1,2}:\s*/, '');

  const newRow = [
    data.slug,              // slug
    hashId,                 // hashId
    cleanTitle,             // title (cleaned)
    data.chatDate,          // chatDate
    '',                     // imageSlug (empty - user will fill)
    data.workDate,          // workDate
    data.pubDate,           // pubDate
    '',                     // category (empty - user will fill)
    '',                     // cluster (empty - user will fill)
    '',                     // featured (empty)
    ''                      // notes (empty)
  ];

  newRows.push(newRow);
  console.log(`   Added: ${hashId} - ${cleanTitle.substring(0, 60)}...`);
});

// Append new rows to metadata CSV
const updatedLines = [
  ...metadataLines.slice(0, -1), // Remove last empty line if exists
  ...newRows.map(row => csvRowToString(row)),
  '' // Add final empty line
];

// Write updated CSV
console.log('\n✏️  Writing updated CSV...');
fs.writeFileSync(METADATA_CSV_PATH, updatedLines.join('\n'), 'utf-8');

console.log('\n✅ Posts added successfully!');
console.log(`\n📈 Summary:`);
console.log(`   Total posts in CSV: ${updatedLines.length - 1} (excluding header)`);
console.log(`   Posts added: ${newRows.length}`);

console.log(`\n⚠️  You still need to fill in for each post:`);
console.log(`   - imageSlug (e.g., "robot-1013.webp")`);
console.log(`   - category (building or insight)`);
console.log(`   - cluster (episode name)`);

console.log(`\n💡 To restore the original CSV, run:`);
console.log(`   cp ${BACKUP_PATH} ${METADATA_CSV_PATH}`);
