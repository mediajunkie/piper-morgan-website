import { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components';

const canonicalUrl = 'https://pipermorgan.ai/try/alpha/';

export const metadata: Metadata = {
  title: 'Join the Alpha | Piper Morgan',
  description: 'Join the Piper Morgan alpha program. Help shape the future of AI-assisted product management.',
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: 'Join the Piper Morgan Alpha',
    description: 'Help shape the future of AI-assisted product management.',
    url: canonicalUrl,
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
                    <strong className="text-text-dark dark:text-white">Invite-only, nothing to install</strong>
                    <p className="text-text-light dark:text-gray-400 mt-1">
                      The alpha runs in your browser. We send you an invite code and you create your account
                    </p>
                    <p className="text-text-light dark:text-gray-400 mt-2">
                      There are two ways to use Piper. Connect your own LLM provider key to use the web app,
                      or install Piper&apos;s plugin in Claude to bring Piper&apos;s skills and what it knows about
                      your work into a chat you already use.
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
                  <span>An API key from your own LLM provider. Piper doesn&apos;t provide or pay for LLM usage, so you bring your own</span>
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
                Interested?
              </h2>
              <p className="text-text-light dark:text-gray-400">
                The alpha is invite-only, and we haven&apos;t opened a public way to request an invite yet.
                Check back here soon.
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
