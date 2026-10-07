import type { Metadata } from 'next';
import Link from 'next/link';
import { generateSEOMetadata } from '@/lib/domain-utils';

// PM-owned fills. Leave null until PM supplies each value; the page marks the gap visibly.
const SUPPORT_ADDRESS: string | null = 'support@pipermorgan.ai';
const RESPONSE_DAYS: string | null = 'two';
// Flip to true only after the Connected apps "Revoke" fix is live and seen working.
const REVOKE_IN_SETTINGS_LIVE = false;

const seoData = generateSEOMetadata(
  'Support - Piper Morgan',
  'How to get help with Piper Morgan, connect Piper to ChatGPT or Claude, and fix common problems.',
  { canonical: 'https://pipermorgan.ai/support' }
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

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="site-container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-text-dark mb-8">Piper Morgan support</h1>

          <div className="prose prose-lg max-w-none space-y-8 text-text-light">
            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">Contact</h2>
              <p>
                {SUPPORT_ADDRESS ? (
                  <a
                    href={`mailto:${SUPPORT_ADDRESS}`}
                    className="text-primary-teal-text hover:underline"
                  >
                    {SUPPORT_ADDRESS}
                  </a>
                ) : (
                  <strong>[Support address: PM to choose]</strong>
                )}
                . We read every message. During the beta, expect a reply within{' '}
                {RESPONSE_DAYS ? RESPONSE_DAYS : <strong>[N]</strong>} business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                Connecting Piper to ChatGPT or Claude
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Add a connector with the URL{' '}
                  <code className="text-text-dark before:content-none after:content-none">https://mcp.pipermorgan.ai/mcp</code>.
                </li>
                <li>You&apos;ll be sent to Piper to sign in and approve read-only access.</li>
                <li>
                  Then ask your assistant: &ldquo;What does Piper know about me?&rdquo;
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                Something isn&apos;t working
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <em>&ldquo;No tools&rdquo; or &ldquo;action discovery failed&rdquo;:</em> remove
                  the connector and add it again, so your assistant picks up Piper&apos;s current
                  tools.
                </li>
                <li>
                  <em>The assistant says it has no access:</em> you may have revoked it, or it may
                  have expired. Reconnect from your assistant.
                </li>
                <li>
                  <em>Parts of the answer are empty:</em> that&apos;s expected, not broken. Piper only
                  reports what&apos;s actually there, and a new account doesn&apos;t have much yet.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">Removing access</h2>
              <p>
                {REVOKE_IN_SETTINGS_LIVE
                  ? 'You can revoke access in Settings → Connected apps in Piper, or remove Piper from your assistant.'
                  : 'Remove Piper from your assistant.'}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">Privacy</h2>
              <p>
                See our{' '}
                <Link href="/privacy" className="text-primary-teal-text hover:underline">
                  privacy policy
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
