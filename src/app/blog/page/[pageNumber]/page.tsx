import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';
import { Hero } from '@/components';
import BlogContent from '../../BlogContent';
import mediumPosts from '@/data/medium-posts.json';
import { notFound } from 'next/navigation';

const POSTS_PER_PAGE = 24;

interface PageProps {
  params: Promise<{
    pageNumber: string;
  }>;
}

// Generate static params for all pages
export async function generateStaticParams() {
  const totalPages = Math.ceil(mediumPosts.length / POSTS_PER_PAGE);
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: i.toString() });
  }

  return pages;
}

// Generate metadata for each page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const pageNumber = parseInt(resolvedParams.pageNumber, 10);
  const totalPages = Math.ceil(mediumPosts.length / POSTS_PER_PAGE);

  // Validate page number
  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    return {
      title: 'Page Not Found - Piper Morgan',
      description: 'The requested page does not exist.',
    };
  }

  const seoData = generateSEOMetadata(
    `Building-in-Public: AI-Powered PM Methodology Development - Page ${pageNumber}`,
    `Follow our transparent journey developing systematic PM excellence through AI collaboration. Real insights, real breakthroughs, real learning. Page ${pageNumber} of ${totalPages}.`,
    { canonical: `https://pipermorgan.ai/blog/page/${pageNumber}` }
  );

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: seoData.openGraph,
    twitter: seoData.twitter,
    alternates: {
      canonical: seoData.canonical,
    },
  };
}

export default async function BlogPageNumber({ params }: PageProps) {
  const resolvedParams = await params;
  const pageNumber = parseInt(resolvedParams.pageNumber, 10);
  const totalPages = Math.ceil(mediumPosts.length / POSTS_PER_PAGE);

  // Validate page number and redirect to 404 if invalid
  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    notFound();
  }

  // Redirect page 1 to /blog (optional, but good for SEO)
  if (pageNumber === 1 && typeof window !== 'undefined') {
    window.location.href = '/blog';
    return null;
  }

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

      <BlogContent currentPage={pageNumber} />
    </div>
  );
}
