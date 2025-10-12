#!/usr/bin/env node

/**
 * Comprehensive Inventory Report
 *
 * Shows complete status of blog posts vs images
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'Building Piper Morgan - Medium Posts.csv');
const SOURCE_DIR = path.join(__dirname, '..', 'public/assets/blog-images/source');

// Extract post ID from Medium URL
function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

// Main report
function main() {
  console.log('📊 COMPREHENSIVE INVENTORY REPORT');
  console.log('===================================\n');

  // Load CSV
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  // Get source images
  const sourceFiles = fs.readdirSync(SOURCE_DIR).filter(f => f !== 'INVENTORY.txt');

  // Track cartoon names used in CSV
  const csvCartoonNames = new Set();

  // Analyze posts
  const published = [];
  const unpublished = [];
  const withCartoon = [];
  const withoutCartoon = [];
  const matched = [];
  const missing = [];

  for (const record of records) {
    const url = record['Medium URL'];
    const cartoonName = record['cartoon']?.trim();
    const title = record['Title'];
    const postId = extractPostId(url);

    if (!url) {
      unpublished.push({ title });
      continue;
    }

    published.push({ postId, title, cartoonName });

    if (cartoonName) {
      csvCartoonNames.add(cartoonName);
      withCartoon.push({ postId, title, cartoonName });

      // Check if we have the image
      const hasImage = sourceFiles.some(f => {
        const name = path.parse(f).name;
        return name === cartoonName;
      });

      if (hasImage) {
        matched.push({ postId, title, cartoonName });
      } else {
        missing.push({ postId, title, cartoonName });
      }
    } else {
      withoutCartoon.push({ postId, title });
    }
  }

  // Find orphan images (not in CSV)
  const orphans = sourceFiles.filter(f => {
    const name = path.parse(f).name;
    return !csvCartoonNames.has(name);
  });

  // Print report
  console.log(`📝 BLOG POSTS:`);
  console.log(`   Total rows in CSV: ${records.length}`);
  console.log(`   Published posts (with URL): ${published.length}`);
  console.log(`   Unpublished/draft posts: ${unpublished.length}\n`);

  console.log(`🖼️  IMAGES IN CSV:`);
  console.log(`   Posts with cartoon name: ${withCartoon.length}`);
  console.log(`   Posts without cartoon name: ${withoutCartoon.length}\n`);

  console.log(`✅ MATCHING STATUS:`);
  console.log(`   Matched (CSV name → found image): ${matched.length}`);
  console.log(`   Missing (CSV name → NO image found): ${missing.length}`);
  console.log(`   Match rate: ${Math.round(matched.length / withCartoon.length * 100)}%\n`);

  console.log(`📦 COLLECTED IMAGES:`);
  console.log(`   Total images in source/: ${sourceFiles.length}`);
  console.log(`   Used in CSV: ${matched.length}`);
  console.log(`   Orphans (not in CSV): ${orphans.length}\n`);

  console.log(`📉 GAPS:`);
  console.log(`   Posts needing images: ${missing.length + withoutCartoon.length}`);
  console.log(`   - Missing (had name but no file): ${missing.length}`);
  console.log(`   - No cartoon name in CSV: ${withoutCartoon.length}\n`);

  // Show missing details
  if (missing.length > 0) {
    console.log(`\n❌ MISSING IMAGES (${missing.length}):`);
    missing.forEach(m => {
      console.log(`   "${m.cartoonName}" for post ${m.postId}`);
      console.log(`      ${m.title.substring(0, 70)}...`);
    });
  }

  // Show some orphans
  if (orphans.length > 0) {
    console.log(`\n🔍 ORPHAN IMAGES (first 20 of ${orphans.length}):`);
    orphans.slice(0, 20).forEach(f => {
      console.log(`   ${f}`);
    });
    if (orphans.length > 20) {
      console.log(`   ... and ${orphans.length - 20} more`);
    }
  }

  console.log(`\n\n💡 NEXT STEPS:`);
  console.log(`   1. Match ${orphans.length} orphan images to ${withoutCartoon.length} posts without cartoon names`);
  console.log(`   2. Find ${missing.length} missing images (probably with slightly different names)`);
  console.log(`   3. Update CSV with correct cartoon names`);
  console.log(`   4. Run match-blog-images.js --copy to populate blog-images/\n`);
}

main();
