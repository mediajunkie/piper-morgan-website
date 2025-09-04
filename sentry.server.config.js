import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',
  
  // Environment configuration
  environment: process.env.NODE_ENV,
  
  // Server-specific integrations
  integrations: [
    // Add any server-specific integrations here
  ],
  
  // Before send hook to filter out non-critical errors
  beforeSend(event, hint) {
    // Filter out known non-critical build/server errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && error.message) {
        // Filter out static export related errors that aren't actionable
        if (error.message.includes('ENOENT') ||
            error.message.includes('Cannot read properties of undefined')) {
          return null;
        }
      }
    }
    return event;
  }
});