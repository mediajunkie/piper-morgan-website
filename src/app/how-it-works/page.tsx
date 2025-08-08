import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';
import { Hero, CTAButton, NewsletterSignup } from '@/components';

const seoData = generateSEOMetadata(
  'How Piper Morgan Works',
  'Understanding the AI-powered PM methodology and systematic approach',
  { canonical: 'https://pipermorgan.ai/how-it-works' }
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

export default function HowItWorksPage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        headline="How Piper Morgan Works"
        subheadline="Discover the systematic approach that delivers 15-minute ADR migrations, 100% test coverage maintenance, and zero architectural drift across 50+ implementations."
        primaryCTA={{
          text: "See the Four Pillars",
          href: "#four-pillars"
        }}
        secondaryCTA={{
          text: "Get Updates",
          href: "/newsletter"
        }}
        background="gradient"
        align="center"
      />

      {/* Four Pillars Section */}
      <section id="four-pillars" className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-dark mb-6">
                The Four Pillars of Excellence
              </h2>
              <p className="text-xl text-text-light">
                Our methodology foundation that enables systematic excellence and accelerated implementation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-card shadow-component">
                <div className="flex items-start">
                  <div className="bg-primary-teal text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-dark mb-3">
                      Systematic Verification First
                    </h3>
                    <p className="text-text-light mb-4">
                      Always check before acting. Pattern discovery and verification
                      accelerate implementation and prevent architectural drift.
                    </p>
                    <div className="text-sm text-primary-teal font-medium">
                      ⚡ Result: 15-minute ADR migrations (previously 2+ hours)
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-card shadow-component">
                <div className="flex items-start">
                  <div className="bg-primary-orange text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-dark mb-3">
                      Test-Driven Development
                    </h3>
                    <p className="text-text-light mb-4">
                      Tests before implementation ensure quality maintenance during
                      rapid development and provide confidence in system behavior.
                    </p>
                    <div className="text-sm text-primary-orange font-medium">
                      ✅ Result: 100% test coverage during rapid development
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-card shadow-component">
                <div className="flex items-start">
                  <div className="bg-primary-teal text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-dark mb-3">
                      Multi-Agent Coordination
                    </h3>
                    <p className="text-text-light mb-4">
                      Strategic deployment of specialized AI agents with clear handoff
                      protocols and systematic progress tracking.
                    </p>
                    <div className="text-sm text-primary-teal font-medium">
                      🔄 Result: Systematic value building vs. isolated work
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-card shadow-component">
                <div className="flex items-start">
                  <div className="bg-primary-orange text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-dark mb-3">
                      GitHub-First Tracking
                    </h3>
                    <p className="text-text-light mb-4">
                      All work tracked systematically with clear issue definitions,
                      acceptance criteria, and progress visibility.
                    </p>
                    <div className="text-sm text-primary-orange font-medium">
                      📊 Result: Zero architectural drift across 50+ implementations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Excellence Flywheel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-dark mb-6">
                The Excellence Flywheel
              </h2>
              <p className="text-xl text-text-light">
                Each implementation builds knowledge for accelerated future work
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary-teal/10 to-primary-orange/10 p-8 rounded-card mb-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                    <div className="font-semibold text-text-dark">Verify Patterns</div>
                    <div className="text-sm text-text-light">2-3 minutes</div>
                  </div>
                  <div className="text-primary-teal text-2xl hidden md:block">↓</div>
                </div>

                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                    <div className="font-semibold text-text-dark">Analyze Architecture</div>
                    <div className="text-sm text-text-light">3-5 minutes</div>
                  </div>
                  <div className="text-primary-orange text-2xl hidden md:block">↓</div>
                </div>

                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                    <div className="font-semibold text-text-dark">Design Solution</div>
                    <div className="text-sm text-text-light">2-3 minutes</div>
                  </div>
                  <div className="text-primary-teal text-2xl hidden md:block">↓</div>
                </div>

                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                    <div className="font-semibold text-text-dark">Implement</div>
                    <div className="text-sm text-text-light">5-10 minutes</div>
                  </div>
                  <div className="text-primary-orange text-2xl hidden md:block">↓</div>
                </div>

                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                    <div className="font-semibold text-text-dark">Test & Document</div>
                    <div className="text-sm text-text-light">5-8 minutes</div>
                  </div>
                  <div className="text-primary-teal text-2xl">↻</div>
                </div>
              </div>

              <div className="text-center mt-6">
                <p className="text-text-dark font-medium">
                  Total Implementation Time: <span className="text-primary-teal font-bold">15-30 minutes</span>
                </p>
                <p className="text-sm text-text-light">
                  Previous approach: 2+ hours with architectural inconsistencies
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Results */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-dark mb-6">
                Proven Results
              </h2>
              <p className="text-xl text-text-light">
                Measurable improvements across speed, quality, and consistency
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-card shadow-component">
                <div className="text-5xl font-bold text-primary-teal mb-4">15min</div>
                <div className="text-xl font-semibold text-text-dark mb-2">ADR Migrations</div>
                <div className="text-text-light">Previously 2+ hours</div>
                <div className="mt-4 text-sm text-primary-teal font-medium">
                  87.5% time reduction
                </div>
              </div>

              <div className="text-center p-8 bg-white rounded-card shadow-component">
                <div className="text-5xl font-bold text-primary-orange mb-4">100%</div>
                <div className="text-xl font-semibold text-text-dark mb-2">Test Coverage</div>
                <div className="text-text-light">During rapid development</div>
                <div className="mt-4 text-sm text-primary-orange font-medium">
                  Quality maintained at speed
                </div>
              </div>

              <div className="text-center p-8 bg-white rounded-card shadow-component">
                <div className="text-5xl font-bold text-primary-teal mb-4">0</div>
                <div className="text-xl font-semibold text-text-dark mb-2">Architectural Drift</div>
                <div className="text-text-light">Across 50+ implementations</div>
                <div className="mt-4 text-sm text-primary-teal font-medium">
                  Perfect consistency
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Implementation */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-dark mb-6">
                Technical Foundation
              </h2>
              <p className="text-xl text-text-light">
                Built on domain-driven design principles with modern development practices
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 p-6 rounded-card">
                <h3 className="text-lg font-semibold text-text-dark mb-4">Architecture Patterns</h3>
                <ul className="space-y-2 text-text-light">
                  <li>• Domain-Driven Design (DDD)</li>
                  <li>• CQRS-lite for read/write separation</li>
                  <li>• Repository pattern for data access</li>
                  <li>• Workflow orchestration engine</li>
                  <li>• Multi-LLM integration strategy</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-primary-orange/5 to-primary-teal/5 p-6 rounded-card">
                <h3 className="text-lg font-semibold text-text-dark mb-4">Quality Assurance</h3>
                <ul className="space-y-2 text-text-light">
                  <li>• Comprehensive test automation</li>
                  <li>• Async session management</li>
                  <li>• Circuit breaker patterns</li>
                  <li>• Graceful degradation handling</li>
                  <li>• Real-time monitoring integration</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-12">
              <CTAButton
                href="/blog"
                variant="outline"
                size="lg"
              >
                Read Implementation Details
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-text-dark py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup
              title="Master the Methodology"
              description="Get weekly insights into our systematic approach, implementation patterns, and methodology breakthroughs."
              benefits={[
                "Step-by-step methodology breakdowns",
                "Implementation pattern libraries",
                "Behind-the-scenes development insights",
                "Early access to new frameworks and tools"
              ]}
              background="dark"
              privacyNotice="No spam, unsubscribe anytime. Join 576+ PM professionals learning systematic excellence."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
