import { CTAButton } from '@/components';
import { trackBlogClick } from '@/lib/analytics';
import { getEpisode, getEpisodeNumber } from '@/lib/episodes';

export interface FeaturedPostProps {
  /** Blog post title */
  title: string;
  /** Post excerpt or description */
  excerpt: string;
  /** Work date (when the work actually happened) */
  workDate?: string;
  /** Publication date */
  publishedAt: string;
  /** Category (building or insight) */
  category?: 'building' | 'insight';
  /** Episode/cluster slug */
  cluster?: string;
  /** Estimated reading time */
  readingTime?: string;
  /** Link to full post */
  href: string;
  /** Author name */
  author?: string;
  /** Featured image URL */
  featuredImage?: string;
}

export function FeaturedPost({
  title,
  excerpt,
  workDate,
  publishedAt,
  category,
  cluster,
  readingTime,
  href,
  author = 'Christian Crumlish',
  featuredImage,
}: FeaturedPostProps) {
  const handleClick = () => {
    trackBlogClick(title, href, 'featured_homepage');
  };

  const episode = cluster ? getEpisode(cluster) : null;
  const episodeNumber = cluster ? getEpisodeNumber(cluster) : null;

  return (
    <section className="bg-gradient-to-br from-primary-teal/10 via-primary-orange/10 to-primary-teal/10 py-16 md:py-24">
      <div className="site-container">
        <div className="max-w-7xl mx-auto">
          {/* Featured Badge */}
          <div className="flex items-center justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-teal text-white font-semibold rounded-full text-sm shadow-md">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured Article
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Content */}
            <div className="order-2 md:order-1">
              {/* Metadata Badges */}
              {(category || cluster) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {category && (
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      category === 'building'
                        ? 'bg-primary-teal/20 text-primary-teal-text dark:text-primary-teal'
                        : 'bg-primary-orange/20 text-primary-orange-text dark:text-primary-orange'
                    }`}>
                      {category === 'building' ? 'Building' : 'Insight'}
                    </span>
                  )}
                  {episode && episodeNumber && (
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      Episode {episodeNumber}
                    </span>
                  )}
                </div>
              )}

              {/* Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-dark dark:text-dark-text leading-tight mb-4">
                {title}
              </h2>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-lg md:text-xl text-text-light dark:text-gray-300 mb-6 line-clamp-3">
                  {excerpt}
                </p>
              )}

              {/* Temporal Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-8">
                {workDate && workDate !== publishedAt ? (
                  <>
                    <span className="text-primary-teal-text dark:text-primary-teal font-medium">Work:</span>
                    <time dateTime={workDate}>{workDate}</time>
                    <span className="text-gray-400 dark:text-gray-600">•</span>
                    <span className="text-gray-500 dark:text-gray-500">Published:</span>
                    <time dateTime={publishedAt}>{publishedAt}</time>
                  </>
                ) : (
                  <time dateTime={publishedAt}>{publishedAt}</time>
                )}
                {readingTime && (
                  <>
                    <span className="text-gray-400 dark:text-gray-600">•</span>
                    <span>{readingTime}</span>
                  </>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <CTAButton
                  href={href}
                  variant="primary"
                  size="lg"
                  onClick={handleClick}
                >
                  Read Full Article
                </CTAButton>
                <CTAButton
                  href="/blog"
                  variant="outline"
                  size="lg"
                >
                  View All Posts
                </CTAButton>
              </div>
            </div>

            {/* Featured Image */}
            <div className="order-1 md:order-2">
              {featuredImage && (
                <div className="relative w-full aspect-video md:aspect-square rounded-card overflow-hidden shadow-lg group">
                  <img
                    src={featuredImage}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                  {/* Gradient overlay for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedPost;
