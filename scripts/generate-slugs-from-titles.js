#!/usr/bin/env node

/**
 * Step 2: Generate Human-Readable Slugs
 * Replace numeric slugs with title-based slugs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv.backup-step2');

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

function generateSlugFromTitle(title) {
  // Remove date prefixes like "8/12:", "10/4:", "7/20 chat:"
  let cleaned = title.replace(/^\d+\/\d+(\s+chat)?:\s*/i, '');

  // Remove "M/D:" or "M/D" prefixes
  cleaned = cleaned.replace(/^M\/D:?\s*/i, '');

  // Convert to lowercase
  cleaned = cleaned.toLowerCase();

  // Remove special characters, keep alphanumeric and spaces
  cleaned = cleaned.replace(/[^a-z0-9\s-]/g, '');

  // Replace multiple spaces with single space
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Trim
  cleaned = cleaned.trim();

  // Replace spaces with hyphens
  let slug = cleaned.replace(/\s/g, '-');

  // Remove multiple consecutive hyphens
  slug = slug.replace(/-+/g, '-');

  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  // Limit length to 100 characters
  if (slug.length > 100) {
    // Try to cut at a word boundary
    slug = slug.substring(0, 100);
    const lastHyphen = slug.lastIndexOf('-');
    if (lastHyphen > 50) {
      slug = slug.substring(0, lastHyphen);
    }
  }

  return slug;
}

console.log('📋 STEP 2: GENERATE HUMAN-READABLE SLUGS');
console.log('=========================================\n');

// Backup CSV
fs.copyFileSync(CSV_PATH, BACKUP_PATH);
console.log(`✅ Backed up CSV to: ${BACKUP_PATH}\n`);

// Read CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = csvContent.split('\n').filter(l => l.trim());
const header = lines[0];
const dataLines = lines.slice(1);

console.log(`📊 Processing ${dataLines.length} entries...\n`);

// Track slug usage for collision detection
const usedSlugs = new Map(); // Map of slug -> count
const updates = [];

// Process each line
const processedLines = dataLines.map((line, idx) => {
  const fields = parseCsvRow(line);
  const [slug, hashId, title] = fields;

  // Check if slug is numeric (pure digits or has date-like format)
  const isNumeric = /^[0-9]+$/.test(slug) || /^\d+-\d+$/.test(slug) || /^\d+to\d+$/.test(slug);

  let finalSlug;
  let needsUpdate = false;

  if (!isNumeric) {
    // Already has a non-numeric slug, but check for duplicates
    const currentCount = usedSlugs.get(slug) || 0;

    if (currentCount === 0) {
      // First occurrence, keep as is
      finalSlug = slug;
      usedSlugs.set(slug, 1);
    } else {
      // Duplicate! Add suffix
      finalSlug = `${slug}-${currentCount + 1}`;
      usedSlugs.set(slug, currentCount + 1);
      needsUpdate = true;

      updates.push({
        lineNum: idx + 2,
        hashId,
        oldSlug: slug,
        newSlug: finalSlug,
        title: title.replace(/^\"|\"$/g, '').substring(0, 60),
        reason: 'duplicate-existing'
      });
    }

    if (!needsUpdate) {
      return line;
    }
  } else {
    // Generate new slug from title
    let baseSlug = generateSlugFromTitle(title);

    // Handle collisions
    let testSlug = baseSlug;
    let counter = 1;

    // Check if base slug or any variant is already used
    while (usedSlugs.has(testSlug)) {
      counter++;
      testSlug = `${baseSlug}-${counter}`;
    }

    finalSlug = testSlug;
    usedSlugs.set(finalSlug, 1);
    needsUpdate = true;

    updates.push({
      lineNum: idx + 2,
      hashId,
      oldSlug: slug,
      newSlug: finalSlug,
      title: title.replace(/^\"|\"$/g, '').substring(0, 60),
      reason: 'numeric-to-readable'
    });
  }

  // Update the fields
  const updatedFields = [finalSlug, ...fields.slice(1)];
  return formatCsvRow(updatedFields);
});

console.log(`🔄 SLUG UPDATES: ${updates.length} entries\n`);

// Show first 10 updates
updates.slice(0, 10).forEach(u => {
  console.log(`   [${u.lineNum}] ${u.hashId}`);
  console.log(`      OLD: "${u.oldSlug}"`);
  console.log(`      NEW: "${u.newSlug}"`);
  console.log(`      "${u.title}..."`);
  console.log();
});

if (updates.length > 10) {
  console.log(`   ... and ${updates.length - 10} more\n`);
}

// Write updated CSV
const finalCsv = [header, ...processedLines].join('\n') + '\n';
fs.writeFileSync(CSV_PATH, finalCsv, 'utf-8');

console.log('📊 RESULTS:');
console.log(`   Total entries: ${processedLines.length}`);
console.log(`   Slugs updated: ${updates.length}`);
console.log(`   Unique slugs: ${usedSlugs.size}`);
console.log();

// Verification
console.log('✅ VERIFICATION:');
const verifyLines = fs.readFileSync(CSV_PATH, 'utf-8').split('\n').filter(l => l.trim());
const verifyData = verifyLines.slice(1);

const verifyNumeric = [];
const verifyDupes = new Set();
const verifyUnique = new Set();

verifyData.forEach((line, idx) => {
  const fields = parseCsvRow(line);
  const slug = fields[0];

  // Check for numeric slugs
  if (/^[0-9]+$/.test(slug) || /^\d+-\d+$/.test(slug) || /^\d+to\d+$/.test(slug)) {
    verifyNumeric.push({ lineNum: idx + 2, slug });
  }

  // Check for duplicates
  if (verifyUnique.has(slug)) {
    verifyDupes.add(slug);
  }
  verifyUnique.add(slug);
});

console.log(`   Total lines: ${verifyLines.length} (${verifyData.length} data + 1 header) ✅`);
console.log(`   Unique slugs: ${verifyUnique.size} ${verifyUnique.size === verifyData.length ? '✅' : '❌'}`);
console.log(`   Numeric slugs: ${verifyNumeric.length} ${verifyNumeric.length === 0 ? '✅' : '❌'}`);
console.log(`   Duplicate slugs: ${verifyDupes.size} ${verifyDupes.size === 0 ? '✅' : '❌'}`);

if (verifyNumeric.length > 0) {
  console.log('\n   ⚠️  Remaining numeric slugs:');
  verifyNumeric.slice(0, 5).forEach(({ lineNum, slug }) => {
    console.log(`      [${lineNum}] "${slug}"`);
  });
}

if (verifyDupes.size > 0) {
  console.log('\n   ❌ Duplicate slugs found:');
  verifyDupes.forEach(slug => {
    console.log(`      "${slug}"`);
  });
}

console.log();

if (verifyNumeric.length === 0 && verifyDupes.size === 0 && verifyUnique.size === verifyData.length) {
  console.log('🎉 SUCCESS! All slugs are human-readable and unique.');
  console.log(`   Backup saved at: ${BACKUP_PATH}`);
} else {
  console.log('❌ VERIFICATION FAILED!');
  console.log('   Restoring from backup...');
  fs.copyFileSync(BACKUP_PATH, CSV_PATH);
  process.exit(1);
}
