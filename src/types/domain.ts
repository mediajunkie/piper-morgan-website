/**
 * Domain models for pipermorgan.ai website
 * Following Domain-Driven Design principles
 */

// Core SEO metadata type
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title: string;
    description: string;
    image?: string;
    url?: string;
  };
  twitter?: {
    card: 'summary' | 'summary_large_image';
    title: string;
    description: string;
    image?: string;
  };
  canonical?: string;
}

// Component props interface
export interface ComponentProps {
  [key: string]: unknown;
}

// Base component interface
export interface Component {
  id: string;
  type: string;
  props: ComponentProps;
  children?: Component[];
}

// Page domain model
export interface Page {
  slug: string;
  title: string;
  description: string;
  components: Component[];
  seoMetadata: SEOMetadata;
  publishedAt?: Date;
  updatedAt?: Date;
  status: 'draft' | 'published' | 'archived';
}

// Integration configuration
export interface IntegrationConfig {
  [key: string]: unknown;
}

// Integration types
export interface Integration {
  type: 'convertkit' | 'medium' | 'analytics';
  configuration: IntegrationConfig;
  status: 'active' | 'inactive';
  lastSync?: Date;
  errorCount?: number;
}

// ConvertKit specific configuration
export interface ConvertKitConfig extends IntegrationConfig {
  formId: string;
  apiKey?: string;
  successUrl?: string;
  errorMessage?: string;
}

// Medium RSS configuration
export interface MediumConfig extends IntegrationConfig {
  feedUrl: string;
  cacheDuration: number; // in minutes
  maxPosts: number;
}

// Google Analytics configuration
export interface AnalyticsConfig extends IntegrationConfig {
  measurementId: string;
  gtmId?: string;
  trackingEvents: string[];
}

// Main website content aggregator
export interface WebsiteContent {
  pages: Page[];
  components: Component[];
  integrations: Integration[];
  siteMetadata: {
    title: string;
    description: string;
    url: string;
    author: string;
    social: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
  };
}

// Blog post from Medium RSS (legacy shape — not currently used)
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  publishedAt: Date;
  author: string;
  readingTime?: number;
  tags: string[];
  url: string;
  mediumUrl: string;
  featuredImage?: string;
}

/**
 * MediumPost — the actual shape of entries in src/data/medium-posts.json.
 *
 * This file is heterogeneous: entries come from blog-first publishes
 * (guid prefix "blog-first-"), Medium RSS imports (guid like
 * "https://medium.com/p/..."), and the back-catalog archive. Most fields
 * are optional because not every code path populates them — only `guid`,
 * `title`, and `url` are reliably present across all entries.
 */
export interface MediumPost {
  // Reliably present
  title: string;
  guid: string;
  url: string;

  // Common metadata
  slug?: string;
  link?: string;
  author?: string;
  excerpt?: string;
  contentSnippet?: string;
  readingTime?: string;
  tags?: string[];
  categories?: string[];

  // Dates (multiple shapes — display strings + ISO strings)
  publishedAt?: string;
  publishedAtISO?: string;
  pubDate?: string;
  isoDate?: string;
  workDate?: string;
  workDateISO?: string;
  chatDate?: string;

  // Image fields
  featuredImage?: string;
  thumbnail?: string | null;
  imageAlt?: string;
  imageCaption?: string;
  imageSlug?: string;

  // Taxonomy
  category?: string;
  cluster?: string;
  featured?: boolean;

  // Source/origin
  source?: string;
  subtitle?: string;
  canonicalLink?: string;
  fullContent?: string;
  needsMetadata?: boolean;
  id?: string;
}

/**
 * BlogContentEntry — value shape in src/data/blog-content.json.
 *
 * Per skill v0.8: every entry must be a dict with title + content.
 * Optional fields appear on entries originating from Medium RSS imports
 * (canonicalLink, author, filename, etc.) and a few have a subtitle.
 */
export interface BlogContentEntry {
  title: string;
  content: string;
  subtitle?: string;
  // Fields present on RSS-import "fat" entries
  author?: string;
  canonicalLink?: string;
  publishedDate?: string;
  filename?: string;
}

// Newsletter signup data
export interface NewsletterSignup {
  email: string;
  source: 'homepage' | 'about' | 'blog' | 'newsletter';
  timestamp: Date;
  consent: boolean;
  interests?: string[];
}

// Site navigation structure
export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavigationItem[];
}

export interface SiteNavigation {
  primary: NavigationItem[];
  footer: NavigationItem[];
}

// Performance metrics
export interface PerformanceMetrics {
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    pwa?: number;
  };
  coreWebVitals: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    cls: number; // Cumulative Layout Shift
    fid?: number; // First Input Delay
    inp?: number; // Interaction to Next Paint
  };
  lastMeasured: Date;
}
