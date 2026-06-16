'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CTAButton } from '@/components/atoms/CTAButton';
import { trackNewsletterSignup } from '@/lib/analytics';

export interface NewsletterSignupProps {
  /** Title for the signup section */
  title?: string;
  /** Description text */
  description?: string;
  /** List of benefits/features */
  benefits?: string[];
  /** Placeholder text for email input */
  placeholder?: string;
  /** Submit button text */
  submitText?: string;
  /** Success message */
  successMessage?: string;
  /** Privacy notice text */
  privacyNotice?: string;
  /** Compact layout for embedding */
  compact?: boolean;
  /** Background variant */
  background?: 'default' | 'surface' | 'dark';
  /** Additional CSS classes */
  className?: string;
  /** Source page identifier for tracking */
  source?: string;
  /** Additional metadata for segmentation */
  metadata?: {
    referrer?: string;
    utm_source?: string;
    page_context?: string;
  };
  /** Callback for successful signup */
  onSignup?: (email: string) => void;
}

const backgroundClasses = {
  default: 'bg-white',
  surface: 'bg-surface',
  dark: 'bg-text-dark text-white',
};

export function NewsletterSignup({
  title = "Stay Updated",
  description = "Get insights on AI-powered product management methodology and building-in-public learnings.",
  benefits = [
    "Weekly methodology insights and breakthroughs",
    "Behind-the-scenes development updates",
    "Early access to new features and tools",
    "Practical PM templates and frameworks"
  ],
  placeholder = "Enter your email address",
  submitText = "Subscribe",
  successMessage = "We've sent you a confirmation email with a verification link. Please check your inbox (and spam folder) and click the link to complete your subscription and start receiving our systematic AI collaboration insights.",
  privacyNotice = "No spam, unsubscribe at any time.",
  compact = false,
  background = 'surface',
  className = '',
  source = 'unknown',
  metadata = {},
  onSignup,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const successRef = useRef<HTMLDivElement>(null);

  // Scroll to success message when status changes to success
  useEffect(() => {
    if (status === 'success' && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      successRef.current.focus();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!gdprConsent) {
      setStatus('error');
      setErrorMessage('Please accept the privacy policy to subscribe.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Submit to Buttondown's embed-subscribe endpoint.
      // Static-export-compatible: direct cross-origin POST; Buttondown's endpoint
      // sets Access-Control-Allow-Origin so CORS is permitted. Form-data body
      // matches the shape Buttondown's <form action="..."> snippet posts.
      // (Previously POSTed to /api/newsletter-signup which never existed on a
      // static-export site — every signup 404'd silently. Wired up 2026-06-15.)
      const formData = new FormData();
      formData.append('email', email);
      // Pass source as a tag for Buttondown segmentation (optional but useful)
      if (source && source !== 'unknown') {
        formData.append('tag', source);
      }

      const response = await fetch(
        'https://buttondown.com/api/emails/embed-subscribe/pipermorgan',
        { method: 'POST', body: formData }
      );

      if (!response.ok) {
        throw new Error('Subscription failed. Please try again, or email us directly.');
      }

      // Success — Buttondown sends a confirmation email; user must click to opt in
      setStatus('success');
      setEmail('');

      // Track successful conversion
      trackNewsletterSignup(source, 'buttondown');

      if (onSignup) {
        onSignup(email);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    }
  };

  const containerClasses = [
    backgroundClasses[background],
    compact ? 'p-6' : 'p-8',
    'rounded-card',
    className,
  ].filter(Boolean).join(' ');

  const textColor = background === 'dark' ? 'text-white' : 'text-text-dark';
  const subtextColor = background === 'dark' ? 'text-gray-300' : 'text-text-light';

  if (status === 'success') {
    return (
      <div 
        ref={successRef}
        className={containerClasses}
        tabIndex={-1}
        role="alert"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className={`text-2xl font-semibold ${textColor} mb-2`}>
            Check your email! 
          </h3>
          <p className={`${subtextColor} mb-4`}>
            {successMessage}
          </p>
          <p className={`text-sm ${subtextColor}`}>
            📧 <strong>Important:</strong> Check your email inbox (and spam folder) for the confirmation link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={compact ? '' : 'max-w-2xl mx-auto'}>
        <h3 className={`text-2xl font-semibold ${textColor} mb-4`}>
          {title}
        </h3>

        <p className={`${subtextColor} mb-6`}>
          {description}
        </p>

        {!compact && benefits && benefits.length > 0 && (
          <ul className="text-left space-y-3 mb-8 max-w-md mx-auto">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-teal-text mr-3 font-bold text-lg">✓</span>
                <span className={subtextColor}>{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className={`
                flex-1 px-4 py-3 border border-gray-300 rounded-button
                focus:ring-2 focus:ring-primary-teal focus:border-transparent
                ${background === 'dark' ? 'bg-white text-text-dark' : 'bg-white'}
                disabled:opacity-50
              `}
              disabled={status === 'loading'}
              required
            />
            <CTAButton
              type="submit"
              variant="primary"
              size="md"
              loading={status === 'loading'}
              disabled={status === 'loading'}
              className="sm:w-auto w-full"
            >
              {status === 'loading' ? 'Subscribing...' : submitText}
            </CTAButton>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                className="mt-1 h-5 w-5 text-primary-teal-text bg-white border-gray-300 rounded focus:ring-primary-teal focus:ring-2"
                disabled={status === 'loading'}
                required
                aria-describedby="gdpr-consent-text"
              />
              <span id="gdpr-consent-text" className={subtextColor}>
                I agree to receive marketing communications and acknowledge that my data will be processed according to the{' '}
                <Link 
                  href="/privacy" 
                  className="text-primary-teal-text hover:underline focus:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
                . I understand I can unsubscribe at any time.
              </span>
            </label>

            {status === 'error' && errorMessage && (
              <p className="text-red-500 text-sm" role="alert">
                {errorMessage}
              </p>
            )}
          </div>
        </form>

        <p className={`text-sm ${subtextColor} mt-4`}>
          {privacyNotice}
        </p>

        <p className={`text-xs ${subtextColor} mt-2 opacity-75`}>
          <a
            href="https://buttondown.com/refer/pipermorgan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Powered by Buttondown.
          </a>
        </p>
      </div>
    </div>
  );
}

export default NewsletterSignup;
