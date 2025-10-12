#!/usr/bin/env node

/**
 * Inventory gaps between CSV expectations and actual images
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'Medium-Posts-updated-xian-2025-10-11-1207.csv');
const SOURCE_DIR = path.join(__dirname, '..', 'public/assets/blog-images/source');
const BLOG_DIR = path.join(__dirname, '..', 'public/assets/blog-images');

function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

function main() {
  console.log('📊 Inventory: CSV Expectations vs Reality\n');
  console.log('=' .repeat(80) + '\n');

  // Load CSV
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  // Get list of source images
  const sourceImages = new Set(fs.readdirSync(SOURCE_DIR));

  // Get list of blog images (already copied)
  const blogImages = new Set(
    fs.readdirSync(BLOG_DIR)
      .filter(f => f.match(/^[a-f0-9]{12}-featured\./))
  );

  // Track what we find
  const missingImages = [];
  const hasCorrectImage = [];
  const csvCartoonNames = new Set();

  // Check each CSV record
  for (const record of records) {
    const url = record['Medium URL'];
    const cartoonName = record['cartoon']?.trim();
    const title = record['Title'];

    if (!url) continue; // Skip unpublished

    const postId = extractPostId(url);
    if (!postId) continue;

    if (!cartoonName) {
      missingImages.push({
        postId,
        title: title.substring(0, 70),
        expected: '(no cartoon name in CSV)',
        reason: 'No cartoon name specified'
      });
      continue;
    }

    csvCartoonNames.add(cartoonName);

    // Check if the expected image exists in source
    const expectedFiles = [
      `${cartoonName}.png`,
      `${cartoonName}.webp`,
      `${cartoonName}.jpg`,
      `${cartoonName}.jpeg`
    ];

    const sourceFile = expectedFiles.find(f => sourceImages.has(f));

    if (!sourceFile) {
      missingImages.push({
        postId,
        title: title.substring(0, 70),
        expected: cartoonName,
        reason: 'Image file not found in source/'
      });
      continue;
    }

    // Check if it's been copied to blog-images
    const ext = path.extname(sourceFile);
    const expectedBlogFile = `${postId}-featured${ext}`;

    if (!blogImages.has(expectedBlogFile)) {
      missingImages.push({
        postId,
        title: title.substring(0, 70),
        expected: cartoonName,
        sourceFile,
        reason: 'Not copied to blog-images yet'
      });
    } else {
      hasCorrectImage.push({
        postId,
        title: title.substring(0, 70),
        cartoonName,
        file: expectedBlogFile
      });
    }
  }

  // Find orphan images (in source but not in CSV)
  const orphanImages = [];
  for (const imageFile of sourceImages) {
    // Extract base name without extension
    const baseName = path.basename(imageFile, path.extname(imageFile));

    if (!csvCartoonNames.has(baseName)) {
      orphanImages.push(imageFile);
    }
  }

  // Print Report
  console.log('📋 LIST 1: ARTICLES MISSING CORRECT IMAGES');
  console.log('=' .repeat(80) + '\n');

  if (missingImages.length === 0) {
    console.log('✅ All articles have correct images!\n');
  } else {
    console.log(`Found ${missingImages.length} articles with image issues:\n`);

    missingImages.forEach((item, i) => {
      console.log(`${i + 1}. ${item.postId}: "${item.title}..."`);
      console.log(`   Expected: ${item.expected}`);
      if (item.sourceFile) {
        console.log(`   Source file exists: ${item.sourceFile}`);
      }
      console.log(`   Issue: ${item.reason}`);
      console.log();
    });
  }

  console.log('=' .repeat(80) + '\n');
  console.log('📋 LIST 2: ORPHAN IMAGES (not in CSV)');
  console.log('=' .repeat(80) + '\n');

  if (orphanImages.length === 0) {
    console.log('✅ No orphan images - all source images are referenced in CSV!\n');
  } else {
    console.log(`Found ${orphanImages.length} images in source/ not referenced in CSV:\n`);

    orphanImages.sort().forEach((file, i) => {
      console.log(`${i + 1}. ${file}`);
    });
    console.log();
  }

  // Summary
  console.log('=' .repeat(80) + '\n');
  console.log('📊 SUMMARY\n');
  console.log(`Total CSV records with URLs: ${records.filter(r => r['Medium URL']).length}`);
  console.log(`Articles with correct images: ${hasCorrectImage.length}`);
  console.log(`Articles missing images: ${missingImages.length}`);
  console.log(`Orphan images in source/: ${orphanImages.length}`);
  console.log(`Total images in source/: ${sourceImages.size}`);
  console.log(`Total images in blog-images/: ${blogImages.size}`);
  console.log();
}

main();
