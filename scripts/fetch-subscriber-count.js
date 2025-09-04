#!/usr/bin/env node

/**
 * Fetch Subscriber Count from ConvertKit
 * 
 * Fetches the current subscriber count from ConvertKit and saves it to a JSON file
 * This runs at build time to display the current count on the website
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;

async function fetchSubscriberCount() {
  if (!CONVERTKIT_API_KEY) {
    console.log('⚠️  ConvertKit API key not found, using default count');
    return { count: 658, lastUpdated: new Date().toISOString() };
  }

  try {
    console.log('🔄 Fetching subscriber count from ConvertKit...');
    
    // Fetch account stats from ConvertKit
    const response = await fetch(
      `https://api.convertkit.com/v3/account?api_key=${CONVERTKIT_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`ConvertKit API error: ${response.status}`);
    }

    const data = await response.json();
    const subscriberCount = data.account?.subscribers || 658;
    
    console.log(`✅ Current subscriber count: ${subscriberCount}`);
    
    return {
      count: subscriberCount,
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error fetching subscriber count:', error.message);
    console.log('📊 Using cached/default count');
    
    // Try to use cached count if available
    try {
      const cachePath = path.join(__dirname, '..', 'src', 'data', 'subscriber-count.json');
      if (fs.existsSync(cachePath)) {
        const cached = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
        return cached;
      }
    } catch {
      // Ignore cache read errors
    }
    
    // Fall back to your mentioned count
    return { count: 658, lastUpdated: new Date().toISOString() };
  }
}

async function saveSubscriberCount() {
  const data = await fetchSubscriberCount();
  
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filePath = path.join(dataDir, 'subscriber-count.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  console.log(`💾 Saved subscriber count to ${filePath}`);
  return data;
}

// Run if called directly
if (process.argv[1] === __filename) {
  saveSubscriberCount()
    .then(data => {
      console.log('✨ Subscriber count updated successfully:', data.count);
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed to update subscriber count:', error);
      process.exit(1);
    });
}

export { fetchSubscriberCount, saveSubscriberCount };