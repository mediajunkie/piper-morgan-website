import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';
import { Hero, NewsletterSignup, NewsletterErrorBoundary, CTAButton } from '@/components';

const seoData = generateSEOMetadata(
  'Join the Systematic Excellence Community - Newsletter',
  'Get weekly insights into AI-powered PM methodology, behind-the-scenes development updates, and practical frameworks you can apply immediately',
  { canonical: 'https://pipermorgan.ai/newsletter' }
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

export default function NewsletterPage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        headline="Join the systematic excellence"
        highlightText="community"
        subheadline="Get weekly insights into our methodology breakthroughs, behind-the-scenes development updates, and practical frameworks you can apply to your own PM work. No marketing fluff—just transparent documentation of what actually works."
        primaryCTA={{
          text: "See Our Methodology",
          href: "/how-it-works"
        }}
        secondaryCTA={{
          text: "Read Building-in-Public Updates",
          href: "/blog"
        }}
        background="gradient"
      />

      {/* Main Newsletter Signup */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <NewsletterErrorBoundary>
              <NewsletterSignup
                title="Join 576+ PM professionals learning systematic excellence"
                description="Get weekly insights into our methodology development, breakthrough discoveries, and practical frameworks you can apply to your own PM work. Watch as we transform AI-assisted product management from experiment to systematic practice."
                benefits={[
                  "Weekly methodology insights and breakthrough discoveries",
                  "Behind-the-scenes development updates and decision rationale",
                  "Early access to new tools and systematic frameworks",
                  "Practical templates and patterns you can immediately apply",
                  "Direct insight into human-AI collaboration patterns that actually work",
                  "Exclusive case studies and implementation learnings"
                ]}
                background="surface"
                compact={false}
                source="newsletter"
                metadata={{
                  page_context: "direct-newsletter-interest"
                }}
                privacyNotice="No spam, unsubscribe anytime. Join the growing community of PM professionals learning systematic excellence."
              />
            </NewsletterErrorBoundary>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-6">
              Why PM Professionals Choose Our Newsletter
            </h2>
            <p className="text-xl text-text-light mb-12">
              Get exclusive access to our building-in-public methodology, systematic excellence patterns, and practical frameworks you can apply immediately. This isn't just another PM newsletter—it's systematic methodology development you can learn from and apply.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-card shadow-component">
                <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  Methodology Breakthroughs
                </h3>
                <p className="text-text-light">
                  Deep dives into our systematic approach that delivers 15-minute ADR migrations, 100% test coverage during rapid development, and zero architectural drift across 50+ implementations.
                </p>
              </div>

              <div className="bg-white p-6 rounded-card shadow-component">
                <div className="w-12 h-12 bg-primary-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  Building-in-Public Transparency
                </h3>
                <p className="text-text-light">
                  Complete transparency into our development process: decision rationale, breakthrough discoveries, failure analysis, and methodology evolution. Learn from our systematic approach to AI-assisted product management.
                </p>
              </div>

              <div className="bg-white p-6 rounded-card shadow-component">
                <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  Systematic Excellence Tools
                </h3>
                <p className="text-text-light">
                  First access to new systematic frameworks, implementation templates, and proven patterns. Plus practical tools you can apply immediately to accelerate your own PM work and AI collaboration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Content Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-12">
              Recent Newsletter Highlights
            </h2>

            <div className="space-y-8">
              <div className="bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 p-8 rounded-card">
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  &ldquo;Systematic Verification: The 15-Minute ADR Migration&rdquo;
                </h3>
                <p className="text-text-light mb-4">
                  How our verification-first methodology reduced implementation time from
                  2+ hours to 15 minutes, with zero architectural drift across 50+ implementations.
                </p>
                <div className="text-sm text-text-light">
                  📅 Issue #47 • ⏱️ 5 min read • 🎯 Implementation Strategy
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary-orange/5 to-primary-teal/5 p-8 rounded-card">
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  &ldquo;Multi-Agent Coordination: Building Value Systematically&rdquo;
                </h3>
                <p className="text-text-light mb-4">
                  Deep dive into our agent coordination patterns and how GitHub-first
                  tracking enables systematic progress across complex implementations.
                </p>
                <div className="text-sm text-text-light">
                  📅 Issue #46 • ⏱️ 7 min read • 🔧 Methodology
                </div>
              </div>

              <div className="bg-surface p-8 rounded-card">
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  &ldquo;Excellence Flywheel: From Pattern to Production&rdquo;
                </h3>
                <p className="text-text-light mb-4">
                  The systematic approach that turns each implementation into accelerated
                  future work, creating a flywheel of continuous improvement.
                </p>
                <div className="text-sm text-text-light">
                  📅 Issue #45 • ⏱️ 6 min read • 📈 Process Optimization
                </div>
              </div>
            </div>

            <div className="mt-12">
              <CTAButton
                href="/blog"
                variant="outline"
                size="lg"
              >
                Read More on Our Blog
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
