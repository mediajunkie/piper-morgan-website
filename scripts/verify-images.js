#!/usr/bin/env node

/**
 * Verify all cartoon names in CSV have corresponding images
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'Medium-Posts-updated-xian-2025-10-11-1207.csv');
const SOURCE_DIR = path.join(__dirname, '..', 'public/assets/blog-images/source');

function main() {
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });

  const sourceFiles = fs.readdirSync(SOURCE_DIR)
    .filter(f => f !== 'INVENTORY.txt')
    .filter(f => f.match(/\.(png|webp|jpg|jpeg)$/i));

  const sourceNames = new Set(sourceFiles.map(f => path.parse(f).name));

  const missing = [];
  const found = [];

  for (const record of records) {
    const cartoonName = record['cartoon']?.trim();
    if (cartoonName) {
      if (!sourceNames.has(cartoonName)) {
        missing.push({
          cartoon: cartoonName,
          title: record['Title']?.substring(0, 60)
        });
      } else {
        found.push(cartoonName);
      }
    }
  }

  console.log('📊 VERIFICATION RESULTS');
  console.log('======================\n');
  console.log(`✅ Found images: ${found.length}`);
  console.log(`❌ Missing images: ${missing.length}\n`);

  if (missing.length > 0) {
    console.log('Missing images:');
    missing.forEach(m => {
      console.log(`   ${m.cartoon} (for: ${m.title}...)`);
    });
  }

  console.log(`\nTotal posts with cartoon names: ${found.length + missing.length}`);
  console.log(`Total images in source/: ${sourceFiles.length}`);

  // Also check for orphan images
  const usedNames = new Set(found);
  const orphans = sourceFiles.filter(f => {
    const name = path.parse(f).name;
    return !usedNames.has(name);
  });

  if (orphans.length > 0) {
    console.log(`\n🔍 Orphan images (in source but not used in CSV): ${orphans.length}`);
    orphans.forEach(f => console.log(`   ${f}`));
  }
}

main();
