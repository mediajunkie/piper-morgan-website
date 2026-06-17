import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components';
import { NewsletterSignup } from '@/components/organisms/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Join the Waitlist | Piper Morgan',
  description: 'Sign up for early beta access to Piper Morgan — AI-powered product management assistance built in public.',
};

export default function BetaPage() {
  return (
    <main>
      <Hero
        headline="Join the waitlist"
        subheadline={
          <p className="text-lg md:text-xl text-text-light dark:text-gray-400 max-w-2xl mx-auto">
            Piper Morgan isn&apos;t quite ready for everyone yet — but it&apos;s getting close.
            Leave your email and we&apos;ll reach out when beta opens.
          </p>
        }
        background="surface"
        align="center"
      />

      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="max-w-xl mx-auto">
            <NewsletterSignup
              title="Get early access"
              description="Be among the first to try Piper Morgan when beta opens. We'll email you directly — no mass-blast, just a personal note."
              benefits={[
                "First access when beta opens",
                "Help shape the product with your feedback",
                "Weekly updates on what we're building",
              ]}
              submitText="Join Waitlist"
              successMessage="You're on the list. We'll reach out personally when beta opens — keep an eye on your inbox (and spam folder) for the confirmation link."
              source="beta-waitlist"
              background="surface"
            />

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
