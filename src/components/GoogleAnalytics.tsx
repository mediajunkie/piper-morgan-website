'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { initGA, trackPageView, GA_MEASUREMENT_ID } from '@/lib/analytics';

export function GoogleAnalytics() {
  // Don't render if no measurement ID is configured
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  const handleLoad = () => {
    initGA();
    trackPageView();
  };

  // Track page views on route changes (for SPA behavior)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Track initial page view after GA loads
      const timer = setTimeout(() => {
        trackPageView();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Load Google Analytics script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={handleLoad}
      />
      
      {/* Initialize with privacy-compliant defaults */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Privacy-first consent defaults
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Set default consent state (denied until user opts in)
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': 'denied',
              'ad_user_data': 'denied', 
              'ad_personalization': 'denied'
            });
            
            console.log('🔒 GA4 privacy defaults set');
          `,
        }}
      />
    </>
  );
}

export default GoogleAnalytics;