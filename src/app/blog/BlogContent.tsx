'use client';

import { BlogPostCard, NewsletterSignup, NewsletterErrorBoundary, BlogErrorBoundary, CTAButton } from '@/components';
import mediumPosts from '@/data/medium-posts.json';

export default function BlogContent() {
  // Use the first 6 posts for the main grid
  const featuredPosts = mediumPosts.slice(0, 6);

  return (
    <>
      {/* Recent Posts Section with Error Boundary */}
      <BlogErrorBoundary>
        <section id="recent-posts" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-text-dark mb-6">
                  Building-in-Public Updates
                </h2>
                <p className="text-xl text-text-light">
                  Deep dives into our methodology breakthroughs, systematic excellence patterns, and transparent AI-powered product management development. Learn from our systematic approach as we build it.
                </p>
              </div>

              {/* Featured Posts Grid - Dynamically loaded from RSS */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredPosts.map((post, index) => (
                  <BlogPostCard
                    key={post.guid || index}
                    title={post.title}
                    excerpt={post.excerpt}
                    publishedAt={post.publishedAt}
                    readingTime={post.readingTime}
                    tags={post.tags}
                    href={post.url}
                    author={post.author}
                    external
                  />
                ))}
              </div>

              {/* Medium Integration Notice */}
              <div className="bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 p-8 rounded-card mb-12">
                <h3 className="text-2xl font-semibold text-text-dark mb-4">
                  Full Building-in-Public Collection on Medium
                </h3>
                <p className="text-text-light mb-6">
                  All our building-in-public content is published on Medium for wider reach and community engagement. Our publication focuses on systematic methodology, AI-augmented product management, and transparent development processes.
                </p>
                <div className="text-left max-w-3xl mx-auto mb-6">
                  <h4 className="font-semibold text-text-dark mb-3">Latest Posts (Live from RSS!):</h4>
                  <p className="text-sm text-text-light mb-3">
                    This page now automatically updates with our latest Medium articles. New posts appear here as soon as they're published!
                  </p>
                  <h4 className="font-semibold text-text-dark mb-3 mt-6">Key Series:</h4>
                  <ul className="space-y-2 text-text-light">
                    <li>• <strong>Building Piper Morgan:</strong> Core development series with methodology insights</li>
                    <li>• <strong>Systematic Excellence:</strong> Practical frameworks and implementation patterns</li>
                    <li>• <strong>AI-Augmented PM:</strong> Real experiences integrating AI into product management work</li>
                    <li>• <strong>Weekend Sprint Chronicles:</strong> Intensive development sessions with measured results</li>
                  </ul>
                  <p className="text-sm text-primary-teal mt-4 font-semibold">
                    ✅ RSS integration complete - posts update automatically!
                  </p>
                </div>
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
      </BlogErrorBoundary>

      {/* Newsletter CTA */}
      <section className="bg-text-dark py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <NewsletterErrorBoundary>
              <NewsletterSignup
                title="Get systematic excellence insights delivered weekly"
                description="Never miss a breakthrough discovery, methodology insight, or behind-the-scenes development update. Join 576+ PM professionals learning systematic excellence through our transparent building-in-public approach."
                benefits={[
                  "Weekly methodology insights and breakthrough discoveries",
                  "Behind-the-scenes development updates and decision rationale",
                  "Early access to new systematic frameworks and tools",
                  "Practical templates and patterns you can immediately apply",
                  "Direct insight into human-AI collaboration patterns that actually work"
                ]}
                background="dark"
                source="blog-post"
                metadata={{
                  page_context: "blog-content-engagement"
                }}
                privacyNotice="No spam, unsubscribe anytime. Join 576+ PM professionals learning systematic excellence."
              />
            </NewsletterErrorBoundary>
          </div>
        </div>
      </section>
    </>
  );
}
