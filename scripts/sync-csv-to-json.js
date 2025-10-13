#!/usr/bin/env node

/**
 * Sync all CSV metadata to JSON
 * Updates cluster, category, and other fields from CSV
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');
const JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'medium-posts.json');
const BACKUP_PATH = path.join(__dirname, '..', 'src', 'data', 'medium-posts.json.backup-sync');

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

function extractHashId(guid) {
  const match = guid.match(/([a-f0-9]{12})$/);
  return match ? match[1] : null;
}

console.log('📋 SYNC CSV METADATA TO JSON\n');
console.log('============================\n');

// Backup JSON
fs.copyFileSync(JSON_PATH, BACKUP_PATH);
console.log(`✅ Backed up JSON to: ${BACKUP_PATH}\n`);

// Read CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const csvLines = csvContent.split('\n').filter(l => l.trim());
const csvData = csvLines.slice(1); // Skip header

console.log(`📊 CSV: ${csvData.length} entries\n`);

// Build hashId → metadata map from CSV
const metadataMap = new Map();
csvData.forEach(line => {
  const fields = parseCsvRow(line);
  const [slug, hashId, title, imageSlug, workDate, pubDate, category, cluster, featured, notes] = fields;

  metadataMap.set(hashId, {
    slug,
    category,
    cluster,
    featured,
    notes
  });
});

console.log(`🗺️  Metadata map: ${metadataMap.size} entries\n`);

// Read JSON
const jsonContent = fs.readFileSync(JSON_PATH, 'utf-8');
const posts = JSON.parse(jsonContent);

console.log(`📊 JSON: ${posts.length} posts\n`);

// Update posts with CSV metadata
const updates = [];

const updatedPosts = posts.map((post, idx) => {
  const hashId = extractHashId(post.guid);

  if (!hashId) {
    return post;
  }

  const metadata = metadataMap.get(hashId);

  if (!metadata) {
    return post;
  }

  // Check what changed
  const changes = [];
  if (post.slug !== metadata.slug) changes.push('slug');
  if (post.category !== metadata.category) changes.push('category');
  if (post.cluster !== metadata.cluster) changes.push('cluster');

  if (changes.length > 0) {
    updates.push({
      index: idx,
      hashId,
      title: post.title.substring(0, 50),
      changes,
      oldCluster: post.cluster || '(none)',
      newCluster: metadata.cluster || '(none)'
    });
  }

  // Update all fields from CSV
  return {
    ...post,
    slug: metadata.slug,
    url: `/blog/${metadata.slug}`,
    category: metadata.category,
    cluster: metadata.cluster || undefined
  };
});

console.log(`🔄 UPDATES: ${updates.length} posts updated\n`);

// Show sample updates focusing on cluster changes
const clusterUpdates = updates.filter(u => u.changes.includes('cluster'));
console.log(`📊 Cluster field updates: ${clusterUpdates.length}\n`);

if (clusterUpdates.length > 0) {
  clusterUpdates.slice(0, 10).forEach(u => {
    console.log(`   [${u.index}] ${u.hashId}`);
    console.log(`      Title: "${u.title}..."`);
    console.log(`      Cluster: "${u.oldCluster}" → "${u.newCluster}"`);
    console.log();
  });

  if (clusterUpdates.length > 10) {
    console.log(`   ... and ${clusterUpdates.length - 10} more\n`);
  }
}

// Write updated JSON
fs.writeFileSync(JSON_PATH, JSON.stringify(updatedPosts, null, 2), 'utf-8');

console.log('📊 RESULTS:');
console.log(`   Total posts: ${updatedPosts.length}`);
console.log(`   Posts with cluster: ${updatedPosts.filter(p => p.cluster).length}`);
console.log(`   Posts updated: ${updates.length}`);
console.log();

// Verify cluster distribution
console.log('📈 CLUSTER DISTRIBUTION IN JSON:\n');

const clusterCounts = {};
updatedPosts.forEach(post => {
  if (post.cluster) {
    clusterCounts[post.cluster] = (clusterCounts[post.cluster] || 0) + 1;
  }
});

const sortedClusters = Object.entries(clusterCounts).sort((a, b) => {
  // Sort by episode number (extract from slug)
  const aNum = parseInt(a[0].match(/\d+/)?.[0] || '0');
  const bNum = parseInt(b[0].match(/\d+/)?.[0] || '0');
  return aNum - bNum;
});

sortedClusters.forEach(([cluster, count]) => {
  console.log(`   ${cluster}: ${count} posts`);
});

console.log('\n✅ SUCCESS! CSV metadata synced to JSON.\n');
console.log(`   Backup saved at: ${BACKUP_PATH}\n`);
