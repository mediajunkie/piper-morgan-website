#!/usr/bin/env node

/**
 * Image Matcher Helper
 *
 * Generates structured data for the matching process
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'Building Piper Morgan - Medium Posts.csv');
const SOURCE_DIR = path.join(__dirname, '..', 'public/assets/blog-images/source');
const DATA_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');

function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

function main() {
  // Load CSV
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  // Load medium-posts.json for content
  const mediumPosts = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const postsMap = new Map(mediumPosts.map(p => [p.guid || p.link, p]));

  // Get posts without cartoon names
  const unmatchedPosts = [];
  for (const record of records) {
    const url = record['Medium URL'];
    if (!url) continue;

    const postId = extractPostId(url);
    if (!postId) continue;

    const cartoonName = record['cartoon']?.trim();
    if (cartoonName) continue; // Skip posts that already have cartoon names

    const title = record['Title'];
    const date = record['Date'];
    const mediumPost = postsMap.get(url);
    const content = mediumPost?.contentSnippet || mediumPost?.content || '';

    unmatchedPosts.push({
      postId,
      title,
      date,
      url,
      content: content.substring(0, 300)
    });
  }

  // Get orphan images
  const sourceFiles = fs.readdirSync(SOURCE_DIR)
    .filter(f => f !== 'INVENTORY.txt')
    .filter(f => f.match(/\.(png|webp|jpg|jpeg)$/i));

  // Find used cartoon names
  const usedNames = new Set();
  for (const record of records) {
    const cartoonName = record['cartoon']?.trim();
    if (cartoonName) {
      usedNames.add(cartoonName);
    }
  }

  // Filter to orphans only
  const orphanImages = sourceFiles.filter(f => {
    const name = path.parse(f).name;
    return !usedNames.has(name);
  });

  // Output structured data
  console.log('📊 MATCHING DATA\n');
  console.log(`Unmatched Posts: ${unmatchedPosts.length}`);
  console.log(`Orphan Images: ${orphanImages.length}\n`);

  // Save to JSON for easier processing
  const outputData = {
    unmatchedPosts,
    orphanImages: orphanImages.map(f => ({
      filename: f,
      name: path.parse(f).name,
      ext: path.extname(f),
      path: path.join(SOURCE_DIR, f)
    }))
  };

  const outputPath = path.join(__dirname, '..', 'docs/matching-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
  console.log(`✅ Saved matching data to: ${outputPath}\n`);

  // Show first few of each for reference
  console.log('🖼️  Sample Orphan Images:');
  orphanImages.slice(0, 10).forEach(f => console.log(`   ${f}`));
  console.log(`   ... and ${orphanImages.length - 10} more\n`);

  console.log('📝 Sample Unmatched Posts:');
  unmatchedPosts.slice(0, 5).forEach(p => {
    console.log(`   ${p.postId}: ${p.title}`);
    console.log(`      ${p.content.substring(0, 80)}...`);
  });
  console.log(`   ... and ${unmatchedPosts.length - 5} more\n`);
}

main();
