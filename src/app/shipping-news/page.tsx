import { Metadata } from 'next';
import { Suspense } from 'react';
import ShippingNewsContent from './ShippingNewsContent';

export const metadata: Metadata = {
  title: 'The Shipping News | Piper Morgan',
  description: 'Weekly updates from the Piper Morgan development team. What shipped, what we learned, and what\'s next.',
  openGraph: {
    title: 'The Shipping News | Piper Morgan',
    description: 'Weekly updates from the Piper Morgan development team.',
    images: ['/assets/blog-images/piper-ship.webp'],
  },
};

export default function ShippingNewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
      </div>

      {/* Content */}
      <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 text-gray-500">Loading...</div>}>
        <ShippingNewsContent />
      </Suspense>
    </div>
  );
}
