#!/usr/bin/env node

/**
 * Match Blog Images Script
 *
 * Matches CSV cartoon names to collected source images and copies them
 * to the blog-images directory with proper post ID naming.
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'Medium-Posts-updated-xian-2025-10-11-1207.csv');
const SOURCE_DIR = path.join(__dirname, '..', 'public/assets/blog-images/source');
const DEST_DIR = path.join(__dirname, '..', 'public/assets/blog-images');

// Extract post ID from Medium URL
function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

// Find matching image file in source directory
function findSourceImage(cartoonName) {
  if (!cartoonName) return null;

  const sourceFiles = fs.readdirSync(SOURCE_DIR);

  // Try exact matches first (with different extensions)
  const exactPatterns = [
    `${cartoonName}.png`,
    `${cartoonName}.webp`,
    `${cartoonName}.jpg`,
    `${cartoonName}.jpeg`
  ];

  for (const pattern of exactPatterns) {
    if (sourceFiles.includes(pattern)) {
      return pattern;
    }
  }

  return null;
}

function main() {
  console.log('🔍 Blog Image Matching Script');
  console.log('==============================\n');

  // Load CSV
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  const matches = [];
  const missing = [];
  const noCartoonName = [];

  // Process each post
  for (const record of records) {
    const url = record['Medium URL'];
    const cartoonName = record['cartoon']?.trim();
    const title = record['Title'];

    if (!url) continue; // Skip unpublished posts

    const postId = extractPostId(url);
    if (!postId) continue;

    if (!cartoonName) {
      noCartoonName.push({ postId, title });
      continue;
    }

    const sourceFile = findSourceImage(cartoonName);

    if (sourceFile) {
      matches.push({
        postId,
        title: title.substring(0, 60),
        cartoonName,
        sourceFile
      });
    } else {
      missing.push({
        postId,
        title: title.substring(0, 60),
        cartoonName
      });
    }
  }

  // Report results
  console.log(`📊 Matching Results:\n`);
  console.log(`✅ Matched: ${matches.length} posts`);
  console.log(`❌ Missing: ${missing.length} posts (cartoon name in CSV but image not found)`);
  console.log(`⚪ No cartoon name: ${noCartoonName.length} posts\n`);

  // Show matches
  if (matches.length > 0) {
    console.log(`\n✅ MATCHED IMAGES (${matches.length}):\n`);
    matches.slice(0, 20).forEach(m => {
      console.log(`   ${m.postId}: ${m.cartoonName} → ${m.sourceFile}`);
      console.log(`      "${m.title}..."`);
    });
    if (matches.length > 20) {
      console.log(`   ... and ${matches.length - 20} more`);
    }
  }

  // Show missing
  if (missing.length > 0) {
    console.log(`\n❌ MISSING IMAGES (${missing.length}):\n`);
    missing.forEach(m => {
      console.log(`   ${m.postId}: Looking for "${m.cartoonName}"`);
      console.log(`      "${m.title}..."`);
    });
  }

  // Show posts without cartoon names
  if (noCartoonName.length > 0) {
    console.log(`\n⚪ NO CARTOON NAME IN CSV (${noCartoonName.length}):\n`);
    noCartoonName.slice(0, 10).forEach(m => {
      console.log(`   ${m.postId}: "${m.title.substring(0, 60)}..."`);
    });
    if (noCartoonName.length > 10) {
      console.log(`   ... and ${noCartoonName.length - 10} more`);
    }
  }

  // Ask if should copy
  console.log(`\n\n🤔 Ready to copy ${matches.length} matched images to blog-images directory?`);
  console.log(`   This will copy files from source/ to the main blog-images/ folder`);
  console.log(`   with proper naming: {postId}-featured.{ext}\n`);
  console.log(`   Run with --copy flag to execute: node scripts/match-blog-images.js --copy\n`);

  // Check if --copy flag
  if (process.argv.includes('--copy')) {
    console.log('📋 Copying matched images...\n');

    let copied = 0;
    for (const match of matches) {
      const ext = path.extname(match.sourceFile);
      const sourcePath = path.join(SOURCE_DIR, match.sourceFile);
      const destPath = path.join(DEST_DIR, `${match.postId}-featured${ext}`);

      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ ${match.postId}-featured${ext}`);
        copied++;
      } catch (err) {
        console.log(`❌ Failed to copy ${match.sourceFile}: ${err.message}`);
      }
    }

    console.log(`\n✨ Copied ${copied} images successfully!`);
  }
}

main();
