#!/usr/bin/env node

/**
 * Update medium-posts.json with thumbnail paths for copied images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public/assets/blog-images');

// Extract post ID from Medium URL or GUID
function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

function main() {
  console.log('🔄 Updating post thumbnails...\n');

  // Load posts
  const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf-8'));

  // Get list of available images
  const imageFiles = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.match(/^[a-f0-9]{12}-featured\.(png|webp|jpg|jpeg)$/));

  console.log(`📦 Found ${posts.length} posts`);
  console.log(`🖼️  Found ${imageFiles.length} images\n`);

  let updated = 0;
  let alreadySet = 0;
  let noMatch = 0;

  // Update each post
  for (const post of posts) {
    const postId = extractPostId(post.link || post.guid);

    if (!postId) {
      noMatch++;
      continue;
    }

    // Find matching image
    const imageFile = imageFiles.find(f => f.startsWith(postId));

    if (imageFile) {
      const newPath = `/assets/blog-images/${imageFile}`;

      if (post.thumbnail === newPath) {
        alreadySet++;
      } else {
        post.thumbnail = newPath;
        updated++;
        console.log(`✅ ${postId}: ${imageFile}`);
      }
    } else {
      noMatch++;
    }
  }

  // Save updated posts
  fs.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2), 'utf-8');

  console.log(`\n📊 Update Summary:`);
  console.log(`   ✅ Updated: ${updated} posts`);
  console.log(`   ⏭️  Already set: ${alreadySet} posts`);
  console.log(`   ⚪ No image: ${noMatch} posts`);
  console.log(`\n💾 Saved to: ${POSTS_PATH}`);
}

main();
