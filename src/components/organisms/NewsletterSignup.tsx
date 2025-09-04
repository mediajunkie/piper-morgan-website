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
  successMessage = "Thank you for subscribing! ConvertKit will send you a confirmation email shortly. Please check your inbox (and spam folder) and click the confirmation link to complete your subscription.",
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
      // Submit directly to ConvertKit (works with static export)
      const CONVERTKIT_FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;
      
      if (!CONVERTKIT_FORM_ID) {
        throw new Error('Newsletter signup is not configured. Please try again later.');
      }

      // Prepare form data for ConvertKit
      const formData = new FormData();
      formData.append('email_address', email);
      formData.append('first_name', ''); // Optional: could add name field later
      
      // Add source tracking as custom fields (if supported by your ConvertKit form)
      formData.append('fields[signup_source]', source);
      formData.append('fields[page_context]', metadata?.page_context || '');
      formData.append('fields[gdpr_consent]', 'true');
      formData.append('fields[consent_timestamp]', new Date().toISOString());
      formData.append('fields[referrer]', typeof document !== 'undefined' ? document.referrer || 'direct' : 'server');

      const response = await fetch(`https://app.convertkit.com/forms/${CONVERTKIT_FORM_ID}/subscriptions`, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required for direct ConvertKit submission
      });

      // Note: no-cors mode means we can't check response status
      // ConvertKit will handle the confirmation email flow
      setStatus('success');
      setEmail('');

      // Track successful conversion
      trackNewsletterSignup(source, 'direct_convertkit_form');

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
            Welcome aboard! 
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
      </div>
    </div>
  );
}

export default NewsletterSignup;
