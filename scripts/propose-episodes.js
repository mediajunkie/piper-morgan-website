#!/usr/bin/env node

/**
 * Phase 8: Propose Episode Structure
 * Based on actual workDate chronology (all dates are 2025)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');

// Parse CSV
function parseCsvRow(row) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

// Convert 2001 dates to 2025
function normalizeDateTo2025(dateStr) {
  return dateStr.replace('2001-', '2025-');
}

// Identify boundary markers
function identifyBoundaryMarkers(title) {
  const markers = [];
  const lower = title.toLowerCase();

  if (lower.includes('strategic pause')) markers.push('STRATEGIC-PAUSE');
  if (lower.includes('reflection') || lower.includes('retrospective')) markers.push('REFLECTION');
  if (lower.includes('reckoning')) markers.push('RECKONING');
  if (lower.includes('taking stock')) markers.push('TAKING-STOCK');
  if (lower.includes('breakthrough')) markers.push('BREAKTHROUGH');
  if (lower.includes('convergence')) markers.push('CONVERGENCE');
  if (lower.includes('great rebuild')) markers.push('GREAT-REBUILD');

  return markers;
}

console.log('📊 PHASE 8: EPISODE PROPOSAL\n');
console.log('============================\n');

// Read and parse CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = csvContent.split('\n').filter(l => l.trim());
const dataLines = lines.slice(1);

const posts = dataLines.map((line, idx) => {
  const fields = parseCsvRow(line);
  const [slug, hashId, title, imageSlug, workDate] = fields;

  return {
    index: idx + 2,
    slug,
    hashId,
    title: title.substring(0, 80),
    workDate: normalizeDateTo2025(workDate),
    markers: identifyBoundaryMarkers(title)
  };
});

// Sort chronologically
posts.sort((a, b) => a.workDate.localeCompare(b.workDate));

// Define episodes based on chronology and gaps
const episodes = [
  {
    name: 'Episode 1: Genesis & Architecture',
    startDate: '2025-06-27',
    endDate: '2025-07-06',
    description: 'Initial prototype, architectural reckoning, foundational decisions',
    keyThemes: ['Initial prototype', 'Architectural decisions', 'RAG integration', 'Taking stock'],
    boundaryReason: 'Early exploration period ending with "Taking Stock" reflection'
  },
  {
    name: 'Episode 2: Foundation Building',
    startDate: '2025-07-07',
    endDate: '2025-07-21',
    description: 'Building core infrastructure, GitHub integration, testing foundations',
    keyThemes: ['Infrastructure', 'Testing', 'Integration work', 'Day Zero'],
    boundaryReason: 'Foundation work before complexity reckoning'
  },
  {
    name: 'Episode 3: The Complexity Reckoning',
    startDate: '2025-07-22',
    endDate: '2025-07-28',
    description: 'Confronting technical debt, AI drift issues, architectural challenges',
    keyThemes: ['Technical debt', 'Complexity', 'Multiple AI coordination', 'Successful prototype syndrome'],
    boundaryReason: 'Week-long reckoning with explicit "Technical Debt Reckoning" post'
  },
  {
    name: 'Episode 4: Production Transformation',
    startDate: '2025-07-29',
    endDate: '2025-08-08',
    description: 'From prototype to production tool, methodology crystallization',
    keyThemes: ['Production readiness', 'Methodology', 'Test architecture', 'Crisis to methodology'],
    boundaryReason: 'Transformation period ending with test/bug work'
  },
  {
    name: 'Episode 5: Methodology Refinement',
    startDate: '2025-08-09',
    endDate: '2025-08-16',
    description: 'Systematic methodology development, documentation breakthroughs',
    keyThemes: ['Demo infrastructure', 'Documentation', 'Session logs', 'Reliable workflows'],
    boundaryReason: 'Focus on methodology as infrastructure'
  },
  {
    name: 'Episode 6: Infrastructure Sprint',
    startDate: '2025-08-17',
    endDate: '2025-08-23',
    description: 'Major infrastructure victories, archaeological discoveries, convergence',
    keyThemes: ['28K-line foundation', 'Archaeological mystery', 'Convergence', 'Everything clicked'],
    boundaryReason: 'High-productivity sprint with explicit "convergence" marker'
  },
  {
    name: 'Episode 7: Enhanced Capabilities',
    startDate: '2025-08-24',
    endDate: '2025-08-31',
    description: 'Enhanced prompting, nervous system development, AI coordination maturity',
    keyThemes: ['Enhanced prompting', 'MVP nervous system', 'Good habits', 'AI coordination'],
    boundaryReason: 'Capability enhancement period before orchestration phase'
  },
  {
    name: 'Episode 8: Orchestration & Verification',
    startDate: '2025-09-01',
    endDate: '2025-09-08',
    description: 'Organic to orchestrated, AI self-verification, methodology infrastructure',
    keyThemes: ['Orchestration', 'AI lies detection', 'Verification theater', 'Methodology cascade'],
    boundaryReason: 'Methodology-as-infrastructure with self-validating systems'
  },
  {
    name: 'Episode 9: Meta-Development',
    startDate: '2025-09-09',
    endDate: '2025-09-15',
    description: 'Architecture that builds itself, framework validation, meta-learning',
    keyThemes: ['Self-building architecture', 'Framework catches cheating', 'Fractal edge', 'AI personality'],
    boundaryReason: 'Meta-level development work'
  },
  {
    name: 'Episode 10: Strategic Pause',
    startDate: '2025-09-16',
    endDate: '2025-09-22',
    description: 'Explicit strategic pause, inchworm mode, methodology validation',
    keyThemes: ['Strategic pause', 'Inchworm mode', 'Methodology under fire', 'Vision clarity'],
    boundaryReason: 'Explicit "Strategic Pause" marker and reassessment period'
  },
  {
    name: 'Episode 11: Discipline & Completion',
    startDate: '2025-09-23',
    endDate: '2025-10-03',
    description: 'Discipline of finishing, 24-hour test, teaching machines, building cathedral',
    keyThemes: ['Discipline', 'Finishing', '24-hour test', 'Teaching machines', 'Cathedral'],
    boundaryReason: 'Final intensive push with completion themes'
  },
  {
    name: 'Episode 12: Reflection & Evolution',
    startDate: '2025-10-04',
    endDate: '2025-10-12',
    description: 'Post-completion reflection, new patterns, orchestration insights',
    keyThemes: ['Dropped balls analysis', 'Time lord thinking', 'UX orchestration', 'Systemic kindness'],
    boundaryReason: 'Post-completion reflection and future-looking insights'
  }
];

// Assign episodes to posts
const postsWithEpisodes = posts.map(post => {
  const episode = episodes.find(ep =>
    post.workDate >= ep.startDate && post.workDate <= ep.endDate
  );

  return {
    ...post,
    episodeName: episode ? episode.name : 'UNASSIGNED',
    episodeNum: episode ? episodes.indexOf(episode) + 1 : 0
  };
});

// Display results
console.log('📅 PROPOSED EPISODES:\n');

episodes.forEach((ep, idx) => {
  const epNum = idx + 1;
  const epPosts = postsWithEpisodes.filter(p => p.episodeNum === epNum);

  console.log(`\n**${ep.name}**`);
  console.log(`   Period: ${ep.startDate} to ${ep.endDate} (2025)`);
  console.log(`   Posts: ${epPosts.length}`);
  console.log(`   Theme: ${ep.description}`);
  console.log(`   Key concepts: ${ep.keyThemes.join(', ')}`);
  console.log(`   Boundary: ${ep.boundaryReason}`);

  // Show first few posts
  if (epPosts.length > 0) {
    console.log(`   Sample posts:`);
    epPosts.slice(0, 3).forEach(p => {
      const marker = p.markers.length > 0 ? ` [${p.markers.join(',')}]` : '';
      console.log(`      • ${p.workDate}: ${p.title}...${marker}`);
    });
    if (epPosts.length > 3) {
      console.log(`      ... and ${epPosts.length - 3} more`);
    }
  }
});

// Check for unassigned
const unassigned = postsWithEpisodes.filter(p => p.episodeNum === 0);
if (unassigned.length > 0) {
  console.log(`\n\n⚠️  UNASSIGNED POSTS: ${unassigned.length}`);
  unassigned.forEach(p => {
    console.log(`   ${p.workDate}: ${p.title}...`);
  });
}

console.log('\n\n📊 SUMMARY:\n');
console.log(`   Total episodes: ${episodes.length}`);
console.log(`   Total posts: ${posts.length}`);
console.log(`   Assigned: ${postsWithEpisodes.filter(p => p.episodeNum > 0).length}`);
console.log(`   Unassigned: ${unassigned.length}`);
console.log(`   Timeline: June 27 - October 12, 2025`);
console.log(`   Duration: ~3.5 months\n`);

console.log('✅ NEXT STEP: Review and refine episode boundaries\n');
