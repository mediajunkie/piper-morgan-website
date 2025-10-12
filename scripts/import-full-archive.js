#!/usr/bin/env node

/**
 * Full Archive Import Script
 *
 * Three-source merge:
 * 1. CSV Export (170 posts) - source of truth for metadata
 * 2. blog-content.json (156 posts) - full HTML content
 * 3. RSS feed (10 posts) - fresh content
 *
 * Priority: CSV → blog-content → RSS (freshest wins)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const CSV_PATH = path.join(__dirname, '..', 'Medium-Posts-updated-xian-2025-10-11-1207.csv');
const BLOG_CONTENT_PATH = path.join(__dirname, '..', 'src/data/blog-content.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');

/**
 * Extract hash ID from Medium URL
 */
function extractHashId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

/**
 * Generate slug from title
 */
function generateSlug(title, maxWords = 6) {
  if (!title) return 'untitled';

  // Take text before colon
  const textBeforeColon = title.split(':')[0].trim();

  // Remove common prefixes like "10/4:", "7/22:", etc.
  const cleanTitle = textBeforeColon.replace(/^\d+\/\d+:\s*/, '');

  // Sanitize
  const sanitized = cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Take first N words
  const words = sanitized.split('-').filter(w => w.length > 0);
  return words.slice(0, Math.min(words.length, maxWords)).join('-');
}

/**
 * Parse CSV (handles quoted fields)
 */
function parseCsvRow(row) {
  const fields = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }

  fields.push(currentField);
  return fields;
}

/**
 * Extract excerpt from HTML content
 */
function extractExcerpt(content, title) {
  if (!content) return '';

  let text = content.replace(/<[^>]*>/g, '');

  if (text.startsWith(title)) {
    text = text.substring(title.length);
  }

  text = text.replace(/\s+/g, ' ').trim();

  if (text.length > 300) {
    text = text.substring(0, 297) + '...';
  }

  return text || '';
}

/**
 * Extract reading time from content
 */
function extractReadingTime(content) {
  if (!content) return '5 min read';
  const match = content.match(/(\d+)\s*min\s*read/i);
  return match ? `${match[1]} min read` : '5 min read';
}

/**
 * Parse incomplete date from CSV and convert to 2025 date
 * Handles formats like "Oct 5" or "Sat Aug 9"
 */
function parseIncompleteDateTo2025(dateString) {
  if (!dateString) return null;

  // Remove day-of-week prefix if present (e.g., "Sat Aug 9" -> "Aug 9")
  const cleaned = dateString.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+/, '');

  // Parse as 2025 date by prepending year
  const dateWith2025 = `${cleaned} 2025`;
  const date = new Date(dateWith2025);

  // Validate the date parsed correctly
  if (isNaN(date.getTime())) {
    console.warn(`  ⚠️  Could not parse date: "${dateString}"`);
    return null;
  }

  return date;
}

/**
 * Format date to display format
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = parseIncompleteDateTo2025(dateString);
  if (!date) return '';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format date to ISO format
 */
function formatDateISO(dateString) {
  if (!dateString) return '';
  const date = parseIncompleteDateTo2025(dateString);
  if (!date) return '';

  return date.toISOString();
}

/**
 * Parse CSV export
 */
function parseCsvExport(csvPath) {
  console.log('📋 Parsing CSV export...');

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.trim().split('\n');

  // Skip header
  const dataLines = lines.slice(1);

  const posts = [];
  const excludedPosts = [];

  dataLines.forEach((line, index) => {
    const fields = parseCsvRow(line);

    if (fields.length < 9) {
      console.log(`  ⚠️  Row ${index + 2}: Insufficient fields, skipping`);
      return;
    }

    const [date, url, title, theme, mediumDate, cartoon, speculative, toMove, notes] = fields;

    // Check if marked for removal
    if (notes && notes.includes('REMOVE THIS FROM ARCHIVE')) {
      excludedPosts.push({ title, hashId: extractHashId(url), reason: 'Marked for removal' });
      return;
    }

    // Skip empty URLs
    if (!url || !url.startsWith('http')) {
      console.log(`  ⚠️  Row ${index + 2}: No valid URL, skipping`);
      return;
    }

    const hashId = extractHashId(url);
    if (!hashId) {
      console.log(`  ⚠️  Row ${index + 2}: Could not extract hash ID from ${url}`);
      return;
    }

    posts.push({
      hashId,
      url,
      title: title.trim(),
      theme: theme.trim() || 'Building in Public',
      workDate: date.trim(),
      mediumDate: mediumDate.trim(),
      imageSlug: cartoon.trim(),
      speculative: speculative.trim(),
      notes: notes.trim()
    });
  });

  console.log(`  ✅ Parsed ${posts.length} posts from CSV`);
  if (excludedPosts.length > 0) {
    console.log(`  🗑️  Excluded ${excludedPosts.length} posts:`);
    excludedPosts.forEach(p => console.log(`     - ${p.title}`));
  }

  return posts;
}

/**
 * Load blog content JSON
 */
function loadBlogContent(contentPath) {
  console.log('\n📄 Loading blog content...');

  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
  const count = Object.keys(content).length;

  console.log(`  ✅ Loaded ${count} posts with full HTML content`);

  return content;
}

/**
 * Merge all sources
 */
function mergeAllSources(csvPosts, blogContent) {
  console.log('\n🔀 Merging all sources...');

  const merged = [];
  let withContent = 0;
  let withoutContent = 0;

  csvPosts.forEach(csvPost => {
    const hashId = csvPost.hashId;
    const content = blogContent[hashId];

    // Generate slug
    const slug = generateSlug(csvPost.title);

    // Parse dates properly with year 2025
    const pubDateStr = csvPost.mediumDate || csvPost.workDate;
    const workDateStr = csvPost.workDate;

    // Build post object
    const post = {
      title: csvPost.title,
      excerpt: content ? extractExcerpt(content.content, csvPost.title) : '',
      url: `/blog/${slug}`,
      publishedAt: formatDate(pubDateStr),
      publishedAtISO: formatDateISO(pubDateStr),
      author: content?.author || 'christian crumlish',
      readingTime: content ? extractReadingTime(content.content) : '5 min read',
      tags: [csvPost.theme || 'Building in Public'],
      guid: csvPost.url,
      featuredImage: csvPost.imageSlug ? `/assets/blog-images/${csvPost.imageSlug}` : null,
      slug: slug,
      // Store work date separately for Phase 6 chronological sorting
      workDate: formatDate(workDateStr),
      workDateISO: formatDateISO(workDateStr),
    };

    if (content) {
      withContent++;
    } else {
      withoutContent++;
    }

    merged.push(post);
  });

  console.log(`  ✅ Merged ${merged.length} posts`);
  console.log(`     - ${withContent} with full content`);
  console.log(`     - ${withoutContent} with metadata only`);

  return merged;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Full Archive Import');
  console.log('======================\n');

  try {
    // Parse CSV
    const csvPosts = parseCsvExport(CSV_PATH);

    // Load blog content
    const blogContent = loadBlogContent(BLOG_CONTENT_PATH);

    // Merge all sources
    const mergedPosts = mergeAllSources(csvPosts, blogContent);

    // Save to file
    console.log(`\n💾 Saving to ${OUTPUT_PATH}...`);
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mergedPosts, null, 2), 'utf-8');
    console.log(`✅ Saved ${mergedPosts.length} posts`);

    console.log('\n✨ Import complete!\n');

  } catch (err) {
    console.error('\n❌ Error:', err);
    process.exit(1);
  }
}

main();
