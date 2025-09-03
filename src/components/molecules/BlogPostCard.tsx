import { CTAButton } from '@/components/atoms/CTAButton';
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
  compact = false,
  className = '',
}: BlogPostCardProps) {
  
  const handleBlogClick = () => {
    trackBlogClick(title, href, 'blog_page');
  };
  const cardClasses = [
    'bg-white rounded-card shadow-component hover:shadow-component-hover transition-all duration-200',
    'border border-gray-100 hover:border-primary-teal/20',
    compact ? 'p-6' : 'p-8',
    className,
  ].filter(Boolean).join(' ');

  return (
    <article className={cardClasses}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <h3 className={`font-bold text-text-dark mb-3 leading-tight ${
            compact ? 'text-lg' : 'text-xl'
          }`}>
            <a
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="hover:text-primary-teal transition-colors"
            >
              {title}
              {external && <span className="ml-1 text-sm">↗</span>}
            </a>
          </h3>

          <p className={`text-text-light leading-relaxed ${
            compact ? 'text-sm' : 'text-base'
          }`}>
            {excerpt}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-primary-teal/10 text-primary-teal text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-text-light text-xs font-medium rounded-full">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm text-text-light mb-4">
            <div className="flex items-center space-x-4">
              <span>{author}</span>
              <span>•</span>
              <time dateTime={publishedAt}>{publishedAt}</time>
              {readingTime && (
                <>
                  <span>•</span>
                  <span>{readingTime}</span>
                </>
              )}
            </div>
          </div>

          <CTAButton
            href={href}
            external={external}
            variant="outline"
            size="sm"
            fullWidth={compact}
            onClick={handleBlogClick}
          >
            {external ? 'Read on Medium' : 'Read More'}
          </CTAButton>
        </div>
      </div>
    </article>
  );
}

export default BlogPostCard;
