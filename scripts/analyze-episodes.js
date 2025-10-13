#!/usr/bin/env node

/**
 * Phase 8: Narrative Clustering - Episode Analysis
 * Analyze blog posts chronologically to suggest episode groupings
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');
const CONTENT_PATH = path.join(__dirname, '..', 'src', 'data', 'blog-content.json');

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

// Extract date prefix from title (e.g., "7/11:", "8/12:", "9/21:")
function extractDatePrefix(title) {
  const match = title.match(/^(\d+\/\d+)[\s:]/);
  return match ? match[1] : null;
}

// Convert date prefix to sortable key (e.g., "7/11" -> "07/11" -> 711)
function dateToSortKey(dateStr) {
  if (!dateStr) return 99999; // Put posts without dates at the end

  const [month, day] = dateStr.split('/').map(n => parseInt(n));
  return month * 100 + day; // 711, 716, 720, etc.
}

// Identify boundary markers in titles
function identifyBoundaryMarkers(title) {
  const markers = [];
  const lower = title.toLowerCase();

  // Explicit pause/reflection markers
  if (lower.includes('strategic pause')) markers.push('strategic-pause');
  if (lower.includes('reflection')) markers.push('reflection');
  if (lower.includes('reckoning')) markers.push('reckoning');
  if (lower.includes('taking stock')) markers.push('taking-stock');
  if (lower.includes('retrospective')) markers.push('retrospective');

  // Phase shift markers
  if (lower.includes('breakthrough')) markers.push('breakthrough');
  if (lower.includes('revelation')) markers.push('revelation');
  if (lower.includes('convergence')) markers.push('convergence');
  if (lower.includes('great rebuild')) markers.push('great-rebuild');
  if (lower.includes('architectural reckoning')) markers.push('architectural-reckoning');

  // Completion markers
  if (lower.includes('production') && !lower.includes('pre-production')) markers.push('production-ready');
  if (lower.includes('final leap')) markers.push('final-leap');
  if (lower.includes('finished')) markers.push('finished');

  return markers;
}

console.log('📊 PHASE 8: NARRATIVE CLUSTERING - CHRONOLOGICAL ANALYSIS\n');
console.log('==========================================================\n');

// Read CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = csvContent.split('\n').filter(l => l.trim());
const header = lines[0];
const dataLines = lines.slice(1);

console.log(`📋 Total posts: ${dataLines.length}\n`);

// Parse posts
const posts = dataLines.map((line, idx) => {
  const fields = parseCsvRow(line);
  const [slug, hashId, title, imageSlug, workDate, pubDate, category, cluster, featured, notes] = fields;

  const datePrefix = extractDatePrefix(title);
  const sortKey = dateToSortKey(datePrefix);
  const markers = identifyBoundaryMarkers(title);

  return {
    index: idx + 2, // CSV line number
    slug,
    hashId,
    title,
    datePrefix,
    sortKey,
    workDate,
    category,
    markers,
    titleShort: title.substring(0, 80)
  };
});

// Sort by date
posts.sort((a, b) => a.sortKey - b.sortKey);

console.log('📅 CHRONOLOGICAL TIMELINE:\n');

// Group by date prefix and identify gaps
let currentDate = null;
let currentGroup = [];
const dateGroups = [];

posts.forEach(post => {
  if (post.datePrefix !== currentDate) {
    if (currentGroup.length > 0) {
      dateGroups.push({
        date: currentDate,
        count: currentGroup.length,
        posts: currentGroup
      });
    }
    currentDate = post.datePrefix;
    currentGroup = [post];
  } else {
    currentGroup.push(post);
  }
});

// Add final group
if (currentGroup.length > 0) {
  dateGroups.push({
    date: currentDate,
    count: currentGroup.length,
    posts: currentGroup
  });
}

// Display timeline with gaps
console.log('Date Clusters (sorted chronologically):\n');

let previousDate = null;
dateGroups.forEach(group => {
  // Calculate gap from previous date
  let gapDays = 0;
  if (previousDate) {
    const [prevMonth, prevDay] = previousDate.split('/').map(n => parseInt(n));
    const [currMonth, currDay] = (group.date || '0/0').split('/').map(n => parseInt(n));

    if (currMonth === prevMonth) {
      gapDays = currDay - prevDay;
    } else if (currMonth === prevMonth + 1) {
      // Approximate: assume 31 days in previous month
      gapDays = (31 - prevDay) + currDay;
    }
  }

  // Show gap if significant
  if (gapDays >= 3) {
    console.log(`   ⏸️  [${gapDays}-day gap]\n`);
  }

  const dateLabel = group.date || 'No date';
  console.log(`   ${dateLabel}: ${group.count} posts`);

  // Show posts with boundary markers
  group.posts.forEach(post => {
    if (post.markers.length > 0) {
      console.log(`      🔹 [${post.markers.join(', ')}] ${post.titleShort}`);
    }
  });

  console.log();
  previousDate = group.date;
});

console.log('\n📊 POSTING PATTERNS:\n');
console.log(`   Date clusters: ${dateGroups.length}`);
console.log(`   Dates with 5+ posts: ${dateGroups.filter(g => g.count >= 5).length}`);
console.log(`   Dates with 1 post: ${dateGroups.filter(g => g.count === 1).length}`);
console.log(`   Posts without dates: ${posts.filter(p => !p.datePrefix).length}`);

console.log('\n🎯 BOUNDARY MARKERS FOUND:\n');

const allMarkers = posts.filter(p => p.markers.length > 0);
console.log(`   Total posts with boundary markers: ${allMarkers.length}\n`);

allMarkers.forEach(post => {
  console.log(`   ${post.datePrefix || 'No date'} - [${post.markers.join(', ')}]`);
  console.log(`      "${post.titleShort}..."\n`);
});

console.log('\n🗺️  SUGGESTED EPISODE DETECTION STRATEGY:\n');
console.log('   1. Use 3+ day gaps as potential episode boundaries');
console.log('   2. Look for boundary markers (strategic pause, reflection, reckoning)');
console.log('   3. Group consecutive date clusters into multi-week periods');
console.log('   4. Identify thematic shifts by reading content within each period');
console.log('   5. Aim for 8-12 total episodes across the timeline\n');

console.log('📝 NEXT STEP: Read blog-content.json to analyze themes within each period\n');
