#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src/data/medium-posts.json'), 'utf-8'));
const content = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src/data/blog-content.json'), 'utf-8'));

function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

const missing = posts.filter(post => {
  const postId = extractPostId(post.guid || post.link);
  return postId && !content[postId];
});

console.log(`\nPosts in JSON but missing content: ${missing.length}\n`);
missing.forEach(p => {
  const id = extractPostId(p.guid || p.link);
  console.log(`   ${id} - ${p.title.substring(0, 60)}`);
});

console.log(`\nTotal posts: ${posts.length}`);
console.log(`Posts with content: ${posts.length - missing.length}`);
console.log(`Coverage: ${((posts.length - missing.length) / posts.length * 100).toFixed(1)}%\n`);
