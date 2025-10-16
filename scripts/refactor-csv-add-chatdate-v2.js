#!/usr/bin/env node

/**
 * Refactor CSV to add chatDate field and extract dates from title prefixes - Version 2
 *
 * Uses proper CSV parsing to handle quoted fields correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'data/blog-metadata.csv');
const BACKUP_PATH = path.join(__dirname, '..', 'data/blog-metadata.csv.backup-chatdate-v2');

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
 * Extract date from title prefix
 * Matches patterns like "8/12:", "10/4:"
 * For complex patterns like "7/12-7/13, 7/15 chat:", extract just the first date
 *
 * @param {string} title - The title to extract from
 * @returns {{ chatDate: string, cleanTitle: string }} - Extracted date and cleaned title
 */
function extractDateFromTitle(title) {
  // Pattern 1: Simple M/D: or MM/DD: at the start
  const singleDateMatch = title.match(/^(\d{1,2}\/\d{1,2}):\s*(.+)$/);
  if (singleDateMatch) {
    return {
      chatDate: `${singleDateMatch[1]}/2025`,
      cleanTitle: singleDateMatch[2]
    };
  }

  // Pattern 2: Complex ranges like "7/12-7/13, 7/15 chat:" - extract first date
  const complexDateMatch = title.match(/^(\d{1,2}\/\d{1,2})[-,].*?:\s*(.+)$/);
  if (complexDateMatch) {
    return {
      chatDate: `${complexDateMatch[1]}/2025`,
      cleanTitle: complexDateMatch[2]
    };
  }

  // Pattern 3: Date range like "7/16 to 7/18:" - extract first date
  const rangeMatch = title.match(/^(\d{1,2}\/\d{1,2})\s+to\s+\d{1,2}\/\d{1,2}:\s*(.+)$/);
  if (rangeMatch) {
    return {
      chatDate: `${rangeMatch[1]}/2025`,
      cleanTitle: rangeMatch[2]
    };
  }

  // Pattern 4: "X chat:" variants like "7/20 chat:" - extract date
  const chatMatch = title.match(/^(\d{1,2}\/\d{1,2})\s+chat:\s*(.+)$/);
  if (chatMatch) {
    return {
      chatDate: `${chatMatch[1]}/2025`,
      cleanTitle: chatMatch[2]
    };
  }

  // No date prefix found
  return {
    chatDate: '',
    cleanTitle: title
  };
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
 * Process CSV and add chatDate field
 */
function refactorCSV() {
  console.log('📄 Reading CSV file...');
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csvContent.split('\n');

  if (lines.length === 0) {
    console.error('❌ CSV file is empty');
    process.exit(1);
  }

  // Backup original file
  console.log('💾 Creating backup...');
  fs.writeFileSync(BACKUP_PATH, csvContent, 'utf-8');
  console.log(`   Backup saved to: ${BACKUP_PATH}`);

  // Parse header
  const header = lines[0];
  const headerFields = parseCsvRow(header);

  // Find the index of the 'title' column
  const titleIndex = headerFields.indexOf('title');
  if (titleIndex === -1) {
    console.error('❌ Could not find "title" column in CSV header');
    process.exit(1);
  }

  console.log(`\n📊 Found ${lines.length - 1} data rows (excluding header)`);
  console.log(`   Title column is at index ${titleIndex}`);

  // Add chatDate column after title
  const newHeaderFields = [
    ...headerFields.slice(0, titleIndex + 1),
    'chatDate',
    ...headerFields.slice(titleIndex + 1)
  ];

  const newLines = [csvRowToString(newHeaderFields)];

  let extractedCount = 0;
  const extractedDates = [];

  // Process each data row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      // Preserve empty lines
      newLines.push('');
      continue;
    }

    // Parse CSV line
    const fields = parseCsvRow(line);

    if (fields.length < headerFields.length) {
      console.warn(`⚠️  Line ${i + 1} has fewer fields than expected (${fields.length} < ${headerFields.length}), skipping...`);
      newLines.push(line);
      continue;
    }

    // Extract title
    const title = fields[titleIndex];

    // Extract date from title
    const { chatDate, cleanTitle } = extractDateFromTitle(title);

    if (chatDate) {
      extractedCount++;
      extractedDates.push({
        line: i + 1,
        original: title,
        chatDate,
        cleanTitle
      });
    }

    // Rebuild row with new chatDate field
    const newFields = [
      ...fields.slice(0, titleIndex),
      cleanTitle,
      chatDate,
      ...fields.slice(titleIndex + 1)
    ];

    newLines.push(csvRowToString(newFields));
  }

  // Write new CSV
  console.log('\n✏️  Writing refactored CSV...');
  fs.writeFileSync(CSV_PATH, newLines.join('\n'), 'utf-8');

  console.log('\n✅ Refactoring complete!');
  console.log(`\n📈 Summary:`);
  console.log(`   Total rows processed: ${lines.length - 1}`);
  console.log(`   Dates extracted: ${extractedCount}`);
  console.log(`   Rows without dates: ${lines.length - 1 - extractedCount - (newLines.filter(l => !l.trim()).length)}`);

  if (extractedDates.length > 0) {
    console.log('\n📋 Sample extractions (first 15):');
    extractedDates.slice(0, 15).forEach(({ line, original, chatDate, cleanTitle }) => {
      console.log(`   Line ${line}:`);
      console.log(`      Original: "${original.substring(0, 70)}${original.length > 70 ? '...' : ''}"`);
      console.log(`      Chat Date: "${chatDate}"`);
      console.log(`      Clean Title: "${cleanTitle.substring(0, 70)}${cleanTitle.length > 70 ? '...' : ''}"`);
      console.log();
    });

    if (extractedDates.length > 15) {
      console.log(`   ... and ${extractedDates.length - 15} more`);
    }
  }

  console.log(`\n💡 To restore the original CSV, run:`);
  console.log(`   cp ${BACKUP_PATH} ${CSV_PATH}`);
}

// Run the refactoring
try {
  refactorCSV();
} catch (error) {
  console.error('\n❌ Error during refactoring:', error.message);
  console.error(error.stack);
  process.exit(1);
}
