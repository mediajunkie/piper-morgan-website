#!/usr/bin/env node

/**
 * Phase 8: Narrative Clustering - Episode Analysis (CORRECTED)
 * Uses actual workDate field, not title prefixes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');

// Parse CSV
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

// Identify boundary markers in titles
function identifyBoundaryMarkers(title) {
  const markers = [];
  const lower = title.toLowerCase();

  if (lower.includes('strategic pause')) markers.push('strategic-pause');
  if (lower.includes('reflection')) markers.push('reflection');
  if (lower.includes('reckoning')) markers.push('reckoning');
  if (lower.includes('taking stock')) markers.push('taking-stock');
  if (lower.includes('retrospective')) markers.push('retrospective');
  if (lower.includes('breakthrough')) markers.push('breakthrough');
  if (lower.includes('revelation')) markers.push('revelation');
  if (lower.includes('convergence')) markers.push('convergence');
  if (lower.includes('great rebuild')) markers.push('great-rebuild');

  return markers;
}

console.log('📊 PHASE 8: CORRECT CHRONOLOGICAL ANALYSIS\n');
console.log('==========================================\n');

// Read CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = csvContent.split('\n').filter(l => l.trim());
const header = lines[0];
const dataLines = lines.slice(1);

console.log(`📋 Total posts: ${dataLines.length}\n`);

// Parse posts using ACTUAL workDate field
const posts = dataLines.map((line, idx) => {
  const fields = parseCsvRow(line);
  const [slug, hashId, title, imageSlug, workDate, pubDate, category] = fields;

  const markers = identifyBoundaryMarkers(title);

  return {
    index: idx + 2,
    slug,
    hashId,
    title: title.substring(0, 90),
    workDate, // This is in format "2001-MM-DD"
    category,
    markers
  };
});

// Sort by workDate (chronologically)
posts.sort((a, b) => a.workDate.localeCompare(b.workDate));

console.log('📅 POSTS SORTED BY ACTUAL WORK DATE:\n');
console.log('(Format: YYYY-MM-DD, treating 2001 as 2025)\n');

let previousDate = null;
let previousMonthDay = null;

posts.forEach((post, idx) => {
  const monthDay = post.workDate.substring(5); // Extract MM-DD

  // Calculate gap from previous date
  let gapDays = 0;
  if (previousMonthDay) {
    const [prevMonth, prevDay] = previousMonthDay.split('-').map(n => parseInt(n));
    const [currMonth, currDay] = monthDay.split('-').map(n => parseInt(n));

    if (currMonth === prevMonth) {
      gapDays = currDay - prevDay;
    } else if (currMonth === prevMonth + 1) {
      // Approximate: assume 31 days in previous month
      gapDays = (31 - prevDay) + currDay;
    } else if (currMonth > prevMonth) {
      // Multiple months gap
      gapDays = (currMonth - prevMonth) * 30; // Rough estimate
    }
  }

  // Show gap if significant
  if (gapDays >= 3 && idx > 0) {
    console.log(`\n   ⏸️  [~${gapDays}-day gap]\n`);
  }

  // Show date change
  if (post.workDate !== previousDate) {
    console.log(`\n${post.workDate} (${monthDay}):`);
    previousDate = post.workDate;
    previousMonthDay = monthDay;
  }

  // Show post
  const markerStr = post.markers.length > 0 ? ` 🔹[${post.markers.join(',')}]` : '';
  console.log(`   ${post.title}...${markerStr}`);
});

console.log('\n\n📊 BOUNDARY MARKERS FOUND:\n');

const allMarkers = posts.filter(p => p.markers.length > 0);
console.log(`   Total posts with boundary markers: ${allMarkers.length}\n`);

allMarkers.forEach(post => {
  console.log(`   ${post.workDate} - [${post.markers.join(', ')}]`);
  console.log(`      "${post.title}..."\n`);
});

console.log('\n📈 DATE DISTRIBUTION:\n');

// Count posts by date
const dateCounts = {};
posts.forEach(post => {
  dateCounts[post.workDate] = (dateCounts[post.workDate] || 0) + 1;
});

const sortedDates = Object.entries(dateCounts).sort();
console.log(`   Unique work dates: ${sortedDates.length}`);
console.log(`   Date range: ${sortedDates[0][0]} to ${sortedDates[sortedDates.length - 1][0]}`);

// Show dates with multiple posts
const denseDates = sortedDates.filter(([_, count]) => count >= 3);
console.log(`\n   Dense dates (3+ posts):`);
denseDates.forEach(([date, count]) => {
  console.log(`      ${date}: ${count} posts`);
});

console.log('\n✅ NEXT STEP: Identify episode boundaries based on actual work chronology\n');
