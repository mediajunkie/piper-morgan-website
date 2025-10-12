#!/usr/bin/env node

/**
 * Build-time check to ensure static export is enabled for GitHub Pages deployment
 * 
 * This prevents accidental regression where someone disables output: 'export'
 * thinking they need server features, which breaks GitHub Pages deployment.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const CONFIG_FILE = 'next.config.ts';

try {
  console.log('🔍 Checking Next.js static export configuration...');
  
  const configPath = join(process.cwd(), CONFIG_FILE);
  const configContent = readFileSync(configPath, 'utf-8');
  
  // Check if output: 'export' is present and not commented out
  const hasStaticExport = /output:\s*['"']export['"]/.test(configContent);
  const isCommentedOut = /\/\/.*output:\s*['"']export['"]/.test(configContent);
  
  if (!hasStaticExport) {
    console.error('\n❌ DEPLOYMENT ERROR: Static export is not configured');
    console.error('   GitHub Pages requires output: "export" in next.config.ts');
    console.error('   Without this, the site will deploy but show 404 errors');
    console.error('\n   Add this to your Next.js config:');
    console.error('   output: "export",');
    console.error('\n   See docs/deployment-404-fix.md for details');
    process.exit(1);
  }
  
  if (isCommentedOut) {
    console.error('\n❌ DEPLOYMENT ERROR: Static export is commented out');
    console.error('   Found commented: // output: "export"');
    console.error('   This will cause GitHub Pages deployment to fail');
    console.error('\n   Uncomment the line or see docs/deployment-404-fix.md');
    process.exit(1);
  }
  
  console.log('✅ Static export is correctly configured for GitHub Pages');
  
} catch (error) {
  console.error(`❌ Error checking ${CONFIG_FILE}:`, error.message);
  process.exit(1);
}