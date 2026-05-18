'use client';

import Link from 'next/link';
import mediumPosts from '@/data/medium-posts.json';

interface ShipPost {
  title: string;
  slug: string;
  publishedAt: string;
  publishedAtISO?: string;
  workDate?: string;
  workDateISO?: string;
  category?: string;
  thumbnail?: string;
}

export default function ShippingNewsContent() {
  // Filter for ship posts only
  const ships = (mediumPosts as ShipPost[])
    .filter(post => post.category === 'ship')
    .sort((a, b) => {
      const dateA = new Date(a.publishedAtISO || a.publishedAt || 0);
      const dateB = new Date(b.publishedAtISO || b.publishedAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

  const extractNumber = (title: string): string | null => {
    const match = title.match(/#(\d+)/);
    return match ? match[1] : null;
  };

  const extractSubtitle = (title: string): string => {
    // "Weekly Ship #036: Approaching Gate" → "Approaching Gate"
    const match = title.match(/:\s*(.+)$/);
    return match ? match[1] : title;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-1">
        {ships.map((ship) => {
          const number = extractNumber(ship.title);
          const subtitle = extractSubtitle(ship.title);
          const pubDate = formatDate(ship.publishedAtISO || ship.publishedAt);

          return (
            <Link
              key={ship.slug}
              href={`/shipping-news/${ship.slug}`}
              className="flex items-baseline gap-4 py-3 px-4 -mx-4 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors group"
            >
              {/* Ship number */}
              {number && (
                <span className="text-sm font-mono text-orange-500 dark:text-orange-400 w-8 text-right shrink-0">
                  #{number}
                </span>
              )}

              {/* Title */}
              <span className="text-lg font-medium text-text-dark dark:text-dark-text group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {subtitle}
              </span>

              {/* Date */}
              <span className="text-sm text-gray-500 dark:text-gray-500 ml-auto shrink-0">
                {pubDate}
              </span>
            </Link>
          );
        })}
      </div>

      {ships.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-12">
          No ships published yet. Check back soon!
        </p>
      )}
    </div>
  );
}
