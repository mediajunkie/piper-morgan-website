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

// Blog post from Medium RSS
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
