#!/usr/bin/env node

import Parser from 'rss-parser';
import { promises as fs } from 'fs';
import { join } from 'path';

const parser = new Parser({
  customFields: {
    item: [
      ['dc:creator', 'creator'],
      ['content:encoded', 'contentEncoded'],
    ]
  }
});

// Extract reading time from content
function extractReadingTime(content) {
  const match = content.match(/(\d+)\s*min\s*read/i);
  return match ? `${match[1]} min read` : '5 min read';
}

// Extract clean excerpt from HTML content
function extractExcerpt(content, title) {
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
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

// Extract tags from categories
function extractTags(categories) {
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

async function fetchMediumPosts() {
  const posts = [];

  try {
    // Fetch from the publication feed
    console.log('🔄 Fetching Medium RSS feed from building-piper-morgan...');
    const feed = await parser.parseURL('https://medium.com/feed/building-piper-morgan');

    console.log(`✅ Found ${feed.items.length} posts in publication feed`);

    for (const item of feed.items.slice(0, 10)) {
      const post = {
        title: item.title || 'Untitled',
        excerpt: extractExcerpt(item.contentEncoded || item.content || '', item.title || ''),
        url: item.link || '',
        publishedAt: formatDate(item.pubDate || new Date().toISOString()),
        publishedAtISO: item.pubDate || new Date().toISOString(),
        author: item.creator || 'Christian Crumlish',
        readingTime: extractReadingTime(item.contentEncoded || item.content || ''),
        tags: extractTags(item.categories),
        guid: item.guid || item.link || ''
      };

      posts.push(post);
      console.log(`  📝 ${post.title} (${post.publishedAt})`);
    }

  } catch (error) {
    console.error('❌ Error fetching Medium RSS feed:', error.message);

    // Return fallback data with the known articles
    console.log('⚠️  Using fallback article data');
    return [
      {
        title: "The Question That Started Everything",
        excerpt: "The origin story of Piper Morgan - how a simple question about PM automation led to a journey of systematic excellence and AI collaboration.",
        url: "https://medium.com/building-piper-morgan/the-question-that-started-everything-5a69f9a2af0b",
        publishedAt: "Jul 5, 2024",
        publishedAtISO: "2024-07-05T00:00:00Z",
        author: "Christian Crumlish",
        readingTime: "5 min read",
        tags: ["Origin Story", "Vision", "AI"],
        guid: "https://medium.com/building-piper-morgan/the-question-that-started-everything-5a69f9a2af0b"
      },
      {
        title: "The PM Who Automated Himself (Or at Least Tried To)",
        excerpt: "An honest exploration of attempting to automate product management tasks, what worked, what didn't, and the surprising insights along the way.",
        url: "https://medium.com/building-piper-morgan/the-pm-who-automated-himself-or-at-least-tried-to-b1d8c2dd5f40",
        publishedAt: "Jul 12, 2024",
        publishedAtISO: "2024-07-12T00:00:00Z",
        author: "Christian Crumlish",
        readingTime: "7 min read",
        tags: ["Automation", "Product Management", "Learning"],
        guid: "https://medium.com/building-piper-morgan/the-pm-who-automated-himself-or-at-least-tried-to-b1d8c2dd5f40"
      },
      {
        title: "The Demo That Killed the Prototype",
        excerpt: "How a successful demo led to completely reimagining our approach, embracing failure as a pathway to better architecture.",
        url: "https://medium.com/building-piper-morgan/the-demo-that-killed-the-prototype-f0aad9fa3a4a",
        publishedAt: "Jul 19, 2024",
        publishedAtISO: "2024-07-19T00:00:00Z",
        author: "Christian Crumlish",
        readingTime: "6 min read",
        tags: ["Prototyping", "Learning", "Architecture"],
        guid: "https://medium.com/building-piper-morgan/the-demo-that-killed-the-prototype-f0aad9fa3a4a"
      }
    ];
  }

  // Sort by date, newest first
  posts.sort((a, b) =>
    new Date(b.publishedAtISO).getTime() - new Date(a.publishedAtISO).getTime()
  );

  return posts;
}

async function main() {
  try {
    console.log('🚀 Starting Medium RSS feed fetch...\n');

    const posts = await fetchMediumPosts();

    if (posts.length > 0) {
      const dataDir = join(process.cwd(), 'src', 'data');
      await fs.mkdir(dataDir, { recursive: true });

      const cachePath = join(dataDir, 'medium-posts.json');
      await fs.writeFile(
        cachePath,
        JSON.stringify(posts, null, 2),
        'utf-8'
      );

      console.log(`\n✅ Successfully cached ${posts.length} Medium posts to src/data/medium-posts.json`);
      console.log('📊 Posts will be used in the blog and homepage components\n');
    } else {
      console.log('⚠️  No posts fetched, site will use existing static content\n');
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
