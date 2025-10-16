'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BlogPostCard, NewsletterSignup, NewsletterErrorBoundary, BlogErrorBoundary, CTAButton, Pagination } from '@/components';
import mediumPosts from '@/data/medium-posts.json';
import { sortByWorkDate } from '@/lib/blog-utils';
import { EPISODES, getEpisodeCounts } from '@/lib/episodes';

const POSTS_PER_PAGE = 24;

// Sort posts by work date (chronological order of when work happened)
const allSortedPosts = sortByWorkDate(mediumPosts, 'desc');

interface BlogContentProps {
  currentPage?: number;
}

type Category = 'all' | 'building' | 'insight';
type ViewMode = 'list' | 'grouped';

export default function BlogContent({ currentPage = 1 }: BlogContentProps) {
  // Get URL search parameters
  const searchParams = useSearchParams();

  // Phase 7: Category filtering state
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  // Phase 9: Episode filtering state
  const [selectedEpisode, setSelectedEpisode] = useState<string>('all');

  // Phase 9: View mode state (list vs. grouped by episode)
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Handle URL parameters for episode filtering
  useEffect(() => {
    const episodeParam = searchParams.get('episode');
    if (episodeParam && EPISODES.some(ep => ep.slug === episodeParam)) {
      setSelectedEpisode(episodeParam);
    }
  }, [searchParams]);

  // Filter posts by category and episode
  let filteredPosts = allSortedPosts;

  // Apply category filter
  if (selectedCategory !== 'all') {
    filteredPosts = filteredPosts.filter((post: any) => post.category === selectedCategory);
  }

  // Apply episode filter
  if (selectedEpisode !== 'all') {
    filteredPosts = filteredPosts.filter((post: any) => post.cluster === selectedEpisode);
  }

  // Calculate pagination (using filtered posts)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const totalPosts = filteredPosts.length;

  // Category counts
  const buildingCount = allSortedPosts.filter((p: any) => p.category === 'building').length;
  const insightCount = allSortedPosts.filter((p: any) => p.category === 'insight').length;

  // Episode counts
  const episodeCounts = getEpisodeCounts(allSortedPosts);

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
                    style={selectedCategory === 'all' ? { backgroundColor: '#2DD4BF', color: '#FFFFFF' } : undefined}
                    className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === 'all'
                        ? 'shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    All Posts ({allSortedPosts.length})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('building')}
                    style={selectedCategory === 'building' ? { backgroundColor: '#2DD4BF', color: '#FFFFFF' } : undefined}
                    className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === 'building'
                        ? 'shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Building ({buildingCount})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('insight')}
                    style={selectedCategory === 'insight' ? { backgroundColor: '#2DD4BF', color: '#FFFFFF' } : undefined}
                    className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === 'insight'
                        ? 'shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Insights ({insightCount})
                  </button>
                </div>

                {/* Phase 9: Episode Filter & View Controls */}
                <div className="mb-6 space-y-4">
                  {/* Episode Filter and View Mode Toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <label htmlFor="episode-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Filter by Episode
                      </label>
                      <select
                        id="episode-filter"
                        value={selectedEpisode}
                        onChange={(e) => setSelectedEpisode(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                      >
                        <option value="all">All Episodes ({allSortedPosts.length} posts)</option>
                        {EPISODES.map((episode) => (
                          <option key={episode.slug} value={episode.slug}>
                            {episode.shortName} ({episodeCounts[episode.slug] || 0} posts)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      {/* View Mode Toggle */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <button
                          onClick={() => setViewMode('list')}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'list'
                              ? 'bg-white dark:bg-gray-700 text-primary-teal-text shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                          }`}
                          title="List view"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setViewMode('grouped')}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'grouped'
                              ? 'bg-white dark:bg-gray-700 text-primary-teal-text shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                          }`}
                          title="Grouped by episode"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </button>
                      </div>

                      <CTAButton
                        href="/blog/episodes"
                        variant="outline"
                        size="sm"
                      >
                        View All Episodes
                      </CTAButton>
                    </div>
                  </div>
                </div>

                {/* Post Count Indicator */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalPosts)} of {totalPosts} {selectedCategory !== 'all' ? `${selectedCategory} ` : ''}posts
                </p>
              </div>

              {/* Posts Display - List or Grouped View */}
              {viewMode === 'list' ? (
                /* List View - Grid of posts */
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
                      cluster={post.cluster}
                    />
                  ))}
                </div>
              ) : (
                /* Grouped View - Posts grouped by episode */
                <div className="space-y-12 mb-12">
                  {EPISODES.map((episode) => {
                    const episodePosts = filteredPosts.filter((post: any) => post.cluster === episode.slug);
                    if (episodePosts.length === 0) return null;

                    const episodeNum = EPISODES.indexOf(episode) + 1;

                    return (
                      <div key={episode.slug} className="space-y-6">
                        {/* Episode Header */}
                        <div className="border-l-4 border-primary-teal pl-6 py-2">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="inline-block px-3 py-1 bg-primary-teal/10 dark:bg-primary-teal/20 text-primary-teal-text font-semibold rounded-full text-sm">
                              Episode {episodeNum}
                            </span>
                            <h3 className="text-2xl font-bold text-text-dark">
                              {episode.shortName}
                            </h3>
                          </div>
                          <p className="text-text-light text-sm mb-2">
                            {episode.description}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(episode.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {' - '}
                            {new Date(episode.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {' • '}
                            {episodePosts.length} {episodePosts.length === 1 ? 'post' : 'posts'}
                          </p>
                        </div>

                        {/* Episode Posts Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {episodePosts.map((post: any, index: number) => (
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
                              cluster={post.cluster}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

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
