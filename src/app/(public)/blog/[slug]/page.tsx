import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mediumPostsRaw from '@/data/medium-posts.json';
import blogContent from '@/data/blog-content.json';
import { BlogPostContent } from '@/components/organisms/BlogPostContent';
import type { MediumPost, BlogContentEntry } from '@/types/domain';

const mediumPosts = mediumPostsRaw as MediumPost[];

// Generate static params for all blog posts
// Only generates slug-based URLs
export async function generateStaticParams() {
  return mediumPosts
    .filter((post) => post.slug && post.category !== 'ship')
    .map((post) => ({
      slug: post.slug
    }));
}

function lookupContent(post: MediumPost): BlogContentEntry | null {
  const hashId = post.guid?.match(/([a-f0-9]{12})$/)?.[1] ||
                 post.link?.match(/([a-f0-9]{12})/)?.[1];
  if (!hashId) return null;
  const bc = blogContent as Record<string, BlogContentEntry | string>;
  const raw = bc[hashId];
  if (raw == null) return null;
  // Tolerate the legacy bare-string shape from pre-v0.8 entries
  return typeof raw === 'string' ? { title: post.title, content: raw } : raw;
}

// Generate metadata for each post
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;

  // Find post by slug
  const post = mediumPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const content = lookupContent(post);
  const description = content?.subtitle || post.excerpt || '';

  return {
    title: `${post.title} | Piper Morgan`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.pubDate,
      authors: post.author ? [post.author] : undefined,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.thumbnail ? [post.thumbnail] : [],
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
  const post = mediumPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const content = lookupContent(post);

  if (!content) {
    notFound();
  }

  // BlogPostContent's BlogPost interface narrows required fields more than MediumPost;
  // map the relevant ones explicitly.
  const blogPost = {
    title: post.title,
    guid: post.guid,
    url: post.url,
    publishedAt: post.publishedAt ?? '',
    workDate: post.workDate,
    author: post.author ?? 'christian crumlish',
    featuredImage: post.featuredImage,
    imageAlt: post.imageAlt,
    imageCaption: post.imageCaption,
    tags: post.tags,
  };

  return (
    <BlogPostContent
      post={blogPost}
      content={content}
    />
  );
}
