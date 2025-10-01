import { trackBlogClick } from '@/lib/analytics';

export interface BlogPostCardProps {
  /** Blog post title */
  title: string;
  /** Post excerpt or description */
  excerpt: string;
  /** Publication date */
  publishedAt: string;
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
    'bg-white rounded-card shadow-component hover:shadow-component-hover transition-all duration-200',
    'border border-gray-100 hover:border-primary-teal/20 hover:bg-gray-50/50',
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
          <div className="relative w-full h-48 md:h-56 bg-gray-100 overflow-hidden flex-shrink-0">
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}

        <div className={`flex flex-col flex-grow ${compact ? 'p-6' : 'p-8'}`}>
          {/* Tags Badge */}
          {tags.length > 0 && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-primary-teal/10 text-primary-teal-text text-xs font-medium rounded-full">
                {tags[0]}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className={`font-bold text-text-dark leading-tight group-hover:text-primary-teal-text transition-colors flex-grow ${
            compact ? 'text-lg' : 'text-xl md:text-2xl'
          }`}>
            {title}
          </h3>

          {/* Footer */}
          <div className="mt-auto pt-6">
            {/* Metadata with improved spacing */}
            <div className="flex items-center text-sm text-gray-600 mb-3 flex-wrap gap-x-2 gap-y-1">
              <time dateTime={publishedAt}>{publishedAt}</time>
              {readingTime && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>{readingTime}</span>
                </>
              )}
            </div>

            {/* Read More Link */}
            <div className="text-primary-teal-text font-medium text-sm group-hover:underline">
              Read More →
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}

export default BlogPostCard;
