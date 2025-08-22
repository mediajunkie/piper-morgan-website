import type { Metadata } from 'next';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    type: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    creator: string;
    images: string[];
  };
}

export function generateSEOMetadata(
  title: string,
  description: string,
  options: {
    canonical?: string;
    keywords?: string[];
    ogImage?: string;
  } = {}
): SEOData {
  const {
    canonical = 'https://pipermorgan.ai',
    keywords = [
      'Product Management',
      'AI Assistant',
      'PM Tools',
      'Systematic Excellence',
      'Building in Public',
      'Methodology',
      'AI Collaboration',
      'Product Strategy'
    ],
    ogImage = '/assets/pm-logo.png'
  } = options;

  return {
    title,
    description,
    keywords,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Piper Morgan',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@mediajunkie',
      images: [ogImage],
    },
  };
}

export function getDefaultWebsiteContent() {
  return {
    siteMetadata: {
      title: 'Piper Morgan - AI Product Management Assistant',
      description: 'AI-powered Product Management Assistant demonstrating systematic excellence through transparent, building-in-public development.',
      author: 'Christian Crumlish',
      url: 'https://pipermorgan.ai',
    },
  };
}
