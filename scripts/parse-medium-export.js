#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { JSDOM } from 'jsdom';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CSV_PATH = path.join(__dirname, '..', 'Building Piper Morgan - Medium Posts.csv');
const EXPORT_DIR = path.join(__dirname, '..', 'src/app/blog/export/medium-export-534348c5a9432cd96669a7c3053fb8bbbc4074f000b1826a3de8aae16a5efbf6/posts');
const OUTPUT_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public/assets/blog-images');
const EXISTING_DATA_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`Created images directory: ${IMAGES_DIR}`);
}

/**
 * Extract post ID from Medium URL
 * Example: https://medium.com/building-piper-morgan/title-433429cb8a5a -> 433429cb8a5a
 */
function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

/**
 * Parse CSV and extract post data
 */
function parseCsv() {
  console.log('\n📄 Parsing CSV...');
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  const posts = records
    .filter(r => r['Medium URL']) // Only posts with URLs (published)
    .map(r => ({
      date: r.Date,
      url: r['Medium URL'],
      title: r.Title,
      theme: r.Theme, // 'building' or 'insight'
      publishDate: r['Medium date'],
      postId: extractPostId(r['Medium URL'])
    }))
    .filter(p => p.postId); // Only posts where we could extract ID

  console.log(`✅ Found ${posts.length} published posts with valid IDs`);
  return posts;
}

/**
 * Find HTML file matching post ID
 */
function findHtmlFile(postId) {
  const files = fs.readdirSync(EXPORT_DIR);
  const match = files.find(f => f.includes(postId) && f.endsWith('.html'));
  return match ? path.join(EXPORT_DIR, match) : null;
}

/**
 * Parse HTML file to extract metadata and content
 */
function parseHtmlFile(filePath, csvPost) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // Extract title (from h1 or CSV as fallback)
  const titleEl = doc.querySelector('h1.p-name') || doc.querySelector('h1');
  const title = titleEl ? titleEl.textContent.trim() : csvPost.title;

  // Extract author (from footer)
  const authorEl = doc.querySelector('.p-author');
  const author = authorEl ? authorEl.textContent.trim() : 'christian crumlish';

  // Extract publication date (from time element or CSV)
  const timeEl = doc.querySelector('time.dt-published');
  let pubDate = csvPost.publishDate ? `${csvPost.publishDate} 2025` : null;
  if (timeEl && timeEl.getAttribute('datetime')) {
    pubDate = timeEl.getAttribute('datetime');
  }

  // Extract canonical link
  const canonicalEl = doc.querySelector('a.p-canonical');
  const link = canonicalEl ? canonicalEl.getAttribute('href') : csvPost.url;

  // Extract featured image
  let featuredImage = null;
  const imgEl = doc.querySelector('img[data-is-featured="true"]');
  if (imgEl) {
    featuredImage = {
      src: imgEl.getAttribute('src'),
      alt: imgEl.getAttribute('alt') || '',
      imageId: imgEl.getAttribute('data-image-id'),
      width: imgEl.getAttribute('data-width'),
      height: imgEl.getAttribute('data-height')
    };
  }

  // Extract content for excerpt
  const contentEl = doc.querySelector('section[data-field="body"]');
  let content = '';
  let contentSnippet = '';

  if (contentEl) {
    // Get first few paragraphs for content
    const paragraphs = contentEl.querySelectorAll('p');
    const firstParagraphs = Array.from(paragraphs)
      .slice(0, 3)
      .map(p => p.textContent.trim())
      .filter(t => t.length > 0);

    content = firstParagraphs.join('\n\n');
    contentSnippet = firstParagraphs[0] || '';

    // Limit snippet to ~200-300 chars
    if (contentSnippet.length > 300) {
      contentSnippet = contentSnippet.substring(0, 297) + '...';
    }
  }

  return {
    title,
    link,
    pubDate,
    author,
    content,
    contentSnippet,
    guid: link,
    categories: ['Building in Public'],
    theme: csvPost.theme,
    featuredImage,
    postId: csvPost.postId
  };
}

/**
 * Download image from URL and save locally (with redirect following)
 */
function downloadImage(url, postId, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith('http')) {
      resolve(null);
      return;
    }

    if (redirectCount > 5) {
      reject(new Error('Too many redirects'));
      return;
    }

    const parsedUrl = new URL(url);
    const ext = path.extname(parsedUrl.pathname) || '.png';
    const filename = `${postId}-featured${ext}`;
    const filepath = path.join(IMAGES_DIR, filename);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`  ⏭️  Image already exists: ${filename}`);
      resolve(`/assets/blog-images/${filename}`);
      return;
    }

    https.get(url, (response) => {
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
        let redirectUrl = response.headers.location;

        // Handle relative redirect URLs by constructing full URL
        if (redirectUrl && redirectUrl.startsWith('/')) {
          redirectUrl = `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
        }

        console.log(`  ↪️  Following redirect to: ${redirectUrl}`);
        return downloadImage(redirectUrl, postId, redirectCount + 1)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(filepath);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`  ✅ Downloaded: ${filename}`);
        resolve(`/assets/blog-images/${filename}`);
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete partial file
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Sleep helper for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Process all posts
 */
async function processPosts() {
  console.log('\n🔄 Processing posts...\n');

  const csvPosts = parseCsv();
  const parsedPosts = [];
  let matched = 0;
  let notMatched = 0;

  for (const csvPost of csvPosts) {
    const htmlFile = findHtmlFile(csvPost.postId);

    if (!htmlFile) {
      console.log(`❌ No HTML file found for: ${csvPost.title} (${csvPost.postId})`);
      notMatched++;
      continue;
    }

    try {
      console.log(`📝 Processing: ${csvPost.title.substring(0, 60)}...`);
      const post = parseHtmlFile(htmlFile, csvPost);

      // Download featured image if exists
      if (post.featuredImage && post.featuredImage.src) {
        try {
          const localPath = await downloadImage(post.featuredImage.src, post.postId);
          post.thumbnail = localPath;

          // Add delay to avoid rate limiting (250ms between requests)
          await sleep(250);
        } catch (err) {
          console.log(`  ⚠️  Failed to download image: ${err.message}`);
          post.thumbnail = null;
        }
      } else {
        post.thumbnail = null;
      }

      // Remove featuredImage object, keep only thumbnail path
      delete post.featuredImage;
      delete post.postId;

      // Convert pubDate to ISO format
      if (post.pubDate) {
        try {
          const date = new Date(post.pubDate);
          post.isoDate = date.toISOString();
          post.pubDate = date.toUTCString();
        } catch (err) {
          console.log(`  ⚠️  Invalid date format: ${post.pubDate}`);
        }
      }

      parsedPosts.push(post);
      matched++;

    } catch (err) {
      console.log(`❌ Error parsing ${csvPost.title}: ${err.message}`);
      notMatched++;
    }
  }

  console.log(`\n✅ Successfully processed ${matched} posts`);
  if (notMatched > 0) {
    console.log(`⚠️  Failed to match/process ${notMatched} posts`);
  }

  return parsedPosts;
}

/**
 * Merge with existing posts and save
 */
function mergeAndSave(newPosts) {
  console.log('\n💾 Merging with existing data...');

  let existingPosts = [];
  if (fs.existsSync(EXISTING_DATA_PATH)) {
    existingPosts = JSON.parse(fs.readFileSync(EXISTING_DATA_PATH, 'utf-8'));
    console.log(`Found ${existingPosts.length} existing posts from RSS`);
  }

  // Merge: use Map to deduplicate by guid/link
  const postsMap = new Map();

  // Add new posts first (they have more complete data)
  newPosts.forEach(post => {
    const key = post.guid || post.link;
    postsMap.set(key, post);
  });

  // Add existing posts (won't overwrite if already present)
  existingPosts.forEach(post => {
    const key = post.guid || post.link;
    if (!postsMap.has(key)) {
      postsMap.set(key, post);
    }
  });

  // Convert back to array and sort by date (newest first)
  const mergedPosts = Array.from(postsMap.values())
    .sort((a, b) => {
      const dateA = new Date(a.isoDate || a.pubDate);
      const dateB = new Date(b.isoDate || b.pubDate);
      return dateB - dateA; // Newest first
    });

  // Save
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mergedPosts, null, 2));
  console.log(`✅ Saved ${mergedPosts.length} total posts to ${OUTPUT_PATH}`);

  return mergedPosts;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Medium Export Parser');
  console.log('========================\n');

  try {
    // Process all posts
    const posts = await processPosts();

    // Merge and save
    const finalPosts = mergeAndSave(posts);

    console.log('\n✨ Complete!');
    console.log(`📊 Total posts in archive: ${finalPosts.length}`);
    console.log(`🖼️  Images saved to: ${IMAGES_DIR}`);
    console.log(`📄 Data saved to: ${OUTPUT_PATH}`);

  } catch (err) {
    console.error('\n❌ Error:', err);
    process.exit(1);
  }
}

// Run
main();

export { extractPostId, parseCsv, parseHtmlFile, downloadImage };
