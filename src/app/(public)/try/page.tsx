import { Metadata } from 'next';
import Link from 'next/link';
import { Hero, CTAButton } from '@/components';

export const metadata: Metadata = {
  title: 'Try Piper Morgan | Get Started',
  description: 'Choose your path to experience Piper Morgan. Join our alpha for hands-on testing or sign up for the beta waitlist.',
  openGraph: {
    title: 'Try Piper Morgan',
    description: 'Choose your path to experience Piper Morgan. Alpha testing or beta waitlist.',
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
                  Join our alpha testers. You&apos;ll need to set up a local development environment,
                  and things will break sometimes. But you&apos;ll be among the first to experience
                  what we&apos;re building — and your feedback will directly shape Piper&apos;s development.
                </p>
                <ul className="space-y-2 text-sm text-text-light dark:text-gray-400 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-teal mt-0.5">✓</span>
                    <span>Setup required (command line, environment)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-teal mt-0.5">✓</span>
                    <span>Direct influence on development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-teal mt-0.5">✓</span>
                    <span>Real usage for your actual work</span>
                  </li>
                </ul>
              </div>
              <CTAButton href="/try/alpha" variant="primary" size="lg" className="w-full justify-center">
                Join the alpha →
              </CTAButton>
            </div>

            {/* Beta Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col">
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-primary-orange/10 text-primary-orange text-sm font-medium rounded-full mb-4">
                  For the curious
                </div>
                <h2 className="text-2xl font-bold text-text-dark dark:text-white mb-4">
                  Keep me posted
                </h2>
                <p className="text-text-light dark:text-gray-400 mb-6">
                  Join the beta waitlist. We&apos;ll let you know when Piper is ready for broader
                  testing — probably in the next few months. No setup required. Just leave your
                  email and we&apos;ll reach out when it&apos;s time.
                </p>
                <ul className="space-y-2 text-sm text-text-light dark:text-gray-400 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-orange mt-0.5">✓</span>
                    <span>No technical setup needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-orange mt-0.5">✓</span>
                    <span>Notification when beta opens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-orange mt-0.5">✓</span>
                    <span>Smoother experience</span>
                  </li>
                </ul>
              </div>
              <CTAButton href="/try/beta" variant="secondary" size="lg" className="w-full justify-center">
                Join the waitlist →
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
