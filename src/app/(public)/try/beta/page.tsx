'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Hero, CTAButton } from '@/components';

// Formspree endpoint - replace with your actual form ID
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

export default function BetaPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [tools, setTools] = useState<string[]>([]);
  const [painPoint, setPainPoint] = useState('');
  const [referral, setReferral] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const toolOptions = [
    'Jira',
    'Linear',
    'Notion',
    'Asana',
    'Monday',
    'GitHub Projects',
  ];

  const handleToolToggle = (tool: string) => {
    setTools(prev =>
      prev.includes(tool)
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role: role || 'Not specified',
          tools: tools.length > 0 ? tools.join(', ') : 'Not specified',
          painPoint: painPoint || 'Not specified',
          referral: referral || 'Not specified',
          _subject: 'New Piper Morgan Beta Waitlist Signup',
        }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or email us directly.');
    }
  };

  if (status === 'success') {
    return (
      <main>
        <Hero
          headline="You're on the list!"
          subheadline={
            <p className="text-lg md:text-xl text-text-light dark:text-gray-400 max-w-2xl mx-auto">
              Thanks for your interest in Piper Morgan. We&apos;ll be in touch when beta opens.
            </p>
          }
          background="surface"
          align="center"
        />
        <section className="py-16">
          <div className="site-container text-center">
            <p className="text-text-light dark:text-gray-400 mb-8">
              In the meantime, you might want to{' '}
              <Link href="/blog" className="text-primary-teal-text dark:text-primary-teal hover:underline">
                read about our journey
              </Link>{' '}
              or{' '}
              <Link href="/methodology" className="text-primary-teal-text dark:text-primary-teal hover:underline">
                learn how we work
              </Link>.
            </p>
            <CTAButton href="/" variant="outline">
              Return home
            </CTAButton>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <Hero
        headline="Join the waitlist"
        subheadline={
          <p className="text-lg md:text-xl text-text-light dark:text-gray-400 max-w-2xl mx-auto">
            Piper Morgan isn&apos;t quite ready for everyone yet — but it&apos;s getting close.
            Leave your email and we&apos;ll let you know when beta opens.
          </p>
        }
        background="surface"
        align="center"
      />

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="site-container">
          <div className="max-w-xl mx-auto">

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Email - Required */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-dark dark:text-white mb-2">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-dark dark:text-white focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-colors"
                />
              </div>

              {/* Optional Fields Header */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-lg font-semibold text-text-dark dark:text-white mb-2">
                  Optional: Help us prioritize
                </h3>
                <p className="text-sm text-text-light dark:text-gray-400 mb-6">
                  The more we know about what you&apos;re looking for, the better we can build.
                  None of this is required.
                </p>
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-text-dark dark:text-white mb-2">
                  What&apos;s your role?
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-dark dark:text-white focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-colors"
                >
                  <option value="">Select your role...</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Program Manager">Program Manager</option>
                  <option value="UX/Design">UX/Design</option>
                  <option value="Engineering Lead">Engineering Lead</option>
                  <option value="Executive">Executive</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Tools */}
              <div>
                <label className="block text-sm font-medium text-text-dark dark:text-white mb-2">
                  What tools do you currently use?
                </label>
                <div className="flex flex-wrap gap-2">
                  {toolOptions.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => handleToolToggle(tool)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        tools.includes(tool)
                          ? 'bg-primary-teal text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-text-dark dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain Point */}
              <div>
                <label htmlFor="painPoint" className="block text-sm font-medium text-text-dark dark:text-white mb-2">
                  What&apos;s your biggest PM pain point?
                </label>
                <textarea
                  id="painPoint"
                  name="painPoint"
                  rows={3}
                  value={painPoint}
                  onChange={(e) => setPainPoint(e.target.value)}
                  placeholder="Tell us what challenges you face..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-dark dark:text-white focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-colors resize-none"
                />
              </div>

              {/* Referral */}
              <div>
                <label htmlFor="referral" className="block text-sm font-medium text-text-dark dark:text-white mb-2">
                  How did you hear about Piper Morgan?
                </label>
                <select
                  id="referral"
                  name="referral"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-dark dark:text-white focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Blog post">Blog post</option>
                  <option value="Word of mouth">Word of mouth</option>
                  <option value="Conference/talk">Conference/talk</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <CTAButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Joining...' : 'Join Waitlist'}
                </CTAButton>
              </div>

              {/* Privacy Note */}
              <p className="text-xs text-text-light dark:text-gray-500 text-center">
                We respect your inbox. You&apos;ll only hear from us about beta access and major milestones.
                <br />
                <Link href="/privacy" className="hover:text-primary-teal-text dark:hover:text-primary-teal">
                  Privacy Policy
                </Link>
              </p>

            </form>

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
