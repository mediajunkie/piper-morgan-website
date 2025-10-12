import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mediumPosts from '@/data/medium-posts.json';
import blogContent from '@/data/blog-content.json';
import { BlogPostContent } from '@/components/organisms/BlogPostContent';
import { LegacyRedirect } from './LegacyRedirect';

// Generate static params for all blog posts
// Generates BOTH new slug-based URLs AND legacy hash-based URLs for backward compatibility
export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  mediumPosts.forEach((post: any) => {
    // Add new slug-based URL
    if (post.slug) {
      params.push({ slug: post.slug });
    }

    // Add legacy hash-based URL for backward compatibility
    const hashId = post.guid?.match(/([a-f0-9]{12})$/)?.[1] ||
                   post.link?.match(/([a-f0-9]{12})/)?.[1];
    if (hashId) {
      params.push({ slug: hashId });
    }
  });

  return params;
}

// Generate metadata for each post
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;

  // Check if this is a legacy hash ID or a new slug
  const isLegacyHashId = /^[a-f0-9]{12}$/.test(slug);

  // Find post
  let post;
  let hashId;

  if (isLegacyHashId) {
    // Legacy hash ID - find by hash
    post = mediumPosts.find((p: any) => {
      const id = p.guid?.match(/([a-f0-9]{12})$/)?.[1] ||
                 p.link?.match(/([a-f0-9]{12})/)?.[1];
      return id === slug;
    });
    hashId = slug;
  } else {
    // New slug - find by slug
    post = mediumPosts.find((p: any) => p.slug === slug);

    if (post) {
      hashId = (post as any).guid?.match(/([a-f0-9]{12})$/)?.[1] ||
               (post as any).link?.match(/([a-f0-9]{12})/)?.[1];
    }
  }

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

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

  // Check if this is a legacy hash ID or a new slug
  const isLegacyHashId = /^[a-f0-9]{12}$/.test(slug);

  // Find post metadata
  let post;
  let hashId;

  if (isLegacyHashId) {
    // Legacy hash ID - find by hash
    post = mediumPosts.find((p: any) => {
      const id = p.guid?.match(/([a-f0-9]{12})$/)?.[1] ||
                 p.link?.match(/([a-f0-9]{12})/)?.[1];
      return id === slug;
    });
    hashId = slug;
  } else {
    // New slug - find by slug
    post = mediumPosts.find((p: any) => p.slug === slug);

    if (post) {
      hashId = (post as any).guid?.match(/([a-f0-9]{12})$/)?.[1] ||
               (post as any).link?.match(/([a-f0-9]{12})/)?.[1];
    }
  }

  if (!post) {
    notFound();
  }

  // Find post content using hash ID (blog-content.json still uses hash IDs as keys)
  const content = hashId ? blogContent[hashId as keyof typeof blogContent] : null;

  if (!content) {
    notFound();
  }

  return (
    <>
      <LegacyRedirect slug={slug} />
      <BlogPostContent
        post={post as any}
        content={content as any}
      />
    </>
  );
}
