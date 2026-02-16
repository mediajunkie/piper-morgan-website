#!/usr/bin/env node

/**
 * Episode Reassignment Script
 *
 * Updates blog-metadata.csv to implement the AI-recommended episode restructuring:
 * - Splits production-transformation (31 posts) into 3 new episodes based on workDate
 * - Creates alpha-milestone episode for 3 unassigned posts from Oct 5-7
 *
 * Date ranges for reassignment:
 * - first-production-tests: 2025-05-30 to 2025-06-29 (7 posts expected)
 * - the-debugging-marathon: 2025-07-01 to 2025-07-11 (10 posts expected)
 * - test-suite-recovery: 2025-07-12 to 2025-07-24 (14 posts expected)
 * - alpha-milestone: Posts with empty cluster and workDate >= 2025-10-05
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CSV_PATH = path.join(process.cwd(), 'data', 'blog-metadata.csv');

console.log('📺 Episode Reassignment Script');
console.log('='.repeat(60));
console.log();

// Parse CSV line (handles quoted fields with commas)
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

// Format CSV field (quote if contains comma, quote, or newline)
function formatCSVField(value) {
  if (!value) return '';

  const needsQuoting = value.includes(',') || value.includes('"') || value.includes('\n');

  if (needsQuoting) {
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  return value;
}

// Determine new episode based on workDate and current cluster
function getNewEpisode(workDate, currentCluster) {
  // Only reassign posts currently in production-transformation or empty cluster
  if (currentCluster !== 'production-transformation' && currentCluster !== '') {
    return currentCluster;
  }

  // Parse workDate
  const date = new Date(workDate);

  // Empty cluster posts from Oct 5-7 → alpha-milestone
  if (currentCluster === '' && workDate >= '2025-10-05') {
    return 'alpha-milestone';
  }

  // Production transformation posts split by date
  if (currentCluster === 'production-transformation') {
    if (workDate >= '2025-05-30' && workDate <= '2025-06-29') {
      return 'first-production-tests';
    } else if (workDate >= '2025-07-01' && workDate <= '2025-07-11') {
      return 'the-debugging-marathon';
    } else if (workDate >= '2025-07-12' && workDate <= '2025-07-24') {
      return 'test-suite-recovery';
    }
  }

  // If we get here, something unexpected happened
  console.warn(`⚠️  Unexpected case: workDate=${workDate}, cluster=${currentCluster}`);
  return currentCluster;
}

// Read CSV
const content = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = content.split('\n');
const headers = parseCSVLine(lines[0]);

// Find column indices
const clusterIdx = headers.indexOf('cluster');
const workDateIdx = headers.indexOf('workDate');
const titleIdx = headers.indexOf('title');

if (clusterIdx === -1 || workDateIdx === -1) {
  console.error('❌ Error: Could not find required columns in CSV');
  process.exit(1);
}

console.log('📋 Processing CSV...');
console.log(`   Headers: ${headers.join(', ')}`);
console.log(`   Cluster column index: ${clusterIdx}`);
console.log(`   WorkDate column index: ${workDateIdx}`);
console.log();

// Track changes
const changes = {
  'first-production-tests': [],
  'the-debugging-marathon': [],
  'test-suite-recovery': [],
  'alpha-milestone': []
};

// Process each line
const updatedLines = [lines[0]]; // Keep header

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue; // Skip empty lines

  const values = parseCSVLine(line);
  const workDate = values[workDateIdx];
  const currentCluster = values[clusterIdx];
  const title = values[titleIdx];

  // Determine new episode
  const newCluster = getNewEpisode(workDate, currentCluster);

  // Track if changed
  if (newCluster !== currentCluster) {
    changes[newCluster].push({
      title,
      workDate,
      from: currentCluster || '(unassigned)'
    });
  }

  // Update cluster field
  values[clusterIdx] = newCluster;

  // Rebuild line with proper CSV formatting
  const formattedLine = values.map(formatCSVField).join(',');
  updatedLines.push(formattedLine);
}

// Display summary
console.log('📊 Episode Reassignment Summary:');
console.log('='.repeat(60));

Object.entries(changes).forEach(([episode, posts]) => {
  if (posts.length > 0) {
    console.log(`\n${episode}: ${posts.length} posts`);
    posts.forEach(p => {
      console.log(`  - ${p.workDate}: ${p.title}`);
      console.log(`    (from: ${p.from})`);
    });
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Total changes: ${Object.values(changes).flat().length} posts reassigned`);
console.log();

// Write updated CSV
const outputContent = updatedLines.join('\n');
fs.writeFileSync(CSV_PATH, outputContent);

console.log('✅ CSV updated successfully!');
console.log(`   File: ${CSV_PATH}`);
console.log();
console.log('📝 Next steps:');
console.log('   1. Run validation: node scripts/validate-csv.js');
console.log('   2. Review changes in git diff');
console.log('   3. Test locally with npm run dev');
console.log();
