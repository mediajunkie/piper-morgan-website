import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mediumPosts from '@/data/medium-posts.json';
import blogContent from '@/data/blog-content.json';
import { BlogPostContent } from '@/components/organisms/BlogPostContent';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = mediumPosts.map((post) => {
    const postId = post.guid?.match(/([a-f0-9]{12})$/)?.[1] ||
                   post.link?.match(/([a-f0-9]{12})/)?.[1];
    return { postId: postId || '' };
  }).filter(({ postId }) => postId);

  return posts;
}

// Generate metadata for each post
export async function generateMetadata({
  params
}: {
  params: Promise<{ postId: string }>
}): Promise<Metadata> {
  const { postId } = await params;

  // Find post in medium-posts.json
  const post = mediumPosts.find((p) => {
    const id = p.guid?.match(/([a-f0-9]{12})$/)?.[1] ||
               p.link?.match(/([a-f0-9]{12})/)?.[1];
    return id === postId;
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const content = blogContent[postId as keyof typeof blogContent];
  const description = content?.subtitle || post.contentSnippet || '';

  return {
    title: `${post.title} | Piper Morgan`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.pubDate,
      authors: [post.author],
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
  params: Promise<{ postId: string }>
}) {
  const { postId } = await params;

  // Find post metadata
  const post = mediumPosts.find((p) => {
    const id = p.guid?.match(/([a-f0-9]{12})$/)?.[1] ||
               p.link?.match(/([a-f0-9]{12})/)?.[1];
    return id === postId;
  });

  // Find post content
  const content = blogContent[postId as keyof typeof blogContent];

  if (!post || !content) {
    notFound();
  }

  return (
    <BlogPostContent
      post={post}
      content={content}
    />
  );
}
