'use client';

import Link from 'next/link';

interface ShipPost {
  title: string;
  slug: string;
  guid?: string;
  url?: string;
  publishedAt: string;
  publishedAtISO?: string;
  workDate?: string;
  author?: string;
  linkedinURL?: string;
}

interface ShipContent {
  title: string;
  content: string;
  subtitle?: string;
}

interface ShipPostContentProps {
  post: ShipPost;
  content: ShipContent | null;
}

export function ShipPostContent({ post, content }: ShipPostContentProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  // Extract ship number from title
  const shipNumber = post.title.match(/#(\d+)/)?.[1];

  // Extract week range from content (first line is usually "*March 20–31, 2026*")
  const extractWeekRange = (html: string): string | null => {
    const match = html.match(/<em>([A-Z][a-z]+ \d+[^<]*\d{4})<\/em>/);
    return match ? match[1] : null;
  };

  const weekRange = content ? extractWeekRange(content.content) : null;

  // Clean content: remove title heading and week range dateline
  const cleanContent = (html: string): string => {
    let cleaned = html;
    // Remove title heading
    const escapedTitle = post.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    cleaned = cleaned.replace(
      new RegExp(`<h[123][^>]*>\\s*${escapedTitle}\\s*</h[123]>`, 'i'),
      ''
    );
    return cleaned;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Header — orange accent for ships */}
      <div className="bg-white dark:bg-dark-surface border-b-2 border-orange-400 dark:border-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <Link
            href="/shipping-news"
            className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:underline mb-6"
          >
            ← The Shipping News
          </Link>

          {/* Ship badge */}
          {shipNumber && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-mono font-medium rounded-full">
                Ship #{shipNumber}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark dark:text-dark-text mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 gap-x-4 gap-y-1">
            <span className="font-medium">{post.author || 'christian crumlish'}</span>
            {formatDate(post.publishedAtISO || post.publishedAt) && (
              <>
                <span>•</span>
                <time dateTime={post.publishedAtISO || post.publishedAt}>
                  {formatDate(post.publishedAtISO || post.publishedAt)}
                </time>
              </>
            )}
            {weekRange && (
              <>
                <span>•</span>
                <span className="text-orange-600 dark:text-orange-400">
                  Week of {weekRange}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ship image — fixed for all ships */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="relative w-full h-48 md:h-72 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src="/assets/blog-images/piper-ship.webp"
            alt="Piper Morgan ship illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      {content ? (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-display prose-headings:font-bold prose-headings:text-text-dark dark:prose-headings:text-dark-text prose-headings:leading-tight prose-headings:tracking-tight
              prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
              prose-a:text-orange-600 dark:prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
              prose-strong:text-text-dark dark:prose-strong:text-dark-text prose-strong:font-semibold
              prose-em:text-gray-700 dark:prose-em:text-gray-300 prose-em:italic
              prose-code:text-orange-600 dark:prose-code:text-orange-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
              prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-8
              prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
              prose-blockquote:border-l-4 prose-blockquote:border-orange-400 prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-400 prose-blockquote:my-8
              prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-2
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6 prose-ol:space-y-2
              prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:leading-relaxed prose-li:text-lg
              prose-figure:my-8 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-gray-600 dark:prose-figcaption:text-gray-400 prose-figcaption:mt-3
              prose-hr:border-orange-200 dark:prose-hr:border-orange-800"
            dangerouslySetInnerHTML={{ __html: cleanContent(content.content) }}
          />
        </article>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Content for this ship is not yet available on the blog.
            {(post as any).linkedinURL && (
              <>
                {' '}Read it on{' '}
                <a
                  href={(post as any).linkedinURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 dark:text-orange-400 hover:underline"
                >
                  LinkedIn
                </a>
                .
              </>
            )}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/shipping-news"
            className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:underline"
          >
            ← The Shipping News
          </Link>

          {/* LinkedIn credit for ships */}
          {(post as any).linkedinURL && (
            <span className="text-sm text-gray-500 dark:text-gray-500">
              Also on{' '}
              <a
                href={(post as any).linkedinURL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors"
              >
                LinkedIn
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
