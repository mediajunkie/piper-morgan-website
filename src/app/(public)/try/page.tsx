import { Metadata } from 'next';
import Link from 'next/link';
import { Hero, CTAButton } from '@/components';

const canonicalUrl = 'https://pipermorgan.ai/try/';

export const metadata: Metadata = {
  title: 'Try Piper Morgan | Get Started',
  description: 'Choose your path to Piper Morgan. See what the private beta is like, or join the waiting list for an invitation or a note when the public beta starts.',
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: 'Try Piper Morgan',
    description: 'See the private beta, or join the waiting list.',
    url: canonicalUrl,
  },
};

export default function TryPage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        headline="How ready are you?"
        subheadline={
          <p className="text-lg md:text-xl text-text-light dark:text-gray-400 max-w-2xl mx-auto">
            Piper Morgan is in active development. Some people want to dive in now and help shape it.
            Others prefer to wait until things are smoother.
            <br /><br />
            Both are good. Which sounds like you?
          </p>
        }
        background="surface"
        align="center"
      />

      {/* Choice Cards */}
      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Alpha Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col">
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-primary-teal/10 text-primary-teal-text dark:text-primary-teal text-sm font-medium rounded-full mb-4">
                  For early adopters
                </div>
                <h2 className="text-2xl font-bold text-text-dark dark:text-white mb-4">
                  I&apos;m ready to get my hands dirty
                </h2>
                <p className="text-text-light dark:text-gray-400 mb-6">
                  Piper Morgan is in private beta. It&apos;s hosted and invite-only, so there&apos;s nothing
                  to install. It&apos;s early, with rough edges, and your feedback is read by the team.
                </p>
                <ul className="space-y-2 text-sm text-text-light dark:text-gray-400 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-teal mt-0.5">✓</span>
                    <span>Invite-only, nothing to install</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-teal mt-0.5">✓</span>
                    <span>Bring your own Anthropic API key. Piper doesn&apos;t cover model costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-teal mt-0.5">✓</span>
                    <span>Works with GitHub and Google Calendar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-teal mt-0.5">✓</span>
                    <span>Your feedback reaches the team building it</span>
                  </li>
                </ul>
              </div>
              <CTAButton href="/try/invite" variant="primary" size="lg" className="w-full justify-center">
                See what the beta is like →
              </CTAButton>
            </div>

            {/* Beta Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col">
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-primary-orange/10 text-orange-700 dark:text-orange-400 text-sm font-medium rounded-full mb-4">
                  For the curious
                </div>
                <h2 className="text-2xl font-bold text-text-dark dark:text-white mb-4">
                  Join the waiting list
                </h2>
                <p className="text-text-light dark:text-gray-400 mb-6">
                  Piper Morgan is in private beta. We&apos;re sending invitations in waves, so we can meet
                  the needs of our beta testers. Sign up for the waiting list, or to hear when the public beta starts.
                </p>
                <ul className="space-y-2 text-sm text-text-light dark:text-gray-400 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-orange mt-0.5">✓</span>
                    <span>No setup needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-orange mt-0.5">✓</span>
                    <span>A place on the waiting list</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-orange mt-0.5">✓</span>
                    <span>A note when the public beta starts</span>
                  </li>
                </ul>
              </div>
              <CTAButton href="/try/beta" variant="secondary" size="lg" className="w-full justify-center">
                Join the waiting list →
              </CTAButton>
            </div>

          </div>

          {/* Bottom Note */}
          <p className="text-center text-sm text-text-light dark:text-gray-500 mt-12 max-w-xl mx-auto">
            Not sure? That&apos;s okay. You can always{' '}
            <Link href="/blog" className="text-primary-teal-text dark:text-primary-teal hover:underline">
              read about the journey
            </Link>{' '}
            first, or{' '}
            <Link href="/about" className="text-primary-teal-text dark:text-primary-teal hover:underline">
              learn more about the project
            </Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
