'use client';

import React, { Component, ReactNode } from 'react';
import { CTAButton } from '@/components/atoms/CTAButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Fallback blog posts for when RSS feed is unavailable
const fallbackBlogPosts = [
  {
    title: "Building Piper Morgan: A Systematic Approach to AI-Powered Product Management",
    excerpt: "How we're developing a methodology that combines human intuition with AI augmentation for more effective product management. Our journey from concept to systematic framework.",
    publishedAt: "Aug 2024",
    readingTime: "6 min read",
    tags: ["Building in Public", "AI", "Product Management"],
    url: "https://medium.com/building-piper-morgan",
    author: "Christian Crumlish"
  },
  {
    title: "The Excellence Flywheel: Systematic Patterns That Scale",
    excerpt: "Discover the repeating patterns that create systematic excellence in product development. How small, consistent improvements compound into breakthrough methodologies.",
    publishedAt: "Aug 2024",
    readingTime: "5 min read",
    tags: ["Methodology", "Systems Thinking"],
    url: "https://medium.com/building-piper-morgan",
    author: "Christian Crumlish"
  },
  {
    title: "Transparent Development: What We've Learned Building in Public",
    excerpt: "Insights from our transparent development approach. The unexpected benefits of open methodology development and community-driven feedback loops.",
    publishedAt: "Jul 2024",
    readingTime: "7 min read",
    tags: ["Building in Public", "Community"],
    url: "https://medium.com/building-piper-morgan",
    author: "Christian Crumlish"
  }
];

class BlogErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for development
    console.error('Blog Error Boundary caught an error:', error, errorInfo);
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
        <section id="recent-posts" className="py-16">
          <div className="site-container">
            <div className="max-w-6xl mx-auto">
              {/* Error Notice */}
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-card mb-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">Blog Content Temporarily Unavailable</h3>
                    <p className="text-yellow-700 mt-1">
                      We're experiencing difficulty loading the latest posts. Here are some recent highlights while we resolve this.
                    </p>
                  </div>
                  <button
                    onClick={this.handleRetry}
                    className="ml-auto px-4 py-2 bg-yellow-600 text-white rounded-button text-sm hover:bg-yellow-700"
                  >
                    Retry
                  </button>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold text-text-dark mb-6">
                  Building-in-Public Updates
                </h2>
                <p className="text-xl text-text-light">
                  Deep dives into our methodology breakthroughs, systematic excellence patterns, and transparent AI-powered product management development.
                </p>
              </div>

              {/* Fallback Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {fallbackBlogPosts.map((post, index) => (
                  <article key={index} className="bg-white rounded-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-text-dark mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-text-light mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-text-light mb-4">
                        <span>By {post.author}</span>
                        <div className="flex items-center gap-4">
                          <span>{post.publishedAt}</span>
                          <span>•</span>
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-primary-teal/10 text-primary-teal-text rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <CTAButton
                        href={post.url}
                        variant="outline"
                        size="sm"
                        external
                        className="w-full"
                      >
                        Read on Medium
                      </CTAButton>
                    </div>
                  </article>
                ))}
              </div>

              {/* Medium Integration Notice */}
              <div className="bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 p-8 rounded-card">
                <h3 className="text-2xl font-semibold text-text-dark mb-4">
                  Full Building-in-Public Collection on Medium
                </h3>
                <p className="text-text-light mb-6">
                  All our building-in-public content is published on Medium. Visit our publication directly for the complete collection and latest updates.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <CTAButton
                    href="https://medium.com/building-piper-morgan"
                    variant="primary"
                    size="lg"
                    external
                  >
                    Visit Our Medium Publication
                  </CTAButton>
                  <CTAButton
                    href="https://medium.com/@mediajunkie"
                    variant="outline"
                    size="lg"
                    external
                  >
                    Follow Christian on Medium
                  </CTAButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default BlogErrorBoundary;