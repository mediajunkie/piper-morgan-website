#!/usr/bin/env node

/**
 * Remove duplicate posts from medium-posts.json
 * Keeps posts with /p/ GUID format (has images), removes /building-piper-morgan/ format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'medium-posts.json');

function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

function removeDuplicates() {
  console.log('🔍 Loading medium-posts.json...\n');

  const posts = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
  console.log(`📊 Total posts before: ${posts.length}`);

  // Group posts by hashId
  const postsByHashId = new Map();

  posts.forEach((post, index) => {
    const hashId = extractPostId(post.guid || post.link);

    if (!hashId) {
      console.log(`⚠️  Warning: Could not extract hashId from post at index ${index}`);
      return;
    }

    if (!postsByHashId.has(hashId)) {
      postsByHashId.set(hashId, []);
    }

    postsByHashId.get(hashId).push({
      post,
      index,
      guid: post.guid,
      hasShortGuid: post.guid && post.guid.includes('/p/'),
      hasFeaturedImage: !!(post.featuredImage || post.thumbnail)
    });
  });

  // Find duplicates
  const duplicates = [];
  postsByHashId.forEach((posts, hashId) => {
    if (posts.length > 1) {
      duplicates.push({ hashId, posts });
    }
  });

  console.log(`\n🔍 Found ${duplicates.length} posts with duplicates:\n`);

  // Choose which post to keep for each duplicate
  const postsToKeep = new Set();
  const postsToRemove = [];

  posts.forEach((_, index) => postsToKeep.add(index));

  duplicates.forEach(({ hashId, posts }) => {
    console.log(`📝 ${hashId}:`);
    posts.forEach(p => {
      console.log(`   - Index ${p.index}: ${p.guid}`);
      console.log(`     Short GUID: ${p.hasShortGuid}, Has Image: ${p.hasFeaturedImage}`);
    });

    // Preference: Keep /p/ format OR keep one with image OR keep first one
    const preferred = posts.find(p => p.hasShortGuid) ||
                      posts.find(p => p.hasFeaturedImage) ||
                      posts[0];

    posts.forEach(p => {
      if (p.index !== preferred.index) {
        postsToKeep.delete(p.index);
        postsToRemove.push({
          index: p.index,
          title: p.post.title.substring(0, 60),
          guid: p.guid
        });
      }
    });

    console.log(`   ✅ Keeping index ${preferred.index}`);
    console.log();
  });

  // Create new array with only posts to keep
  const cleanedPosts = posts.filter((_, index) => postsToKeep.has(index));

  console.log(`\n📊 Summary:`);
  console.log(`   - Posts before: ${posts.length}`);
  console.log(`   - Posts after: ${cleanedPosts.length}`);
  console.log(`   - Removed: ${postsToRemove.length}`);

  if (postsToRemove.length > 0) {
    console.log(`\n🗑️  Removing duplicates:`);
    postsToRemove.forEach(p => {
      console.log(`   - [${p.index}] ${p.title}... (${p.guid})`);
    });
  }

  // Save cleaned data
  fs.writeFileSync(JSON_PATH, JSON.stringify(cleanedPosts, null, 2));
  console.log(`\n✅ Saved cleaned data to ${JSON_PATH}`);

  return {
    before: posts.length,
    after: cleanedPosts.length,
    removed: postsToRemove.length
  };
}

// Run
try {
  const result = removeDuplicates();
  console.log('\n✨ Done!');
  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
