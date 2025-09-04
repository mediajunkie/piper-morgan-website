# Sentry Error Tracking Setup Guide

## Overview
Sentry error tracking is configured for the Piper Morgan website using the free tier to monitor production errors and performance issues.

## Setup Instructions

### 1. Create Sentry Account
1. Go to [sentry.io](https://sentry.io) and create a free account
2. Create a new project for "Next.js"
3. Note your DSN, Organization, and Project name

### 2. Environment Variables
Add these to your production environment (GitHub Actions Secrets):

```bash
# Required for error tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@o000000.ingest.sentry.io/0000000
SENTRY_DSN=https://your-dsn@o000000.ingest.sentry.io/0000000

# Optional: For source map uploads in CI
SENTRY_ORG=your-org-name
SENTRY_PROJECT=piper-morgan-website
SENTRY_AUTH_TOKEN=your-auth-token
```

### 3. Configuration Details

#### Client Configuration (`sentry.client.config.js`)
- **Error Tracking**: Captures unhandled exceptions and promise rejections
- **Performance Monitoring**: Tracks Core Web Vitals and page load performance
- **Session Replay**: Records 10% of sessions, 100% with errors (for debugging)
- **Privacy**: Only enabled in production, filters out non-actionable errors

#### Server Configuration (`sentry.server.config.js`)
- **Server Errors**: Captures API route errors and build-time issues
- **Filtered Logging**: Excludes static export related errors that aren't actionable

#### Static Export Compatibility
- **Build Integration**: Source maps uploaded for better error tracking
- **Bundle Optimization**: Sentry code tree-shaken in production builds
- **Performance**: Minimal impact on bundle size and load times

## Features Implemented

### Error Monitoring
- JavaScript runtime errors
- Unhandled promise rejections  
- Network request failures
- Component rendering errors

### Performance Monitoring
- Core Web Vitals (CLS, FCP, LCP, FID)
- Page load times and navigation
- API response times
- Bundle size tracking

### Session Replay
- Visual recordings of user sessions with errors
- Helps debug complex interaction issues
- Privacy-focused (only captures errors)

### Smart Filtering
- Excludes common non-actionable errors (ad blockers, extensions)
- Filters out static export build warnings
- Focuses on genuine application issues

## Free Tier Limits
- **5,000 errors/month**: More than sufficient for most websites
- **10,000 performance transactions/month**: Covers typical usage
- **50 session replays/month**: Enough for debugging critical issues
- **30-day data retention**: Adequate for issue resolution

## Usage After Deployment

### Monitoring Dashboard
1. Go to your Sentry project dashboard
2. View real-time errors and performance metrics
3. Set up alerts for critical issues
4. Review weekly/monthly reports

### Error Resolution Workflow
1. **Receive Alert**: Email/Slack notification for new errors
2. **Investigate**: Use session replay and stack traces
3. **Fix**: Deploy fix and mark as resolved in Sentry
4. **Verify**: Confirm error rate decreases

### Performance Monitoring
- Track Core Web Vitals trends
- Monitor page load performance
- Identify slow database queries or API calls
- Optimize based on real user data

## Security & Privacy
- **No PII Collection**: Sentry configured to avoid personal data
- **Production Only**: Error tracking disabled in development
- **Minimal Data**: Only collects technical error information
- **User Control**: Respects Do Not Track preferences

This implementation provides professional-grade error monitoring while maintaining the $0 stack approach through Sentry's generous free tier.