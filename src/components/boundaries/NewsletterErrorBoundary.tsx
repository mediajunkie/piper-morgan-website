'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class NewsletterErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for development
    console.error('Newsletter Error Boundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or use provided fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-surface p-8 rounded-card">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-text-dark mb-4">
              Newsletter Temporarily Unavailable
            </h3>
            <p className="text-text-light mb-6">
              We're experiencing some technical difficulties with our newsletter signup. Please try again in a few moments, or reach out to us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-primary-teal text-white rounded-button hover:bg-primary-teal/90 transition-colors"
              >
                Try Again
              </button>
              <a
                href="https://medium.com/building-piper-morgan"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-primary-teal text-primary-teal-text rounded-button hover:bg-primary-teal/5 transition-colors text-center"
              >
                Follow on Medium Instead
              </a>
            </div>
            <p className="text-sm text-text-light mt-4">
              You can also follow our updates directly on Medium while we resolve this issue.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default NewsletterErrorBoundary;