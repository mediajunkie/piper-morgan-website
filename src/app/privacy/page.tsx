import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/domain-utils';

const seoData = generateSEOMetadata(
  'Privacy Policy - Piper Morgan',
  'Privacy policy for the Piper Morgan website and newsletter. Learn how we collect, use, and protect your personal information.',
  { canonical: 'https://pipermorgan.ai/privacy' }
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

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-text-dark mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-8 text-text-light">
            <div className="bg-primary-teal/10 p-6 rounded-lg mb-8">
              <p className="text-text-dark font-medium mb-2">
                <strong>Last updated:</strong> September 2025
              </p>
              <p className="text-text-dark">
                This privacy policy explains how Piper Morgan collects, uses, and protects your personal information when you visit our website and subscribe to our newsletter.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-text-dark mb-3">
                Newsletter Subscription
              </h3>
              <p>When you subscribe to our newsletter, we collect:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Email address:</strong> Required to send you newsletter content</li>
                <li><strong>Consent timestamp:</strong> Records when you provided GDPR consent</li>
                <li><strong>Signup source:</strong> Tracks which page you subscribed from</li>
                <li><strong>IP address:</strong> Collected automatically by our email service provider</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-dark mb-3">
                Website Analytics
              </h3>
              <p className="mb-4">We use web analytics to understand how visitors use our site:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Pages visited and time spent on site</li>
                <li>Referring websites and search terms</li>
                <li>Device and browser information</li>
                <li>General location (country/city level)</li>
              </ul>

              <p className="text-sm italic">
                We do not use Google Analytics or other third-party tracking services that create detailed user profiles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                How We Use Your Information
              </h2>
              
              <h3 className="text-xl font-semibold text-text-dark mb-3">
                Newsletter Communications
              </h3>
              <p className="mb-4">We use your email address to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Send weekly newsletter content about AI-powered product management</li>
                <li>Share methodology insights and building-in-public updates</li>
                <li>Notify you about new features or significant site updates</li>
                <li>Send double opt-in confirmation emails (required by law)</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-dark mb-3">
                Website Improvement
              </h3>
              <p className="mb-6">
                We use aggregated analytics data to improve our content and user experience. This data cannot be used to identify individual users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                Data Sharing and Third Parties
              </h2>
              
              <h3 className="text-xl font-semibold text-text-dark mb-3">
                Email Service Provider
              </h3>
              <p className="mb-4">
                We use <strong>ConvertKit</strong> to manage our newsletter subscriptions. ConvertKit is GDPR-compliant and processes your data according to their privacy policy:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Your email and consent data are stored on ConvertKit's secure servers</li>
                <li>ConvertKit may process data in the United States under appropriate safeguards</li>
                <li>You can review ConvertKit's privacy policy at: <a href="https://convertkit.com/privacy" className="text-primary-teal-text hover:underline" target="_blank" rel="noopener noreferrer">https://convertkit.com/privacy</a></li>
              </ul>

              <h3 className="text-xl font-semibold text-text-dark mb-3">
                Website Hosting
              </h3>
              <p className="mb-6">
                Our website is hosted on <strong>GitHub Pages</strong>, which may collect basic server logs including IP addresses and request information. GitHub is GDPR-compliant and you can review their privacy policy at: <a href="https://docs.github.com/en/github/site-policy/github-privacy-statement" className="text-primary-teal-text hover:underline" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement</a>.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <p className="text-yellow-800">
                  <strong>Important:</strong> We never sell, rent, or share your email address with third parties for marketing purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                Your Rights (GDPR)
              </h2>
              
              <p className="mb-4">Under the General Data Protection Regulation (GDPR), you have the following rights:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-dark">Access and Portability</h3>
                  <p>You can request a copy of all personal data we hold about you.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-text-dark">Rectification</h3>
                  <p>You can ask us to correct any inaccurate personal data.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-text-dark">Erasure ("Right to be Forgotten")</h3>
                  <p>You can request that we delete your personal data.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-text-dark">Withdraw Consent</h3>
                  <p>You can withdraw your consent at any time by unsubscribing from our newsletter.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-text-dark">Object to Processing</h3>
                  <p>You can object to how we process your data for marketing purposes.</p>
                </div>
              </div>

              <div className="bg-primary-teal/10 p-4 rounded-lg mt-6">
                <p className="text-text-dark">
                  <strong>To exercise any of these rights:</strong> Contact us at{' '}
                  <a href="mailto:privacy@pipermorgan.ai" className="text-primary-teal-text hover:underline">
                    privacy@pipermorgan.ai
                  </a>{' '}
                  or use the unsubscribe link in any newsletter email.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                Data Security
              </h2>
              
              <p className="mb-4">We implement appropriate security measures to protect your personal information:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>All data transmission is encrypted using HTTPS</li>
                <li>Email data is stored with ConvertKit using industry-standard encryption</li>
                <li>We regularly review and update our security practices</li>
                <li>We limit access to personal data to authorized personnel only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                Data Retention
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-dark">Newsletter Data</h3>
                  <p>We retain your email address and consent data until you unsubscribe or request deletion.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-text-dark">Analytics Data</h3>
                  <p>Website analytics data is retained for up to 2 years for site improvement purposes.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-text-dark">Legal Requirements</h3>
                  <p>We may retain certain data if required by law or to resolve disputes.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                Cookies and Tracking
              </h2>
              
              <p className="mb-4">Our website uses minimal cookies and tracking:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Essential cookies:</strong> Required for basic website functionality</li>
                <li><strong>No advertising cookies:</strong> We do not use cookies for advertising or detailed user tracking</li>
                <li><strong>No third-party trackers:</strong> We do not embed social media widgets or advertising networks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                International Data Transfers
              </h2>
              
              <p className="mb-4">
                Your data may be processed in the United States by our service providers (ConvertKit, GitHub). These providers comply with appropriate data protection safeguards:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Standard Contractual Clauses (SCCs) for GDPR compliance</li>
                <li>Industry-standard security and privacy practices</li>
                <li>Regular privacy and security audits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                Children's Privacy
              </h2>
              
              <p className="mb-6">
                Our website and newsletter are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you believe we have collected information from a child under 16, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                Changes to This Policy
              </h2>
              
              <p className="mb-6">
                We may update this privacy policy to reflect changes in our practices or legal requirements. When we make significant changes, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Update the "Last updated" date at the top of this policy</li>
                <li>Notify newsletter subscribers of significant changes</li>
                <li>Post the updated policy on our website</li>
              </ul>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-text-dark mb-4">
                Contact Us
              </h2>
              
              <p className="mb-4">
                If you have questions about this privacy policy or how we handle your personal information, please contact us:
              </p>
              
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:privacy@pipermorgan.ai" className="text-primary-teal-text hover:underline">privacy@pipermorgan.ai</a></p>
                <p><strong>Website:</strong> <a href="https://pipermorgan.ai" className="text-primary-teal-text hover:underline">https://pipermorgan.ai</a></p>
                <p><strong>Response Time:</strong> We aim to respond to privacy inquiries within 7 business days</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}