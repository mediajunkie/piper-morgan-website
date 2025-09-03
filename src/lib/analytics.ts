// Google Analytics 4 Integration
// Privacy-compliant implementation for static export

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'consent',
      targetId: string | Date | 'default' | 'update',
      config?: {
        [key: string]: any;
      }
    ) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export function initGA() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  // Set current date
  window.gtag('js', new Date());

  // Configure privacy-friendly settings
  window.gtag('config', GA_MEASUREMENT_ID, {
    // Privacy-compliant settings
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    
    // Performance and tracking settings
    page_title: document.title,
    page_location: window.location.href,
    
    // Custom parameters for Piper Morgan
    custom_map: {
      custom_parameter_1: 'source_page',
      custom_parameter_2: 'user_engagement'
    }
  });

  console.log('✅ Google Analytics initialized:', GA_MEASUREMENT_ID);
}

// Track page views
export function trackPageView(url?: string, title?: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'page_view', {
    page_title: title || document.title,
    page_location: url || window.location.href,
    page_path: url ? new URL(url).pathname : window.location.pathname,
  });
}

// Track newsletter signups with source attribution
export function trackNewsletterSignup(source: string, method: string = 'website_form') {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'newsletter_signup', {
    event_category: 'engagement',
    event_label: source,
    method: method,
    source_page: source,
    value: 1, // Conversion value
  });

  console.log('📊 Newsletter signup tracked:', { source, method });
}

// Track blog post clicks
export function trackBlogClick(postTitle: string, postUrl: string, source: string = 'blog_page') {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'blog_click', {
    event_category: 'content',
    event_label: postTitle,
    blog_post_title: postTitle,
    blog_post_url: postUrl,
    source_page: source,
    value: 1,
  });

  console.log('📊 Blog click tracked:', { postTitle, source });
}

// Track CTA button clicks
export function trackCTAClick(ctaText: string, ctaUrl: string, source: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'cta_click', {
    event_category: 'navigation',
    event_label: ctaText,
    cta_text: ctaText,
    cta_url: ctaUrl,
    source_page: source,
    value: 1,
  });

  console.log('📊 CTA click tracked:', { ctaText, source });
}

// Track scroll depth (for engagement measurement)
export function trackScrollDepth(depth: number, page: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', 'scroll', {
    event_category: 'engagement',
    event_label: `${depth}%`,
    scroll_depth: depth,
    page_path: page,
  });
}

// Track performance metrics
export function trackWebVitals(metric: {
  name: string;
  value: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', metric.name, {
    event_category: 'web_vitals',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_rating: metric.rating,
    non_interaction: true,
  });

  console.log('📊 Web Vital tracked:', metric);
}

// Privacy-compliant consent management
export function updateConsent(granted: boolean) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied', // Always deny ads for privacy
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  console.log('🔒 Analytics consent updated:', granted);
}

// Check if GA is loaded and ready
export function isGAReady(): boolean {
  return !!(
    GA_MEASUREMENT_ID && 
    typeof window !== 'undefined' && 
    window.gtag
  );
}

// Get current GA measurement ID (for debugging)
export function getGAId(): string | undefined {
  return GA_MEASUREMENT_ID;
}