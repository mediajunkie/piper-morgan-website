import type { Metadata } from 'next';
import { Suspense } from 'react';
import { generateSEOMetadata } from '@/lib/domain-utils';
import { FeaturedPost } from '@/components';
import BlogContent from './BlogContent';
import mediumPostsRaw from '@/data/medium-posts.json';
import { sortByPubDate } from '@/lib/blog-utils';
import type { MediumPost } from '@/types/domain';

const mediumPosts = mediumPostsRaw as MediumPost[];
const mostRecentPost = sortByPubDate(
  mediumPosts.filter((p) => p.category !== 'ship'),
  'desc'
)[0];

const seoData = generateSEOMetadata(
  'Building-in-Public: AI-Powered PM Methodology Development',
  'Follow our transparent journey developing systematic PM excellence through AI collaboration. Real insights, real breakthroughs, real learning.',
  { canonical: 'https://pipermorgan.ai/blog' }
);

export const metadata: Metadata = {
  title: seoData.title,
  description: seoData.description,
  keywords: seoData.keywords,
  openGraph: seoData.openGraph,
  twitter: seoData.twitter,
  alternates: {
    canonical: seoData.canonical
  }
};

export default function BlogPage() {
  return (
    <div>
      {/* Featured Post — the actual most recent post, not generic marketing copy.
          Replaces the old Hero (PM's 08-15 finding, confirmed live 08-28: the compact
          Hero fix reduced padding but never addressed what's above the fold). */}
      {mostRecentPost && (
        <FeaturedPost
          title={mostRecentPost.title}
          excerpt={mostRecentPost.excerpt ?? ''}
          href={mostRecentPost.url}
          workDate={mostRecentPost.workDate}
          publishedAt={mostRecentPost.publishedAt ?? ''}
          readingTime={mostRecentPost.readingTime}
          featuredImage={mostRecentPost.featuredImage}
          category={mostRecentPost.category as 'building' | 'insight' | undefined}
          cluster={mostRecentPost.cluster}
          compact
        />
      )}

      <Suspense fallback={<div className="text-center py-16">Loading blog posts...</div>}>
        <BlogContent currentPage={1} />
      </Suspense>
    </div>
  );
}
