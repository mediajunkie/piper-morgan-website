import { trackBlogClick } from '@/lib/analytics';
import { getEpisode, getEpisodeNumber } from '@/lib/episodes';

export interface BlogPostCardProps {
  /** Blog post title */
  title: string;
  /** Post excerpt or description */
  excerpt: string;
  /** Publication date (when posted to Medium) */
  publishedAt: string;
  /** Work date (when the work actually happened) - Phase 6 */
  workDate?: string;
  /** Category (building or insight) - Phase 7 */
  category?: 'building' | 'insight';
  /** Episode/cluster slug - Phase 9 */
  cluster?: string;
  /** Estimated reading time */
  readingTime?: string;
  /** Post tags */
  tags?: string[];
  /** Link to full post */
  href: string;
  /** External link (opens in new tab) */
  external?: boolean;
  /** Author name */
  author?: string;
  /** Featured image URL */
  featuredImage?: string;
  /** Compact layout variant */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function BlogPostCard({
  title,
  excerpt,
  publishedAt,
  workDate,
  category,
  cluster,
  readingTime,
  tags = [],
  href,
  external = false,
  author = 'Christian Crumlish',
  featuredImage,
  compact = false,
  className = '',
}: BlogPostCardProps) {

  const handleBlogClick = () => {
    trackBlogClick(title, href, 'blog_page');
  };

  const cardClasses = [
    'bg-white dark:bg-dark-surface rounded-card shadow-component hover:shadow-component-hover transition-all duration-200',
    'border border-gray-100 dark:border-gray-800 hover:border-primary-teal/20 dark:hover:border-primary-teal/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/50',
    'overflow-hidden group',
    className,
  ].filter(Boolean).join(' ');

  return (
    <article className={cardClasses}>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="flex flex-col h-full cursor-pointer"
        onClick={handleBlogClick}
      >
        {/* Featured Image */}
        {featuredImage && (
          <div className="relative w-full h-48 md:h-56 bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}

        <div className={`flex flex-col flex-grow ${compact ? 'p-6' : 'p-8'}`}>
          {/* Metadata Badges (Phase 7 & 9) */}
          {(category || cluster) && (
            <div className="mb-3 flex flex-wrap gap-2">
              {/* Category Badge */}
              {category && (
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  category === 'building'
                    ? 'bg-primary-teal/10 dark:bg-primary-teal/20 text-primary-teal-text dark:text-primary-teal'
                    : 'bg-primary-orange/10 dark:bg-primary-orange/20 text-primary-orange-text dark:text-primary-orange'
                }`}>
                  {category === 'building' ? 'Building' : 'Insight'}
                </span>
              )}

              {/* Episode Badge (Phase 9) */}
              {cluster && (() => {
                const episode = getEpisode(cluster);
                const episodeNum = getEpisodeNumber(cluster);
                return episode ? (
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Episode {episodeNum}
                  </span>
                ) : null;
              })()}
            </div>
          )}

          {/* Title */}
          <h3 className={`font-bold text-text-dark dark:text-dark-text leading-tight group-hover:text-primary-teal-text dark:group-hover:text-primary-teal transition-colors flex-grow ${
            compact ? 'text-lg' : 'text-xl md:text-2xl'
          }`}>
            {title}
          </h3>

          {/* Footer */}
          <div className="mt-auto pt-6">
            {/* Temporal Metadata (Phase 6: Work Date Chronology) */}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3 flex-wrap gap-x-2 gap-y-1">
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

            {/* Read More Link */}
            <div className="text-primary-teal-text dark:text-primary-teal font-medium text-sm group-hover:underline">
              Read More →
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}

export default BlogPostCard;
