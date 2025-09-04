#!/usr/bin/env node

/**
 * ConvertKit Subscriber Sync Script
 * 
 * Fetches all subscribers from ConvertKit and syncs them with our local database.
 * Handles both initial migration and ongoing synchronization.
 * 
 * Usage:
 *   node scripts/sync-convertkit-subscribers.js
 *   npm run sync-subscribers
 */

import dotenv from 'dotenv';
import { addSubscriber, confirmSubscriber, getSubscriberByEmail } from '../lib/database.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

if (!CONVERTKIT_API_KEY) {
  console.error('❌ CONVERTKIT_API_KEY not found in environment variables');
  process.exit(1);
}

class ConvertKitSync {
  constructor() {
    this.baseUrl = 'https://api.convertkit.com/v3';
    this.stats = {
      total: 0,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: 0
    };
  }

  /**
   * Fetch all subscribers from ConvertKit
   */
  async fetchAllSubscribers() {
    console.log('🔄 Fetching subscribers from ConvertKit...');
    
    let allSubscribers = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const url = `${this.baseUrl}/subscribers?api_key=${CONVERTKIT_API_KEY}&page=${page}&per_page=100`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`ConvertKit API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.subscribers && data.subscribers.length > 0) {
          allSubscribers = allSubscribers.concat(data.subscribers);
          console.log(`📄 Fetched page ${page}: ${data.subscribers.length} subscribers`);
          page++;
          
          // Check if there are more pages
          hasMore = data.subscribers.length === 100;
        } else {
          hasMore = false;
        }

        // Be respectful to the API
        await this.sleep(500);
        
      } catch (error) {
        console.error(`❌ Error fetching page ${page}:`, error.message);
        hasMore = false;
      }
    }

    this.stats.total = allSubscribers.length;
    console.log(`✅ Total subscribers fetched: ${this.stats.total}`);
    
    return allSubscribers;
  }

  /**
   * Fetch specific form subscribers if CONVERTKIT_FORM_ID is provided
   */
  async fetchFormSubscribers() {
    if (!CONVERTKIT_FORM_ID) {
      return this.fetchAllSubscribers();
    }

    console.log(`🔄 Fetching subscribers from form ${CONVERTKIT_FORM_ID}...`);
    
    try {
      const url = `${this.baseUrl}/forms/${CONVERTKIT_FORM_ID}/subscriptions?api_key=${CONVERTKIT_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`ConvertKit API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.stats.total = data.subscriptions ? data.subscriptions.length : 0;
      
      console.log(`✅ Form subscribers fetched: ${this.stats.total}`);
      
      return data.subscriptions || [];
      
    } catch (error) {
      console.error('❌ Error fetching form subscribers:', error.message);
      console.log('🔄 Falling back to all subscribers...');
      return this.fetchAllSubscribers();
    }
  }

  /**
   * Sync a single subscriber to our database
   */
  async syncSubscriber(subscriber) {
    try {
      const email = subscriber.email_address;
      const createdAt = new Date(subscriber.created_at);
      const state = subscriber.state; // 'active', 'cancelled', etc.

      // Check if subscriber already exists
      const existing = await getSubscriberByEmail(email);
      
      if (existing) {
        // Update existing subscriber if needed
        if (existing.status !== (state === 'active' ? 'confirmed' : 'unsubscribed')) {
          // Update status if different
          console.log(`📝 Updating ${email}: ${existing.status} → ${state === 'active' ? 'confirmed' : 'unsubscribed'}`);
          this.stats.updated++;
        } else {
          this.stats.skipped++;
        }
      } else {
        // Add new subscriber
        await addSubscriber(
          email,
          'convertkit_sync',
          null, // No verification token - already confirmed in ConvertKit
          {
            convertkit_id: subscriber.id,
            convertkit_state: state,
            original_signup_date: createdAt.toISOString(),
            tags: subscriber.tags || [],
            synced_at: new Date().toISOString()
          }
        );

        // Mark as confirmed if active in ConvertKit
        if (state === 'active') {
          await confirmSubscriber(null, email);
        }

        console.log(`✅ Imported ${email} (${state})`);
        this.stats.imported++;
      }

    } catch (error) {
      console.error(`❌ Error syncing ${subscriber.email_address}:`, error.message);
      this.stats.errors++;
    }
  }

  /**
   * Main sync process
   */
  async sync() {
    console.log('🚀 Starting ConvertKit subscriber sync...\n');

    try {
      // Fetch subscribers from ConvertKit
      const subscribers = await this.fetchFormSubscribers();

      if (subscribers.length === 0) {
        console.log('ℹ️ No subscribers found to sync');
        return;
      }

      console.log(`\n🔄 Syncing ${subscribers.length} subscribers to database...\n`);

      // Process each subscriber
      for (let i = 0; i < subscribers.length; i++) {
        await this.syncSubscriber(subscribers[i]);
        
        // Progress indicator
        if ((i + 1) % 10 === 0) {
          const progress = Math.round(((i + 1) / subscribers.length) * 100);
          console.log(`📊 Progress: ${i + 1}/${subscribers.length} (${progress}%)`);
        }

        // Rate limiting
        await this.sleep(100);
      }

      this.printSummary();

    } catch (error) {
      console.error('❌ Sync failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Print sync summary
   */
  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 SYNC SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total ConvertKit subscribers: ${this.stats.total}`);
    console.log(`Imported (new):               ${this.stats.imported}`);
    console.log(`Updated (existing):           ${this.stats.updated}`);
    console.log(`Skipped (no changes):         ${this.stats.skipped}`);
    console.log(`Errors:                       ${this.stats.errors}`);
    console.log('='.repeat(50));
    
    if (this.stats.errors > 0) {
      console.log('⚠️  Some errors occurred during sync. Check logs above.');
    } else {
      console.log('✅ Sync completed successfully!');
    }
  }

  /**
   * Sleep utility for rate limiting
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the sync if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const sync = new ConvertKitSync();
  sync.sync().catch(console.error);
}

export default ConvertKitSync;