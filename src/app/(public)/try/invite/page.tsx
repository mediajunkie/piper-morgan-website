import { Metadata } from 'next';
import Link from 'next/link';
import { Hero, CTAButton } from '@/components';

const canonicalUrl = 'https://pipermorgan.ai/try/invite/';

export const metadata: Metadata = {
  title: 'Join the Private Beta | Piper Morgan',
  description: 'See what the Piper Morgan private beta is like, and join the waiting list for an invitation.',
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: 'Join the Piper Morgan Private Beta',
    description: 'Help shape the future of AI-assisted product management.',
    url: canonicalUrl,
  },
};

export default function InvitePage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        headline="Join the private beta"
        subheadline={
          <p className="text-lg md:text-xl text-text-light dark:text-gray-400 max-w-2xl mx-auto">
            Piper Morgan is in private beta. We&apos;re inviting a small number of product people
            to use it for their real work and tell us what they find.
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
                    <strong className="text-text-dark dark:text-white">Invite-only, nothing to install</strong>
                    <p className="text-text-light dark:text-gray-400 mt-1">
                      Piper runs in your browser. We send you an invite code and you create your account.
                      You connect your own Anthropic API key to use it.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-teal/10 text-primary-teal rounded-full flex items-center justify-center font-semibold text-sm">2</span>
                  <div>
                    <strong className="text-text-dark dark:text-white">Things will break</strong>
                    <p className="text-text-light dark:text-gray-400 mt-1">
                      We&apos;re iterating fast, and bugs are part of the process.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-teal/10 text-primary-teal rounded-full flex items-center justify-center font-semibold text-sm">3</span>
                  <div>
                    <strong className="text-text-dark dark:text-white">Your voice matters</strong>
                    <p className="text-text-light dark:text-gray-400 mt-1">
                      Your feedback reaches the team building it.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-teal/10 text-primary-teal rounded-full flex items-center justify-center font-semibold text-sm">4</span>
                  <div>
                    <strong className="text-text-dark dark:text-white">Real access</strong>
                    <p className="text-text-light dark:text-gray-400 mt-1">
                      You&apos;ll use Piper for your actual work, not a sandbox.
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
                  <span>An Anthropic API key of your own. Piper doesn&apos;t provide or pay for model usage</span>
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
                Want in?
              </h2>
              <p className="text-text-light dark:text-gray-400 mb-6">
                Join the waiting list. We&apos;re sending invitations in waves, so we can meet the needs of
                our beta testers, and we can&apos;t promise when yours will come.
              </p>
              <CTAButton
                href="/try/beta"
                variant="primary"
                size="lg"
              >
                Join the waiting list →
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
                  href="mailto:support@pipermorgan.ai"
                  className="text-primary-teal-text dark:text-primary-teal hover:underline"
                >
                  support@pipermorgan.ai
                </a>
                . We&apos;re happy to chat, and to hear about the product work you do.
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
