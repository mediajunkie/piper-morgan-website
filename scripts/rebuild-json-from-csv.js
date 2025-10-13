#!/usr/bin/env node

/**
 * Step 3: Rebuild JSON from Clean CSV
 * Merge cleaned CSV slugs with existing JSON metadata
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');
const JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'medium-posts.json');
const BACKUP_PATH = path.join(__dirname, '..', 'src', 'data', 'medium-posts.json.backup-step3');

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
  // Extract 12-char hashId from Medium GUID
  // Examples:
  // - "https://medium.com/building-piper-morgan/4148a6ebdab1"
  // - "https://medium.com/p/4148a6ebdab1"
  const match = guid.match(/([a-f0-9]{12})$/);
  return match ? match[1] : null;
}

console.log('📋 STEP 3: REBUILD JSON FROM CLEAN CSV');
console.log('======================================\n');

// Backup JSON
fs.copyFileSync(JSON_PATH, BACKUP_PATH);
console.log(`✅ Backed up JSON to: ${BACKUP_PATH}\n`);

// Read CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const csvLines = csvContent.split('\n').filter(l => l.trim());
const csvData = csvLines.slice(1); // Skip header

console.log(`📊 CSV: ${csvData.length} entries\n`);

// Build hashId → slug map from CSV
const slugMap = new Map();
csvData.forEach(line => {
  const fields = parseCsvRow(line);
  const [slug, hashId] = fields;
  slugMap.set(hashId, slug);
});

console.log(`🗺️  Slug map: ${slugMap.size} entries\n`);

// Read JSON
const jsonContent = fs.readFileSync(JSON_PATH, 'utf-8');
const posts = JSON.parse(jsonContent);

console.log(`📊 JSON: ${posts.length} posts\n`);

// Update posts with new slugs
const updates = [];
const missing = [];

const updatedPosts = posts.map((post, idx) => {
  const hashId = extractHashId(post.guid);

  if (!hashId) {
    missing.push({
      index: idx,
      guid: post.guid,
      reason: 'no-hashid'
    });
    return post;
  }

  const newSlug = slugMap.get(hashId);

  if (!newSlug) {
    missing.push({
      index: idx,
      hashId,
      guid: post.guid,
      title: post.title,
      reason: 'not-in-csv'
    });
    return post;
  }

  // Update slug and URL
  const oldSlug = post.slug;
  const oldUrl = post.url;

  if (oldSlug !== newSlug) {
    updates.push({
      index: idx,
      hashId,
      oldSlug,
      newSlug,
      title: post.title.substring(0, 60)
    });

    return {
      ...post,
      slug: newSlug,
      url: `/blog/${newSlug}`
    };
  }

  return post;
});

console.log(`🔄 UPDATES: ${updates.length} posts updated\n`);

if (updates.length > 0) {
  updates.slice(0, 10).forEach(u => {
    console.log(`   [${u.index}] ${u.hashId}`);
    console.log(`      OLD: slug="${u.oldSlug}" url="/blog/${u.oldSlug}"`);
    console.log(`      NEW: slug="${u.newSlug}" url="/blog/${u.newSlug}"`);
    console.log(`      "${u.title}..."`);
    console.log();
  });

  if (updates.length > 10) {
    console.log(`   ... and ${updates.length - 10} more\n`);
  }
}

if (missing.length > 0) {
  console.log(`⚠️  MISSING: ${missing.length} posts not matched\n`);
  missing.slice(0, 5).forEach(m => {
    console.log(`   [${m.index}] ${m.hashId || 'NO HASH'}`);
    console.log(`      Reason: ${m.reason}`);
    console.log(`      GUID: ${m.guid}`);
    if (m.title) console.log(`      Title: ${m.title.substring(0, 60)}...`);
    console.log();
  });

  if (missing.length > 5) {
    console.log(`   ... and ${missing.length - 5} more\n`);
  }
}

// Write updated JSON
fs.writeFileSync(JSON_PATH, JSON.stringify(updatedPosts, null, 2), 'utf-8');

console.log('📊 RESULTS:');
console.log(`   Total posts: ${updatedPosts.length}`);
console.log(`   Updated: ${updates.length}`);
console.log(`   Unchanged: ${updatedPosts.length - updates.length - missing.length}`);
console.log(`   Missing/Not matched: ${missing.length}`);
console.log();

// Verification
console.log('✅ VERIFICATION:');

// Check for numeric slugs in JSON
const numericSlugs = updatedPosts.filter(p => /^[0-9]+$/.test(p.slug) || /^\d+-\d+$/.test(p.slug));
console.log(`   Numeric slugs in JSON: ${numericSlugs.length} ${numericSlugs.length === 0 ? '✅' : '❌'}`);

if (numericSlugs.length > 0) {
  console.log('   ⚠️  Posts with numeric slugs:');
  numericSlugs.slice(0, 5).forEach(p => {
    console.log(`      slug="${p.slug}" hashId="${extractHashId(p.guid)}" title="${p.title.substring(0, 50)}..."`);
  });
}

// Check slug uniqueness in JSON
const jsonSlugs = new Set();
const jsonDupes = new Set();
updatedPosts.forEach(p => {
  if (jsonSlugs.has(p.slug)) {
    jsonDupes.add(p.slug);
  }
  jsonSlugs.add(p.slug);
});

console.log(`   Unique slugs: ${jsonSlugs.size} (out of ${updatedPosts.length} posts) ${jsonSlugs.size === updatedPosts.length ? '✅' : '❌'}`);
console.log(`   Duplicate slugs: ${jsonDupes.size} ${jsonDupes.size === 0 ? '✅' : '❌'}`);

if (jsonDupes.size > 0) {
  console.log('   ❌ Duplicate slugs:');
  jsonDupes.forEach(slug => {
    const count = updatedPosts.filter(p => p.slug === slug).length;
    console.log(`      "${slug}" appears ${count} times`);
  });
}

console.log();

if (numericSlugs.length === 0 && jsonDupes.size === 0 && missing.length === 0) {
  console.log('🎉 SUCCESS! JSON rebuilt with clean slugs.');
  console.log(`   Backup saved at: ${BACKUP_PATH}`);
} else if (missing.length === 0) {
  console.log('✅ JSON rebuilt successfully.');
  console.log('   ⚠️  Some warnings above, but no critical issues.');
  console.log(`   Backup saved at: ${BACKUP_PATH}`);
} else {
  console.log('⚠️  JSON rebuilt with warnings.');
  console.log('   Review missing entries above.');
  console.log(`   Backup saved at: ${BACKUP_PATH}`);
}
