import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mediumPosts from '@/data/medium-posts.json';
import blogContent from '@/data/blog-content.json';
import { BlogPostContent } from '@/components/organisms/BlogPostContent';

// Generate static params for all blog posts
// Only generates slug-based URLs
export async function generateStaticParams() {
  return mediumPosts
    .filter((post: any) => post.slug)
    .map((post: any) => ({
      slug: post.slug
    }));
}

// Generate metadata for each post
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;

  // Find post by slug
  const post = mediumPosts.find((p: any) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Extract hashId to look up content (blog-content.json uses hashIds as keys)
  const hashId = (post as any).guid?.match(/([a-f0-9]{12})$/)?.[1] ||
                 (post as any).link?.match(/([a-f0-9]{12})/)?.[1];

  const content = hashId ? blogContent[hashId as keyof typeof blogContent] : null;
  const description = content?.subtitle || (post as any).contentSnippet || '';

  return {
    title: `${(post as any).title} | Piper Morgan`,
    description,
    openGraph: {
      title: (post as any).title,
      description,
      type: 'article',
      publishedTime: (post as any).pubDate,
      authors: [(post as any).author],
      images: (post as any).thumbnail ? [(post as any).thumbnail] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: (post as any).title,
      description,
      images: (post as any).thumbnail ? [(post as any).thumbnail] : [],
    },
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  // Find post by slug
  const post = mediumPosts.find((p: any) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Extract hashId to look up content (blog-content.json uses hashIds as keys)
  const hashId = (post as any).guid?.match(/([a-f0-9]{12})$/)?.[1] ||
                 (post as any).link?.match(/([a-f0-9]{12})/)?.[1];

  const content = hashId ? blogContent[hashId as keyof typeof blogContent] : null;

  if (!content) {
    notFound();
  }

  return (
    <BlogPostContent
      post={post as any}
      content={content as any}
    />
  );
}
