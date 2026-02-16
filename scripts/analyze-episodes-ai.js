#!/usr/bin/env node

/**
 * AI-Powered Episode Analyzer
 *
 * Uses an AI agent to analyze all blog posts and suggest optimal episode boundaries.
 *
 * Purpose:
 * - Identify natural narrative breaks in the development journey
 * - Suggest balanced episode distribution (~12-15 posts each)
 * - Account for thematic coherence and work periods
 * - Propose splitting production-transformation (currently 30 posts)
 * - Create Episode 13 for Alpha milestone period
 *
 * Usage:
 *   node scripts/analyze-episodes-ai.js
 *
 * Output:
 *   devel/analysis/episode-rechunking-suggestions.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths
const CSV_PATH = path.join(process.cwd(), 'data', 'blog-metadata.csv');
const CONTENT_PATH = path.join(process.cwd(), 'src', 'data', 'blog-content.json');
const EPISODES_PATH = path.join(process.cwd(), 'src', 'lib', 'episodes.ts');
const OUTPUT_PATH = path.join(process.cwd(), 'devel', 'analysis', 'episode-rechunking-suggestions.md');

console.log('🤖 AI-Powered Episode Analyzer');
console.log('='.repeat(60));
console.log();

// Parse CSV (simple parser since we know the format)
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function loadCSV() {
  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(lines[0]);

  const posts = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const post = {};
    headers.forEach((h, idx) => {
      post[h] = values[idx] || '';
    });
    posts.push(post);
  }

  return posts.filter(p => p.workDate); // Only posts with workDate
}

function loadBlogContent() {
  return JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8'));
}

function loadCurrentEpisodes() {
  const episodesContent = fs.readFileSync(EPISODES_PATH, 'utf-8');

  // Extract episode data using regex
  const episodeMatches = episodesContent.matchAll(/{\s*slug:\s*'([^']+)',\s*name:\s*'([^']+)',\s*shortName:\s*'([^']+)',\s*description:\s*'([^']+)',\s*startDate:\s*'([^']+)',\s*endDate:\s*'([^']+)',\s*theme:\s*'([^']+)'/g);

  const episodes = [];
  for (const match of episodeMatches) {
    episodes.push({
      slug: match[1],
      name: match[2],
      shortName: match[3],
      description: match[4],
      startDate: match[5],
      endDate: match[6],
      theme: match[7]
    });
  }

  return episodes;
}

// Main execution
console.log('📋 Loading blog metadata...');
const posts = loadCSV();
console.log(`✅ Loaded ${posts.length} posts with workDate`);

console.log('📄 Loading blog content...');
const blogContent = loadBlogContent();
console.log(`✅ Loaded content for ${Object.keys(blogContent).length} posts`);

console.log('📺 Loading current episode structure...');
const currentEpisodes = loadCurrentEpisodes();
console.log(`✅ Loaded ${currentEpisodes.length} current episodes\n`);

// Prepare analysis data
const postsByCluster = {};
posts.forEach(post => {
  const cluster = post.cluster || 'unassigned';
  if (!postsByCluster[cluster]) {
    postsByCluster[cluster] = [];
  }
  postsByCluster[cluster].push({
    workDate: post.workDate,
    title: post.title,
    category: post.category,
    hashId: post.hashId
  });
});

// Sort each cluster by workDate
Object.keys(postsByCluster).forEach(cluster => {
  postsByCluster[cluster].sort((a, b) => a.workDate.localeCompare(b.workDate));
});

// Create summary for agent
const summary = {
  totalPosts: posts.length,
  currentEpisodes: currentEpisodes.length,
  postsPerEpisode: Object.entries(postsByCluster)
    .filter(([k]) => k !== 'unassigned')
    .map(([cluster, clusterPosts]) => ({
      episode: currentEpisodes.find(ep => ep.slug === cluster)?.shortName || cluster,
      slug: cluster,
      count: clusterPosts.length,
      dateRange: `${clusterPosts[0].workDate} to ${clusterPosts[clusterPosts.length - 1].workDate}`,
      posts: clusterPosts.map(p => `${p.workDate}: ${p.title}`)
    }))
    .sort((a, b) => b.count - a.count),
  unassigned: postsByCluster.unassigned || [],
  context: {
    projectPhase: 'Post-Great-Refactor, entering Alpha milestone with testers',
    problemAreas: [
      'production-transformation has 30 posts (2.7x average)',
      '3-4 unassigned posts from Oct 5-7',
      'Need Episode 13 for current Alpha period'
    ],
    goals: [
      'Natural narrative breaks (coherent work periods)',
      'Balanced distribution (~12-15 posts per episode)',
      'Thematic coherence',
      'Account for current project phase (Alpha milestone)'
    ]
  }
};

// Save analysis data
const analysisDataPath = path.join(process.cwd(), 'devel', 'analysis', 'episode-data.json');
fs.mkdirSync(path.dirname(analysisDataPath), { recursive: true });
fs.writeFileSync(analysisDataPath, JSON.stringify(summary, null, 2));

console.log('📊 Episode Distribution Summary:');
console.log('='.repeat(60));
summary.postsPerEpisode.forEach((ep, idx) => {
  console.log(`${idx + 1}. ${ep.episode.padEnd(35)} ${ep.count.toString().padStart(3)} posts`);
  console.log(`   ${ep.dateRange}`);
});

if (summary.unassigned.length > 0) {
  console.log(`\n⚠️  Unassigned: ${summary.unassigned.length} posts`);
}

console.log('\n' + '='.repeat(60));
console.log('📊 Statistics:');
console.log(`   Total posts: ${summary.totalPosts}`);
console.log(`   Current episodes: ${summary.currentEpisodes}`);
console.log(`   Average posts per episode: ${(summary.totalPosts / summary.currentEpisodes).toFixed(1)}`);
console.log(`   Largest episode: ${summary.postsPerEpisode[0].episode} (${summary.postsPerEpisode[0].count} posts)`);
console.log(`   Smallest episode: ${summary.postsPerEpisode[summary.postsPerEpisode.length - 1].episode} (${summary.postsPerEpisode[summary.postsPerEpisode.length - 1].count} posts)`);

console.log('\n' + '='.repeat(60));
console.log('🤖 Next Step: Review episode-data.json and use Task agent');
console.log('='.repeat(60));
console.log('\nData saved to: devel/analysis/episode-data.json');
console.log('\nTo analyze with AI agent, use the Task tool with this data.');
console.log('The agent should suggest episode boundaries based on:');
console.log('  - Natural narrative breaks in development journey');
console.log('  - Thematic coherence of work periods');
console.log('  - Balanced distribution (~12-15 posts each)');
console.log('  - Current project phase (Alpha milestone)\n');
