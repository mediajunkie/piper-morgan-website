#!/usr/bin/env node

/**
 * Interactive New Post Preparation Script
 *
 * Helps add new Medium posts to blog-metadata.csv with proper metadata.
 * Detects posts in medium-posts.json that aren't in CSV and guides user through adding them.
 *
 * Usage:
 *   node scripts/prepare-new-post.js
 *   node scripts/prepare-new-post.js --dry-run  (preview without writing)
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { generateSlug, extractHashId } from '../src/lib/slug-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');
const JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'medium-posts.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'assets', 'blog-images');
const EPISODES_PATH = path.join(__dirname, '..', 'src', 'lib', 'episodes.ts');

const isDryRun = process.argv.includes('--dry-run');

/**
 * Create readline interface for interactive prompts
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Promisified question
 */
function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

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
 * Format CSV row with proper quoting
 */
function formatCsvRow(fields) {
  return fields.map(field => {
    const str = String(field || '');
    // Quote if contains comma, newline, or quote
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }).join(',');
}

/**
 * Load existing CSV entries
 */
function loadCsvEntries() {
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const csvLines = csvContent.split('\n').filter(l => l.trim());
  const dataLines = csvLines.slice(1); // Skip header

  const entries = new Map();
  dataLines.forEach(line => {
    const fields = parseCsvRow(line);
    const [slug, hashId] = fields;
    if (hashId) {
      entries.set(hashId, fields);
    }
  });

  return entries;
}

/**
 * Load JSON posts
 */
function loadJsonPosts() {
  const jsonContent = fs.readFileSync(JSON_PATH, 'utf-8');
  return JSON.parse(jsonContent);
}

/**
 * Extract hashId from GUID or link
 */
function getHashId(post) {
  return extractHashId(post.guid || post.link);
}

/**
 * Find posts not in CSV
 */
function findNewPosts(jsonPosts, csvEntries) {
  const newPosts = [];

  jsonPosts.forEach(post => {
    const hashId = getHashId(post);
    if (hashId && !csvEntries.has(hashId)) {
      newPosts.push({ ...post, hashId });
    }
  });

  return newPosts;
}

/**
 * Get available robot images
 */
function getAvailableImages() {
  if (!fs.existsSync(IMAGES_DIR)) return [];

  const files = fs.readdirSync(IMAGES_DIR);
  return files
    .filter(f => f.startsWith('robot-') && (f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg')))
    .sort();
}

/**
 * Load episodes from episodes.ts
 */
function loadEpisodes() {
  try {
    const content = fs.readFileSync(EPISODES_PATH, 'utf-8');

    // Extract episode definitions using regex
    const episodes = [];
    const episodePattern = /\{[^}]*slug:\s*['"]([^'"]+)['"][^}]*name:\s*['"]([^'"]+)['"][^}]*startDate:\s*['"]([^'"]+)['"][^}]*endDate:\s*['"]([^'"]+)['"][^}]*\}/g;

    let match;
    while ((match = episodePattern.exec(content)) !== null) {
      episodes.push({
        slug: match[1],
        name: match[2],
        startDate: match[3],
        endDate: match[4]
      });
    }

    return episodes;
  } catch (err) {
    console.log(`⚠️  Could not load episodes: ${err.message}`);
    return [];
  }
}

/**
 * Get existing slugs for collision detection
 */
function getExistingSlugs(csvEntries) {
  return Array.from(csvEntries.values()).map(fields => fields[0]).filter(Boolean);
}

/**
 * Interactive metadata collection for a post
 */
async function collectMetadata(post, availableImages, episodes, existingSlugs) {
  console.log('\n' + '='.repeat(60));
  console.log(`\n📝 New Post Found:\n`);
  console.log(`Title: ${post.title}`);
  console.log(`Hash ID: ${post.hashId}`);
  console.log(`Published: ${post.publishedAt || post.pubDate}\n`);

  const metadata = {};

  // 1. Generate slug
  console.log('1️⃣  Generating slug...');
  const generatedSlug = generateSlug(post.title, existingSlugs);
  console.log(`   Suggested slug: ${generatedSlug}`);

  const slugAnswer = await question('   Use this slug? (y/n, or enter custom): ');
  if (slugAnswer.toLowerCase() === 'n') {
    metadata.slug = await question('   Enter custom slug: ');
  } else if (slugAnswer.toLowerCase() !== 'y' && slugAnswer.trim()) {
    metadata.slug = slugAnswer.trim();
  } else {
    metadata.slug = generatedSlug;
  }

  // 2. Select image
  console.log('\n2️⃣  Select featured image:');
  if (availableImages.length > 0) {
    console.log('   Available images:');
    availableImages.slice(0, 20).forEach((img, idx) => {
      console.log(`   ${idx + 1}. ${img}`);
    });
    if (availableImages.length > 20) {
      console.log(`   ... and ${availableImages.length - 20} more`);
    }
  } else {
    console.log('   ⚠️  No robot-* images found in public/assets/blog-images/');
  }

  metadata.imageSlug = await question('   Enter image filename (e.g., robot-trainer.webp): ');

  // 3. Category
  console.log('\n3️⃣  Select category:');
  console.log('   building - Narrative posts (building-in-public story)');
  console.log('   insight  - Standalone lessons/frameworks');

  const categoryAnswer = await question('   Enter category (building/insight): ');
  metadata.category = categoryAnswer.trim() || 'building';

  // 4. Episode (cluster)
  console.log('\n4️⃣  Select episode:');
  if (episodes.length > 0) {
    episodes.forEach((ep, idx) => {
      console.log(`   ${idx + 1}. ${ep.slug}`);
      console.log(`      ${ep.name}`);
      console.log(`      ${ep.startDate} to ${ep.endDate}`);
    });
  }

  const episodeAnswer = await question('   Enter episode slug (or press Enter for none): ');
  metadata.cluster = episodeAnswer.trim();

  // 5. Work date
  console.log('\n5️⃣  Work date (when the work discussed in the article happened):');
  const pubDate = post.publishedAt || post.pubDate;
  console.log(`   Published: ${pubDate}`);
  console.log(`   NOTE: This is NOT when you wrote the post - it's when the work occurred`);

  const workDateAnswer = await question(`   Work date (YYYY-MM-DD, or Enter to use pub date): `);
  metadata.workDate = workDateAnswer.trim() || pubDate.split('T')[0];

  // 6. Chat date (optional)
  console.log('\n6️⃣  Chat date (optional - start date of Comms Director chat with draft):');
  console.log(`   NOTE: Multiple posts can share same chatDate if using one long-running chat`);
  const chatDateAnswer = await question('   Chat date (YYYY-MM-DD, or Enter to skip): ');
  metadata.chatDate = chatDateAnswer.trim();

  // 7. Featured (default false)
  metadata.featured = 'false';

  // 8. Notes (optional)
  const notesAnswer = await question('\n7️⃣  Notes (optional): ');
  metadata.notes = notesAnswer.trim();

  return metadata;
}

/**
 * Create CSV entry for post
 */
function createCsvEntry(post, metadata) {
  const pubDate = post.publishedAt || post.pubDate;

  return [
    metadata.slug,
    post.hashId,
    post.title,
    metadata.chatDate || '',
    metadata.imageSlug,
    metadata.workDate,
    pubDate,
    metadata.category,
    metadata.cluster || '',
    metadata.featured || 'false',
    metadata.notes || ''
  ];
}

/**
 * Append entries to CSV
 */
function appendToCSV(entries) {
  const csvLines = entries.map(entry => formatCsvRow(entry));
  const content = csvLines.join('\n') + '\n';

  fs.appendFileSync(CSV_PATH, content, 'utf-8');
}

/**
 * Main function
 */
async function main() {
  console.log('📋 PREPARE NEW BLOG POST\n');
  console.log('============================\n');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be written\n');
  }

  // Load data
  console.log('Loading data...');
  const csvEntries = loadCsvEntries();
  const jsonPosts = loadJsonPosts();
  const availableImages = getAvailableImages();
  const episodes = loadEpisodes();
  const existingSlugs = getExistingSlugs(csvEntries);

  console.log(`✅ CSV: ${csvEntries.size} entries`);
  console.log(`✅ JSON: ${jsonPosts.length} posts`);
  console.log(`✅ Available images: ${availableImages.length}`);
  console.log(`✅ Episodes: ${episodes.length}`);

  // Find new posts
  const newPosts = findNewPosts(jsonPosts, csvEntries);

  if (newPosts.length === 0) {
    console.log('\n✅ No new posts found! All posts in JSON are already in CSV.\n');
    rl.close();
    return;
  }

  console.log(`\n🆕 Found ${newPosts.length} new post(s) not in CSV:\n`);
  newPosts.forEach((post, idx) => {
    console.log(`${idx + 1}. ${post.hashId} - "${post.title.substring(0, 50)}..."`);
  });

  const continueAnswer = await question('\nContinue to add these posts? (y/n): ');
  if (continueAnswer.toLowerCase() !== 'y') {
    console.log('\nCancelled.\n');
    rl.close();
    return;
  }

  // Collect metadata for each post
  const newEntries = [];

  for (const post of newPosts) {
    const metadata = await collectMetadata(post, availableImages, episodes, existingSlugs);
    const entry = createCsvEntry(post, metadata);
    newEntries.push(entry);

    // Add slug to existing slugs to prevent collisions
    existingSlugs.push(metadata.slug);

    console.log('\n✅ Entry prepared:');
    console.log(`   Slug: ${metadata.slug}`);
    console.log(`   Image: ${metadata.imageSlug}`);
    console.log(`   Category: ${metadata.category}`);
    console.log(`   Episode: ${metadata.cluster || '(none)'}`);
  }

  // Confirm before writing
  console.log('\n' + '='.repeat(60));
  console.log(`\n📝 Ready to add ${newEntries.length} entry(s) to CSV\n`);

  const confirmAnswer = await question('Write to CSV? (y/n): ');
  if (confirmAnswer.toLowerCase() !== 'y') {
    console.log('\nCancelled. No changes written.\n');
    rl.close();
    return;
  }

  if (isDryRun) {
    console.log('\n🔍 DRY RUN - Entries that would be added:\n');
    newEntries.forEach(entry => {
      console.log(formatCsvRow(entry));
    });
    console.log('\n(No changes written in dry-run mode)\n');
  } else {
    // Write to CSV
    appendToCSV(newEntries);
    console.log(`\n✅ Added ${newEntries.length} entry(s) to CSV\n`);

    // Suggest next steps
    console.log('Next steps:');
    console.log('1. Run validation: node scripts/validate-csv.js');
    console.log('2. Sync to JSON: node scripts/sync-csv-to-json.js');
    console.log('3. Test locally: npm run dev');
    console.log('4. Commit and push\n');
  }

  rl.close();
}

// Run main
main().catch(err => {
  console.error('❌ Error:', err.message);
  rl.close();
  process.exit(1);
});
