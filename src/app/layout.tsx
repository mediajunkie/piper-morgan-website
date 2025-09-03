import type { Metadata } from "next";
import "./globals.css";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { getDefaultWebsiteContent } from '@/lib/domain-utils';

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
    locale: 'en_US',
    images: [
      {
        url: '/assets/pm-logo.png',
        width: 400,
        height: 400,
        alt: 'Piper Morgan - AI Product Management Assistant logo featuring a teal dolphin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: websiteContent.siteMetadata.title,
    description: websiteContent.siteMetadata.description,
    images: ['/assets/pm-logo.png'],
    creator: '@mediajunkie',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/pm-favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/pm-favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/pm-favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/pm-favicon-180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/pm-favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-inter">
      <head>
        <link rel="dns-prefetch" href="//pipermorgan.ai" />
        <link rel="preconnect" href="https://pipermorgan.ai" />
        <link rel="preload" as="image" href="/assets/pm-logo.png" />
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/HossRound-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face{font-family:'Inter';src:url('/fonts/inter-latin.woff2') format('woff2');font-weight:100 900;font-style:normal;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
            *{box-sizing:border-box}
            html{scroll-behavior:smooth;font-size:16px;margin:0;padding:0;border:none;outline:none}
            body{background:#FFFFFF;color:#1F2937;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell',sans-serif;line-height:1.6;margin:0;padding:0;border:none;outline:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
            .container{max-width:1200px;margin:0 auto;padding:0 1rem}
            .mx-auto{margin-left:auto;margin-right:auto}
            .max-w-4xl{max-width:56rem}
            .pt-16{padding-top:4rem}
            .pb-8{padding-bottom:2rem}
            .px-4{padding-left:1rem;padding-right:1rem}
            .mb-6{margin-bottom:1.5rem}
            .mb-8{margin-bottom:2rem}
            .text-left{text-align:left}
            .text-center{text-align:center}
            .text-primary-teal{color:#2DD4BF}
            .text-text-dark{color:#1F2937}
            .text-text-light{color:#6B7280}
            .font-bold{font-weight:700}
            .text-4xl{font-size:2.25rem;line-height:2.5rem}
            .text-5xl{font-size:3rem;line-height:1}
            .text-6xl{font-size:3.75rem;line-height:1}
            .text-lg{font-size:1.125rem;line-height:1.75rem}
            .text-xl{font-size:1.25rem;line-height:1.75rem}
            .leading-tight{line-height:1.25}
            .leading-relaxed{line-height:1.625}
            .min-h-screen{min-height:100vh}
            @media (min-width:768px){
              .md\\:pt-24{padding-top:6rem}
              .md\\:pb-12{padding-bottom:3rem}
              .md\\:text-5xl{font-size:3rem;line-height:1}
              .md\\:text-xl{font-size:1.25rem;line-height:1.75rem}
            }
            @media (min-width:1024px){
              .lg\\:text-6xl{font-size:3.75rem;line-height:1}
            }
          `
        }} />
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
        <GoogleAnalytics />
      </body>
    </html>
  );
}
