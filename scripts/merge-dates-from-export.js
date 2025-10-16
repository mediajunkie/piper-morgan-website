#!/usr/bin/env node

/**
 * Merge correct workDate and pubDate from date-export.csv into blog-metadata.csv
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPORT_CSV_PATH = path.join(__dirname, '..', 'date-export.csv');
const METADATA_CSV_PATH = path.join(__dirname, '..', 'data/blog-metadata.csv');
const BACKUP_PATH = path.join(__dirname, '..', 'data/blog-metadata.csv.backup-before-date-merge');

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
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Add last field
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
 * Convert CSV row to proper CSV string, quoting fields with commas
 */
function csvRowToString(fields) {
  return fields.map(field => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      // Quote the field and escape internal quotes
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }).join(',');
}

/**
 * Convert M/D/YYYY to YYYY-MM-DD
 */
function convertDateFormat(mdyDate) {
  if (!mdyDate || mdyDate.trim() === '') return '';

  const parts = mdyDate.split('/');
  if (parts.length !== 3) return mdyDate; // Return as-is if not M/D/YYYY

  const month = parts[0].padStart(2, '0');
  const day = parts[1].padStart(2, '0');
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

console.log('📄 Reading date export CSV...');
const exportContent = fs.readFileSync(EXPORT_CSV_PATH, 'utf-8');
const exportLines = exportContent.split('\n');

// Parse export CSV and build hashId → dates map
const dateMap = new Map();
let skippedCount = 0;

for (let i = 1; i < exportLines.length; i++) {
  const line = exportLines[i].trim();
  if (!line) continue;

  const fields = parseCsvRow(line);
  if (fields.length < 4) {
    console.warn(`⚠️  Export line ${i + 1} has insufficient fields, skipping...`);
    skippedCount++;
    continue;
  }

  const mediumUrl = fields[1];
  const workDate = fields[2];
  const pubDate = fields[3];

  const hashId = extractHashIdFromUrl(mediumUrl);
  if (!hashId) {
    console.warn(`⚠️  Could not extract hashId from: ${mediumUrl}`);
    skippedCount++;
    continue;
  }

  dateMap.set(hashId, {
    workDate: convertDateFormat(workDate),
    pubDate: convertDateFormat(pubDate)
  });
}

console.log(`✅ Loaded ${dateMap.size} date entries from export`);
if (skippedCount > 0) {
  console.log(`⚠️  Skipped ${skippedCount} entries`);
}

// Read and backup metadata CSV
console.log('\n📄 Reading blog metadata CSV...');
const metadataContent = fs.readFileSync(METADATA_CSV_PATH, 'utf-8');
const metadataLines = metadataContent.split('\n');

console.log('💾 Creating backup...');
fs.writeFileSync(BACKUP_PATH, metadataContent, 'utf-8');
console.log(`   Backup saved to: ${BACKUP_PATH}`);

// Parse metadata CSV header
const header = metadataLines[0];
const headerFields = parseCsvRow(header);

const hashIdIndex = headerFields.indexOf('hashId');
const workDateIndex = headerFields.indexOf('workDate');
const pubDateIndex = headerFields.indexOf('pubDate');

if (hashIdIndex === -1 || workDateIndex === -1 || pubDateIndex === -1) {
  console.error('❌ Could not find required columns in metadata CSV');
  process.exit(1);
}

console.log(`\n📊 Processing ${metadataLines.length - 1} metadata rows...`);

// Update metadata CSV with correct dates
const newLines = [csvRowToString(headerFields)];
let updatedCount = 0;
let notFoundCount = 0;

for (let i = 1; i < metadataLines.length; i++) {
  const line = metadataLines[i].trim();
  if (!line) {
    newLines.push('');
    continue;
  }

  const fields = parseCsvRow(line);
  const hashId = fields[hashIdIndex];

  const dates = dateMap.get(hashId);
  if (dates) {
    // Update dates
    fields[workDateIndex] = dates.workDate;
    fields[pubDateIndex] = dates.pubDate;
    updatedCount++;
  } else {
    console.warn(`⚠️  No date data found for hashId: ${hashId}`);
    notFoundCount++;
  }

  newLines.push(csvRowToString(fields));
}

// Write updated CSV
console.log('\n✏️  Writing updated CSV...');
fs.writeFileSync(METADATA_CSV_PATH, newLines.join('\n'), 'utf-8');

console.log('\n✅ Date merge complete!');
console.log(`\n📈 Summary:`);
console.log(`   Rows updated: ${updatedCount}`);
console.log(`   Rows not found in export: ${notFoundCount}`);
console.log(`   Total rows processed: ${metadataLines.length - 1}`);

console.log(`\n💡 To restore the original CSV, run:`);
console.log(`   cp ${BACKUP_PATH} ${METADATA_CSV_PATH}`);
