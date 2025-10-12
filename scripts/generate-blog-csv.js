/**
 * Generate Blog Metadata CSV
 *
 * Creates data/blog-metadata.csv from existing medium-posts.json
 * CSV becomes the source of truth for blog metadata
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const MEDIUM_POSTS_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');
const DATA_DIR = path.join(__dirname, '..', 'data');
const CSV_PATH = path.join(DATA_DIR, 'blog-metadata.csv');

/**
 * Extract hash ID from Medium URL or GUID
 */
function extractHashId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

/**
 * Generate slug from title (matches Phase 4 algorithm)
 * Takes text before colon, max 6 words, lowercase with hyphens
 */
function generateSlug(title, existingSlugs = []) {
  // Extract text before colon
  const textBeforeColon = title.split(':')[0].trim();

  // Sanitize and split into words
  const sanitized = textBeforeColon
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const words = sanitized.split(/\s+/).filter(word => word.length > 0);

  if (words.length === 0) return 'untitled';

  // Use up to 6 words
  const maxWords = 6;
  const slug = words.slice(0, Math.min(words.length, maxWords)).join('-');

  // Check for collisions
  if (!existingSlugs.includes(slug)) {
    return slug;
  }

  // Handle collision by adding next word or number
  for (let wordCount = maxWords + 1; wordCount <= words.length; wordCount++) {
    const expandedSlug = words.slice(0, wordCount).join('-');
    if (!existingSlugs.includes(expandedSlug)) {
      return expandedSlug;
    }
  }

  // If all words exhausted, append number
  const baseSlug = words.slice(0, maxWords).join('-');
  let counter = 2;
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++;
  }
  return `${baseSlug}-${counter}`;
}

/**
 * Generate image slug from title
 * Format: robot-[WORD].webp
 */
function generateImageSlug(title) {
  // Extract first meaningful word from title (after common words)
  const commonWords = ['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0 && !commonWords.includes(word));

  const firstWord = words[0] || 'default';
  return `robot-${firstWord}.webp`;
}

/**
 * Derive work date from pub date (for now, same as pub date)
 * In the future, you can manually adjust these in the CSV
 */
function deriveWorkDate(pubDate) {
  if (!pubDate) return '';
  const date = new Date(pubDate);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Infer category from title/content
 * Default to "Building in Public" for now
 */
function inferCategory(post) {
  // In the future, you can manually categorize in the CSV
  // For now, default to the main category
  return 'Building in Public';
}

/**
 * Escape CSV field (handle quotes and commas)
 */
function escapeCsvField(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Main execution
 */
async function generateCsv() {
  console.log('🚀 Blog Metadata CSV Generator');
  console.log('================================\n');

  // Load existing posts
  console.log('📦 Loading medium-posts.json...');
  const posts = JSON.parse(fs.readFileSync(MEDIUM_POSTS_PATH, 'utf-8'));
  console.log(`✅ Found ${posts.length} posts\n`);

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('📁 Created data/ directory\n');
  }

  // Build CSV rows
  const rows = [];

  // Header row
  rows.push('slug,hashId,title,imageSlug,workDate,pubDate,category,cluster,featured,notes');

  // Track used slugs to avoid collisions
  const usedSlugs = [];

  // Data rows
  for (const post of posts) {
    const hashId = extractHashId(post.guid || post.link);
    const title = post.title || '';

    // Generate slug from title (Phase 4 algorithm)
    const slug = post.slug || generateSlug(title, usedSlugs);
    usedSlugs.push(slug);

    const imageSlug = generateImageSlug(title);

    // Extract date from multiple possible fields
    const dateStr = post.pubDate || post.isoDate || post.publishedAtISO || '';
    const pubDate = deriveWorkDate(dateStr);
    const workDate = pubDate; // Same as pubDate initially

    const category = inferCategory(post);
    const cluster = ''; // Empty for manual assignment
    const featured = ''; // Empty (can be 'yes' or leave blank)
    const notes = ''; // Empty for manual notes

    rows.push([
      escapeCsvField(slug),
      escapeCsvField(hashId),
      escapeCsvField(title),
      escapeCsvField(imageSlug),
      escapeCsvField(workDate),
      escapeCsvField(pubDate),
      escapeCsvField(category),
      escapeCsvField(cluster),
      escapeCsvField(featured),
      escapeCsvField(notes)
    ].join(','));
  }

  // Write CSV
  console.log('💾 Writing blog-metadata.csv...');
  fs.writeFileSync(CSV_PATH, rows.join('\n'), 'utf-8');
  console.log(`✅ Wrote ${rows.length - 1} posts to ${CSV_PATH}\n`);

  // Summary
  console.log('📊 CSV Generation Summary:');
  console.log(`   - Total posts: ${posts.length}`);
  console.log(`   - CSV location: /data/blog-metadata.csv`);
  console.log(`   - Ready for manual enrichment!\n`);

  console.log('💡 Next Steps:');
  console.log('   1. Review and edit /data/blog-metadata.csv');
  console.log('   2. Add cluster names for narrative grouping');
  console.log('   3. Mark featured articles (add "yes" to featured column)');
  console.log('   4. Adjust workDate if different from pubDate');
  console.log('   5. Add notes for editorial context\n');

  console.log('✨ CSV is now ready to become your source of truth!');
}

// Run
generateCsv().catch(err => {
  console.error('❌ Error generating CSV:', err);
  process.exit(1);
});
