import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';
import { Hero } from '@/components';
import BlogContent from './BlogContent';

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
      {/* Hero Section */}
      <Hero
        headline="Building-in-public:"
        highlightText="systematic PM excellence"
        subheadline="Follow our transparent journey as we develop AI-powered product management methodology through verified patterns, breakthrough discoveries, and systematic excellence. Every decision documented, every pattern captured, every lesson shared."
        primaryCTA={{
          text: "Read Latest Updates",
          href: "#recent-posts"
        }}
        secondaryCTA={{
          text: "Join the Journey",
          href: "/newsletter"
        }}
        background="surface"
        align="center"
      />

      <BlogContent currentPage={1} />
    </div>
  );
}
