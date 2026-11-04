import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components';
import { NewsletterSignup } from '@/components/organisms/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Join the Waiting List | Piper Morgan',
  description: 'Join the Piper Morgan waiting list for a private beta invitation, or a note when the public beta starts.',
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
            We&apos;re sending invitations in waves. Join the waiting list for an invitation, or just
            to hear when the public beta starts.
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
              description="You'll get occasional news and updates from Piper Morgan, and a place on the waiting list for the private beta."
              benefits={[]}
              privacyNotice=""
              consentBefore="I agree to these emails, as described in the"
              consentAfter=". I can unsubscribe at any time."
              submitText="Join the waiting list"
              successMessage="Almost there. Check your email and confirm your address to join the list."
              source="beta-waitlist"
              background="surface"
            />

            <div className="mt-12 text-center">
              <Link
                href="/try/"
                className="text-sm text-text-light dark:text-gray-500 hover:text-primary-teal-text dark:hover:text-primary-teal"
              >
                ← What the beta asks
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
