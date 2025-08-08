import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';
import { Hero, CTAButton, NewsletterSignup } from '@/components';

const seoData = generateSEOMetadata(
  'About Piper Morgan',
  'Learn about the project, methodology, and the team behind Piper Morgan',
  { canonical: 'https://pipermorgan.ai/about' }
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

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        headline="Building in public:"
        highlightText="systematic excellence"
        subheadline="The story behind Piper Morgan—from learning project to comprehensive AI-powered Product Management methodology. Meet the team, understand the mission, and see how we're transforming PM work through transparent development."
        primaryCTA={{
          text: "See How It Works",
          href: "/how-it-works"
        }}
        secondaryCTA={{
          text: "Follow the Journey",
          href: "/newsletter"
        }}
        background="surface"
        align="center"
      />

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Origin Story */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-text-dark mb-6">
                Origin Story: From Experiment to Methodology
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-text-light mb-6">
                  Piper Morgan began as a systematic experiment in AI-assisted product management. What would happen if we treated AI collaboration as a core PM skill, documented every decision, and shared every breakthrough?
                </p>
                <p className="text-lg text-text-light mb-6">
                  The answer surprised us. By applying systematic verification, test-driven development, and transparent methodology development, we didn't just build a tool—we discovered an entirely new approach to PM excellence that compounds over time.
                </p>
                <p className="text-lg text-text-light mb-6">
                  Today, Piper Morgan demonstrates how AI can systematically enhance human PM expertise through verified patterns, ethical boundaries, and systematic excellence. Every feature we build proves that AI augmentation, done right, creates capabilities neither human nor AI could achieve alone.
                </p>
              </div>
            </div>

            {/* The Excellence Flywheel Methodology */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-text-dark mb-6">
                The Excellence Flywheel Methodology
              </h2>
              <div className="bg-surface p-8 rounded-card mb-8">
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  Systematic Excellence Through AI Collaboration
                </h3>
                <p className="text-text-light mb-6">
                  Our breakthrough methodology turns each implementation into accelerated future work. Through systematic verification, multi-agent coordination, and transparent development, we've achieved implementation speeds that seemed impossible while maintaining 100% quality standards.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-3">The Four Pillars</h4>
                    <ul className="space-y-3 text-text-light">
                      <li><strong className="text-text-dark">Systematic Verification First:</strong> Always check existing patterns before implementing. This single practice delivers 300-500% speed improvements.</li>
                      <li><strong className="text-text-dark">Test-Driven Development:</strong> Tests drive architecture. 100% coverage maintained even during rapid development.</li>
                      <li><strong className="text-text-dark">Multi-Agent Coordination:</strong> Strategic deployment of specialized AI agents with clear handoff protocols.</li>
                      <li><strong className="text-text-dark">GitHub-First Tracking:</strong> Every decision tracked with clear acceptance criteria and systematic documentation.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-3">Proven Breakthrough Results</h4>
                    <ul className="space-y-3 text-text-light">
                      <li><strong className="text-text-dark">15-minute ADR migrations</strong> (previously 2+ hours)</li>
                      <li><strong className="text-text-dark">Zero architectural drift</strong> across 50+ implementations</li>
                      <li><strong className="text-text-dark">642x performance improvements</strong> through systematic optimization</li>
                      <li><strong className="text-text-dark">Ethics-first architecture</strong> that makes violations technically impossible</li>
                      <li><strong className="text-text-dark">100% test success rates</strong> maintained during rapid feature development</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary-teal/10 to-primary-orange/10 p-6 rounded-lg">
                  <h4 className="font-semibold text-text-dark mb-2">The Compound Effect</h4>
                  <p className="text-text-light">
                    Each verified pattern becomes a reusable asset. Each test becomes future confidence. Each documentation update becomes team knowledge. This creates a flywheel where every implementation makes the next one faster and more reliable.
                  </p>
                </div>
              </div>

              <CTAButton
                href="/how-it-works"
                variant="outline"
                size="md"
              >
                Deep Dive: How Our Methodology Works
              </CTAButton>
            </div>

            {/* Meet Christian */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-text-dark mb-6">
                Meet Christian: PM × AI Integration Specialist
              </h2>
              <div className="bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 p-8 rounded-card">
                <p className="text-lg text-text-light mb-6">
                  Christian Rondeau is a product management professional with deep expertise in civic technology, systematic methodology development, and AI integration. Through Piper Morgan, he's demonstrating how AI can systematically enhance rather than replace human PM expertise.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-semibold text-text-dark mb-3">Background & Philosophy</h4>
                    <ul className="space-y-2 text-text-light">
                      <li>• <strong>Senior Product Manager</strong> with civic technology focus at Kind Systems</li>
                      <li>• <strong>AI Integration Pioneer</strong> developing practical human-AI collaboration patterns</li>
                      <li>• <strong>Systematic Excellence Advocate</strong> proving that rigorous methodology accelerates rather than slows development</li>
                      <li>• <strong>Building-in-Public Practitioner</strong> sharing every decision, breakthrough, and lesson learned</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark mb-3">Vision for PM × AI</h4>
                    <p className="text-text-light mb-4">
                      "AI doesn't replace PM judgment—it amplifies it systematically. Through transparent methodology development and ethical-first architecture, we're proving that human-AI collaboration can achieve capabilities neither could reach alone."
                    </p>
                    <p className="text-text-light">
                      <strong>Current Mission:</strong> Demonstrate that AI-augmented product management, done with systematic excellence, creates compound value that transforms how we approach strategic work.
                    </p>
                  </div>
                </div>

                <div className="bg-white/50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-text-dark mb-3">Why This Matters</h4>
                  <p className="text-text-light">
                    The product management profession is at an inflection point. AI tools promise to "replace" PM work, but that misses the real opportunity: <strong>systematic augmentation</strong> that preserves human strategic thinking while accelerating execution and insights. Piper Morgan proves this approach works.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <CTAButton
                    href="https://twitter.com/mediajunkie"
                    variant="outline"
                    size="sm"
                    external
                  >
                    Follow on Twitter
                  </CTAButton>
                  <CTAButton
                    href="https://linkedin.com/in/christianrondeau"
                    variant="outline"
                    size="sm"
                    external
                  >
                    Connect on LinkedIn
                  </CTAButton>
                  <CTAButton
                    href="https://medium.com/building-piper-morgan"
                    variant="outline"
                    size="sm"
                    external
                  >
                    Read Building-in-Public Updates
                  </CTAButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-text-dark py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup
              title="Join the systematic excellence journey"
              description="Get behind-the-scenes insights into our methodology development, breakthrough discoveries, and practical frameworks you can apply to your own PM work. Watch as we transform AI-assisted product management from experiment to systematic practice."
              benefits={[
                "Weekly methodology insights and breakthrough discoveries",
                "Behind-the-scenes development updates and decision rationale",
                "Early access to new tools and systematic frameworks",
                "Practical templates and patterns you can immediately apply",
                "Direct insight into human-AI collaboration patterns that actually work"
              ]}
              background="dark"
              compact={false}
              privacyNotice="No spam, unsubscribe anytime. Join 576+ PM professionals learning systematic excellence."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
