/**
 * Blog Utilities
 *
 * Utility functions for blog post management, sorting, and filtering.
 */

/**
 * Sort posts by work date (chronological order of when work happened)
 *
 * @param posts - Array of blog posts
 * @param order - 'desc' for newest first (default), 'asc' for oldest first
 * @returns Sorted array of posts
 */
export function sortByWorkDate(posts: any[], order: 'asc' | 'desc' = 'desc'): any[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.workDateISO || a.publishedAtISO || a.isoDate || a.pubDate);
    const dateB = new Date(b.workDateISO || b.publishedAtISO || b.isoDate || b.pubDate);

    return order === 'desc'
      ? dateB.getTime() - dateA.getTime()  // Newest first
      : dateA.getTime() - dateB.getTime(); // Oldest first
  });
}

/**
 * Sort posts by publication date (when posted to Medium)
 *
 * @param posts - Array of blog posts
 * @param order - 'desc' for newest first (default), 'asc' for oldest first
 * @returns Sorted array of posts
 */
export function sortByPubDate(posts: any[], order: 'asc' | 'desc' = 'desc'): any[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.publishedAtISO || a.isoDate || a.pubDate);
    const dateB = new Date(b.publishedAtISO || b.isoDate || b.pubDate);

    return order === 'desc'
      ? dateB.getTime() - dateA.getTime()  // Newest first
      : dateA.getTime() - dateB.getTime(); // Oldest first
  });
}

/**
 * Get work date range for a set of posts
 *
 * @param posts - Array of blog posts
 * @returns Object with earliest and latest work dates
 */
export function getWorkDateRange(posts: any[]): { earliest: Date | null, latest: Date | null } {
  if (posts.length === 0) {
    return { earliest: null, latest: null };
  }

  const dates = posts
    .map(p => new Date(p.workDateISO || p.publishedAtISO || p.isoDate || p.pubDate))
    .filter(d => !isNaN(d.getTime()));

  if (dates.length === 0) {
    return { earliest: null, latest: null };
  }

  return {
    earliest: new Date(Math.min(...dates.map(d => d.getTime()))),
    latest: new Date(Math.max(...dates.map(d => d.getTime())))
  };
}

/**
 * Filter posts by work date range
 *
 * @param posts - Array of blog posts
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @returns Filtered array of posts
 */
export function filterByWorkDateRange(
  posts: any[],
  startDate: Date | string,
  endDate: Date | string
): any[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  return posts.filter(post => {
    const workDate = new Date(post.workDateISO || post.publishedAtISO || post.isoDate || post.pubDate).getTime();
    return workDate >= start && workDate <= end;
  });
}

/**
 * Get featured post for homepage (Phase 10)
 *
 * Hybrid selection strategy:
 * 1. Primary: Return post with featured=true in CSV
 * 2. Fallback: Return most recent post by work date
 *
 * @param posts - Array of blog posts
 * @returns Featured post or null
 */
export function getFeaturedPost(posts: any[]): any | null {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Check for manually featured post
  const manuallyFeatured = posts.find(post => post.featured === true);
  if (manuallyFeatured) {
    return manuallyFeatured;
  }

  // Fallback: Return most recent by work date
  const sorted = sortByWorkDate(posts, 'desc');
  return sorted[0] || null;
}
