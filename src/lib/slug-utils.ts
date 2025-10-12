/**
 * Slug Generation Utilities
 *
 * Generates human-readable URL slugs from blog post titles.
 * Rules:
 * - Use text before colon only
 * - Maximum 6 words
 * - Lowercase, hyphens for spaces
 * - Remove special characters
 * - Handle collisions by adding next word or numbering
 */

/**
 * Sanitizes text for use in a URL slug
 */
function sanitizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

/**
 * Generates a URL-friendly slug from a blog post title
 *
 * @param title - Full blog post title
 * @param existingSlugs - Array of already-used slugs to check for collisions
 * @param maxWords - Maximum number of words to use (default: 6)
 * @returns A unique, URL-friendly slug
 *
 * @example
 * generateSlug("Systemic Kindness: Building Methodology", [])
 * // Returns: "systemic-kindness"
 *
 * @example
 * generateSlug("Building Piper Morgan: The Journey Continues", ["building-piper-morgan"])
 * // Returns: "building-piper-morgan-journey"
 */
export function generateSlug(
  title: string,
  existingSlugs: string[] = [],
  maxWords: number = 6
): string {
  // Extract text before colon
  const textBeforeColon = title.split(':')[0].trim();

  // Sanitize and split into words
  const sanitized = sanitizeText(textBeforeColon);
  const words = sanitized
    .split(/\s+/)
    .filter(word => word.length > 0);

  // If no words, return a fallback
  if (words.length === 0) {
    return 'untitled';
  }

  // Try with increasing word counts (start with fewer, add more if collision)
  const startWordCount = Math.min(words.length, maxWords);

  for (let wordCount = startWordCount; wordCount <= words.length; wordCount++) {
    const slug = words.slice(0, wordCount).join('-');

    // Check for collision
    if (!existingSlugs.includes(slug)) {
      return slug;
    }
  }

  // If all words exhausted and still collision, append number
  const baseSlug = words.slice(0, maxWords).join('-');
  let counter = 2;

  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++;
  }

  return `${baseSlug}-${counter}`;
}

/**
 * Extracts the 12-character hash ID from a Medium URL
 *
 * @param url - Medium post URL or GUID
 * @returns The 12-character hash ID, or null if not found
 *
 * @example
 * extractHashId("https://medium.com/.../post-title-f38cde251d9d")
 * // Returns: "f38cde251d9d"
 */
export function extractHashId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/([a-f0-9]{12})(?:\?|$)/);
  return match ? match[1] : null;
}

/**
 * Validates that a slug meets the required format
 *
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  // Must be lowercase, alphanumeric + hyphens only
  // No leading/trailing hyphens
  // No multiple consecutive hyphens
  const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugPattern.test(slug);
}

/**
 * Generates slugs for an array of blog posts
 * Ensures all slugs are unique across the entire array
 *
 * @param posts - Array of blog posts with title property
 * @returns Map of hashId to slug
 */
export function generateSlugsForPosts(
  posts: Array<{ title: string; guid?: string; link?: string }>
): Map<string, string> {
  const slugMap = new Map<string, string>();
  const usedSlugs: string[] = [];

  for (const post of posts) {
    const hashId = extractHashId(post.guid || post.link || '');
    if (!hashId) {
      console.warn(`No hash ID found for post: ${post.title}`);
      continue;
    }

    const slug = generateSlug(post.title, usedSlugs);
    slugMap.set(hashId, slug);
    usedSlugs.push(slug);
  }

  return slugMap;
}
