# Google Analytics 4 Integration Guide

## Overview
Privacy-compliant Google Analytics 4 integration for the Piper Morgan website, compatible with static export deployment and $0 stack requirements.

## Features Implemented

### ✅ **Privacy-First Configuration**
- **Analytics consent granted by default** (can be modified for stricter compliance)
- **Ad storage and personalization denied** by default
- **IP anonymization enabled**
- **Google signals disabled** (no cross-device tracking)
- **No ad personalization signals**

### ✅ **Event Tracking**
- **Newsletter signups** with source attribution
- **Blog post clicks** with post title and URL
- **Page views** with custom parameters
- **CTA clicks** (ready for implementation)
- **Web Vitals performance metrics** (ready for implementation)

### ✅ **Static Export Compatibility**
- Uses Next.js `<Script>` component with proper loading strategy
- Client-side initialization only when GA_MEASUREMENT_ID is present
- No server-side dependencies
- Works with GitHub Pages deployment

## Setup Instructions

### 1. Get Google Analytics 4 Measurement ID
1. Create a Google Analytics 4 property
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to your environment variables

### 2. Environment Configuration
Add to `.env.local`:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important**: The `NEXT_PUBLIC_` prefix makes this available in the browser (required for static export).

### 3. Verify Integration
1. Deploy your site
2. Visit Google Analytics Real-Time reports
3. Check that page views and events are tracking
4. Verify privacy settings in GA4 dashboard

## Event Tracking Details

### Newsletter Signup Events
```javascript
trackNewsletterSignup('get-involved', 'direct_convertkit_form');
```
**Data captured**:
- `source_page`: Where the signup originated
- `method`: How they signed up
- `event_category`: 'engagement'
- `value`: 1 (conversion value)

### Blog Click Events
```javascript
trackBlogClick('Post Title', 'https://medium.com/...', 'blog_page');
```
**Data captured**:
- `blog_post_title`: Title of clicked post
- `blog_post_url`: URL of clicked post
- `source_page`: Where the click originated
- `event_category`: 'content'

### Page View Events
```javascript
trackPageView('/about', 'About - Piper Morgan');
```
**Data captured**:
- `page_title`: Page title
- `page_location`: Full URL
- `page_path`: URL path only

## Privacy Compliance

### GDPR Considerations
- **Consent defaults**: Analytics storage granted, ads denied
- **User control**: Ready for consent management system integration
- **Data retention**: Configured in GA4 dashboard (recommend 14 months max)
- **IP anonymization**: Enabled by default

### Update Consent Function
```javascript
import { updateConsent } from '@/lib/analytics';

// Grant full consent
updateConsent(true);

// Revoke consent  
updateConsent(false);
```

## Performance Impact
- **Script loading**: After page interactive (`strategy="afterInteractive"`)
- **Bundle size**: ~0 increase (external script)
- **Network requests**: 2 additional (gtag.js + config)
- **Performance**: <50ms initialization time

## Custom Dimensions Available

The integration supports custom dimensions for:
- `source_page`: Track conversion attribution
- `user_engagement`: Measure interaction depth
- `blog_post_title`: Content performance
- `cta_text`: Button effectiveness

## Advanced Features Ready for Implementation

### Web Vitals Tracking
```javascript
import { trackWebVitals } from '@/lib/analytics';

// Automatic Web Vitals tracking
trackWebVitals({
  name: 'CLS',
  value: 0.1,
  id: 'unique-id',
  rating: 'good'
});
```

### Scroll Depth Tracking  
```javascript
import { trackScrollDepth } from '@/lib/analytics';

// Track 25%, 50%, 75%, 100% scroll milestones
trackScrollDepth(50, '/how-it-works');
```

### CTA Click Tracking
```javascript
import { trackCTAClick } from '@/lib/analytics';

trackCTAClick('See How It Works', '/how-it-works', 'homepage');
```

## Debugging

### Check if GA4 is loaded
```javascript
import { isGAReady, getGAId } from '@/lib/analytics';

console.log('GA Ready:', isGAReady());
console.log('GA ID:', getGAId());
```

### Browser Console
- Look for `✅ Google Analytics initialized: G-XXXXXXXXXX`
- Check `Network` tab for gtag.js and collect requests
- Use GA4 DebugView in Google Analytics dashboard

## Cost Considerations

### Google Analytics 4 Free Tier
- **10 million events/month**: Free forever
- **Standard reporting**: All features included
- **Data retention**: Up to 14 months
- **Export capabilities**: BigQuery integration (free quota)

### Upgrade Triggers
- **Analytics Intelligence**: $150,000+ revenue requirement
- **Advanced features**: Large enterprise needs only
- **Current usage**: Well within free limits

## Security Considerations

- **No API keys exposed**: Only measurement ID in public environment
- **Content Security Policy**: Add GA domains to CSP if implemented
- **Data processing**: EU/US data processing agreements handled by Google
- **Privacy controls**: User consent framework ready

This implementation balances comprehensive tracking with privacy compliance and maintains the $0 stack approach while providing professional-grade analytics capabilities.