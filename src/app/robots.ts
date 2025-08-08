import type { MetadataRoute } from 'next';
import { getDefaultWebsiteContent } from '@/lib/domain-utils';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const websiteContent = getDefaultWebsiteContent();
  const baseUrl = websiteContent.siteMetadata.url;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
