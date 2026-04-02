import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mediumPosts from '@/data/medium-posts.json';
import blogContent from '@/data/blog-content.json';
import { ShipPostContent } from '@/components/organisms/ShipPostContent';

// Generate static params for all ship posts
// Only generates slug-based URLs
export async function generateStaticParams() {
  return mediumPosts
    .filter((post: any) => post.slug && post.category === 'ship')
    .map((post: any) => ({
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
  const post = mediumPosts.find((p: any) => p.slug === slug && p.category === 'ship');

  if (!post) {
    return {
      title: 'Ship Not Found',
    };
  }

  return {
    title: `${(post as any).title} | The Shipping News | Piper Morgan`,
    description: 'Weekly development update from the Piper Morgan team.',
    openGraph: {
      title: (post as any).title,
      type: 'article',
      publishedTime: (post as any).publishedAtISO || (post as any).publishedAt,
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
  const post = mediumPosts.find((p: any) => p.slug === slug && p.category === 'ship');

  if (!post) {
    notFound();
  }

  // Extract hashId to look up content (blog-content.json uses hashIds as keys)
  const hashId = (post as any).guid?.match(/([a-f0-9]{12})$/)?.[1] ||
                 (post as any).link?.match(/([a-f0-9]{12})/)?.[1];

  const content = hashId ? blogContent[hashId as keyof typeof blogContent] : null;

  return <ShipPostContent post={post as any} content={content as any} />;
}
