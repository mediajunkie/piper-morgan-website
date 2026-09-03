import { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ShippingNewsContent from './ShippingNewsContent';
import mediumPostsRaw from '@/data/medium-posts.json';
import { sortByPubDate } from '@/lib/blog-utils';
import type { MediumPost } from '@/types/domain';

const canonicalUrl = 'https://pipermorgan.ai/shipping-news/';

export const metadata: Metadata = {
  title: 'The Shipping News | Piper Morgan',
  description: 'Weekly updates from the Piper Morgan development team. What shipped, what we learned, and what\'s next.',
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: 'The Shipping News | Piper Morgan',
    description: 'Weekly updates from the Piper Morgan development team.',
    url: canonicalUrl,
    images: ['/assets/blog-images/piper-ship.webp'],
  },
};

const mediumPosts = mediumPostsRaw as MediumPost[];
const mostRecentShip = sortByPubDate(
  mediumPosts.filter((p) => p.category === 'ship'),
  'desc'
)[0];

export default function ShippingNewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero — banner-style branding, the ship illustration shown fully (native
          16:9, object-contain so a future differently-shaped image never gets
          silently cropped) rather than cropped into a thin strip like the old
          per-post treatment this replaces. */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🚢</span>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-text-dark dark:text-dark-text">
              The Shipping News
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Weekly updates from the Piper Morgan development team. What shipped, what we learned, and what&apos;s next.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="relative w-full aspect-[16/9] rounded-card overflow-hidden shadow-lg bg-gradient-to-br from-primary-teal/10 via-primary-orange/10 to-primary-teal/10">
            <Image
              src="/assets/blog-images/piper-ship.webp"
              alt="A person and a crew of small robots rowing a wooden boat together"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain"
              priority
            />
          </div>
          {mostRecentShip && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Latest:{' '}
              <Link
                href={`/shipping-news/${mostRecentShip.slug}`}
                className="font-medium text-primary-teal-text dark:text-primary-teal hover:underline"
              >
                {mostRecentShip.title}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 text-gray-500">Loading...</div>}>
        <ShippingNewsContent />
      </Suspense>
    </div>
  );
}
