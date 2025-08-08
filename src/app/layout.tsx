import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getDefaultWebsiteContent } from '@/lib/domain-utils';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const websiteContent = getDefaultWebsiteContent();

export const metadata: Metadata = {
  title: websiteContent.siteMetadata.title,
  description: websiteContent.siteMetadata.description,
  keywords: ["AI", "Product Management", "Methodology", "Building in Public"],
  authors: [{ name: websiteContent.siteMetadata.author }],
  creator: websiteContent.siteMetadata.author,
  publisher: websiteContent.siteMetadata.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(websiteContent.siteMetadata.url),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    siteName: websiteContent.siteMetadata.title,
    title: websiteContent.siteMetadata.title,
    description: websiteContent.siteMetadata.description,
    url: websiteContent.siteMetadata.url,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: websiteContent.siteMetadata.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: websiteContent.siteMetadata.title,
    description: websiteContent.siteMetadata.description,
    images: ['/images/twitter-card.png'],
    creator: '@mediajunkie',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Navigation />
        <div id="main-content">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
