'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import mediumPosts from '@/data/medium-posts.json';

/**
 * Client-side redirect handler for legacy hash-based URLs
 *
 * If the slug looks like a 12-character hash ID (legacy format),
 * redirects to the new slug-based URL.
 */
export function LegacyRedirect({ slug }: { slug: string }) {
  const router = useRouter();

  useEffect(() => {
    // Check if this looks like a legacy hash ID (12 hex characters)
    const isLegacyHashId = /^[a-f0-9]{12}$/.test(slug);

    if (isLegacyHashId) {
      // Find the post with this hash ID
      const post = mediumPosts.find((p: any) => {
        const hashId = p.guid?.match(/([a-f0-9]{12})$/)?.[1] ||
                       p.link?.match(/([a-f0-9]{12})/)?.[1];
        return hashId === slug;
      });

      if (post && (post as any).slug) {
        // Redirect to new slug-based URL
        console.log(`Redirecting legacy URL /blog/${slug} → /blog/${(post as any).slug}`);
        router.replace(`/blog/${(post as any).slug}`);
      }
    }
  }, [slug, router]);

  return null;
}
