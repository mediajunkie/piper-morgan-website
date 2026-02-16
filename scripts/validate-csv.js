#!/usr/bin/env node

/**
 * CSV Metadata Validation Script
 *
 * Validates blog-metadata.csv for completeness and correctness.
 * Used for pre-deployment checks and CI/CD validation.
 *
 * Exit codes:
 * - 0: All validation passed
 * - 1: Validation errors found
 *
 * Usage:
 *   node scripts/validate-csv.js
 *   node scripts/validate-csv.js --verbose
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'assets', 'blog-images');
const EPISODES_PATH = path.join(__dirname, '..', 'src', 'lib', 'episodes.ts');

// Valid values
const VALID_CATEGORIES = ['building', 'insight'];
const REQUIRED_FIELDS = ['slug', 'hashId', 'title', 'imageSlug', 'workDate', 'pubDate', 'category', 'cluster'];
const OPTIONAL_FIELDS = ['chatDate', 'featured', 'notes'];

// Validation state
let errors = [];
let warnings = [];
let stats = {
  total: 0,
  valid: 0,
  errors: 0,
  warnings: 0
};

/**
 * Parse CSV row handling quoted fields
 */
function parseCsvRow(row) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

/**
 * Validate date format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)
 */
function isValidDate(dateString) {
  if (!dateString) return false;

  // ISO 8601 formats
  const datePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/;
  if (!datePattern.test(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validate slug format
 */
function isValidSlug(slug) {
  if (!slug) return false;

  // Must be lowercase, alphanumeric + hyphens only
  // No leading/trailing hyphens, no multiple consecutive hyphens
  const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugPattern.test(slug);
}

/**
 * Validate hashId format (12 hex characters)
 */
function isValidHashId(hashId) {
  if (!hashId) return false;
  return /^[a-f0-9]{12}$/.test(hashId);
}

/**
 * Load valid episode slugs from episodes.ts
 */
function getValidEpisodeSlugs() {
  try {
    const content = fs.readFileSync(EPISODES_PATH, 'utf-8');
    const slugMatches = content.match(/slug:\s*['"]([^'"]+)['"]/g);
    if (!slugMatches) return [];
    return slugMatches.map(m => m.match(/['"]([^'"]+)['"]/)[1]);
  } catch (err) {
    warnings.push(`Could not load episode slugs from ${EPISODES_PATH}: ${err.message}`);
    return [];
  }
}

/**
 * Check if image file exists
 */
function imageExists(imageSlug) {
  if (!imageSlug) return false;

  // Remove .webp extension if present for checking
  const baseName = imageSlug.replace(/\.webp$/, '');

  // Check for various extensions
  const extensions = ['.webp', '.png', '.jpg', '.jpeg'];
  for (const ext of extensions) {
    const filePath = path.join(IMAGES_DIR, `${baseName}${ext}`);
    if (fs.existsSync(filePath)) return true;
  }

  return false;
}

/**
 * Validate a single CSV entry
 */
function validateEntry(entry, lineNumber, validEpisodeSlugs, usedSlugs, usedHashIds) {
  const entryErrors = [];
  const entryWarnings = [];

  const [slug, hashId, title, chatDate, imageSlug, workDate, pubDate, category, cluster, featured, notes] = entry;

  // Validate required fields
  if (!slug) entryErrors.push('Missing slug');
  if (!hashId) entryErrors.push('Missing hashId');
  if (!title) entryErrors.push('Missing title');
  if (!imageSlug) entryErrors.push('Missing imageSlug');
  if (!workDate) entryErrors.push('Missing workDate');
  if (!pubDate) entryErrors.push('Missing pubDate');
  if (!category) entryErrors.push('Missing category');
  if (!cluster) entryErrors.push('Missing cluster (episode)');

  // Validate slug format
  if (slug && !isValidSlug(slug)) {
    entryErrors.push(`Invalid slug format: "${slug}" (must be lowercase, alphanumeric + hyphens)`);
  }

  // Check for duplicate slugs
  if (slug && usedSlugs.has(slug)) {
    entryErrors.push(`Duplicate slug: "${slug}"`);
  } else if (slug) {
    usedSlugs.add(slug);
  }

  // Validate hashId format
  if (hashId && !isValidHashId(hashId)) {
    entryErrors.push(`Invalid hashId format: "${hashId}" (must be 12 hex characters)`);
  }

  // Check for duplicate hashIds
  if (hashId && usedHashIds.has(hashId)) {
    entryErrors.push(`Duplicate hashId: "${hashId}"`);
  } else if (hashId) {
    usedHashIds.add(hashId);
  }

  // Validate dates
  if (workDate && !isValidDate(workDate)) {
    entryErrors.push(`Invalid workDate format: "${workDate}" (must be YYYY-MM-DD or ISO 8601)`);
  }
  if (pubDate && !isValidDate(pubDate)) {
    entryErrors.push(`Invalid pubDate format: "${pubDate}" (must be YYYY-MM-DD or ISO 8601)`);
  }
  if (chatDate && !isValidDate(chatDate) && chatDate !== '') {
    // chatDate can be empty, but if present must be valid
    entryWarnings.push(`Invalid chatDate format: "${chatDate}" (should be YYYY-MM-DD or ISO 8601)`);
  }

  // Validate category
  if (category && !VALID_CATEGORIES.includes(category)) {
    entryErrors.push(`Invalid category: "${category}" (must be "building" or "insight")`);
  }

  // Validate cluster (episode slug)
  if (cluster && validEpisodeSlugs.length > 0 && !validEpisodeSlugs.includes(cluster)) {
    entryErrors.push(`Invalid cluster: "${cluster}" (must match an episode slug in episodes.ts)`);
  }

  // Validate featured field
  if (featured && featured !== 'true' && featured !== 'false' && featured !== '') {
    entryWarnings.push(`Invalid featured value: "${featured}" (should be "true", "false", or empty)`);
  }

  // Check if image file exists
  if (imageSlug && !imageExists(imageSlug)) {
    entryWarnings.push(`Image file not found: "${imageSlug}" (expected in ${IMAGES_DIR})`);
  }

  // Report errors and warnings
  if (entryErrors.length > 0 || entryWarnings.length > 0) {
    const identifier = `Line ${lineNumber}: ${hashId || 'unknown'} - "${title?.substring(0, 50) || 'untitled'}"`;

    if (entryErrors.length > 0) {
      errors.push({
        line: lineNumber,
        hashId,
        title,
        errors: entryErrors
      });
      stats.errors++;
    }

    if (entryWarnings.length > 0) {
      warnings.push({
        line: lineNumber,
        hashId,
        title,
        warnings: entryWarnings
      });
      stats.warnings++;
    }
  } else {
    stats.valid++;
  }
}

/**
 * Main validation function
 */
function validateCSV() {
  console.log('📋 CSV METADATA VALIDATION\n');
  console.log('============================\n');

  // Check if CSV exists
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ ERROR: CSV file not found at ${CSV_PATH}`);
    process.exit(1);
  }

  // Load valid episode slugs
  const validEpisodeSlugs = getValidEpisodeSlugs();
  console.log(`📊 Loaded ${validEpisodeSlugs.length} valid episode slugs\n`);

  // Read CSV
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const csvLines = csvContent.split('\n').filter(l => l.trim());

  // Skip header
  const header = csvLines[0];
  const dataLines = csvLines.slice(1);

  console.log(`📄 CSV: ${dataLines.length} entries\n`);
  stats.total = dataLines.length;

  // Track duplicates
  const usedSlugs = new Set();
  const usedHashIds = new Set();

  // Validate each entry
  dataLines.forEach((line, idx) => {
    const entry = parseCsvRow(line);
    const lineNumber = idx + 2; // +2 because of header and 0-indexing
    validateEntry(entry, lineNumber, validEpisodeSlugs, usedSlugs, usedHashIds);
  });

  // Print results
  console.log('\n' + '='.repeat(60) + '\n');
  console.log('📊 VALIDATION RESULTS\n');
  console.log(`Total entries: ${stats.total}`);
  console.log(`Valid entries: ${stats.valid}`);
  console.log(`Entries with errors: ${stats.errors}`);
  console.log(`Entries with warnings: ${stats.warnings}\n`);

  // Print errors
  if (errors.length > 0) {
    console.log('🔴 ERRORS:\n');
    errors.forEach(({ line, hashId, title, errors: entryErrors }) => {
      console.log(`Line ${line}: ${hashId} - "${title?.substring(0, 50)}"`);
      entryErrors.forEach(err => console.log(`  ❌ ${err}`));
      console.log('');
    });
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    warnings.forEach(({ line, hashId, title, warnings: entryWarnings }) => {
      console.log(`Line ${line}: ${hashId} - "${title?.substring(0, 50)}"`);
      entryWarnings.forEach(warn => console.log(`  ⚠️  ${warn}`));
      console.log('');
    });
  }

  // Summary
  console.log('='.repeat(60) + '\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ ALL VALIDATION PASSED!\n');
    return 0;
  } else if (errors.length === 0) {
    console.log(`⚠️  VALIDATION PASSED WITH ${warnings.length} WARNINGS\n`);
    return 0;
  } else {
    console.log(`❌ VALIDATION FAILED: ${errors.length} errors, ${warnings.length} warnings\n`);
    console.log('Fix errors before deploying.\n');
    return 1;
  }
}

// Run validation
const exitCode = validateCSV();
process.exit(exitCode);
