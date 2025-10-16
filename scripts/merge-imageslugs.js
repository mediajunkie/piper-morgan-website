#!/usr/bin/env node

/**
 * Merge imageSlugs from data/imageSlugs.csv into blog-metadata.csv
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_SLUGS_PATH = path.join(__dirname, '..', 'data/imageSlugs.csv');
const METADATA_CSV_PATH = path.join(__dirname, '..', 'data/blog-metadata.csv');
const BACKUP_PATH = path.join(__dirname, '..', 'data/blog-metadata.csv.backup-before-imageSlug-merge');

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
 * Normalize imageSlug - ensure .webp extension
 */
function normalizeImageSlug(imageSlug) {
  if (!imageSlug || imageSlug.trim() === '') return '';

  imageSlug = imageSlug.trim();

  // Special values that aren't filenames
  if (imageSlug === 'exists' || imageSlug === "Claude's POV!") {
    return '';
  }

  // If it already has .webp extension, return as-is
  if (imageSlug.endsWith('.webp')) {
    return imageSlug;
  }

  // Otherwise add .webp extension
  return `${imageSlug}.webp`;
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

console.log('📄 Reading imageSlugs CSV...');
const imageSlugsContent = fs.readFileSync(IMAGE_SLUGS_PATH, 'utf-8');
const imageSlugsLines = imageSlugsContent.split('\n');

// Parse imageSlugs CSV and build hashId → imageSlug map
const imageSlugMap = new Map();
let skippedCount = 0;

for (let i = 1; i < imageSlugsLines.length; i++) {
  const line = imageSlugsLines[i].trim();
  if (!line) continue;

  const fields = parseCsvRow(line);
  if (fields.length < 2) {
    skippedCount++;
    continue;
  }

  const mediumUrl = fields[0];
  const imageSlug = fields[1];

  const hashId = extractHashIdFromUrl(mediumUrl);
  if (!hashId) {
    if (mediumUrl) {
      console.warn(`⚠️  Could not extract hashId from: ${mediumUrl}`);
    }
    skippedCount++;
    continue;
  }

  const normalizedImageSlug = normalizeImageSlug(imageSlug);
  imageSlugMap.set(hashId, normalizedImageSlug);
}

console.log(`✅ Loaded ${imageSlugMap.size} imageSlug entries`);
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
const imageSlugIndex = headerFields.indexOf('imageSlug');

if (hashIdIndex === -1 || imageSlugIndex === -1) {
  console.error('❌ Could not find required columns in metadata CSV');
  process.exit(1);
}

console.log(`\n📊 Processing ${metadataLines.length - 1} metadata rows...`);

// Update metadata CSV with imageSlugs
const newLines = [csvRowToString(headerFields)];
let updatedCount = 0;
let notFoundCount = 0;
let emptySlugCount = 0;

for (let i = 1; i < metadataLines.length; i++) {
  const line = metadataLines[i].trim();
  if (!line) {
    newLines.push('');
    continue;
  }

  const fields = parseCsvRow(line);
  const hashId = fields[hashIdIndex];

  if (imageSlugMap.has(hashId)) {
    const newImageSlug = imageSlugMap.get(hashId);
    fields[imageSlugIndex] = newImageSlug;

    if (newImageSlug === '') {
      emptySlugCount++;
    } else {
      updatedCount++;
    }
  } else {
    notFoundCount++;
  }

  newLines.push(csvRowToString(fields));
}

// Write updated CSV
console.log('\n✏️  Writing updated CSV...');
fs.writeFileSync(METADATA_CSV_PATH, newLines.join('\n'), 'utf-8');

console.log('\n✅ ImageSlug merge complete!');
console.log(`\n📈 Summary:`);
console.log(`   Rows with imageSlugs updated: ${updatedCount}`);
console.log(`   Rows with empty imageSlugs: ${emptySlugCount}`);
console.log(`   Rows not found in export: ${notFoundCount}`);
console.log(`   Total rows processed: ${metadataLines.length - 1}`);

console.log(`\n💡 To restore the original CSV, run:`);
console.log(`   cp ${BACKUP_PATH} ${METADATA_CSV_PATH}`);
