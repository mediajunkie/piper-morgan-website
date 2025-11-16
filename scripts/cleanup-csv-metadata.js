#!/usr/bin/env node

/**
 * CSV Metadata Cleanup Script
 *
 * Fixes data quality issues in blog-metadata.csv:
 * 1. Regenerates slugs that have date prefixes (old "date: title" format)
 * 2. Standardizes chatDate format (M/D/YYYY → YYYY-MM-DD)
 * 3. Standardizes workDate format (M/D/YYYY → YYYY-MM-DD)
 * 4. Interactive prompts for empty chatDate fields on recent posts
 *
 * Usage:
 *   node scripts/cleanup-csv-metadata.js           # Interactive mode
 *   node scripts/cleanup-csv-metadata.js --dry-run  # Preview changes only
 *   node scripts/cleanup-csv-metadata.js --auto     # Auto-fix without prompts
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const CSV_PATH = path.join(process.cwd(), 'data', 'blog-metadata.csv');
const BACKUP_PATH = path.join(process.cwd(), 'data', 'blog-metadata.backup.csv');
const DRY_RUN = process.argv.includes('--dry-run');
const AUTO_MODE = process.argv.includes('--auto');

// Slug generation (copied from src/lib/slug-utils.ts)
function sanitizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

function generateSlug(title, existingSlugs = [], maxWords = 6) {
  // Extract text before colon
  const textBeforeColon = title.split(':')[0].trim();

  // Sanitize and split into words
  const sanitized = sanitizeText(textBeforeColon);
  const words = sanitized.split(/\s+/).filter(word => word.length > 0);

  if (words.length === 0) {
    return 'untitled';
  }

  // Try with increasing word counts
  const startWordCount = Math.min(words.length, maxWords);

  for (let wordCount = startWordCount; wordCount <= words.length; wordCount++) {
    const slug = words.slice(0, wordCount).join('-');
    if (!existingSlugs.includes(slug)) {
      return slug;
    }
  }

  // If all words exhausted, append number
  const baseSlug = words.slice(0, maxWords).join('-');
  let counter = 2;

  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++;
  }

  return `${baseSlug}-${counter}`;
}

// Date format standardization
function standardizeDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') {
    return '';
  }

  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // M/D/YYYY or MM/DD/YYYY format
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, month, day, year] = match;
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  }

  console.warn(`⚠️  Unrecognized date format: "${dateStr}"`);
  return dateStr; // Return as-is if we can't parse it
}

// Check if slug has date prefix pattern
function hasDatePrefix(slug) {
  // Patterns like: 716-chat, 720-chat-2, 712-713-715-chat, 86-revised-from-722
  return /^[0-9]{1,3}-/.test(slug) || /^[0-9]{1,3}-[0-9]{1,3}-[0-9]{1,3}-/.test(slug);
}

// Parse CSV
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  const entries = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = values[index] || '';
    });
    entries.push(entry);
  }

  return { headers, entries };
}

// Format CSV
function formatCSV(headers, entries) {
  const rows = [headers.join(',')];

  entries.forEach(entry => {
    const values = headers.map(header => entry[header] || '');
    rows.push(values.join(','));
  });

  return rows.join('\n') + '\n';
}

// Interactive prompt
async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// Main cleanup function
async function cleanupCSV() {
  console.log('🧹 CSV Metadata Cleanup Script');
  console.log('='.repeat(50));
  console.log();

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes will be saved\n');
  }

  // Load CSV
  console.log('📋 Loading CSV...');
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const { headers, entries } = parseCSV(csvContent);
  console.log(`✅ Loaded ${entries.length} entries\n`);

  // Track changes
  const changes = {
    slugsFixed: 0,
    chatDatesStandardized: 0,
    workDatesStandardized: 0,
    chatDatesPrompted: 0
  };

  const usedSlugs = entries.map(e => e.slug);
  const newSlugs = [];

  // Process entries
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    let modified = false;

    // Fix slugs with date prefixes
    if (hasDatePrefix(entry.slug)) {
      const oldSlug = entry.slug;
      const newSlug = generateSlug(entry.title, [...usedSlugs, ...newSlugs]);

      console.log(`\n📝 Fixing slug with date prefix:`);
      console.log(`   Title: "${entry.title}"`);
      console.log(`   Old slug: ${oldSlug}`);
      console.log(`   New slug: ${newSlug}`);

      entry.slug = newSlug;
      newSlugs.push(newSlug);
      changes.slugsFixed++;
      modified = true;
    }

    // Standardize chatDate format
    if (entry.chatDate && entry.chatDate !== standardizeDate(entry.chatDate)) {
      const oldDate = entry.chatDate;
      entry.chatDate = standardizeDate(oldDate);
      console.log(`\n📅 Standardizing chatDate: ${oldDate} → ${entry.chatDate}`);
      changes.chatDatesStandardized++;
      modified = true;
    }

    // Standardize workDate format
    if (entry.workDate && entry.workDate !== standardizeDate(entry.workDate)) {
      const oldDate = entry.workDate;
      entry.workDate = standardizeDate(oldDate);
      console.log(`📅 Standardizing workDate: ${oldDate} → ${entry.workDate}`);
      changes.workDatesStandardized++;
      modified = true;
    }

    // Interactive prompts for empty chatDate on recent posts
    if (!AUTO_MODE && !DRY_RUN && !entry.chatDate && entry.pubDate >= '2025-10-04') {
      console.log(`\n❓ Empty chatDate for recent post:`);
      console.log(`   Title: "${entry.title}"`);
      console.log(`   Published: ${entry.pubDate}`);
      console.log(`   Work Date: ${entry.workDate || '(none)'}`);

      const answer = await prompt('   Enter chatDate (YYYY-MM-DD) or press Enter to skip: ');

      if (answer.trim()) {
        entry.chatDate = standardizeDate(answer.trim());
        changes.chatDatesPrompted++;
        modified = true;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary of Changes:');
  console.log('='.repeat(50));
  console.log(`   Slugs fixed (date prefixes): ${changes.slugsFixed}`);
  console.log(`   chatDate standardized: ${changes.chatDatesStandardized}`);
  console.log(`   workDate standardized: ${changes.workDatesStandardized}`);
  console.log(`   chatDate filled interactively: ${changes.chatDatesPrompted}`);
  console.log();

  const totalChanges = Object.values(changes).reduce((sum, count) => sum + count, 0);

  if (totalChanges === 0) {
    console.log('✨ No changes needed! CSV is already clean.\n');
    return;
  }

  if (DRY_RUN) {
    console.log('🔍 DRY RUN - No changes saved\n');
    console.log('💡 Run without --dry-run to apply these changes\n');
    return;
  }

  // Create backup
  console.log('💾 Creating backup...');
  fs.copyFileSync(CSV_PATH, BACKUP_PATH);
  console.log(`✅ Backup saved to: ${BACKUP_PATH}\n`);

  // Save updated CSV
  console.log('💾 Saving updated CSV...');
  const updatedContent = formatCSV(headers, entries);
  fs.writeFileSync(CSV_PATH, updatedContent);
  console.log(`✅ Saved ${entries.length} entries to ${CSV_PATH}\n`);

  console.log('✨ Cleanup complete!\n');
  console.log('📝 Next steps:');
  console.log('   1. Review changes: git diff data/blog-metadata.csv');
  console.log('   2. Sync to JSON: node scripts/sync-csv-to-json.js');
  console.log('   3. Test locally: npm run dev');
  console.log('   4. Commit: git add data/blog-metadata.csv && git commit\n');
}

// Run cleanup
cleanupCSV().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
