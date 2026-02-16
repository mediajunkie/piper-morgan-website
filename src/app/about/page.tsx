import type { Metadata } from 'next';
import Link from 'next/link';
import { generateSEOMetadata } from '@/lib/domain-utils';
import { Hero, CTAButton } from '@/components';

const seoData = generateSEOMetadata(
  'About Piper Morgan',
  'What is Piper Morgan? An AI-powered product management assistant built as an experiment in ethical AI development, documented in public from day one.',
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
        headline="What is Piper Morgan?"
        subheadline={
          <p className="text-lg md:text-xl">
            An AI-powered product management assistant — a colleague who helps you stay on top
            of everything without losing sight of what matters.
          </p>
        }
        background="gradient"
        align="center"
      />

      {/* But that's not the whole story */}
      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-text-light dark:text-gray-400 text-center italic mb-16">
              But that&apos;s not quite the whole story.
            </p>

            {/* The Experiment */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-white mb-6">
                The experiment
              </h2>
              <div className="space-y-6 text-lg text-text-light dark:text-gray-400">
                <p>
                  Piper Morgan started as a question: <em>What if we built an AI assistant
                  according to our actual values, instead of optimizing for engagement metrics?</em>
                </p>
                <p>
                  No venture funding. No growth targets. No pressure to ship fast and fix later.
                  Just one product manager with decades of experience, a $0 infrastructure stack,
                  and the time to do things right.
                </p>
                <p>
                  The result is an ongoing experiment in ethical AI development, documented in
                  public from day one.
                </p>
              </div>
            </div>

            {/* Who's behind this */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-white mb-6">
                Who&apos;s behind this
              </h2>
              <div className="space-y-6 text-lg text-text-light dark:text-gray-400">
                <p>
                  <strong className="text-text-dark dark:text-white">Christian Crumlish</strong> (xian)
                  has been building social software and digital products since the web was young.
                  Yahoo. Grubhub. Typepad. Co-author of <em>Designing Social Interfaces</em> (O&apos;Reilly).
                  Currently exploring what it means to have AI as a genuine collaborator rather than
                  just a tool.
                </p>
                <p>
                  Piper Morgan is built with significant help from Claude (Anthropic) and a methodology
                  that treats AI agents as professional colleagues — with appropriate boundaries.
                </p>
              </div>
            </div>

            {/* The name */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-white mb-6">
                The name
              </h2>
              <div className="space-y-6 text-lg text-text-light dark:text-gray-400">
                <p>
                  Piper Morgan is named in the tradition of AI assistants with human names, but with
                  intention. Piper suggests someone who leads, who sets a tempo. Morgan suggests
                  wisdom, guidance, mentorship. Together: a colleague who helps you think bigger.
                </p>
                <p className="text-base italic">
                  (And yes, there&apos;s a bit of a wink at &quot;PM&quot; in the initials.)
                </p>
              </div>
            </div>

            {/* Where this is going */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-white mb-6">
                Where this is going
              </h2>
              <div className="space-y-6 text-lg text-text-light dark:text-gray-400">
                <p>
                  <strong className="text-text-dark dark:text-white">The immediate goal:</strong> a
                  working tool that helps product managers do their jobs better.
                </p>
                <p>
                  <strong className="text-text-dark dark:text-white">The larger ambition:</strong>{' '}
                  demonstrating that AI development can be thoughtful, transparent, and humane — that
                  you don&apos;t have to choose between capability and ethics.
                </p>
                <p>
                  We&apos;re building in public because we think the process matters as much as the
                  product. Maybe more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Follow Along CTAs */}
      <section className="py-16 md:py-24 bg-surface dark:bg-gray-900">
        <div className="site-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-white mb-8 text-center">
              Follow along
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/blog" variant="outline">
                Read the blog →
              </CTAButton>
              <CTAButton href="/methodology" variant="outline">
                Explore the methodology →
              </CTAButton>
              <CTAButton href="/try" variant="primary">
                Try Piper →
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <section className="py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="site-container">
          <div className="flex justify-between items-center text-sm">
            <Link
              href="/methodology"
              className="text-text-light dark:text-gray-500 hover:text-primary-teal-text dark:hover:text-primary-teal"
            >
              ← How we work
            </Link>
            <Link
              href="/get-involved"
              className="text-text-light dark:text-gray-500 hover:text-primary-teal-text dark:hover:text-primary-teal"
            >
              Get involved →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
