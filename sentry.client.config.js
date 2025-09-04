import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Capture unhandled promise rejections
  captureUnhandledRejections: true,
  
  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',
  
  // Performance monitoring
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Capture 10% of all sessions,
      // plus 100% of sessions with an error
      sessionSampleRate: 0.1,
      errorSampleRate: 1.0,
    }),
  ],
  
  // Environment configuration
  environment: process.env.NODE_ENV,
  
  // Before send hook to filter out non-critical errors
  beforeSend(event, hint) {
    // Filter out known non-critical errors
    if (event.exception) {
      const error = hint.originalException;
      // Filter out network errors, ad blockers, etc.
      if (error && error.message) {
        if (error.message.includes('Non-Error promise rejection captured') ||
            error.message.includes('Script error') ||
            error.message.includes('Network Error')) {
          return null;
        }
      }
    }
    return event;
  }
});