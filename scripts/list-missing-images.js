#!/usr/bin/env node

/**
 * List posts without images and their expected cartoon names
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'Medium-Posts-updated-xian-2025-10-11-1207.csv');
const POSTS_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');
const SOURCE_DIR = path.join(__dirname, '..', 'public/assets/blog-images/source');

function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

function main() {
  // Load posts and CSV
  const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf-8'));
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  // Create map of postId -> cartoon name
  const cartoonMap = new Map();
  for (const record of records) {
    const postId = extractPostId(record['Medium URL']);
    if (postId) {
      cartoonMap.set(postId, record['cartoon']?.trim() || '(no cartoon name)');
    }
  }

  // Get list of source images
  const sourceImages = fs.readdirSync(SOURCE_DIR);

  // Find posts without thumbnails
  const postsWithoutImages = posts.filter(p => !p.thumbnail);

  console.log('📋 POSTS WITHOUT IMAGES (25)\n');
  console.log('=' .repeat(80) + '\n');

  postsWithoutImages.forEach((post, i) => {
    const postId = extractPostId(post.link || post.guid);
    const expectedCartoon = cartoonMap.get(postId) || '(not in CSV)';

    // Check if the cartoon name exists in source with any extension
    const possibleFiles = [
      `${expectedCartoon}.png`,
      `${expectedCartoon}.webp`,
      `${expectedCartoon}.jpg`,
      `${expectedCartoon}.jpeg`
    ];

    const foundFile = possibleFiles.find(f => sourceImages.includes(f));
    const status = foundFile ? `✅ Found: ${foundFile}` : '❌ Not found in source/';

    console.log(`${i + 1}. ${postId}: "${post.title}"`);
    console.log(`   Expected cartoon: ${expectedCartoon}`);
    console.log(`   Status: ${status}`);
    console.log();
  });

  console.log('=' .repeat(80));
  console.log(`\nTotal: ${postsWithoutImages.length} posts without images\n`);
}

main();
