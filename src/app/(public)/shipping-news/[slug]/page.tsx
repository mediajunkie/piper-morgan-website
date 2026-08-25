import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mediumPostsRaw from '@/data/medium-posts.json';
import blogContent from '@/data/blog-content.json';
import { ShipPostContent } from '@/components/organisms/ShipPostContent';
import type { MediumPost, BlogContentEntry } from '@/types/domain';

const mediumPosts = mediumPostsRaw as MediumPost[];

// Generate static params for all ship posts
// Only generates slug-based URLs
export async function generateStaticParams() {
  return mediumPosts
    .filter((post) => post.slug && post.category === 'ship')
    .map((post) => ({
      slug: post.slug
    }));
}

// Generate metadata for each ship post
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;

  // Find post by slug
  const post = mediumPosts.find((p) => p.slug === slug && p.category === 'ship');

  if (!post) {
    return {
      title: 'Ship Not Found',
    };
  }

  // Without an explicit per-post canonical, this page inherited the root layout's
  // alternates.canonical: '/' -- every Ship post canonicalized to the homepage.
  // trailingSlash: true (next.config.ts) means the served URL always ends in '/'.
  const canonicalUrl = `https://pipermorgan.ai/shipping-news/${slug}/`;

  return {
    title: `${post.title} | The Shipping News | Piper Morgan`,
    description: 'Weekly development update from the Piper Morgan team.',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.publishedAtISO || post.publishedAt,
      images: ['/assets/blog-images/piper-ship.webp'],
    },
  };
}

export default async function ShipPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  // Find post by slug
  const post = mediumPosts.find((p) => p.slug === slug && p.category === 'ship');

  if (!post) {
    notFound();
  }

  // Extract hashId to look up content (blog-content.json uses hashIds as keys)
  const hashId = post.guid?.match(/([a-f0-9]{12})$/)?.[1] ||
                 post.link?.match(/([a-f0-9]{12})/)?.[1];

  const bc = blogContent as Record<string, BlogContentEntry | string>;
  const rawEntry = hashId ? bc[hashId] : null;
  // Handle both dict-shaped entries (canonical) and the legacy bare-string shape
  const content: BlogContentEntry | null =
    rawEntry == null ? null
    : typeof rawEntry === 'string' ? { title: post.title, content: rawEntry }
    : rawEntry;

  // ShipPost interface in ShipPostContent has narrower required fields than MediumPost;
  // map the relevant ones explicitly.
  const shipPost = {
    title: post.title,
    slug: post.slug ?? slug,
    guid: post.guid,
    url: post.url,
    publishedAt: post.publishedAt ?? '',
    publishedAtISO: post.publishedAtISO,
    workDate: post.workDate,
    author: post.author,
    // linkedinURL isn't in MediumPost (lives in editorial-calendar.csv); preserve if present
    linkedinURL: (post as { linkedinURL?: string }).linkedinURL,
  };

  return <ShipPostContent post={shipPost} content={content} />;
}
