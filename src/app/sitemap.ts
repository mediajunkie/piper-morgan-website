import type { MetadataRoute } from 'next';
import { getDefaultWebsiteContent } from '@/lib/domain-utils';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const websiteContent = getDefaultWebsiteContent();
  const baseUrl = websiteContent.siteMetadata.url;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
