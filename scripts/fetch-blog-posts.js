#!/usr/bin/env node

/**
 * Enhanced RSS Blog Post Fetcher
 *
 * Fetches latest posts from Medium RSS and merges with existing archive.
 * Downloads new featured images locally and maintains complete archive.
 *
 * Used by: .github/workflows/update-blog-posts.yml (daily at 11:30 AM Pacific)
 */

import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { loadBlogMetadata, getMetadataByHashId, getMetadataBySlug } from './csv-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RSS_FEED_URL = 'https://medium.com/feed/building-piper-morgan';
const DATA_PATH = path.join(__dirname, '..', 'src/data/medium-posts.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public/assets/blog-images');
const CSV_PATH = path.join(__dirname, '..', 'data/blog-metadata.csv');

const parser = new Parser({
  customFields: {
    item: [
      ['dc:creator', 'creator'],
      ['content:encoded', 'contentEncoded'],
      ['media:thumbnail', 'thumbnail'],
    ]
  }
});

/**
 * Extract post ID from Medium URL
 */
function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

/**
 * Extract slug from Medium URL (the path segment before the hashId)
 * e.g. "https://medium.com/building-piper-morgan/wiring-vs-wizardry-f29671b088b7?..." → "wiring-vs-wizardry"
 */
function extractSlugFromMediumUrl(url) {
  if (!url) return null;
  try {
    const pathname = new URL(url).pathname;
    const lastSegment = pathname.split('/').filter(Boolean).pop();
    if (!lastSegment) return null;
    // Remove the trailing hashId (12 hex chars preceded by a hyphen)
    return lastSegment.replace(/-[a-f0-9]{12}$/, '');
  } catch {
    return null;
  }
}

/**
 * Convert YYYY-MM-DD date to ISO format
 */
function dateToISO(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString();
}

/**
 * Extract featured image URL from content
 */
function extractFeaturedImageUrl(content) {
  if (!content) return null;

  // Look for first img tag
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  return null;
}

/**
 * Extract clean excerpt from HTML content
 */
function extractExcerpt(content, title) {
  if (!content) return '';

  // Remove HTML tags
  let text = content.replace(/<[^>]*>/g, '');

  // Remove the title if it appears at the start
  if (text.startsWith(title)) {
    text = text.substring(title.length);
  }

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Get first 200-300 characters
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
 * Format date to display format
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Extract title from HTML content
 */
function extractTitle(content) {
  if (!content) return '';
  const titleMatch = content.match(/<h3[^>]*>(.*?)<\/h3>/i);
  return titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
}

/**
 * Extract subtitle from HTML content
 */
function extractSubtitle(content) {
  if (!content) return '';
  const subtitleMatch = content.match(/<h4[^>]*class="[^"]*subtitle[^"]*"[^>]*>(.*?)<\/h4>/i);
  return subtitleMatch ? subtitleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
}

/**
 * Download image from URL with redirect following
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

    const ext = path.extname(new URL(url).pathname) || '.png';
    const filename = `${postId}-featured${ext}`;
    const filepath = path.join(IMAGES_DIR, filename);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`  ⏭️  Image already exists: ${filename}`);
      resolve(`/assets/blog-images/${filename}`);
      return;
    }

    console.log(`  📥 Downloading: ${filename}`);

    https.get(url, (response) => {
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
        const redirectUrl = response.headers.location;
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
 * Load existing archive
 */
function loadExistingArchive() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      const data = fs.readFileSync(DATA_PATH, 'utf-8');
      const posts = JSON.parse(data);
      console.log(`📦 Loaded ${posts.length} existing posts from archive`);
      return posts;
    }
  } catch (err) {
    console.error('⚠️  Error loading existing archive:', err.message);
  }

  return [];
}

/**
 * Fetch latest posts from RSS feed
 */
async function fetchRssPosts() {
  console.log('\n🔄 Fetching Medium RSS feed...');

  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    console.log(`✅ Found ${feed.items.length} posts in RSS feed`);

    const posts = [];

    for (const item of feed.items) {
      const postId = extractPostId(item.link);

      if (!postId) {
        console.log(`⚠️  Could not extract ID from: ${item.link}`);
        continue;
      }

      const fullContent = item.contentEncoded || item.content || '';
      const pubDate = item.pubDate || new Date().toUTCString();
      const isoDate = item.isoDate || new Date(pubDate).toISOString();

      // Transform to consistent format (matches BlogContent.tsx expectations)
      const post = {
        title: item.title || 'Untitled',
        excerpt: extractExcerpt(fullContent, item.title || ''),
        url: item.link || '', // Will be updated to slug-based URL later
        publishedAt: formatDate(pubDate),
        publishedAtISO: pubDate,
        author: item.creator || 'christian crumlish',
        readingTime: extractReadingTime(fullContent),
        tags: item.categories || ['Building in Public'],
        guid: item.guid || item.link || '',
        featuredImage: extractFeaturedImageUrl(fullContent),

        // Keep these for internal processing
        featuredImageUrl: extractFeaturedImageUrl(fullContent),
        postId: postId,
        fullContent: fullContent,
        subtitle: extractSubtitle(fullContent),
        canonicalLink: item.link || ''
      };

      posts.push(post);
    }

    return posts;

  } catch (err) {
    console.error('❌ Error fetching RSS feed:', err.message);
    return [];
  }
}

/**
 * Merge RSS posts with existing archive and CSV metadata
 */
async function mergeArchive(existingPosts, rssPosts, csvMetadata) {
  console.log('\n🔀 Merging new posts with archive and CSV metadata...');

  // Create map of existing posts by hashId (normalized from GUID)
  // This prevents duplicates when Medium provides different GUID formats for same post
  const existingMap = new Map();
  existingPosts.forEach(post => {
    const hashId = extractPostId(post.guid || post.link);
    if (hashId) {
      existingMap.set(hashId, post);
    }
  });

  // Build slug set from existing blog-first posts so we can detect
  // syndicated versions of blog-first content arriving via RSS
  const blogFirstSlugs = new Set();
  existingPosts.forEach(post => {
    if (post.guid && post.guid.startsWith('blog-first-') && post.slug) {
      blogFirstSlugs.add(post.slug);
    }
  });

  let newPostsCount = 0;
  let updatedPostsCount = 0;
  let imagesDownloaded = 0;
  let skippedBlogFirst = 0;

  // Process RSS posts
  for (const rssPost of rssPosts) {
    const hashId = extractPostId(rssPost.guid || rssPost.link);
    if (!hashId) continue; // Skip if we can't extract hashId

    const existing = existingMap.get(hashId);

    if (!existing) {
      // Before treating as new: check if this is a syndicated version of a blog-first post.
      // Blog-first posts have a different hashId than Medium assigns, so hashId matching
      // won't catch the duplicate. Match by slug instead.
      const rssSlug = extractSlugFromMediumUrl(rssPost.url || rssPost.link || rssPost.guid);
      const csvBySlug = rssSlug ? getMetadataBySlug(csvMetadata, rssSlug) : null;

      if (rssSlug && (blogFirstSlugs.has(rssSlug) || (csvBySlug && csvBySlug.hashId !== hashId))) {
        // This RSS post matches a blog-first post by slug — skip it
        console.log(`\n⏭️  Skipping syndicated duplicate: "${rssPost.title.substring(0, 60)}..."`);
        console.log(`   Blog-first slug "${rssSlug}" already exists (blog hashId: ${csvBySlug ? csvBySlug.hashId : 'in archive'})`);
        skippedBlogFirst++;
        continue;
      }

      // New post! Download image if available
      console.log(`\n📝 New post: ${rssPost.title.substring(0, 60)}...`);

      if (rssPost.featuredImageUrl) {
        try {
          const localPath = await downloadImage(rssPost.featuredImageUrl, rssPost.postId);
          rssPost.thumbnail = localPath;
          if (localPath) imagesDownloaded++;

          // Rate limiting delay
          await sleep(250);
        } catch (err) {
          console.log(`  ⚠️  Failed to download image: ${err.message}`);
          rssPost.thumbnail = null;
        }
      } else {
        rssPost.thumbnail = null;
      }

      // Merge CSV metadata if available
      const metadata = getMetadataByHashId(csvMetadata, rssPost.postId);
      if (metadata && metadata.slug) {
        rssPost.slug = metadata.slug;
        rssPost.url = `/blog/${metadata.slug}`; // Update URL to slug-based
        console.log(`  🏷️  Merged CSV metadata: slug="${metadata.slug}"`);
      } else {
        // WARNING: No CSV metadata - this post needs to be added to blog-metadata.csv
        console.log(`  ⚠️  NO CSV METADATA FOUND for ${rssPost.postId}`);
        console.log(`  ⚠️  This post will NOT have a local URL until added to CSV`);
        console.log(`  ⚠️  Medium URL will be used as fallback: ${rssPost.url}`);

        // Mark this post as needing CSV metadata
        rssPost.needsMetadata = true;
      }

      // Clean up temporary fields (keep fullContent for blog-content.json update)
      delete rssPost.featuredImageUrl;
      delete rssPost.postId;
      // Note: fullContent, subtitle, canonicalLink are kept for updateBlogContent()

      // Add to map using hashId
      existingMap.set(hashId, rssPost);
      newPostsCount++;

    } else if (existing.thumbnail && existing.thumbnail.startsWith('http')) {
      // Existing post but with CDN image - download locally
      console.log(`\n🔄 Updating image for: ${existing.title.substring(0, 60)}...`);

      const postId = extractPostId(existing.link);
      if (postId) {
        try {
          const localPath = await downloadImage(existing.thumbnail, postId);
          if (localPath) {
            existing.thumbnail = localPath;
            imagesDownloaded++;
            updatedPostsCount++;
          }

          // Rate limiting delay
          await sleep(250);
        } catch (err) {
          console.log(`  ⚠️  Failed to download image: ${err.message}`);
        }
      }
    }
  }

  // Add blog-first posts: CSV entries with a slug that aren't in RSS
  // These are posts published directly to the blog, not sourced from Medium
  const BLOG_CONTENT_PATH = path.join(__dirname, '..', 'src/data/blog-content.json');
  let blogContent = {};
  try {
    if (fs.existsSync(BLOG_CONTENT_PATH)) {
      blogContent = JSON.parse(fs.readFileSync(BLOG_CONTENT_PATH, 'utf-8'));
    }
  } catch (err) {
    console.log('  ⚠️  Could not load blog-content.json for blog-first posts');
  }

  let blogFirstCount = 0;
  csvMetadata.forEach(meta => {
    if (!meta.slug || !meta.hashId) return;
    if (existingMap.has(meta.hashId)) return; // Already have this post from RSS

    // Build a post entry from CSV metadata + blog-content.json
    const content = blogContent[meta.hashId];
    if (!content) return; // No content available, skip

    // Extract excerpt from HTML content
    const excerpt = extractExcerpt(content.content || '', meta.title || '');

    const post = {
      title: meta.title || content.title || 'Untitled',
      excerpt: excerpt,
      url: `/blog/${meta.slug}`,
      slug: meta.slug,
      publishedAt: formatDate(meta.pubDate || meta.workDate),
      publishedAtISO: dateToISO(meta.pubDate || meta.workDate),
      author: 'christian crumlish',
      readingTime: '5 min read',
      tags: ['Building in Public'],
      guid: `blog-first-${meta.hashId}`,
      featuredImage: meta.imageSlug ? `/assets/blog-images/${meta.imageSlug}` : null,
      thumbnail: meta.imageSlug ? `/assets/blog-images/${meta.imageSlug}` : null,
      category: meta.category || '',
      cluster: meta.cluster || '',
      workDate: meta.workDate ? formatDate(meta.workDate) : '',
      workDateISO: meta.workDate ? dateToISO(meta.workDate) : '',
    };

    existingMap.set(meta.hashId, post);
    blogFirstCount++;
    console.log(`  📝 Blog-first post added: "${meta.title}"`);
  });

  if (blogFirstCount > 0) {
    console.log(`\n🌐 Added ${blogFirstCount} blog-first post(s) from CSV`);
  }

  // Remove RSS duplicates of blog-first posts that were already in the archive.
  // A blog-first post has guid "blog-first-{hashId}". If an RSS entry exists with
  // a different hashId but the same slug, the RSS entry is a syndicated duplicate.
  let removedDuplicates = 0;
  const blogFirstSlugToHashId = new Map();
  for (const [hashId, post] of existingMap) {
    if (post.guid && post.guid.startsWith('blog-first-') && post.slug) {
      blogFirstSlugToHashId.set(post.slug, hashId);
    }
  }
  for (const [hashId, post] of existingMap) {
    if (post.guid && post.guid.startsWith('blog-first-')) continue; // Skip blog-first entries
    const slug = post.slug || extractSlugFromMediumUrl(post.url || post.link || post.guid);
    if (slug && blogFirstSlugToHashId.has(slug) && blogFirstSlugToHashId.get(slug) !== hashId) {
      console.log(`  🗑️  Removing RSS duplicate: "${post.title}" (${hashId} → blog-first ${blogFirstSlugToHashId.get(slug)})`);
      existingMap.delete(hashId);
      removedDuplicates++;
    }
  }

  // Convert map back to array
  const mergedPosts = Array.from(existingMap.values());

  // Merge CSV metadata for ALL posts (not just new ones)
  let csvMergedCount = 0;
  mergedPosts.forEach(post => {
    const postId = extractPostId(post.guid || post.link || post.url);
    if (postId) {
      const metadata = getMetadataByHashId(csvMetadata, postId);
      if (metadata && metadata.slug) {
        post.slug = metadata.slug;
        post.url = `/blog/${metadata.slug}`; // Set slug-based URL

        // Add chat date from CSV (when article draft was created)
        if (metadata.chatDate) {
          post.chatDate = metadata.chatDate;
        }

        // Add work date from CSV (Phase 6: Work Date Chronology)
        if (metadata.workDate) {
          post.workDate = formatDate(metadata.workDate);
          post.workDateISO = dateToISO(metadata.workDate);
        }

        // Add category from CSV (Phase 7: Category System)
        if (metadata.category) {
          post.category = metadata.category;
        }

        csvMergedCount++;
      }
    }
  });

  // Sort by date (newest first)
  mergedPosts.sort((a, b) => {
    const dateA = new Date(a.publishedAtISO || a.isoDate || a.pubDate);
    const dateB = new Date(b.publishedAtISO || b.isoDate || b.pubDate);
    return dateB - dateA;
  });

  console.log(`\n📊 Merge Summary:`);
  console.log(`   - ${newPostsCount} new posts added`);
  console.log(`   - ${updatedPostsCount} posts updated (images)`);
  console.log(`   - ${imagesDownloaded} images downloaded`);
  console.log(`   - ${csvMergedCount} posts merged with CSV metadata`);
  if (skippedBlogFirst > 0) {
    console.log(`   - ${skippedBlogFirst} syndicated duplicates skipped (blog-first posts)`);
  }
  if (removedDuplicates > 0) {
    console.log(`   - ${removedDuplicates} existing RSS duplicates removed (blog-first posts take priority)`);
  }
  console.log(`   - ${mergedPosts.length} total posts in archive`);

  // Check for posts missing CSV metadata (will have Medium URLs)
  const postsNeedingMetadata = mergedPosts.filter(post =>
    post.url && (post.url.includes('medium.com') || post.url.startsWith('http'))
  );

  if (postsNeedingMetadata.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log(`⚠️  WARNING: ${postsNeedingMetadata.length} POST(S) MISSING CSV METADATA`);
    console.log('='.repeat(60));
    console.log('\nThese posts will link to Medium instead of local pages:\n');

    postsNeedingMetadata.forEach(post => {
      const hashId = extractPostId(post.guid || post.link || post.url);
      console.log(`   - ${hashId}: "${post.title.substring(0, 60)}..."`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('📝 ACTION REQUIRED:');
    console.log('='.repeat(60));
    console.log('\nOption A: Interactive Helper (Recommended)');
    console.log('   node scripts/prepare-new-post.js');
    console.log('   → Guides you through adding metadata for each post');
    console.log('   → Auto-generates slugs');
    console.log('   → Prevents errors and duplicates');
    console.log('\nOption B: Manual CSV Editing');
    console.log('   1. Edit data/blog-metadata.csv');
    console.log('   2. Add entries for missing posts (see docs/publishing-workflow.md)');
    console.log('\nAfter Adding Metadata:');
    console.log('   1. Validate: node scripts/validate-csv.js');
    console.log('   2. Sync: node scripts/sync-csv-to-json.js');
    console.log('   3. Test: npm run dev');
    console.log('\nSee docs/publishing-workflow.md for complete guide.\n');
    console.log('='.repeat(60) + '\n');
  }

  return mergedPosts;
}

/**
 * Save archive to file
 */
function saveArchive(posts) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(posts, null, 2), 'utf-8');
    console.log(`\n💾 Saved ${posts.length} posts to ${DATA_PATH}`);
    return true;
  } catch (err) {
    console.error('❌ Error saving archive:', err.message);
    return false;
  }
}

/**
 * Update blog content file with new posts
 */
function updateBlogContent(posts) {
  const BLOG_CONTENT_PATH = path.join(__dirname, '..', 'src/data/blog-content.json');

  try {
    // Load existing blog content
    let blogContent = {};
    if (fs.existsSync(BLOG_CONTENT_PATH)) {
      const data = fs.readFileSync(BLOG_CONTENT_PATH, 'utf-8');
      blogContent = JSON.parse(data);
    }

    let newContentCount = 0;

    // Add full content for new posts
    posts.forEach(post => {
      const postId = extractPostId(post.guid || post.link);
      if (!postId) return;

      // If post has fullContent and isn't already in blog-content.json, add it
      if (post.fullContent && !blogContent[postId]) {
        blogContent[postId] = {
          title: post.title,
          subtitle: post.subtitle || '',
          content: post.fullContent,
          author: post.author,
          canonicalLink: post.canonicalLink || post.link,
          publishedDate: post.isoDate || post.pubDate,
          filename: `rss-${postId}.html`
        };
        newContentCount++;
      }
    });

    if (newContentCount > 0) {
      fs.writeFileSync(BLOG_CONTENT_PATH, JSON.stringify(blogContent, null, 2), 'utf-8');
      console.log(`📄 Added full content for ${newContentCount} new posts to blog-content.json`);
    }

    return newContentCount;
  } catch (err) {
    console.error('⚠️  Error updating blog content:', err.message);
    return 0;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Enhanced RSS Blog Post Fetcher');
  console.log('==================================\n');
  console.log(`📅 ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} Pacific\n`);

  try {
    // Ensure images directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
      console.log(`✅ Created images directory: ${IMAGES_DIR}\n`);
    }

    // Load CSV metadata (source of truth for slugs and metadata)
    console.log('📋 Loading CSV metadata...');
    const csvMetadata = loadBlogMetadata(CSV_PATH);
    if (csvMetadata.length > 0) {
      console.log(`✅ Loaded ${csvMetadata.length} entries from CSV\n`);
    } else {
      console.log('⚠️  No CSV metadata found - slugs will not be available\n');
    }

    // Load existing archive
    const existingPosts = loadExistingArchive();

    // Fetch RSS posts
    const rssPosts = await fetchRssPosts();

    if (rssPosts.length === 0) {
      console.log('\n⚠️  No posts fetched from RSS feed. Keeping existing archive.');
      process.exit(0);
    }

    // Merge archives with CSV metadata
    const mergedPosts = await mergeArchive(existingPosts, rssPosts, csvMetadata);

    // Save to file
    const saved = saveArchive(mergedPosts);

    // Update blog content with full HTML
    const newContentAdded = updateBlogContent(rssPosts);

    if (saved) {
      console.log('\n✨ Complete! Archive updated successfully.');
      if (newContentAdded > 0) {
        console.log(`   Full content available for ${newContentAdded} new posts`);
      }
      console.log();
      process.exit(0);
    } else {
      console.log('\n❌ Failed to save archive.\n');
      process.exit(1);
    }

  } catch (err) {
    console.error('\n❌ Unexpected error:', err);
    process.exit(1);
  }
}

// Run
main();
