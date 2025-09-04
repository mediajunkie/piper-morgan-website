import { CTAButton } from '@/components/atoms/CTAButton';
import Image from 'next/image';

export interface HeroProps {
  /** Main headline text */
  headline: string;
  /** Optional highlight text that appears in accent color */
  highlightText?: string;
  /** Subheadline or description text */
  subheadline: string | React.ReactNode;
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
  align = 'left',
  showLogo = false,
  className = '',
}: HeroProps) {
  const containerClasses = [
    'pt-16 md:pt-24 pb-8 md:pb-12',
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
            <div className={`mb-8 ${align === 'center' ? 'flex justify-center' : 'flex justify-start'}`}>
              <div className="relative w-64 h-20 md:w-80 md:h-24">
                <Image
                  src="/assets/pm-logo-lockup.png"
                  alt="Piper Morgan - AI Product Management Assistant"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>
          )}

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-dark mb-6 leading-tight">
            {headline}
            {highlightText && (
              <span className="block text-primary-teal mt-2">
                {highlightText}
              </span>
            )}
          </h1>

          <div className={`text-lg md:text-xl text-text-light mb-8 leading-relaxed ${align === 'center' ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl'}`}>
            {subheadline}
          </div>

          {(primaryCTA || secondaryCTA) && (
            <div className={`flex flex-col sm:flex-row gap-4 items-center ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
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
