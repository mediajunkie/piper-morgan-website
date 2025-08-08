import Parser from 'rss-parser';
import fs from 'fs/promises';
import path from 'path';

const parser = new Parser({
  customFields: {
    item: [
      ['dc:creator', 'creator'],
      ['content:encoded', 'contentEncoded'],
    ]
  }
});

export interface MediumPost {
  title: string;
  excerpt: string;
  url: string;
  publishedAt: string;
  author: string;
  readingTime: string;
  tags: string[];
  guid: string;
}

// Extract reading time from content (Medium includes it in the article)
function extractReadingTime(content: string): string {
  // Medium typically includes reading time in the content
  const match = content.match(/(\d+)\s*min\s*read/i);
  return match ? `${match[1]} min read` : '5 min read'; // default fallback
}

// Extract clean excerpt from HTML content
function extractExcerpt(content: string, title: string): string {
  // Remove HTML tags
  let text = content.replace(/<[^>]*>/g, '');

  // Remove the title if it appears at the start
  if (text.startsWith(title)) {
    text = text.substring(title.length);
  }

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Get first 150-200 characters
  if (text.length > 200) {
    text = text.substring(0, 197) + '...';
  }

  return text || 'Read more on Medium';
}

// Format date to readable format
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

// Extract tags from categories
function extractTags(categories?: string[]): string[] {
  if (!categories || categories.length === 0) {
    return ['Building in Public'];
  }

  // Take first 3 categories as tags
  return categories.slice(0, 3).map(cat =>
    // Capitalize first letter of each word
    cat.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  );
}

export async function fetchMediumPosts(): Promise<MediumPost[]> {
  const posts: MediumPost[] = [];

  try {
    // Fetch from the publication feed
    console.log('Fetching Medium RSS feed...');
    const feed = await parser.parseURL('https://medium.com/feed/building-piper-morgan');

    console.log(`Found ${feed.items.length} posts in feed`);

    for (const item of feed.items.slice(0, 10)) { // Get latest 10 posts
      const post: MediumPost = {
        title: item.title || 'Untitled',
        excerpt: extractExcerpt(item.contentEncoded || item.content || '', item.title || ''),
        url: item.link || '',
        publishedAt: formatDate(item.pubDate || new Date().toISOString()),
        author: item.creator || 'Christian Rondeau',
        readingTime: extractReadingTime(item.contentEncoded || item.content || ''),
        tags: extractTags(item.categories),
        guid: item.guid || item.link || ''
      };

      posts.push(post);
    }

    // Also try to fetch from author feed for additional posts
    try {
      const authorFeed = await parser.parseURL('https://medium.com/feed/@mediajunkie');
      console.log(`Found ${authorFeed.items.length} posts in author feed`);

      // Add posts that aren't already in the list
      for (const item of authorFeed.items.slice(0, 10)) {
        const existingPost = posts.find(p => p.guid === item.guid || p.url === item.link);
        if (!existingPost && item.link?.includes('piper-morgan')) {
          const post: MediumPost = {
            title: item.title || 'Untitled',
            excerpt: extractExcerpt(item.contentEncoded || item.content || '', item.title || ''),
            url: item.link || '',
            publishedAt: formatDate(item.pubDate || new Date().toISOString()),
            author: item.creator || 'Christian Rondeau',
            readingTime: extractReadingTime(item.contentEncoded || item.content || ''),
            tags: extractTags(item.categories),
            guid: item.guid || item.link || ''
          };
          posts.push(post);
        }
      }
    } catch (authorError) {
      console.log('Could not fetch author feed, continuing with publication feed only');
    }

  } catch (error) {
    console.error('Error fetching Medium RSS feed:', error);
    // Return empty array if fetch fails
    return [];
  }

  // Sort by date, newest first
  posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return posts;
}

// Cache the posts to a JSON file during build
export async function cacheMediumPosts(): Promise<void> {
  try {
    const posts = await fetchMediumPosts();

    if (posts.length > 0) {
      const cacheDir = path.join(process.cwd(), 'src', 'data');
      await fs.mkdir(cacheDir, { recursive: true });

      const cachePath = path.join(cacheDir, 'medium-posts.json');
      await fs.writeFile(
        cachePath,
        JSON.stringify(posts, null, 2),
        'utf-8'
      );

      console.log(`Cached ${posts.length} Medium posts to ${cachePath}`);
    }
  } catch (error) {
    console.error('Error caching Medium posts:', error);
  }
}

// Load cached posts (for use in components)
export async function loadCachedPosts(): Promise<MediumPost[]> {
  try {
    const cachePath = path.join(process.cwd(), 'src', 'data', 'medium-posts.json');
    const data = await fs.readFile(cachePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No cached posts found, returning empty array');
    return [];
  }
}
