#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'medium-posts.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'assets', 'blog-images');

const posts = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));

// Posts to fix with their hashIds
const postsToFix = [
  { hashId: '8aacc89aecc9', ext: 'png' },
  { hashId: 'f38cde251d9d', ext: 'webp' },
  { hashId: '7f74897824a7', ext: 'webp' }
];

console.log('🔧 Fixing image paths in medium-posts.json...\n');

let fixed = 0;

postsToFix.forEach(({ hashId, ext }) => {
  const localPath = `/assets/blog-images/${hashId}-featured.${ext}`;
  const fullPath = path.join(IMAGES_DIR, `${hashId}-featured.${ext}`);

  // Verify file exists
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${localPath}`);
    return;
  }

  // Find and update post
  const post = posts.find(p => {
    const match = (p.guid || p.link || '').match(/([a-f0-9]{12})/);
    return match && match[1] === hashId;
  });

  if (post) {
    console.log(`✅ ${post.title.substring(0, 60)}...`);
    console.log(`   HashId: ${hashId}`);
    console.log(`   Old: ${post.thumbnail || 'null'}`);
    console.log(`   New: ${localPath}`);
    console.log();

    post.thumbnail = localPath;
    fixed++;
  } else {
    console.log(`⚠️  Post not found for hashId: ${hashId}`);
  }
});

// Save updated JSON
fs.writeFileSync(JSON_PATH, JSON.stringify(posts, null, 2));

console.log(`\n📊 Fixed ${fixed} image paths`);
console.log(`✅ Updated ${JSON_PATH}`);
