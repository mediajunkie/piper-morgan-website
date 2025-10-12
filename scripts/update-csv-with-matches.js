#!/usr/bin/env node

/**
 * Update CSV with confirmed and speculative image matches
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'Building Piper Morgan - Medium Posts.csv');

// Confirmed correct matches from user feedback
const confirmedMatches = {
  '40f084dc3095': 'robot-rabbits',
  '987eb4c5cc42': 'robot-detectives',
  '2575d3526323': 'robot-cleanup',
  'cc07dca2a5e9': 'robot-victory',
  'b4d9193ec579': 'robot-rollercoaster',
  'cde7eb0b6605': 'robot-pupil',
  '9fbbf6932838': 'robot-speech',
  'aab04037831e': 'robot-foundation',
  '922fd802460e': 'robot-understudy',
  '117b25fa6bae': 'robot-dig',
  '4660787e98a1': 'robot-mirror',
  'ca9c8039b20d': 'robot-hero',
  'c7207687f711': 'robot-tv',
  '9efacddc4804': 'robot-champagne',
  '078e056a87e4': 'robot-bootstrap',
  '7d71c9e5316d': 'robot-sailboat',
  'b5bb0c2c9384': 'robot-critique',
  '201f17c5cfbf': 'robot-drift',
  'cc7f4b96b621': 'robot-rag'
};

// Speculative/unconfirmed matches from Claude's first round
const speculativeMatches = {
  '647704d46558': 'robot-blueprints',
  '3d696dbf2803': 'robot-discover',
  '5243027aa9f6': 'robot-knight',
  'd9f839597278': 'robot-logs',
  '336d98a417e4': 'robot-mosquito',
  'a858bf183c21': 'robot-skaters OR robot-driver',
  'bb06005611cb': 'robot-stars',
  'f0aad9fa3a4a': 'robot-tv (MOVED)',
  'b75918602942': 'robot-found',
  'a143610ce7f9': 'robot-dr-evil',
  'b1d8c2dd5f40': 'robot-easy',
  '4e6f997a80cf': 'robot-help OR robot-taxes',
  '084611e312ea': 'robot-taxes',
  '5a69f9a2af0b': 'robot-ethics',
  '32c8ed94248d': 'robot-archer',
  'c619de609a42': 'robot-horses',
  '0caeeadf7ef5': 'robot-dogsled',
  '72145777c406': 'robot-handoff',
  '34c725384254': 'robot-blind-curve OR robot-cards',
  'c00a94c09c2c': 'robot-smartbug',
  '4c04e304a3a7': 'robot-self-build?',
  '1e15183972a7': 'robots-cranking',
  '98ad7b8cefd0': 'robots-docs',
  '7fc3aadc2a3b': 'robot-boxers',
  '4734f6e9f442': 'robot-cards',
  '0822585cb51a': 'robot-conductor',
  '03c685be122a': 'robot-hole',
  '0b19d8a13665': 'robot-waterfall',
  '13896a87b7a9': 'robot-third-arm',
  '1f9581a41633': 'robot-doctors',
  'ccb351b91629': 'robot-unprepared',
  'da41a68cd59b': 'robot-report',
  '360bd682551e': 'robot-filing',
  '2965731c90bc': 'robot-fractal-chaos',
  'b7c3ef25cbdc': 'robot-pass-fail'
};

function extractPostId(url) {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\\?|$)/);
  return match ? match[1] : null;
}

function main() {
  // Read CSV
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true
  });

  // Update records
  const updatedRecords = records.map(record => {
    const postId = extractPostId(record['Medium URL']);

    if (postId && confirmedMatches[postId]) {
      // Only update if cartoon column is empty
      if (!record.cartoon || record.cartoon.trim() === '') {
        record.cartoon = confirmedMatches[postId];
      }
    }

    // Add speculative match if exists
    if (postId && speculativeMatches[postId]) {
      record.speculative = speculativeMatches[postId];
    } else {
      record.speculative = '';
    }

    return record;
  });

  // Write back to CSV
  const output = stringify(updatedRecords, {
    header: true,
    columns: ['Date', 'Medium URL', 'Title', 'Theme', 'Medium date', 'cartoon', 'speculative', 'Notes']
  });

  fs.writeFileSync(CSV_PATH, output);
  console.log(`✅ Updated CSV with ${Object.keys(confirmedMatches).length} confirmed matches`);
  console.log(`✅ Added ${Object.keys(speculativeMatches).length} speculative matches`);
  console.log(`✅ Saved to: ${CSV_PATH}`);
}

main();
