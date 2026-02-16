import { Metadata } from 'next';
import Link from 'next/link';
import { Hero, CTAButton } from '@/components';

export const metadata: Metadata = {
  title: 'Join the Alpha | Piper Morgan',
  description: 'Join the Piper Morgan alpha program. Help shape the future of AI-assisted product management.',
  openGraph: {
    title: 'Join the Piper Morgan Alpha',
    description: 'Help shape the future of AI-assisted product management.',
  },
};

export default function AlphaPage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        headline="Welcome to the alpha"
        subheadline={
          <p className="text-lg md:text-xl text-text-light dark:text-gray-400 max-w-2xl mx-auto">
            You&apos;re joining a small group of people who are helping shape Piper Morgan
            while it&apos;s still taking form. This is hands-on, early-stage work.
          </p>
        }
        background="surface"
        align="center"
      />

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="max-w-2xl mx-auto">

            {/* What to Expect */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-dark dark:text-white mb-6">
                What to expect
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-teal/10 text-primary-teal rounded-full flex items-center justify-center font-semibold text-sm">1</span>
                  <div>
                    <strong className="text-text-dark dark:text-white">Setup required</strong>
                    <p className="text-text-light dark:text-gray-400 mt-1">
                      You&apos;ll install Piper locally using our developer documentation
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-teal/10 text-primary-teal rounded-full flex items-center justify-center font-semibold text-sm">2</span>
                  <div>
                    <strong className="text-text-dark dark:text-white">Things will break</strong>
                    <p className="text-text-light dark:text-gray-400 mt-1">
                      We&apos;re iterating fast; bugs are part of the process
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-teal/10 text-primary-teal rounded-full flex items-center justify-center font-semibold text-sm">3</span>
                  <div>
                    <strong className="text-text-dark dark:text-white">Your voice matters</strong>
                    <p className="text-text-light dark:text-gray-400 mt-1">
                      Alpha feedback directly influences what we build next
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-teal/10 text-primary-teal rounded-full flex items-center justify-center font-semibold text-sm">4</span>
                  <div>
                    <strong className="text-text-dark dark:text-white">Real access</strong>
                    <p className="text-text-light dark:text-gray-400 mt-1">
                      You&apos;ll use Piper for your actual work, not a sandbox
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* What we're looking for */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-dark dark:text-white mb-6">
                What we&apos;re looking for
              </h2>
              <ul className="space-y-3 text-text-light dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary-teal mt-0.5">•</span>
                  <span>Comfort with technical setup (command line, environment variables, Docker optional)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-teal mt-0.5">•</span>
                  <span>Willingness to report what&apos;s working and what isn&apos;t</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-teal mt-0.5">•</span>
                  <span>Interest in AI-assisted product management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-teal mt-0.5">•</span>
                  <span>Patience with rough edges</span>
                </li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary-teal/10 to-primary-orange/10 rounded-2xl p-8 text-center mb-12">
              <h2 className="text-2xl font-bold text-text-dark dark:text-white mb-4">
                Ready?
              </h2>
              <p className="text-text-light dark:text-gray-400 mb-6">
                This will take you to pmorgan.tech, our developer documentation site,
                where you&apos;ll find the installation guide.
              </p>
              <CTAButton
                href="https://pmorgan.tech"
                variant="primary"
                size="lg"
                external
              >
                Start Alpha Setup →
              </CTAButton>
            </div>

            {/* Questions Section */}
            <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-text-dark dark:text-white mb-2">
                Have questions first?
              </h3>
              <p className="text-text-light dark:text-gray-400">
                Email us at{' '}
                <a
                  href="mailto:alpha@pipermorgan.ai"
                  className="text-primary-teal-text dark:text-primary-teal hover:underline"
                >
                  alpha@pipermorgan.ai
                </a>
                {' '}— we&apos;re happy to chat before you commit.
              </p>
            </div>

            {/* Back Link */}
            <div className="mt-12 text-center">
              <Link
                href="/try"
                className="text-sm text-text-light dark:text-gray-500 hover:text-primary-teal-text dark:hover:text-primary-teal"
              >
                ← Back to options
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
