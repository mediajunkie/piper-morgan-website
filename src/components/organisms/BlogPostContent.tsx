'use client';

import Link from 'next/link';
import { trackBlogClick } from '@/lib/analytics';

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  thumbnail?: string;
  categories?: string[];
}

interface BlogContent {
  title: string;
  subtitle: string;
  content: string;
  author: string;
  canonicalLink: string;
  publishedDate: string;
  filename: string;
}

interface BlogPostContentProps {
  post: BlogPost;
  content: BlogContent;
}

export function BlogPostContent({ post, content }: BlogPostContentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleMediumClick = () => {
    trackBlogClick(post.title, post.link, 'view_on_medium');
  };

  // Extract caption from featured image
  const extractCaption = (html: string): string | null => {
    // Try Medium export format first
    const exportMatch = html.match(/<figure[^>]*data-is-featured="true"[^>]*>[\s\S]*?<figcaption[^>]*>(.*?)<\/figcaption>[\s\S]*?<\/figure>/i);
    if (exportMatch) return exportMatch[1].replace(/<[^>]+>/g, '').trim();

    // Try RSS format (first figure)
    const rssMatch = html.match(/^<figure[^>]*>[\s\S]*?<figcaption[^>]*>(.*?)<\/figcaption>[\s\S]*?<\/figure>/);
    if (rssMatch) return rssMatch[1].replace(/<[^>]+>/g, '').trim();

    return null;
  };

  const imageCaption = extractCaption(content.content);

  // Clean Medium HTML content
  const cleanContent = (html: string): string => {
    let cleaned = html;

    // Remove the title heading (Medium includes it at the start of content)
    // Try to match h1, h2, or h3 tags containing the post title
    // Escape special regex characters in the title
    const escapedTitle = post.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match heading tags with the title (allows for some HTML inside)
    cleaned = cleaned.replace(new RegExp(`<h[123][^>]*>\\s*${escapedTitle}\\s*<\\/h[123]>`, 'i'), '');
    // Also try matching with any HTML tags stripped from title
    const titleText = post.title.replace(/<[^>]+>/g, '');
    const escapedTitleText = titleText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    cleaned = cleaned.replace(new RegExp(`<h[123][^>]*>\\s*${escapedTitleText}\\s*<\\/h[123]>`, 'i'), '');

    // Remove the featured image from content (we show it in header)
    // Medium export: <figure data-is-featured="true">...</figure>
    cleaned = cleaned.replace(/<figure[^>]*data-is-featured="true"[^>]*>[\s\S]*?<\/figure>/i, '');

    // RSS content: First <figure> is always the featured image
    cleaned = cleaned.replace(/^<figure[^>]*>[\s\S]*?<\/figure>/, '');

    // Remove section wrappers that Medium adds (export only)
    cleaned = cleaned.replace(/<section[^>]*class="section[^"]*"[^>]*>/gi, '<div>');
    cleaned = cleaned.replace(/<\/section>/gi, '</div>');

    // Remove section dividers (export only)
    cleaned = cleaned.replace(/<div[^>]*class="section-divider"[^>]*>[\s\S]*?<\/div>/gi, '');

    // Remove Medium tracking pixel (RSS only)
    cleaned = cleaned.replace(/<img[^>]*stat\?event=post\.clientViewed[^>]*>/gi, '');

    // Remove Medium footer attribution (RSS only)
    cleaned = cleaned.replace(/<hr><p>.*?was originally published in.*?<\/p>/gi, '');

    // Clean up empty divs
    cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, '');

    return cleaned;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-teal-text dark:text-primary-teal hover:underline mb-6"
          >
            ← Back to Blog
          </Link>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="mb-4">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="inline-block px-3 py-1 bg-primary-teal/10 dark:bg-primary-teal/20 text-primary-teal-text dark:text-primary-teal text-sm font-medium rounded-full mr-2"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark dark:text-dark-text mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Subtitle */}
          {content.subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {content.subtitle}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            <span className="font-medium">{post.author}</span>
            <span className="mx-2">•</span>
            <time dateTime={post.pubDate}>{formatDate(post.pubDate)}</time>
          </div>

          {/* Medium Link */}
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMediumClick}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-teal-text dark:hover:text-primary-teal transition-colors"
          >
            View original on Medium →
          </a>
        </div>
      </div>

      {/* Featured Image */}
      {post.thumbnail && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          {imageCaption && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3 italic">
              {imageCaption}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
        <div
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-display prose-headings:font-bold prose-headings:text-text-dark dark:prose-headings:text-dark-text prose-headings:leading-tight prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
            prose-a:text-primary-teal-text dark:prose-a:text-primary-teal prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
            prose-strong:text-text-dark dark:prose-strong:text-dark-text prose-strong:font-semibold
            prose-em:text-gray-700 dark:prose-em:text-gray-300 prose-em:italic
            prose-code:text-primary-teal-text dark:prose-code:text-primary-teal prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-8
            prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
            prose-blockquote:border-l-4 prose-blockquote:border-primary-teal prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-400 prose-blockquote:my-8
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-2
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6 prose-ol:space-y-2
            prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:leading-relaxed prose-li:text-lg
            prose-figure:my-8 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-gray-600 dark:prose-figcaption:text-gray-400 prose-figcaption:mt-3"
          dangerouslySetInnerHTML={{ __html: cleanContent(content.content) }}
        />
      </article>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-teal-text dark:text-primary-teal hover:underline"
          >
            ← Back to Blog
          </Link>

          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMediumClick}
            className="inline-flex items-center px-4 py-2 bg-primary-teal/10 dark:bg-primary-teal/20 text-primary-teal-text dark:text-primary-teal rounded-lg hover:bg-primary-teal/20 dark:hover:bg-primary-teal/30 transition-colors"
          >
            View on Medium →
          </a>
        </div>
      </div>
    </div>
  );
}
