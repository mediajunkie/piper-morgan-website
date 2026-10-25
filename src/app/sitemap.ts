import type { MetadataRoute } from 'next';
import { getDefaultWebsiteContent } from '@/lib/domain-utils';
import mediumPostsRaw from '@/data/medium-posts.json';
import type { MediumPost } from '@/types/domain';

const mediumPosts = mediumPostsRaw as MediumPost[];

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const websiteContent = getDefaultWebsiteContent();
  const baseUrl = websiteContent.siteMetadata.url;

  // Same filters as the [slug] routes' generateStaticParams, so every URL listed exists.
  const postEntries: MetadataRoute.Sitemap = mediumPosts
    .filter((post) => post.slug)
    .map((post) => ({
      url: `${baseUrl}/${post.category === 'ship' ? 'shipping-news' : 'blog'}/${post.slug}/`,
      lastModified: post.publishedAtISO ? new Date(post.publishedAtISO) : new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/methodology/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping-news/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/get-involved/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/what-weve-learned/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/support/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/try/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...postEntries,
  ];
}
