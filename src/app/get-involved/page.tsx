import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/domain-utils";
import { Hero, NewsletterSignup, NewsletterErrorBoundary, CTAButton } from "@/components";

const seoData = generateSEOMetadata(
  "Get Involved - Join 576+ PM Professionals Learning Systematic AI Collaboration",
  "Follow the Piper Morgan methodology development journey. Weekly insights, breakthrough discoveries, and practical frameworks for systematic AI-human collaboration.",
  { canonical: "https://pipermorgan.ai/get-involved" }
);

export const metadata: Metadata = {
  title: seoData.title,
  description: seoData.description,
  keywords: seoData.keywords,
  openGraph: seoData.openGraph,
  twitter: seoData.twitter,
  alternates: {
    canonical: seoData.canonical,
  },
};

export default function GetInvolvedPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        headline="Follow the systematic excellence"
        highlightText="methodology development"
        subheadline="Get weekly insights into our breakthrough discoveries, behind-the-scenes development updates, and practical frameworks you can apply to your own AI collaboration work. Join 635+ PM professionals learning systematic AI collaboration."
        primaryCTA={{
          text: "Join the Community",
          href: "#newsletter",
        }}
        secondaryCTA={{
          text: "See Our Methodology",
          href: "/how-it-works",
        }}
        background="gradient"
        align="center"
        showLogo={true}
      />

      {/* Primary Newsletter Engagement */}
      <section className="py-16" id="newsletter">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-text-dark mb-4">
                Join 635+ PM Professionals Learning Systematic Excellence
              </h2>
              <p className="text-xl text-text-light">
                Get weekly insights into our methodology development,
                breakthrough discoveries, and practical frameworks you can apply
                to your own PM work. This isn&apos;t just another AI
                newsletter—it&apos;s systematic methodology development you can
                learn from and apply.
              </p>
            </div>

            <NewsletterErrorBoundary>
              <NewsletterSignup
                title="Weekly Methodology Insights"
                description="Watch as we transform AI-assisted product management from experiment to systematic practice through transparent development and rigorous methodology."
                benefits={[
                  "Weekly methodology insights and breakthrough discoveries",
                  "Behind-the-scenes development updates and decision rationale",
                  "Early access to new tools and systematic frameworks",
                  "Practical templates and patterns you can immediately apply",
                  "Direct insight into human-AI collaboration patterns that actually work",
                  "Exclusive case studies and implementation learnings",
                ]}
                background="surface"
                compact={false}
                source="get-involved"
                metadata={{
                  page_context: "primary-engagement-cta"
                }}
                privacyNotice="No spam, unsubscribe anytime. Join the growing community of PM professionals learning systematic excellence."
              />
            </NewsletterErrorBoundary>

            <div className="mt-8">
              <div className="bg-white p-6 rounded-card shadow-sm max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-text-dark mb-4 text-center">
                  Why PM Professionals Choose This Newsletter
                </h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-primary-teal rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">📊</span>
                    </div>
                    <p className="font-medium text-text-dark">
                      Methodology Breakthroughs
                    </p>
                    <p className="text-text-light">
                      15-minute ADR migrations, 100% test coverage, zero
                      architectural drift
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-primary-orange rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">🔍</span>
                    </div>
                    <p className="font-medium text-text-dark">
                      Building-in-Public Transparency
                    </p>
                    <p className="text-text-light">
                      Complete transparency into development process and
                      systematic approach
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-primary-teal rounded-lg flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">🚀</span>
                    </div>
                    <p className="font-medium text-text-dark">
                      Systematic Excellence Tools
                    </p>
                    <p className="text-text-light">
                      First access to frameworks, templates, and proven patterns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Content Streams */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              Follow the Building-in-Public Journey
            </h2>
            <p className="text-lg text-text-light mb-12">
              Multiple ways to access the same methodology development content,
              depending on your preferences and timeline.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-card shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  Building Piper Morgan (LinkedIn Newsletter)
                </h3>
                <p className="text-text-light mb-4">
                  Daily development narrative with weekly Ships for real-time
                  progress. Blog posts currently lag 6+ weeks behind development
                  work.
                </p>
                <a
                  href="https://www.linkedin.com/newsletters/building-piper-morgan-7346158338541305856/"
                  className="inline-flex items-center text-primary-teal-text font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  → Subscribe to LinkedIn Newsletter
                </a>
              </div>

              <div className="bg-white p-6 rounded-card shadow-sm">
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  Building Piper Morgan (Medium Publication)
                </h3>
                <p className="text-text-light mb-4">
                  For the impatient: posts appear ~1 week after development, ~5
                  weeks before LinkedIn. Last 20 posts always free to read.
                </p>
                <a
                  href="https://medium.com/building-piper-morgan"
                  className="inline-flex items-center text-primary-orange font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  → Read the Medium Series
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-teal/10 to-primary-orange/10 p-6 rounded-card">
              <h3 className="text-lg font-semibold text-text-dark mb-3">
                The Pygmalion Effect (Rosenverse Talk)
              </h3>
              <p className="text-text-light mb-4">
                Comprehensive August 2025 talk for UX practitioners covering the
                Excellence Flywheel methodology, multi-agent coordination
                patterns, and systematic AI collaboration principles. Free with
                signup.
              </p>
              <a
                href="https://rosenverse.rosenfeldmedia.com/videos/the-pygmalion-effect-in-which-a-vibe-coding-experiment-becomes-a-million-lines"
                className="inline-flex items-center text-primary-teal-text font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                → Watch the Talk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Future Content & More Engagement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-dark mb-8">
              What's Coming + More Ways to Engage
            </h2>

            <div className="bg-white p-8 rounded-card shadow-sm mb-8">
              <h3 className="text-2xl font-semibold text-text-dark mb-4">
                Growing Piper Morgan - A New Series for Broader Applicability
              </h3>
              <p className="text-text-light mb-6">
                The Building Piper Morgan series documents the technical journey
                with full implementation details.{" "}
                <strong>Growing Piper Morgan</strong> will translate the same
                discoveries into broader applicability—systematic AI
                collaboration principles without requiring hands-on development
                experience.
              </p>

              <div className="bg-surface p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-text-dark mb-3">
                  What to expect
                </h4>
                <ul className="space-y-1 text-text-light">
                  <li>
                    • Excellence Flywheel methodology adapted for different
                    roles and contexts
                  </li>
                  <li>
                    • Verification-first patterns for any type of AI
                    collaboration
                  </li>
                  <li>
                    • Multi-agent coordination principles for teams and
                    organizations
                  </li>
                  <li>
                    • Risk-based frameworks for AI evaluation and adoption
                  </li>
                </ul>
              </div>

              <p className="text-text-light mb-4">
                <strong>Timeline:</strong> Early development, no firm launch
                date. Will be hosted on this site when ready.
              </p>

              <div className="bg-primary-teal/10 p-4 rounded-lg">
                <p className="text-text-dark font-medium mb-3">
                  Get notified when Growing Piper Morgan launches:
                </p>
                <p className="text-text-light text-sm">
                  Newsletter subscribers will be the first to know. Additional
                  notification options coming soon.
                </p>
              </div>
            </div>

            <details className="bg-gradient-to-r from-primary-teal/5 to-primary-orange/5 p-6 rounded-card">
              <summary className="text-xl font-semibold text-text-dark cursor-pointer hover:text-primary-teal-text">
                More Ways to Get Involved →
              </summary>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    Test Patterns in Your Own Work
                  </h4>
                  <p className="text-text-light text-sm mb-2">
                    The methodologies we&apos;re developing apply wherever
                    systematic thinking meets AI collaboration. We&apos;re
                    seeking feedback from practitioners testing these approaches
                    across different roles and industries.
                  </p>
                  <p className="text-text-light text-sm italic">
                    Contact:{" "}
                    <a
                      href="mailto:info@pipermorgan.ai"
                      className="text-primary-teal-text hover:underline"
                    >
                      info@pipermorgan.ai
                    </a>
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    Future Alpha Testing Interest
                  </h4>
                  <p className="text-text-light text-sm mb-2">
                    Eventually there may be opportunities to test Piper Morgan
                    directly. Currently focused on methodology
                    development—timeline uncertain for broader access.
                  </p>
                  <p className="text-text-light text-sm italic">
                    Newsletter subscribers will be notified of any future
                    opportunities.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    Organizational AI Collaboration
                  </h4>
                  <p className="text-text-light text-sm mb-2">
                    The patterns we&apos;re discovering appear applicable for
                    teams and organizations adopting AI tools systematically.
                    Limited availability—primary focus remains methodology
                    development.
                  </p>
                  <p className="text-text-light text-sm italic">
                    Professional inquiries:{" "}
                    <a
                      href="mailto:info@pipermorgan.ai"
                      className="text-primary-teal-text hover:underline"
                    >
                      info@pipermorgan.ai
                    </a>
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* The Bottom Line */}
      <section className="bg-text-dark py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Learning in Public Because the Best Discoveries Happen When Smart
              People Share What Actually Works
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Whether you follow along casually or contribute actively, you're
              part of developing better approaches to human-AI collaboration.
              The methodology benefits from diverse perspectives and real-world
              application.
            </p>
            <p className="text-gray-300 mb-8">
              Questions about getting involved?{" "}
              <a
                href="mailto:info@pipermorgan.ai"
                className="text-primary-teal-text hover:underline"
              >
                Contact Christian directly
              </a>
              —this is still a personal project with direct communication.
            </p>

            <CTAButton href="#newsletter" variant="primary" size="lg">
              Join the Systematic Excellence Community
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
