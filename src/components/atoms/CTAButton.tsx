import Link from 'next/link';
import { forwardRef } from 'react';

export interface CTAButtonProps {
  /** Button text content */
  children: React.ReactNode;
  /** Button visual variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Button type (for form submission) */
  type?: 'button' | 'submit' | 'reset';
  /** External link (opens in new tab) */
  external?: boolean;
  /** Link href (renders as Link component) */
  href?: string;
  /** Click handler (for button element) */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

const baseClasses = [
  'inline-flex',
  'items-center',
  'justify-center',
  'font-semibold',
  'transition-all',
  'duration-200',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-2',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
  'disabled:hover:transform-none',
].join(' ');

const variantClasses = {
  primary: [
    'bg-primary-teal',
    'text-white',
    'hover:bg-teal-600',
    'focus:ring-primary-teal',
    'shadow-component',
    'hover:shadow-component-hover',
    'hover:-translate-y-0.5',
    'hover:scale-105',
    'font-bold',
    'text-lg',
  ].join(' '),
  secondary: [
    'bg-primary-orange',
    'text-white',
    'hover:bg-orange-600',
    'focus:ring-primary-orange',
    'shadow-component',
    'hover:shadow-component-hover',
    'hover:-translate-y-0.5',
    'font-medium',
  ].join(' '),
  outline: [
    'bg-white',
    'text-primary-teal',
    'border-2',
    'border-primary-teal',
    'hover:bg-primary-teal',
    'hover:text-white',
    'focus:ring-primary-teal',
    'shadow-component',
    'hover:shadow-component-hover',
    'hover:-translate-y-0.5',
    'font-medium',
  ].join(' '),
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-button',
  md: 'px-6 py-3 text-base rounded-button',
  lg: 'px-8 py-4 text-lg rounded-button',
};

export const CTAButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  CTAButtonProps
>(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  external = false,
  href,
  onClick,
  className = '',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const content = (
    <>
      {loading && <LoadingSpinner />}
      {children}
    </>
  );

  // Render as Link for internal navigation
  if (href && !external && !disabled) {
    return (
      <Link
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...props}
      >
        {content}
      </Link>
    );
  }

  // Render as external link
  if (href && external && !disabled) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        {...props}
      >
        {content}
        <span className="ml-1 text-xs" aria-hidden="true">↗</span>
      </a>
    );
  }

  // Render as button
  return (
    <button
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {content}
    </button>
  );
});

CTAButton.displayName = 'CTAButton';

export default CTAButton;
