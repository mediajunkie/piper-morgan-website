#!/usr/bin/env node

/**
 * LinkedIn Newsletter Stats Fetcher
 * 
 * Fetches subscriber count for the "Building Piper Morgan" LinkedIn newsletter
 * Since LinkedIn requires authentication, this script offers multiple approaches:
 * 1. Manual update via environment variable
 * 2. LinkedIn API (requires OAuth - complex setup)
 * 3. Puppeteer scraping (requires headless browser)
 * 4. Simple fetch with cookie (if you provide your LinkedIn session cookie)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

const LINKEDIN_NEWSLETTER_ID = '7346158338541305856';
const LINKEDIN_NEWSLETTER_URL = `https://www.linkedin.com/newsletters/building-piper-morgan-${LINKEDIN_NEWSLETTER_ID}/`;

// Option 1: Manual override via environment variable (simplest)
const LINKEDIN_SUBSCRIBER_COUNT = process.env.LINKEDIN_SUBSCRIBER_COUNT;

// Option 2: LinkedIn session cookie (if provided)
const LINKEDIN_SESSION_COOKIE = process.env.LINKEDIN_SESSION_COOKIE;

class LinkedInStatsFetcher {
  constructor() {
    this.statsPath = path.join(__dirname, '..', 'src', 'data', 'site-stats.json');
  }

  /**
   * Load existing stats
   */
  loadExistingStats() {
    try {
      if (fs.existsSync(this.statsPath)) {
        return JSON.parse(fs.readFileSync(this.statsPath, 'utf-8'));
      }
    } catch (error) {
      console.log('⚠️  Could not load existing stats, creating new file');
    }
    
    return {
      linkedinSubscribers: {
        count: 659,
        lastUpdated: new Date().toISOString().split('T')[0],
        description: "LinkedIn Newsletter Subscribers"
      }
    };
  }

  /**
   * Method 1: Use environment variable (manual update)
   */
  async fetchFromEnv() {
    if (LINKEDIN_SUBSCRIBER_COUNT) {
      const count = parseInt(LINKEDIN_SUBSCRIBER_COUNT);
      console.log(`✅ Using LinkedIn subscriber count from env: ${count}`);
      return count;
    }
    return null;
  }

  /**
   * Method 2: Attempt to fetch with session cookie
   * Note: This requires a valid LinkedIn session cookie
   */
  async fetchWithCookie() {
    if (!LINKEDIN_SESSION_COOKIE) {
      return null;
    }

    try {
      console.log('🔄 Attempting to fetch LinkedIn stats with session cookie...');
      
      const response = await fetch(LINKEDIN_NEWSLETTER_URL, {
        headers: {
          'Cookie': `li_at=${LINKEDIN_SESSION_COOKIE}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`LinkedIn returned ${response.status}`);
      }

      const html = await response.text();
      
      // Try to parse subscriber count from HTML
      // LinkedIn's HTML structure changes, so we try multiple patterns
      const patterns = [
        />(\d+(?:,\d+)*)\s*subscribers?</i,
        /subscriber[s]?[^>]*>(\d+(?:,\d+)*)</i,
        /"subscriberCount":\s*(\d+)/,
        /followers":(\d+)/
      ];

      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) {
          const count = parseInt(match[1].replace(/,/g, ''));
          console.log(`✅ Found subscriber count: ${count}`);
          return count;
        }
      }

      console.log('⚠️  Could not parse subscriber count from LinkedIn HTML');
      return null;

    } catch (error) {
      console.log('⚠️  Failed to fetch from LinkedIn:', error.message);
      return null;
    }
  }

  /**
   * Method 3: Use Puppeteer for automated browser scraping
   */
  async fetchWithPuppeteer() {
    try {
      const puppeteer = await import('puppeteer');
      console.log('🔄 Launching headless browser to fetch LinkedIn stats...');
      
      const browser = await puppeteer.default.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      
      // Set a realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      console.log('📄 Navigating to LinkedIn newsletter page...');
      await page.goto(LINKEDIN_NEWSLETTER_URL, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait a bit for dynamic content
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Try multiple selectors to find subscriber count
      const subscriberCount = await page.evaluate(() => {
        // Pattern 1: Look for text containing "subscribers"
        const patterns = [
          /(\d+(?:,\d+)*)\s*subscribers?/i,
          /(\d+(?:,\d+)*)\s*follower/i,
          /(\d+(?:,\d+)*)\s*member/i
        ];
        
        // Check all text elements
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        let node;
        while (node = walker.nextNode()) {
          const text = node.textContent.trim();
          if (text) {
            for (const pattern of patterns) {
              const match = text.match(pattern);
              if (match) {
                const count = parseInt(match[1].replace(/,/g, ''));
                if (count > 100 && count < 100000) { // Sanity check
                  return count;
                }
              }
            }
          }
        }
        
        // Pattern 2: Check aria-labels and titles
        const elements = document.querySelectorAll('[aria-label], [title]');
        for (const el of elements) {
          const text = (el.getAttribute('aria-label') || '') + ' ' + (el.getAttribute('title') || '');
          for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
              const count = parseInt(match[1].replace(/,/g, ''));
              if (count > 100 && count < 100000) {
                return count;
              }
            }
          }
        }
        
        return null;
      });
      
      await browser.close();
      
      if (subscriberCount) {
        console.log(`✅ Scraped subscriber count: ${subscriberCount}`);
        return subscriberCount;
      } else {
        console.log('⚠️  Could not find subscriber count on page');
        console.log('💡 Tip: The page might require login or LinkedIn may have changed their layout');
      }
      
    } catch (error) {
      console.log('⚠️  Puppeteer scraping failed:', error.message);
      if (error.message.includes('TimeoutError')) {
        console.log('💡 Tip: LinkedIn might be blocking automated access or the page is loading slowly');
      }
    }
    return null;
  }

  /**
   * Main update process
   */
  async updateStats() {
    console.log('🚀 Fetching LinkedIn newsletter stats...\n');
    
    let stats = this.loadExistingStats();
    let newCount = null;

    // Try methods in order of preference
    newCount = await this.fetchFromEnv();
    
    if (!newCount) {
      newCount = await this.fetchWithCookie();
    }

    // Try Puppeteer if other methods fail
    if (!newCount) {
      newCount = await this.fetchWithPuppeteer();
    }

    if (newCount) {
      const oldCount = stats.linkedinSubscribers.count;
      stats.linkedinSubscribers.count = newCount;
      stats.linkedinSubscribers.lastUpdated = new Date().toISOString().split('T')[0];
      
      // Save updated stats
      const dataDir = path.dirname(this.statsPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(this.statsPath, JSON.stringify(stats, null, 2));
      
      console.log('\n' + '='.repeat(50));
      console.log('📊 LinkedIn Stats Updated');
      console.log('='.repeat(50));
      console.log(`Previous count: ${oldCount || 'unknown'}`);
      console.log(`New count:      ${newCount}`);
      console.log(`Change:         ${oldCount ? (newCount > oldCount ? '+' : '') + (newCount - oldCount) : 'N/A'}`);
      console.log('='.repeat(50));
      console.log(`\n✅ Stats saved to ${this.statsPath}`);

    } else {
      console.log('\n⚠️  Could not fetch new subscriber count');
      console.log('Current methods available:');
      console.log('1. Set LINKEDIN_SUBSCRIBER_COUNT=660 in .env.local');
      console.log('2. Set LINKEDIN_SESSION_COOKIE with your li_at cookie value');
      console.log('3. Install puppeteer and uncomment the Puppeteer method');
      console.log(`\n📊 Keeping existing count: ${stats.linkedinSubscribers.count}`);
    }

    return stats;
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  const fetcher = new LinkedInStatsFetcher();
  fetcher.updateStats()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

export default LinkedInStatsFetcher;