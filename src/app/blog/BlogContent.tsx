'use client';

import { useState } from 'react';
import { BlogPostCard, NewsletterSignup, NewsletterErrorBoundary, BlogErrorBoundary, CTAButton, Pagination } from '@/components';
import mediumPosts from '@/data/medium-posts.json';
import { sortByWorkDate } from '@/lib/blog-utils';

const POSTS_PER_PAGE = 24;

// Sort posts by work date (chronological order of when work happened)
const allSortedPosts = sortByWorkDate(mediumPosts, 'desc');

interface BlogContentProps {
  currentPage?: number;
}

type Category = 'all' | 'building' | 'insight';

export default function BlogContent({ currentPage = 1 }: BlogContentProps) {
  // Phase 7: Category filtering state
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all'
    ? allSortedPosts
    : allSortedPosts.filter((post: any) => post.category === selectedCategory);

  // Calculate pagination (using filtered posts)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const totalPosts = filteredPosts.length;

  // Category counts
  const buildingCount = allSortedPosts.filter((p: any) => p.category === 'building').length;
  const insightCount = allSortedPosts.filter((p: any) => p.category === 'insight').length;

  return (
    <>
      {/* Recent Posts Section with Error Boundary */}
      <BlogErrorBoundary>
        <section id="recent-posts" className="py-16">
          <div className="site-container">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-text-dark mb-6">
                  Building-in-Public Updates
                </h2>
                <p className="text-xl text-text-light mb-6">
                  Deep dives into our methodology breakthroughs, systematic excellence patterns, and transparent AI-powered product management development. Learn from our systematic approach as we build it.
                </p>

                {/* Phase 7: Category Filter Tabs */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === 'all'
                        ? 'bg-primary-teal text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    All Posts ({allSortedPosts.length})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('building')}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === 'building'
                        ? 'bg-primary-teal text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Building ({buildingCount})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('insight')}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === 'insight'
                        ? 'bg-primary-teal text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Insights ({insightCount})
                  </button>
                </div>

                {/* Post Count Indicator */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalPosts)} of {totalPosts} {selectedCategory !== 'all' ? `${selectedCategory} ` : ''}posts
                </p>
              </div>

              {/* Posts Grid - Dynamically loaded from RSS */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedPosts.map((post: any, index: number) => (
                  <BlogPostCard
                    key={post.guid || index}
                    title={post.title}
                    excerpt={post.excerpt}
                    publishedAt={post.publishedAt}
                    workDate={post.workDate}
                    readingTime={post.readingTime}
                    tags={post.tags}
                    href={post.url}
                    author={post.author}
                    featuredImage={post.featuredImage}
                    category={post.category}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                className="mb-12"
              />

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
                  <p className="text-sm text-primary-teal-text mt-4 font-semibold">
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
