#!/usr/bin/env node

/**
 * Phase 8: Narrative Clustering - Theme Analysis
 * Read post content and identify thematic patterns within date clusters
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'data', 'blog-metadata.csv');
const CONTENT_PATH = path.join(__dirname, '..', 'src', 'data', 'blog-content.json');

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

function extractDatePrefix(title) {
  const match = title.match(/^(\d+\/\d+)[\s:]/);
  return match ? match[1] : null;
}

function dateToSortKey(dateStr) {
  if (!dateStr) return 99999;
  const [month, day] = dateStr.split('/').map(n => parseInt(n));
  return month * 100 + day;
}

// Extract theme keywords from subtitle
function extractThemes(subtitle) {
  if (!subtitle) return [];

  const themes = [];
  const lower = subtitle.toLowerCase();

  // Technical themes
  if (lower.match(/github|integration|slack|api|infrastructure/)) themes.push('integration');
  if (lower.match(/test|tdd|debugging|bug/)) themes.push('testing');
  if (lower.match(/architecture|design|refactor|rebuild/)) themes.push('architecture');
  if (lower.match(/methodology|process|workflow/)) themes.push('methodology');
  if (lower.match(/ai agent|multi-agent|coordination/)) themes.push('multi-agent');

  // Development themes
  if (lower.match(/prototype|mvp|production/)) themes.push('milestone');
  if (lower.match(/foundation|infrastructure|cleanup/)) themes.push('foundation');
  if (lower.match(/breakthrough|revelation|convergence/)) themes.push('breakthrough');

  // Meta themes
  if (lower.match(/ethics|values|human/)) themes.push('ethics');
  if (lower.match(/reflection|retrospective|pause|stock/)) themes.push('reflection');
  if (lower.match(/learning|teaching|documentation/)) themes.push('learning');

  return [...new Set(themes)];
}

console.log('🎨 PHASE 8: THEME ANALYSIS\n');
console.log('==========================\n');

// Read CSV and content
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = csvContent.split('\n').filter(l => l.trim());
const dataLines = lines.slice(1);

const blogContent = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8'));

// Parse and sort posts
const posts = dataLines.map((line) => {
  const fields = parseCsvRow(line);
  const [slug, hashId, title] = fields;

  const datePrefix = extractDatePrefix(title);
  const sortKey = dateToSortKey(datePrefix);
  const content = blogContent[hashId];

  return {
    slug,
    hashId,
    title: title.substring(0, 100),
    datePrefix,
    sortKey,
    subtitle: content?.subtitle || '',
    themes: extractThemes(content?.subtitle)
  };
});

posts.sort((a, b) => a.sortKey - b.sortKey);

// Group into date clusters
const dateGroups = new Map();
posts.forEach(post => {
  const date = post.datePrefix || 'No date';
  if (!dateGroups.has(date)) {
    dateGroups.set(date, []);
  }
  dateGroups.get(date).push(post);
});

// Analyze themes by period
console.log('📊 THEMATIC ANALYSIS BY DATE CLUSTER:\n');

const sortedDates = Array.from(dateGroups.keys()).sort((a, b) => {
  if (a === 'No date') return 1;
  if (b === 'No date') return -1;
  return dateToSortKey(a) - dateToSortKey(b);
});

sortedDates.forEach(date => {
  const groupPosts = dateGroups.get(date);
  const allThemes = groupPosts.flatMap(p => p.themes);
  const themeCount = {};
  allThemes.forEach(t => themeCount[t] = (themeCount[t] || 0) + 1);

  const dominantThemes = Object.entries(themeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme, count]) => `${theme}(${count})`);

  console.log(`\n${date} — ${groupPosts.length} posts`);
  console.log(`   Themes: ${dominantThemes.join(', ') || 'none detected'}`);

  // Show sample post titles
  groupPosts.slice(0, 3).forEach(post => {
    console.log(`   • ${post.title}...`);
  });

  if (groupPosts.length > 3) {
    console.log(`   ... and ${groupPosts.length - 3} more`);
  }
});

console.log('\n\n🗺️  SUGGESTED EPISODE GROUPINGS:\n');
console.log('Based on gaps, themes, and natural boundaries:\n');

const episodes = [
  {
    name: 'Episode 1: The Great Rebuild',
    dates: 'Pre-dated posts',
    description: 'Foundational work, architectural decisions, initial prototype',
    keyPosts: ['The Great Rebuild', 'The Architectural Reckoning', 'RAG Revelation']
  },
  {
    name: 'Episode 2: First Sprint',
    dates: '7/8-7/12',
    description: 'Early development, PM modeling, initial agent coordination',
    keyPosts: ['Two-Fisted Coding', 'When the Bugs Lead You Home', 'Just-in-Time Retrospective']
  },
  {
    name: 'Episode 3: The 716 Coordination Breakthrough',
    dates: '7/16',
    description: 'Multi-agent coordination, 642x performance gains, architecture discoveries',
    keyPosts: ['The three-AI orchestra', '40-minute miracle', 'Cascade Effect']
  },
  {
    name: 'Episode 4: The Complexity Reckoning',
    dates: '7/20',
    description: 'Technical debt confrontation, foundation work, successful prototype syndrome',
    keyPosts: ['Technical Debt Reckoning', 'Digging Out of the Complexity Hole', 'Following Your Own Patterns']
  },
  {
    name: 'Episode 5: Production Leap',
    dates: '7/22',
    description: 'GitHub integration, prototype becomes production tool, PTSD and culture',
    keyPosts: ['The Final Leap', 'Finished Next Week\'s Work', 'Battle-Testing GitHub Integration']
  },
  {
    name: 'Episode 6: Ethics & Methodology',
    dates: '7/26-7/31',
    description: 'Ethics framework, systematic methodology, Slack integration, crisis to methodology',
    keyPosts: ['Saturday Reflection: Ethics', '71-Minute Cascade Killer', 'Crisis Became Methodology']
  },
  {
    name: 'Episode 7: Infrastructure Sprint',
    dates: '8/3-8/12',
    description: 'Weekend infrastructure victories, agent coordination refinement, methodology validation',
    keyPosts: ['Weekend Sprint Chronicles', '28,000-line foundation', 'Day We Taught Piper to Summarize']
  },
  {
    name: 'Episode 8: The Convergence',
    dates: '8/17-8/23',
    description: 'Archaeological mystery to triumph, breakthroughs, enhanced prompting, everything clicked',
    keyPosts: ['The convergence day', 'Enhanced Prompting Breakthrough', 'The Sunday When Everything Clicked']
  },
  {
    name: 'Episode 9: Methodology Infrastructure',
    dates: '8/28',
    description: 'Organic to orchestrated, AI lies detection, Wiki publishing, verification theater',
    keyPosts: ['From Organic to Orchestrated', 'AI That Caught Its Own Lies', 'Verification Theater']
  },
  {
    name: 'Episode 10: Architecture That Builds Itself',
    dates: '9/3-9/9',
    description: 'Self-validating methodology, framework catches cheating, two-line fixes, boring work pays off',
    keyPosts: ['Architecture that Build Itself', 'Framework Catches You Cheating', 'We Gave Our AI a Personality']
  },
  {
    name: 'Episode 11: Strategic Pause & Reassessment',
    dates: '9/12-9/19',
    description: 'Explicit pause, inchworm mode, methodology under fire, vision clarification',
    keyPosts: ['The Strategic Pause', 'Inchworm Mode', 'Methodology Under Fire']
  },
  {
    name: 'Episode 12: The Final Push',
    dates: '9/20-9/21',
    description: 'Discipline of finishing, 24-hour test, teaching machines, foundations were there, building the cathedral',
    keyPosts: ['Discipline of Actually Finishing', '24-hour test', 'Teaching Machines to Teach Machines']
  }
];

episodes.forEach((ep, idx) => {
  console.log(`\n**${ep.name}**`);
  console.log(`   Period: ${ep.dates}`);
  console.log(`   Theme: ${ep.description}`);
  console.log(`   Key posts: ${ep.keyPosts.join(', ')}`);
});

console.log('\n\n✅ NEXT STEP: Review and refine these episode groupings\n');
