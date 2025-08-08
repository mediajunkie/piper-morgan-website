import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';
import { Hero, NewsletterSignup } from '@/components';
import HomePageBlog from './HomePageBlog';

const seoData = generateSEOMetadata(
  'Piper Morgan - AI Product Management Assistant',
  'Building-in-public: AI-powered PM methodology that shows its work',
  { canonical: 'https://pipermorgan.ai' }
);

export const metadata: Metadata = {
  title: seoData.title,
  description: seoData.description,
  keywords: seoData.keywords,
  openGraph: seoData.openGraph,
  twitter: seoData.twitter,
  alternates: {
    canonical: seoData.canonical
  }
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero
        headline="The PM methodology"
        highlightText="that shows its work"
        subheadline="AI-powered Product Management Assistant demonstrating systematic excellence through transparent, building-in-public development. Watch as we transform routine PM tasks into strategic intelligence."
        primaryCTA={{
          text: "See How It Works",
          href: "[SEE_HOW_IT_WORKS_URL]"
        }}
        secondaryCTA={{
          text: "Follow the Journey",
          href: "[FOLLOW_THE_JOURNEY_URL]"
        }}
        showLogo={true}
      />

      {/* Value Propositions */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark text-center mb-12">
              Systematic excellence through AI collaboration
            </h2>
            <div className="text-center mb-12">
              <p className="text-lg text-text-light max-w-4xl mx-auto">
                Piper Morgan isn't another AI tool that promises to replace human judgment. It's a systematic approach to augmenting product management expertise through transparent AI collaboration. Every decision is documented, every pattern is captured, and every breakthrough is shared.
              </p>
              <p className="text-lg text-text-light max-w-4xl mx-auto mt-4">
                Our most recent breakthroughs have been to embed spatial intelligence into Piper's model of the world as well as to bake ethical boundaries into the product at the architectural level: meaning it is functionally impossible for Piper to violate our basic principles.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  Verification First
                </h3>
                <p className="text-text-light">
                  Every implementation starts with pattern discovery. 15-minute ADR migrations
                  prove that verification accelerates rather than slows development.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary-orange rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  Multi-Agent Coordination
                </h3>
                <p className="text-text-light">
                  Strategic deployment of specialized AI agents with clear handoff protocols.
                  Building value systematically rather than working in isolation.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  GitHub-First Tracking
                </h3>
                <p className="text-text-light">
                  All work tracked with clear issue definitions and acceptance criteria.
                  Zero architectural drift across 50+ implementations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Building in Public - Now with Live RSS Posts! */}
      <HomePageBlog />

      {/* Newsletter CTA */}
      <section className="bg-text-dark py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup
              title="Join the systematic excellence journey"
              description="Get weekly insights into our methodology, behind-the-scenes development updates, and practical frameworks you can apply to your own PM work. No marketing fluff—just transparent documentation of what actually works."
              benefits={[
                "Weekly methodology insights and breakthroughs",
                "Behind-the-scenes development updates",
                "Early access to new features and tools",
                "Practical PM templates and frameworks"
              ]}
              background="dark"
              compact={false}
              privacyNotice="No spam, unsubscribe anytime. Join 576+ PM professionals."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
