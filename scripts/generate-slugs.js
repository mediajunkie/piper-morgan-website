/**
 * Generate Slugs for All Blog Posts
 *
 * This script:
 * 1. Reads medium-posts.json
 * 2. Generates unique slugs for all posts
 * 3. Updates the JSON with slug fields
 * 4. Validates all slugs are unique
 * 5. Outputs a report
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple slug generation (matches TypeScript version)
function sanitizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateSlug(title, existingSlugs = [], maxWords = 6) {
  const textBeforeColon = title.split(':')[0].trim();
  const sanitized = sanitizeText(textBeforeColon);
  const words = sanitized
    .split(/\s+/)
    .filter(word => word.length > 0);

  if (words.length === 0) {
    return 'untitled';
  }

  const startWordCount = Math.min(words.length, maxWords);

  for (let wordCount = startWordCount; wordCount <= words.length; wordCount++) {
    const slug = words.slice(0, wordCount).join('-');

    if (!existingSlugs.includes(slug)) {
      return slug;
    }
  }

  const baseSlug = words.slice(0, maxWords).join('-');
  let counter = 2;

  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++;
  }

  return `${baseSlug}-${counter}`;
}

function extractHashId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

// Main execution
async function main() {
  console.log('🚀 Starting slug generation for all blog posts...\n');

  // Read medium-posts.json
  const mediumPostsPath = path.join(__dirname, '..', 'src/data/medium-posts.json');
  const posts = JSON.parse(fs.readFileSync(mediumPostsPath, 'utf-8'));

  console.log(`📚 Found ${posts.length} posts\n`);

  // Generate slugs
  const usedSlugs = [];
  const slugMap = new Map();
  const report = [];

  for (const post of posts) {
    const hashId = extractHashId(post.guid || post.link);

    if (!hashId) {
      console.warn(`⚠️  No hash ID found for post: ${post.title}`);
      continue;
    }

    const slug = generateSlug(post.title, usedSlugs);

    // Add slug to post
    post.slug = slug;

    // Track for report
    slugMap.set(hashId, slug);
    usedSlugs.push(slug);

    report.push({
      hashId,
      slug,
      title: post.title,
      wordCount: slug.split('-').length
    });
  }

  // Validation
  console.log('✅ Slug generation complete!\n');
  console.log('📊 Statistics:');
  console.log(`   Total posts: ${posts.length}`);
  console.log(`   Slugs generated: ${usedSlugs.length}`);
  console.log(`   Unique slugs: ${new Set(usedSlugs).size}`);

  // Check for any collisions (should be none)
  const uniqueSlugs = new Set(usedSlugs);
  if (uniqueSlugs.size !== usedSlugs.length) {
    console.error('\n❌ ERROR: Duplicate slugs detected!');
    process.exit(1);
  }

  // Word count distribution
  const wordCounts = report.reduce((acc, r) => {
    acc[r.wordCount] = (acc[r.wordCount] || 0) + 1;
    return acc;
  }, {});

  console.log('\n📏 Slug length distribution (by word count):');
  Object.entries(wordCounts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .forEach(([count, num]) => {
      console.log(`   ${count} words: ${num} posts`);
    });

  // Write updated medium-posts.json
  fs.writeFileSync(mediumPostsPath, JSON.stringify(posts, null, 2));
  console.log(`\n💾 Updated: ${mediumPostsPath}`);

  // Write detailed report
  const reportPath = path.join(__dirname, 'slug-generation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📋 Report saved: ${reportPath}`);

  // Show first 10 examples
  console.log('\n📝 First 10 generated slugs (most recent posts):');
  report.slice(0, 10).forEach(({ title, slug, hashId }) => {
    console.log(`\n   Title: ${title}`);
    console.log(`   Slug:  ${slug}`);
    console.log(`   Hash:  ${hashId}`);
  });

  console.log('\n✨ Done! All posts now have slugs.\n');
}

// Run
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
