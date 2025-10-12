#!/usr/bin/env node

/**
 * Parse Blog Content Script
 *
 * Extracts content from Medium export HTML files and creates
 * a JSON file mapping post IDs to their parsed content.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPORT_DIR = path.join(__dirname, '..', 'src/app/blog/export/medium-export-534348c5a9432cd96669a7c3053fb8bbbc4074f000b1826a3de8aae16a5efbf6/posts');
const POSTS_JSON = path.join(__dirname, '..', 'src/data/medium-posts.json');
const OUTPUT_JSON = path.join(__dirname, '..', 'src/data/blog-content.json');

// Extract post ID from filename
function extractPostIdFromFilename(filename) {
  // Format: YYYY-MM-DD_title-slug-POSTID.html
  const match = filename.match(/([a-f0-9]{12})\.html$/);
  return match ? match[1] : null;
}

// Extract post ID from Medium URL
function extractPostIdFromUrl(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

// Parse HTML content from Medium export
function parseHtmlContent(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Extract title using regex
  const titleMatch = html.match(/<h1 class="p-name">([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Extract subtitle
  const subtitleMatch = html.match(/<section data-field="subtitle"[^>]*>([\s\S]*?)<\/section>/);
  const subtitle = subtitleMatch ? subtitleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  // Extract main content (body section)
  const contentMatch = html.match(/<section data-field="body" class="e-content">([\s\S]*?)<\/section>/);
  const content = contentMatch ? contentMatch[1].trim() : '';

  // Extract author
  const authorMatch = html.match(/By <a[^>]*class="p-author[^"]*"[^>]*>([^<]+)<\/a>/);
  const author = authorMatch ? authorMatch[1].trim() : '';

  // Extract canonical link
  const canonicalMatch = html.match(/<a[^>]*class="p-canonical"[^>]*href="([^"]+)"/);
  const canonicalLink = canonicalMatch ? canonicalMatch[1] : '';

  // Extract published date
  const publishedMatch = html.match(/<time[^>]*class="dt-published"[^>]*datetime="([^"]+)"/);
  const publishedDate = publishedMatch ? publishedMatch[1] : '';

  return {
    title,
    subtitle,
    content,
    author,
    canonicalLink,
    publishedDate,
  };
}

function main() {
  console.log('📚 Parsing Medium Export Content');
  console.log('=================================\n');

  // Load existing posts JSON
  const posts = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf-8'));
  console.log(`✅ Loaded ${posts.length} posts from medium-posts.json\n`);

  // Get all HTML files
  const htmlFiles = fs.readdirSync(EXPORT_DIR).filter(f => f.endsWith('.html'));
  console.log(`✅ Found ${htmlFiles.length} HTML files in export directory\n`);

  // Create map of post IDs to metadata
  const postMap = new Map();
  posts.forEach(post => {
    const postId = extractPostIdFromUrl(post.guid || post.link);
    if (postId) {
      postMap.set(postId, post);
    }
  });

  // Parse HTML files and match with posts
  const blogContent = {};
  let matched = 0;
  let unmatched = 0;

  for (const filename of htmlFiles) {
    const postId = extractPostIdFromFilename(filename);

    if (!postId) {
      console.log(`⚠️  Could not extract post ID from ${filename}`);
      continue;
    }

    // Check if this post is in our active posts list
    if (!postMap.has(postId)) {
      unmatched++;
      continue;
    }

    const htmlPath = path.join(EXPORT_DIR, filename);
    const parsed = parseHtmlContent(htmlPath);

    blogContent[postId] = {
      ...parsed,
      filename,
    };

    matched++;
  }

  console.log(`✅ Matched: ${matched} posts`);
  console.log(`⚪ Unmatched: ${unmatched} HTML files (not in active posts list)\n`);

  // Write output
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(blogContent, null, 2));
  console.log(`✅ Written parsed content to: ${OUTPUT_JSON}\n`);

  // Summary
  console.log('📊 Summary:');
  console.log(`   Posts in JSON: ${posts.length}`);
  console.log(`   HTML files: ${htmlFiles.length}`);
  console.log(`   Matched & parsed: ${matched}`);
  console.log(`   Coverage: ${((matched / posts.length) * 100).toFixed(1)}%\n`);
}

main();
