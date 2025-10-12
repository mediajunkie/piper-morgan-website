#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join } from 'path';

async function generateMockPosts() {
  // Read the original 10 posts
  const backupPath = join(process.cwd(), 'src', 'data', 'medium-posts.backup.json');
  const originalPosts = JSON.parse(await fs.readFile(backupPath, 'utf-8'));

  const mockPosts = [];
  const numCopies = 5; // Create 50 posts (10 * 5)

  // Starting date (work backwards from Oct 1, 2025)
  let currentDate = new Date('2025-10-01T12:00:00Z');

  // Duplicate posts 5 times with date variations
  for (let copy = 0; copy < numCopies; copy++) {
    for (let i = 0; i < originalPosts.length; i++) {
      const originalPost = originalPosts[i];

      // Move date back by 1 day for each post
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

      const mockPost = {
        ...originalPost,
        title: copy === 0 ? originalPost.title : `[${copy * 10 + i + 1}] ${originalPost.title}`,
        publishedAt: currentDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        publishedAtISO: currentDate.toISOString(),
        guid: `${originalPost.guid}-mock-${copy}-${i}`,
      };

      mockPosts.push(mockPost);
    }
  }

  // Save mock posts
  const cachePath = join(process.cwd(), 'src', 'data', 'medium-posts.json');
  await fs.writeFile(
    cachePath,
    JSON.stringify(mockPosts, null, 2),
    'utf-8'
  );

  console.log(`✅ Generated ${mockPosts.length} mock posts for pagination testing`);
  console.log(`📅 Date range: ${mockPosts[mockPosts.length - 1].publishedAt} to ${mockPosts[0].publishedAt}`);
  console.log(`📊 This will create ${Math.ceil(mockPosts.length / 24)} pages with 24 posts per page`);
  console.log(`\n💡 To restore original posts, run: cp src/data/medium-posts.backup.json src/data/medium-posts.json`);
}

generateMockPosts();
