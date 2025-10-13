#!/usr/bin/env node

/**
 * Phase 8: Populate Episode Clusters in CSV
 * Updates the cluster column with episode names
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv.backup-phase8');

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

// Format CSV row
function formatCsvRow(fields) {
  return fields.map(field => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }).join(',');
}

// Normalize date to 2025
function normalizeDateTo2025(dateStr) {
  return dateStr.replace('2001-', '2025-');
}

// Episode definitions
const episodes = [
  {
    name: 'Episode 1: Genesis & Architecture',
    slug: 'genesis-architecture',
    startDate: '2025-06-27',
    endDate: '2025-07-06'
  },
  {
    name: 'Episode 2: Foundation Building',
    slug: 'foundation-building',
    startDate: '2025-07-07',
    endDate: '2025-07-21'
  },
  {
    name: 'Episode 3: The Complexity Reckoning',
    slug: 'complexity-reckoning',
    startDate: '2025-07-22',
    endDate: '2025-07-28'
  },
  {
    name: 'Episode 4: Production Transformation',
    slug: 'production-transformation',
    startDate: '2025-07-29',
    endDate: '2025-08-08'
  },
  {
    name: 'Episode 5: Methodology Refinement',
    slug: 'methodology-refinement',
    startDate: '2025-08-09',
    endDate: '2025-08-16'
  },
  {
    name: 'Episode 6: Infrastructure Sprint',
    slug: 'infrastructure-sprint',
    startDate: '2025-08-17',
    endDate: '2025-08-23'
  },
  {
    name: 'Episode 7: Enhanced Capabilities',
    slug: 'enhanced-capabilities',
    startDate: '2025-08-24',
    endDate: '2025-08-31'
  },
  {
    name: 'Episode 8: Orchestration & Verification',
    slug: 'orchestration-verification',
    startDate: '2025-09-01',
    endDate: '2025-09-08'
  },
  {
    name: 'Episode 9: Meta-Development',
    slug: 'meta-development',
    startDate: '2025-09-09',
    endDate: '2025-09-15'
  },
  {
    name: 'Episode 10: Strategic Pause',
    slug: 'strategic-pause',
    startDate: '2025-09-16',
    endDate: '2025-09-22'
  },
  {
    name: 'Episode 11: Discipline & Completion',
    slug: 'discipline-completion',
    startDate: '2025-09-23',
    endDate: '2025-10-03'
  },
  {
    name: 'Episode 12: Reflection & Evolution',
    slug: 'reflection-evolution',
    startDate: '2025-10-04',
    endDate: '2025-10-12'
  }
];

// Find episode for a given date
function findEpisode(workDate) {
  const normalizedDate = normalizeDateTo2025(workDate);
  const episode = episodes.find(ep =>
    normalizedDate >= ep.startDate && normalizedDate <= ep.endDate
  );
  return episode ? episode.slug : '';
}

console.log('📊 PHASE 8: POPULATING EPISODE CLUSTERS\n');
console.log('=======================================\n');

// Backup CSV
fs.copyFileSync(CSV_PATH, BACKUP_PATH);
console.log(`✅ Backed up CSV to: ${BACKUP_PATH}\n`);

// Read CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = csvContent.split('\n').filter(l => l.trim());
const header = lines[0];
const dataLines = lines.slice(1);

console.log(`📋 Processing ${dataLines.length} posts...\n`);

// Process each line and assign episode
const updates = [];
const updatedLines = dataLines.map((line, idx) => {
  const fields = parseCsvRow(line);
  const [slug, hashId, title, imageSlug, workDate, pubDate, category, cluster, featured, notes] = fields;

  const episodeSlug = findEpisode(workDate);

  if (episodeSlug && episodeSlug !== cluster) {
    const episodeName = episodes.find(ep => ep.slug === episodeSlug)?.name || episodeSlug;
    updates.push({
      lineNum: idx + 2,
      slug,
      workDate: normalizeDateTo2025(workDate),
      oldCluster: cluster || '(empty)',
      newCluster: episodeSlug,
      episodeName,
      title: title.substring(0, 60)
    });
  }

  // Update the cluster field (index 7)
  const updatedFields = [...fields];
  updatedFields[7] = episodeSlug;

  return formatCsvRow(updatedFields);
});

console.log(`🔄 UPDATES: ${updates.length} posts assigned to episodes\n`);

// Show sample updates
if (updates.length > 0) {
  updates.slice(0, 10).forEach(u => {
    console.log(`   [${u.lineNum}] ${u.workDate}`);
    console.log(`      Episode: "${u.episodeName}"`);
    console.log(`      "${u.title}..."`);
    console.log();
  });

  if (updates.length > 10) {
    console.log(`   ... and ${updates.length - 10} more\n`);
  }
}

// Write updated CSV
const finalCsv = [header, ...updatedLines].join('\n') + '\n';
fs.writeFileSync(CSV_PATH, finalCsv, 'utf-8');

console.log('📊 RESULTS:');
console.log(`   Total posts: ${dataLines.length}`);
console.log(`   Updated: ${updates.length}`);
console.log(`   Backup saved at: ${BACKUP_PATH}`);
console.log();

// Verify episode distribution
console.log('📈 EPISODE DISTRIBUTION:\n');
const distribution = {};
episodes.forEach(ep => distribution[ep.slug] = 0);

updatedLines.forEach(line => {
  const fields = parseCsvRow(line);
  const cluster = fields[7];
  if (cluster) {
    distribution[cluster] = (distribution[cluster] || 0) + 1;
  }
});

episodes.forEach((ep, idx) => {
  const count = distribution[ep.slug] || 0;
  console.log(`   ${idx + 1}. ${ep.name}: ${count} posts`);
});

console.log('\n✅ SUCCESS! Episode clusters populated in CSV.\n');
