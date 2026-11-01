import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components';
import { NewsletterSignup } from '@/components/organisms/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Join the Waiting List | Piper Morgan',
  description: 'Piper Morgan is in private beta, with invitations going out in waves. Join the waiting list, or hear when the public beta starts.',
  alternates: {
    canonical: 'https://pipermorgan.ai/try/beta/',
  },
};

export default function BetaPage() {
  return (
    <main>
      <Hero
        headline="Join the waiting list"
        subheadline={
          <p className="text-lg md:text-xl text-text-light dark:text-gray-400 max-w-2xl mx-auto">
            Piper Morgan is in private beta. We&apos;re sending invitations in waves, so we can meet
            the needs of our beta testers.
          </p>
        }
        background="surface"
        align="center"
      />

      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="max-w-xl mx-auto">
            <NewsletterSignup
              title="Sign up"
              description="Join the waiting list for an invitation, or to hear when the public beta starts."
              benefits={[
                "A place on the waiting list",
                "A note when the public beta starts",
                "No setup needed",
              ]}
              submitText="Join the waiting list"
              successMessage="You're on the list. Check your inbox (and spam folder) for the confirmation link."
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
