#!/usr/bin/env node

/**
 * Update blog-metadata.csv categories from personal spreadsheet theme column
 *
 * Usage: node scripts/update-categories-from-theme.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PERSONAL_CSV_PATH = '/Users/xian/Development/piper-morgan/dev/active/Copy of Piper Morgan editorial calendar - new paywall model.csv';
const BLOG_METADATA_CSV_PATH = path.join(__dirname, '../data/blog-metadata.csv');

/**
 * Extract hash ID from Medium URL
 */
function extractHashId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

/**
 * Parse CSV row handling quoted fields
 */
function parseCsvRow(line) {
  const fields = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
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
 * Parse personal CSV and extract theme by hashId
 */
function parsePersonalCsv(csvPath) {
  console.log('📋 Reading personal CSV...');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.trim().split('\n');

  // Skip header
  const dataLines = lines.slice(1);

  const themeMap = new Map();
  let validCount = 0;
  let skippedCount = 0;

  dataLines.forEach((line, index) => {
    const fields = parseCsvRow(line);
    if (fields.length < 10) {
      return;
    }

    // Fields: Date, Title, Theme, Medium date, Medium status, LinkedIn date, LinkedIn status, Canonical blog site, cartoon, Medium URL, LinkedIn URL, Notes
    const theme = fields[2]?.trim().toLowerCase();
    const mediumUrl = fields[9]?.trim();

    if (!mediumUrl || !mediumUrl.includes('medium.com')) {
      skippedCount++;
      return;
    }

    const hashId = extractHashId(mediumUrl);
    if (!hashId) {
      console.log(`  ⚠️  Row ${index + 2}: Could not extract hash ID from ${mediumUrl}`);
      skippedCount++;
      return;
    }

    if (theme === 'building' || theme === 'insight') {
      themeMap.set(hashId, theme);
      validCount++;
    } else {
      console.log(`  ⚠️  Row ${index + 2}: Unknown theme "${theme}" for ${hashId}`);
      skippedCount++;
    }
  });

  console.log(`  ✅ Extracted ${validCount} theme assignments`);
  if (skippedCount > 0) {
    console.log(`  ⏭️  Skipped ${skippedCount} rows (no URL or invalid theme)`);
  }

  return themeMap;
}

/**
 * Update blog-metadata.csv with theme data
 */
function updateBlogMetadata(themeMap) {
  console.log('\n📝 Updating blog-metadata.csv...');

  const csvContent = fs.readFileSync(BLOG_METADATA_CSV_PATH, 'utf-8');
  const lines = csvContent.trim().split('\n');

  const header = lines[0];
  const dataLines = lines.slice(1);

  const updatedLines = [header];
  let updatedCount = 0;
  let notFoundCount = 0;

  dataLines.forEach((line, index) => {
    const fields = parseCsvRow(line);

    if (fields.length < 9) {
      console.log(`  ⚠️  Row ${index + 2}: Insufficient fields, keeping as-is`);
      updatedLines.push(line);
      return;
    }

    // Fields: slug, hashId, title, imageSlug, workDate, pubDate, category, cluster, featured, notes
    const hashId = fields[1].trim();
    const theme = themeMap.get(hashId);

    if (theme) {
      // Update category field (index 6)
      fields[6] = theme;
      updatedCount++;
    } else {
      // Keep existing category or default to 'building'
      if (!fields[6] || fields[6] === 'Building in Public') {
        fields[6] = 'building';
        notFoundCount++;
      }
    }

    // Reconstruct line with proper CSV escaping
    const escapedFields = fields.map(f => {
      if (f.includes(',') || f.includes('"') || f.includes('\n')) {
        return `"${f.replace(/"/g, '""')}"`;
      }
      return f;
    });

    updatedLines.push(escapedFields.join(','));
  });

  // Write updated CSV
  fs.writeFileSync(BLOG_METADATA_CSV_PATH, updatedLines.join('\n') + '\n', 'utf-8');

  console.log(`  ✅ Updated ${updatedCount} posts with theme from personal CSV`);
  if (notFoundCount > 0) {
    console.log(`  ⚠️  ${notFoundCount} posts not found in personal CSV (defaulted to 'building')`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Update Categories from Personal CSV Theme Column\n');

  // Check if personal CSV exists
  if (!fs.existsSync(PERSONAL_CSV_PATH)) {
    console.error(`❌ Personal CSV not found: ${PERSONAL_CSV_PATH}`);
    process.exit(1);
  }

  // Parse personal CSV
  const themeMap = parsePersonalCsv(PERSONAL_CSV_PATH);

  // Update blog-metadata.csv
  updateBlogMetadata(themeMap);

  console.log('\n✨ Categories updated successfully!');

  // Show distribution
  console.log('\n📊 Category Distribution:');
  const csvContent = fs.readFileSync(BLOG_METADATA_CSV_PATH, 'utf-8');
  const lines = csvContent.trim().split('\n');
  const dataLines = lines.slice(1);

  const categoryCount = { building: 0, insight: 0, other: 0 };
  dataLines.forEach(line => {
    const fields = parseCsvRow(line);
    const category = fields[6]?.trim().toLowerCase();
    if (category === 'building') {
      categoryCount.building++;
    } else if (category === 'insight') {
      categoryCount.insight++;
    } else {
      categoryCount.other++;
    }
  });

  console.log(`  Building (narrative): ${categoryCount.building} posts`);
  console.log(`  Insight (lessons): ${categoryCount.insight} posts`);
  if (categoryCount.other > 0) {
    console.log(`  Other/Unknown: ${categoryCount.other} posts`);
  }
}

// Run
main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
