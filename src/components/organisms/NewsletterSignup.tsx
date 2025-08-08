'use client';

import { useState } from 'react';
import { CTAButton } from '@/components/atoms/CTAButton';

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
  successMessage = "Thank you for subscribing! Check your email to confirm.",
  privacyNotice = "No spam, unsubscribe at any time.",
  compact = false,
  background = 'surface',
  className = '',
  onSignup,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // In a real implementation, this would integrate with ConvertKit API
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('success');
      setEmail('');

      if (onSignup) {
        onSignup(email);
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
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
      <div className={containerClasses}>
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className={`text-2xl font-semibold ${textColor} mb-2`}>
            Welcome aboard!
          </h3>
          <p className={subtextColor}>
            {successMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={compact ? 'text-center' : 'max-w-2xl mx-auto text-center'}>
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
                <span className="text-primary-teal mr-3 font-bold text-lg">✓</span>
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
              {submitText}
            </CTAButton>
          </div>

          {status === 'error' && errorMessage && (
            <p className="text-red-500 text-sm text-center">
              {errorMessage}
            </p>
          )}
        </form>

        <p className={`text-sm ${subtextColor} mt-4`}>
          {privacyNotice}
        </p>
      </div>
    </div>
  );
}

export default NewsletterSignup;
