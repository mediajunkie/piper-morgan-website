import { CTAButton } from '@/components/atoms/CTAButton';
import Image from 'next/image';

export interface HeroProps {
  /** Main headline text */
  headline: string;
  /** Optional highlight text that appears in accent color */
  highlightText?: string;
  /** Subheadline or description text */
  subheadline: string;
  /** Primary call-to-action button */
  primaryCTA?: {
    text: string;
    href: string;
    external?: boolean;
  };
  /** Secondary call-to-action button */
  secondaryCTA?: {
    text: string;
    href: string;
    external?: boolean;
  };
  /** Background variant */
  background?: 'default' | 'gradient' | 'surface';
  /** Text alignment */
  align?: 'left' | 'center';
  /** Show logo above headline */
  showLogo?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const backgroundClasses = {
  default: '',
  gradient: 'bg-gradient-to-br from-primary-teal/5 to-primary-orange/5',
  surface: 'bg-surface',
};

export function Hero({
  headline,
  highlightText,
  subheadline,
  primaryCTA,
  secondaryCTA,
  background = 'default',
  align = 'center',
  showLogo = false,
  className = '',
}: HeroProps) {
  const containerClasses = [
    'py-16 md:py-24',
    backgroundClasses[background],
    className,
  ].filter(Boolean).join(' ');

  const contentClasses = [
    'container mx-auto px-4',
    align === 'center' ? 'text-center' : 'text-left',
  ].join(' ');

  return (
    <section className={containerClasses}>
      <div className={contentClasses}>
        <div className="max-w-4xl mx-auto">
          {showLogo && (
            <div className="mb-8 flex justify-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src="/assets/pm-logo.png"
                  alt="Piper Morgan Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-dark mb-6 leading-tight">
            {headline}
            {highlightText && (
              <span className="block text-primary-teal mt-2">
                {highlightText}
              </span>
            )}
          </h1>

          <p className="text-lg md:text-xl text-text-light mb-8 max-w-3xl mx-auto leading-relaxed">
            {subheadline}
          </p>

          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {primaryCTA && (
                <CTAButton
                  href={primaryCTA.href}
                  external={primaryCTA.external}
                  size="lg"
                  variant="primary"
                >
                  {primaryCTA.text}
                </CTAButton>
              )}

              {secondaryCTA && (
                <CTAButton
                  href={secondaryCTA.href}
                  external={secondaryCTA.external}
                  size="lg"
                  variant="outline"
                >
                  {secondaryCTA.text}
                </CTAButton>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
