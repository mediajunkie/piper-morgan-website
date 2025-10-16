#!/usr/bin/env node

/**
 * Find posts with Medium URLs instead of slug-based URLs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');

// Read JSON
const posts = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));

// Find posts with Medium URLs
const postsWithMediumUrls = posts.filter(post =>
  post.url && (post.url.includes('medium.com') || post.url.startsWith('http'))
);

console.log(`\n🔍 Found ${postsWithMediumUrls.length} posts with Medium URLs:\n`);

postsWithMediumUrls.forEach((post, idx) => {
  // Extract hashID from guid or url
  const hashId = post.guid?.match(/([a-f0-9]{12})/)?.[1] ||
                 post.url?.match(/([a-f0-9]{12})/)?.[1] ||
                 'unknown';

  console.log(`${idx + 1}. ${post.title}`);
  console.log(`   HashID: ${hashId}`);
  console.log(`   URL: ${post.url}`);
  console.log(`   Published: ${post.publishedAt || post.pubDate}`);
  console.log();
});
