import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero, CTAButton } from '@/components';

export const metadata: Metadata = {
  title: 'The Excellence Flywheel | Piper Morgan Methodology',
  description: 'Learn how we build AI that actually helps. Our systematic approach to human-AI collaboration compounds quality over time.',
  openGraph: {
    title: 'The Excellence Flywheel | Piper Morgan',
    description: 'Building AI that actually helps requires more than good intentions. It requires systematic methodology.',
  },
};

export default function MethodologyPage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        headline="The Excellence Flywheel"
        subheadline={
          <p className="text-lg md:text-xl text-text-light dark:text-gray-400 max-w-2xl mx-auto">
            Building AI that actually helps requires more than good intentions.
            It requires systematic methodology — the kind that compounds over time.
          </p>
        }
        background="gradient"
        align="center"
      />

      {/* Core Principles */}
      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="max-w-4xl mx-auto">

            {/* Principles Grid */}
            <div className="space-y-12">

              {/* Principle 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-teal/10 text-primary-teal rounded-lg flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-dark dark:text-white mb-3">
                    Verification before implementation
                  </h2>
                  <p className="text-text-light dark:text-gray-400">
                    Before writing code, we verify assumptions. Check existing patterns.
                    Understand what&apos;s actually there. This takes longer at the start
                    and saves time everywhere else.
                  </p>
                </div>
              </div>

              {/* Principle 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-teal/10 text-primary-teal rounded-lg flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-dark dark:text-white mb-3">
                    Tests before features
                  </h2>
                  <p className="text-text-light dark:text-gray-400">
                    We write the test first. Not because it&apos;s trendy, but because it
                    forces clarity about what &quot;working&quot; actually means. If you can&apos;t
                    test it, you don&apos;t understand it yet.
                  </p>
                </div>
              </div>

              {/* Principle 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-teal/10 text-primary-teal rounded-lg flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-dark dark:text-white mb-3">
                    Documentation as you go
                  </h2>
                  <p className="text-text-light dark:text-gray-400">
                    Decisions get documented when they&apos;re made, not reconstructed later.
                    Architecture Decision Records (ADRs) capture the why, not just the what.
                  </p>
                </div>
              </div>

              {/* Principle 4 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-teal/10 text-primary-teal rounded-lg flex items-center justify-center font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-dark dark:text-white mb-3">
                    Cross-validation by default
                  </h2>
                  <p className="text-text-light dark:text-gray-400">
                    Different AI agents check each other&apos;s work. One builds, another validates.
                    Mistakes get caught before they compound.
                  </p>
                </div>
              </div>

              {/* Principle 5 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-teal/10 text-primary-teal rounded-lg flex items-center justify-center font-bold">
                    5
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-dark dark:text-white mb-3">
                    Systematic kindness
                  </h2>
                  <p className="text-text-light dark:text-gray-400">
                    Excellence doesn&apos;t have to be harsh. Our methodology assumes good intentions,
                    explains the why, and makes learning feel safe. Rigor and warmth aren&apos;t opposites.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-16 md:py-24 bg-surface dark:bg-gray-900">
        <div className="site-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-text-dark dark:text-white mb-6">
              Why this matters for AI
            </h2>
            <div className="space-y-6 text-lg text-text-light dark:text-gray-400">
              <p>
                Most AI development moves fast and breaks things. That works until it doesn&apos;t —
                until the accumulated shortcuts create systems that are fragile, opaque, or harmful.
              </p>
              <p>
                We&apos;re building something meant to last. Something meant to be trusted.
                That requires a different pace and a different discipline.
              </p>
              <p className="text-xl font-semibold text-text-dark dark:text-white">
                The methodology is the product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Go Deeper CTA */}
      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-primary-teal/10 to-primary-orange/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl font-bold text-text-dark dark:text-white mb-4">
                Want to go deeper?
              </h2>
              <p className="text-text-light dark:text-gray-400 mb-8 max-w-xl mx-auto">
                Our full methodology documentation is available on pmorgan.tech, including
                the pattern catalog, Architecture Decision Records, and session logging protocols.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="https://pmorgan.tech" variant="primary" external>
                  Explore the methodology →
                </CTAButton>
                <CTAButton href="/blog" variant="outline">
                  Read the journey
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <section className="py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="site-container">
          <div className="flex justify-between items-center text-sm">
            <Link
              href="/about"
              className="text-text-light dark:text-gray-500 hover:text-primary-teal-text dark:hover:text-primary-teal"
            >
              ← About the project
            </Link>
            <Link
              href="/try"
              className="text-text-light dark:text-gray-500 hover:text-primary-teal-text dark:hover:text-primary-teal"
            >
              Try Piper →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
