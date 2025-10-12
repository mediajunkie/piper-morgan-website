#!/usr/bin/env node

/**
 * Deduplicate posts in medium-posts.json
 * Keeps entries with building-piper-morgan publication URLs
 * Removes duplicates with @mediajunkie author URLs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');

function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

function main() {
  console.log('🔍 Deduplicating posts...\n');

  const posts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf-8'));
  console.log(`📦 Loaded ${posts.length} posts`);

  // Group by post ID
  const postsByIdmap = new Map();

  for (const post of posts) {
    const postId = extractPostId(post.link || post.guid);

    if (!postId) {
      console.log(`⚠️  No post ID for: ${post.title?.substring(0, 50)}`);
      continue;
    }

    if (!postsByIdmap.has(postId)) {
      postsByIdmap.set(postId, []);
    }

    postsByIdmap.get(postId).push(post);
  }

  console.log(`📊 Found ${postsByIdmap.size} unique post IDs\n`);

  // Keep best version of each post
  const deduplicatedPosts = [];
  let duplicatesRemoved = 0;

  for (const [postId, duplicates] of postsByIdmap.entries()) {
    if (duplicates.length === 1) {
      deduplicatedPosts.push(duplicates[0]);
    } else {
      // Multiple entries - keep the publication URL version
      console.log(`🔄 Duplicate found (${duplicates.length}x): ${postId}`);
      console.log(`   "${duplicates[0].title?.substring(0, 60)}..."`);

      // Prefer building-piper-morgan publication URL
      const preferred = duplicates.find(p =>
        (p.link || p.guid || '').includes('building-piper-morgan')
      ) || duplicates[0];

      deduplicatedPosts.push(preferred);
      duplicatesRemoved += duplicates.length - 1;

      console.log(`   ✅ Kept: ${preferred.link || preferred.guid}`);

      duplicates.forEach(dup => {
        if (dup !== preferred) {
          console.log(`   ❌ Removed: ${dup.link || dup.guid}`);
        }
      });
      console.log();
    }
  }

  // Sort by date (newest first)
  deduplicatedPosts.sort((a, b) => {
    const dateA = new Date(a.isoDate || a.pubDate);
    const dateB = new Date(b.isoDate || b.pubDate);
    return dateB - dateA;
  });

  // Save
  fs.writeFileSync(POSTS_PATH, JSON.stringify(deduplicatedPosts, null, 2), 'utf-8');

  console.log(`\n📊 Summary:`);
  console.log(`   Before: ${posts.length} posts`);
  console.log(`   After: ${deduplicatedPosts.length} posts`);
  console.log(`   Removed: ${duplicatesRemoved} duplicates`);
  console.log(`\n💾 Saved to: ${POSTS_PATH}`);
}

main();
