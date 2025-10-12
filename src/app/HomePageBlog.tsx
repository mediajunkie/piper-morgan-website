'use client';

import { BlogPostCard, CTAButton } from '@/components';
import mediumPostsRaw from '@/data/medium-posts.json';

// Format date helper
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Extract reading time helper
function extractReadingTime(content: string): string {
  const match = content?.match(/(\d+)\s*min\s*read/i);
  return match ? `${match[1]} min read` : '5 min read';
}

// Extract post ID from URL
function extractPostId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

// Transform posts to expected format
const mediumPosts = mediumPostsRaw.map((post: any) => {
  const postId = extractPostId(post.guid || post.link);

  return {
    ...post,
    excerpt: post.contentSnippet || post.content?.substring(0, 200) || '',
    url: `/blog/${postId}`,
    mediumUrl: post.link,
    publishedAt: formatDate(post.pubDate || post.isoDate),
    readingTime: extractReadingTime(post.content || ''),
    tags: post.categories || ['Building in Public'],
    featuredImage: post.thumbnail
  };
});

export default function HomePageBlog() {
  // Use the first 3 posts for the homepage
  const featuredPosts = mediumPosts.slice(0, 3);

  return (
    <section className="py-16">
      <div className="site-container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-dark mb-6">
              Learning project that grew wings
            </h2>
            <p className="text-xl text-text-light mb-8">
              What started as a systematic experiment in AI-assisted product management has evolved into a comprehensive methodology for PM excellence. Follow along as we build infrastructure, solve real problems, and share everything we learn.
            </p>
            <div className="text-left max-w-3xl mx-auto mb-8">
              <h3 className="text-lg font-semibold text-text-dark mb-4">Recent Highlights:</h3>
              <ul className="space-y-2 text-text-light">
                <li>• Ethics-first architecture that makes inappropriate responses technically impossible</li>
                <li>• 15-minute implementation cycles (previously 2+ hours) through systematic verification</li>
                <li>• Zero architectural drift across 50+ feature implementations</li>
                <li>• 100% test coverage maintained during rapid development</li>
              </ul>
            </div>
          </div>

          {/* Recent Blog Posts - Live from RSS */}
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
                featuredImage={post.featuredImage}
                compact
              />
            ))}
          </div>

          <div className="text-center">
            <CTAButton
              href="/blog"
              variant="outline"
              size="lg"
            >
              View All Building-in-Public Updates
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
